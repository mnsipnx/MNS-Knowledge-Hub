import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for server code (pages, server actions). Uses the signed-in
// user's session, so row-level security applies.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a page where cookies can't be set; the proxy refreshes them.
          }
        },
      },
    }
  );
}
