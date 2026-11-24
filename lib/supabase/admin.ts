import "server-only";
import { createClient } from "@supabase/supabase-js";

// Full-access client. SERVER ONLY. Bypasses row-level security.
// Used just for writing the audit log. Never import this in browser code.
export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
