import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { runRcon, IsleRconError } from "@/lib/isle/rcon";
import { formatRconTemplate } from "@/lib/isle/player";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  const rl = rateLimit(`apply-skin:${session.id}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: `Rate limit. Espera ${rl.retryAfterSec}s` },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    species?: string;
    skinId?: string;
  } | null;

  const species = body?.species?.trim();
  const skinId = body?.skinId?.trim();
  if (!species || !skinId) {
    return NextResponse.json(
      { ok: false, error: "Faltan species y skinId" },
      { status: 400 },
    );
  }

  const owned = await prisma.ownedSkin.findUnique({
    where: {
      userId_species_skinId: {
        userId: session.id,
        species,
        skinId,
      },
    },
  });

  if (!owned) {
    return NextResponse.json(
      { ok: false, error: "No tienes esa skin", code: "NOT_OWNED" },
      { status: 403 },
    );
  }

  const template =
    process.env.ISLE_RCON_APPLY_SKIN_CMD?.trim() ||
    "ApplySkin {steamId} {species} {skinId}";
  const cmd = formatRconTemplate(template, {
    steamId: session.steamId,
    species,
    skinId,
  });

  try {
    const raw = await runRcon("custom", cmd);
    if (/not online|offline|not found|no player/i.test(raw)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes estar online en el servidor para aplicar la skin",
          code: "PLAYER_OFFLINE",
          raw,
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, raw, command: cmd });
  } catch (error) {
    const message =
      error instanceof IsleRconError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Error RCON";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
