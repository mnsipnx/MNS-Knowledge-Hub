// Idle timeout (requirement FR-AC-08): sign people out after 30 minutes of no activity.
// The time of the last activity lives in a signed cookie, so it can't be edited by hand.
// No "server-only" import here because proxy.ts uses it too.

export const IDLE_COOKIE = "mns_last_active";
export const IDLE_LIMIT_MS = 30 * 60 * 1000; // change this number to change the limit

export const idleCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // how long the browser keeps the cookie; the timeout itself is IDLE_LIMIT_MS
};

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Cookie value for "last active at <time>".
export async function makeStamp(time: number = Date.now()): Promise<string> {
  const t = String(time);
  return `${t}.${await sign(t)}`;
}

// The time stored in the cookie, or null if it is missing or has been tampered with.
export async function readStamp(value: string | undefined): Promise<number | null> {
  if (!value) return null;
  const [t, sig] = value.split(".");
  if (!t || !sig || !/^\d+$/.test(t)) return null;
  const expected = await sign(t);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0 ? Number(t) : null;
}
