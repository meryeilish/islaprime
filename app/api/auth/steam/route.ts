import { NextResponse } from "next/server";
import { buildSteamLoginUrl } from "@/lib/auth/steam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = buildSteamLoginUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error Steam";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
