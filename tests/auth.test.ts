import { describe, test, expect } from "bun:test";
import { hashPassword, verifyPassword, signToken, verifyToken, parseBearerToken } from "../src/lib/auth.server";

describe("password hashing", () => {
  test("hashPassword produces a bcrypt hash", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).toStartWith("$2");
    expect(hash.length).toBeGreaterThan(50);
  });

  test("verifyPassword returns true for correct password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("mypassword", hash)).toBe(true);
  });

  test("verifyPassword returns false for wrong password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  test("two hashes of the same password differ (salt)", async () => {
    const h1 = await hashPassword("same");
    const h2 = await hashPassword("same");
    expect(h1).not.toBe(h2);
  });
});

describe("JWT tokens", () => {
  const payload = { id: 1, email: "test@kns.org", name: "Test User", role: "member" };

  test("signToken produces a non-empty string", async () => {
    const token = await signToken(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
    expect(token.split(".").length).toBe(3); // JWT header.payload.signature
  });

  test("verifyToken returns the original payload", async () => {
    const token = await signToken(payload);
    const decoded = await verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.id).toBe(payload.id);
    expect(decoded!.email).toBe(payload.email);
    expect(decoded!.name).toBe(payload.name);
    expect(decoded!.role).toBe(payload.role);
  });

  test("verifyToken returns null for a garbage token", async () => {
    expect(await verifyToken("not.a.token")).toBeNull();
  });

  test("verifyToken returns null for empty string", async () => {
    expect(await verifyToken("")).toBeNull();
  });

  test("admin role round-trips correctly", async () => {
    const token = await signToken({ id: 99, email: "admin@kns.org", name: "Admin", role: "admin" });
    const decoded = await verifyToken(token);
    expect(decoded!.role).toBe("admin");
  });
});

describe("parseBearerToken", () => {
  test("extracts token from valid Bearer header", () => {
    expect(parseBearerToken("Bearer mytoken123")).toBe("mytoken123");
  });

  test("returns null for missing header", () => {
    expect(parseBearerToken(null)).toBeNull();
  });

  test("returns null for wrong scheme", () => {
    expect(parseBearerToken("Basic abc123")).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(parseBearerToken("")).toBeNull();
  });

  test("handles token with dots (JWT)", () => {
    const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.sig";
    expect(parseBearerToken(`Bearer ${jwt}`)).toBe(jwt);
  });
});
