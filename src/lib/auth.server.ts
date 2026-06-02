import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? "kns-dev-secret-change-in-production-2024");

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export type TokenPayload = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(await getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, await getSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function parseBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
