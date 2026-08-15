import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mapear título/tier de Patreon → monedas y label. Configurable por env JSON. */
function tierRewards(tierTitle: string | null | undefined) {
  const defaults: Record<string, { coins: number; marks: number; label: string }> = {
    supporter: { coins: 500, marks: 10, label: "Supporter" },
    hunter: { coins: 1500, marks: 30, label: "Hunter" },
    apex: { coins: 4000, marks: 100, label: "Apex" },
  };

  try {
    if (process.env.PATREON_TIER_MAP) {
      Object.assign(defaults, JSON.parse(process.env.PATREON_TIER_MAP));
    }
  } catch {
    /* ignore bad JSON */
  }

  const key = (tierTitle || "").toLowerCase();
  for (const [name, reward] of Object.entries(defaults)) {
    if (key.includes(name)) return reward;
  }
  return { coins: 250, marks: 5, label: tierTitle || "Patreon" };
}

function verifyPatreonSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PATREON_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  if (!signature) return false;
  const digest = createHmac("md5", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

function steamIdFromNote(note: string | null | undefined): string | null {
  if (!note) return null;
  const m = note.match(/\b(7656119\d{10})\b/);
  return m?.[1] ?? null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-patreon-signature");

  if (!verifyPatreonSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 401 });
  }

  let payload: {
    data?: {
      id?: string;
      attributes?: {
        patron_status?: string;
        currently_entitled_amount_cents?: number;
        note?: string;
      };
      relationships?: {
        currently_entitled_tiers?: { data?: Array<{ id?: string }> };
      };
    };
    included?: Array<{
      type?: string;
      id?: string;
      attributes?: { title?: string; full_name?: string };
    }>;
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const event = request.headers.get("x-patreon-event") || "unknown";
  const patreonId = payload.data?.id;
  const note = payload.data?.attributes?.note;
  const steamId = steamIdFromNote(note);

  const tierInclude = payload.included?.find((i) => i.type === "tier");
  const tierTitle = tierInclude?.attributes?.title || null;
  const reward = tierRewards(tierTitle);

  // Buscar usuario por patreonId o Steam ID en la nota del patrón
  let user =
    (patreonId
      ? await prisma.user.findUnique({ where: { patreonId } })
      : null) ||
    (steamId
      ? await prisma.user.findUnique({ where: { steamId } })
      : null);

  if (!user && steamId) {
    user = await prisma.user.create({
      data: {
        steamId,
        name: `Patreon ${steamId.slice(-4)}`,
        patreonId: patreonId ?? undefined,
        patreonTier: reward.label,
      },
    });
  }

  if (!user) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Sin usuario Steam vinculado (pon SteamID64 en la nota de Patreon)",
      event,
    });
  }

  const active = /create|update|members:pledge/i.test(event);
  const deleted = /delete|remove/i.test(event);

  if (deleted) {
    await prisma.user.update({
      where: { id: user.id },
      data: { patreonTier: null, patreonId: patreonId ?? user.patreonId },
    });
    return NextResponse.json({ ok: true, event, action: "tier_cleared" });
  }

  if (active) {
    const ref = `patreon:${event}:${patreonId}:${createHash("sha1").update(rawBody).digest("hex").slice(0, 12)}`;
    const already = await prisma.ledger.findFirst({ where: { ref } });
    if (already) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          patreonId: patreonId ?? user.patreonId,
          patreonTier: reward.label,
          coins: { increment: reward.coins },
          marks: { increment: reward.marks },
        },
      }),
      prisma.ledger.create({
        data: {
          userId: user.id,
          amount: reward.coins,
          currency: "coins",
          reason: `Patreon ${reward.label}`,
          ref,
        },
      }),
      prisma.ledger.create({
        data: {
          userId: user.id,
          amount: reward.marks,
          currency: "marks",
          reason: `Patreon ${reward.label}`,
          ref: `${ref}:marks`,
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true, event, rewarded: active });
}
