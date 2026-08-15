import { prisma } from "@/lib/db";

const STEAM_OPENID = "https://steamcommunity.com/openid/login";

function siteUrl() {
  return (
    process.env.STEAM_REALM?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function steamReturnUrl() {
  return (
    process.env.STEAM_RETURN_URL?.trim() ||
    `${siteUrl()}/api/auth/steam/callback`
  );
}

export function buildSteamLoginUrl(): string {
  const returnTo = steamReturnUrl();
  const realm = siteUrl();
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_OPENID}?${params.toString()}`;
}

export function extractSteamId(claimedId: string | null): string | null {
  if (!claimedId) return null;
  const match = claimedId.match(/\/openid\/id\/(\d{17})$/);
  return match?.[1] ?? null;
}

export async function verifySteamOpenId(
  params: URLSearchParams,
): Promise<string> {
  const verify = new URLSearchParams(params);
  verify.set("openid.mode", "check_authentication");

  const res = await fetch(STEAM_OPENID, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verify.toString(),
  });
  const text = await res.text();
  if (!/is_valid\s*:\s*true/i.test(text)) {
    throw new Error("Steam OpenID inválido");
  }

  const steamId = extractSteamId(params.get("openid.claimed_id"));
  if (!steamId) throw new Error("No se pudo leer Steam ID");
  return steamId;
}

export type SteamProfile = {
  steamId: string;
  name: string | null;
  avatar: string | null;
};

export async function fetchSteamProfile(
  steamId: string,
): Promise<SteamProfile> {
  const key = process.env.STEAM_API_KEY?.trim();
  if (!key) {
    return { steamId, name: `Steam ${steamId.slice(-4)}`, avatar: null };
  }

  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
  url.searchParams.set("key", key);
  url.searchParams.set("steamids", steamId);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    return { steamId, name: `Steam ${steamId.slice(-4)}`, avatar: null };
  }
  const json = (await res.json()) as {
    response?: { players?: Array<{ personaname?: string; avatarfull?: string }> };
  };
  const player = json.response?.players?.[0];
  return {
    steamId,
    name: player?.personaname ?? `Steam ${steamId.slice(-4)}`,
    avatar: player?.avatarfull ?? null,
  };
}

export async function upsertSteamUser(profile: SteamProfile) {
  return prisma.user.upsert({
    where: { steamId: profile.steamId },
    create: {
      steamId: profile.steamId,
      name: profile.name,
      avatar: profile.avatar,
    },
    update: {
      name: profile.name,
      avatar: profile.avatar,
    },
  });
}
