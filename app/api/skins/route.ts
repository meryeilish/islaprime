import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  const skins = await prisma.ownedSkin.findMany({
    where: { userId: session.id },
    orderBy: { acquiredAt: "desc" },
  });

  return NextResponse.json({ ok: true, skins });
}

/** Guarda una skin comprada / recompensada (requiere sesión). */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    species?: string;
    skinId?: string;
    costCoins?: number;
  } | null;

  const species = body?.species?.trim();
  const skinId = body?.skinId?.trim();
  const costCoins = Math.max(0, Number(body?.costCoins ?? 0));
  if (!species || !skinId) {
    return NextResponse.json(
      { ok: false, error: "Faltan species y skinId" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }
  if (user.coins < costCoins) {
    return NextResponse.json(
      { ok: false, error: "Saldo insuficiente", code: "INSUFFICIENT_FUNDS" },
      { status: 402 },
    );
  }

  const skin = await prisma.$transaction(async (tx) => {
    if (costCoins > 0) {
      await tx.user.update({
        where: { id: user.id },
        data: { coins: { decrement: costCoins } },
      });
      await tx.ledger.create({
        data: {
          userId: user.id,
          amount: -costCoins,
          currency: "coins",
          reason: `Buy skin ${species}/${skinId}`,
          ref: `skin:${species}:${skinId}`,
        },
      });
    }
    return tx.ownedSkin.upsert({
      where: {
        userId_species_skinId: { userId: user.id, species, skinId },
      },
      create: { userId: user.id, species, skinId },
      update: {},
    });
  });

  return NextResponse.json({ ok: true, skin });
}
