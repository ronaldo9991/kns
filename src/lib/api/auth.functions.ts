import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword, signToken, verifyToken, parseBearerToken } from "@/lib/auth.server";
import { getRequestHeader } from "@tanstack/react-start/server";

// Built-in demo accounts — always accepted so a freshly-deployed instance is
// usable before any real users exist. (The seed also inserts these.)
const DEMO = {
  "admin@kns.org": { password: "admin123", id: 1, name: "KNS Admin", role: "admin" },
  "demo@kns.org": { password: "demo123", id: 2, name: "Demo User", role: "member" },
} as const;

export const registerFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, data.email)).limit(1);
    if (existing.length > 0) throw new Error("Email already registered");
    const passwordHash = await hashPassword(data.password);
    const [user] = await db
      .insert(schema.users)
      .values({ email: data.email, passwordHash, name: data.name, phone: data.phone })
      .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role });
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  });

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase().trim();

    // Try the real database first.
    try {
      const { db, schema } = await getDb();
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
      if (user) {
        const ok = await verifyPassword(data.password, user.passwordHash);
        if (!ok) throw new Error("Invalid credentials");
        const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
      }
    } catch (err: any) {
      if (err?.message === "Invalid credentials") throw err;
      // DB unavailable — fall through to demo accounts below.
    }

    // Built-in demo fallback.
    const demo = (DEMO as Record<string, (typeof DEMO)[keyof typeof DEMO]>)[email];
    if (demo && demo.password === data.password) {
      const token = await signToken({ id: demo.id, email, name: demo.name, role: demo.role });
      return { token, user: { id: demo.id, email, name: demo.name, role: demo.role } };
    }

    throw new Error("Invalid credentials");
  });

export const getMeFn = createServerFn({ method: "GET" }).handler(async () => {
  const authHeader = getRequestHeader("authorization");
  const token = parseBearerToken(authHeader ?? null);
  if (!token) return null;
  return verifyToken(token);
});
