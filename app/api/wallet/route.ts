import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      coins: true,
      marks: true,
      patreonTier: true,
      name: true,
      steamId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    coins: user.coins,
    marks: user.marks,
    tierLabel: user.patreonTier || "Sin membresía",
    tierId: user.patreonTier,
    name: user.name,
    steamId: user.steamId,
  });
}
