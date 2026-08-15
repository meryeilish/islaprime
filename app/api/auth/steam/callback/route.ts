import { NextRequest, NextResponse } from "next/server";
import {
  fetchSteamProfile,
  upsertSteamUser,
  verifySteamOpenId,
} from "@/lib/auth/steam";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function homeUrl() {
  return (
    process.env.STEAM_REALM?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function GET(request: NextRequest) {
  try {
    const steamId = await verifySteamOpenId(request.nextUrl.searchParams);
    const profile = await fetchSteamProfile(steamId);
    const user = await upsertSteamUser(profile);
    const token = await createSessionToken({
      id: user.id,
      steamId: user.steamId,
      name: user.name,
      avatar: user.avatar,
    });

    const res = NextResponse.redirect(`${homeUrl()}/#mi-dino`);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth fallida";
    const res = NextResponse.redirect(
      `${homeUrl()}/?authError=${encodeURIComponent(message)}#mi-dino`,
    );
    return res;
  }
}
