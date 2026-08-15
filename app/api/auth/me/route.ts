import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: true, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      steamId: true,
      name: true,
      avatar: true,
      coins: true,
      marks: true,
      patreonTier: true,
    },
  });

  return NextResponse.json({
    ok: true,
    user: user
      ? {
          ...user,
          tierLabel: user.patreonTier || "Sin membresía",
        }
      : null,
  });
}
