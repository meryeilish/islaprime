import { NextResponse } from "next/server";
import { IsleRconError, runRcon } from "@/lib/isle/rcon";
import {
  parsePlayerList,
  parseServerDetails,
  type ServerStatusPayload,
} from "@/lib/isle/parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Estado vivo del servidor vía RCON.
 * GET /api/server/status
 */
export async function GET() {
  try {
    const [detailsRaw, playersRaw, queueRaw, playerDataRaw] = await Promise.all([
      runRcon("serverdetails"),
      runRcon("playerlist").catch(() => ""),
      runRcon("getqueuestatus").catch(() => ""),
      runRcon("getplayerdata").catch(() => ""),
    ]);

    const server = parseServerDetails(detailsRaw);
    const list = parsePlayerList(playersRaw);
    const count = Math.max(server.currentPlayers, list.length);

    const payload: ServerStatusPayload = {
      ok: true,
      online: true,
      checkedAt: new Date().toISOString(),
      server: { ...server, currentPlayers: count },
      players: {
        count,
        list,
        raw: playersRaw,
      },
      queue: queueRaw || null,
      playerDataRaw: playerDataRaw || null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof IsleRconError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Error RCON desconocido";

    const payload: ServerStatusPayload = {
      ok: false,
      online: false,
      checkedAt: new Date().toISOString(),
      error: message,
      hint:
        "Revisa ISLE_RCON_* en .env.local y que el puerto 8888 acepte la IP de la web.",
      players: { count: 0, list: [], raw: "" },
      queue: null,
      playerDataRaw: null,
    };

    return NextResponse.json(payload, { status: 503 });
  }
}
