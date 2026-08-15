import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { runRcon, IsleRconError } from "@/lib/isle/rcon";
import { formatRconTemplate } from "@/lib/isle/player";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REWARD_COSTS: Record<string, { coins: number; marks: number }> = {
  growth_boost: { coins: 100, marks: 0 },
  nest_kit: { coins: 250, marks: 5 },
  cosmetic_pack: { coins: 500, marks: 0 },
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  const rl = rateLimit(`claim-reward:${session.id}`, 6, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: `Rate limit. Espera ${rl.retryAfterSec}s` },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    rewardId?: string;
  } | null;
  const rewardId = body?.rewardId?.trim();
  if (!rewardId || !REWARD_COSTS[rewardId]) {
    return NextResponse.json(
      { ok: false, error: "rewardId inválido", allowed: Object.keys(REWARD_COSTS) },
      { status: 400 },
    );
  }

  const cost = REWARD_COSTS[rewardId];
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }
  if (user.coins < cost.coins || user.marks < cost.marks) {
    return NextResponse.json(
      { ok: false, error: "Saldo insuficiente", code: "INSUFFICIENT_FUNDS" },
      { status: 402 },
    );
  }

  const template =
    process.env.ISLE_RCON_CLAIM_REWARD_CMD?.trim() ||
    "GiveReward {steamId} {rewardId}";
  const cmd = formatRconTemplate(template, {
    steamId: session.steamId,
    rewardId,
  });

  try {
    const raw = await runRcon("custom", cmd);
    if (/not online|offline|not found|no player/i.test(raw)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes estar online en el servidor para reclamar la recompensa",
          code: "PLAYER_OFFLINE",
          raw,
        },
        { status: 409 },
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          coins: { decrement: cost.coins },
          marks: { decrement: cost.marks },
        },
      }),
      prisma.ledger.create({
        data: {
          userId: user.id,
          amount: -cost.coins,
          currency: "coins",
          reason: `Reward ${rewardId}`,
          ref: `reward:${rewardId}:${Date.now()}`,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, raw, command: cmd, spent: cost });
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
