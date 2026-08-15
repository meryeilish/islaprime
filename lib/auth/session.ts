import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "islaprime_session";

export type SessionUser = {
  id: string;
  steamId: string;
  name: string | null;
  avatar: string | null;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error(
      "Falta AUTH_SECRET en .env.local (mínimo 16 caracteres).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    steamId: user.steamId,
    name: user.name,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function readSessionToken(
  token: string | undefined | null,
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.steamId !== "string" || typeof payload.id !== "string") {
      return null;
    }
    return {
      id: payload.id,
      steamId: payload.steamId,
      name: typeof payload.name === "string" ? payload.name : null,
      avatar: typeof payload.avatar === "string" ? payload.avatar : null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
