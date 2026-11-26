import "server-only";
import { headers } from "next/headers";
import { adminClient } from "@/lib/supabase/admin";

type Event =
  | "sign_in"
  | "sign_in_failed"
  | "sign_out"
  | "session_expired"
  | "access_denied";

// Writes one line to the audit log. Never throws: a logging problem
// must not stop someone signing in or out.
export async function logEvent(
  event: Event,
  opts: { userId?: string; email?: string; detail?: Record<string, unknown> } = {}
) {
  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    await adminClient().from("audit_log").insert({
      event,
      user_id: opts.userId ?? null,
      email: opts.email ?? null,
      detail: opts.detail ?? {},
      ip,
    });
  } catch (e) {
    console.error("audit log failed", e);
  }
}
