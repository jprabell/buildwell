/**
 * Stateless password reset tokens using signed JWTs.
 * No database changes needed — token contains email + expiry, signed with NEXTAUTH_SECRET.
 */

const SECRET = process.env.NEXTAUTH_SECRET ?? "fallback-secret";

function base64url(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function sign(payload: object): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const crypto = require("crypto") as typeof import("crypto");
  const sig = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verify(token: string): { email: string; exp: number } | null {
  try {
    const [header, body, sig] = token.split(".");
    const crypto = require("crypto") as typeof import("crypto");
    const expected = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createResetToken(email: string): string {
  return sign({ email, exp: Math.floor(Date.now() / 1000) + 3600 }); // 1 hour
}

export function verifyResetToken(token: string): string | null {
  const payload = verify(token);
  return payload?.email ?? null;
}
