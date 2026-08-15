import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function envOrNull(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export async function POST(request: Request) {
  const url = envOrNull("LIVEKIT_URL");
  const apiKey = envOrNull("LIVEKIT_API_KEY");
  const apiSecret = envOrNull("LIVEKIT_API_SECRET");
  const room = envOrNull("LIVEKIT_ROOM") ?? "islaprime";

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "LiveKit no está configurado. Añade LIVEKIT_URL, LIVEKIT_API_KEY y LIVEKIT_API_SECRET en .env.local",
      },
      { status: 503 },
    );
  }

  let body: { identity?: string; name?: string } = {};
  try {
    body = (await request.json()) as { identity?: string; name?: string };
  } catch {
    body = {};
  }

  const rawIdentity = (body.identity ?? body.name ?? "").trim().slice(0, 64);
  const identity = rawIdentity.replace(/[^\w\-.]/g, "_") || `guest_${Date.now().toString(36)}`;
  const name = (body.name ?? identity).trim().slice(0, 64) || identity;

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name,
    ttl: "2h",
  });

  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt();

  return NextResponse.json({
    token: jwt,
    url,
    room,
    identity,
  });
}
