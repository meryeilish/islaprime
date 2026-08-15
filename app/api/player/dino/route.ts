import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { runRcon, IsleRconError } from "@/lib/isle/rcon";
import { parsePlayerDino } from "@/lib/isle/player";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Inicia sesión con Steam", code: "UNAUTHENTICATED" },
      { status: 401 },
    );
  }

  try {
    const raw = await runRcon("getplayerdata");
    const dino = parsePlayerDino(raw, session.steamId);

    if (!dino) {
      return NextResponse.json({
        ok: true,
        online: false,
        dino: null,
        message:
          "No hay personaje activo para tu Steam ID (offline o sin dino spawneado).",
        checkedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      online: dino.online,
      dino,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof IsleRconError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Error RCON";
    return NextResponse.json(
      { ok: false, error: message, code: "RCON_ERROR" },
      { status: 503 },
    );
  }
}
