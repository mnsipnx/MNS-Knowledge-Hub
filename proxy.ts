import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import {
  IDLE_COOKIE,
  IDLE_LIMIT_MS,
  idleCookieOptions,
  makeStamp,
  readStamp,
} from "@/lib/idle";

// Runs before every page. It (1) keeps the sign-in session fresh, (2) signs people out
// after 30 minutes of inactivity, and (3) sends signed-out visitors to /signin.
// (Next.js 16 calls this file proxy.ts. On Next.js 15 or older, rename it to
// middleware.ts and rename the function to middleware.)

async function logExpiry(request: NextRequest, userId: string, email?: string) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
      .from("audit_log")
      .insert({
        event: "session_expired",
        user_id: userId,
        email: email ?? null,
        detail: { idle_limit_minutes: IDLE_LIMIT_MS / 60000 },
        ip,
      });
  } catch (e) {
    console.error("audit log failed", e);
  }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = ["/staff", "/contractor", "/customer"].some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (user) {
    const last = await readStamp(request.cookies.get(IDLE_COOKIE)?.value);
    const now = Date.now();
    const expired = last === null || now - last > IDLE_LIMIT_MS;

    if (expired) {
      // Idle too long (or no valid activity record): end this session.
      await supabase.auth.signOut({ scope: "local" });
      await logExpiry(request, user.id, user.email);

      if (request.method !== "GET") {
        // Don't redirect a form submission; just continue signed out.
        response.cookies.delete(IDLE_COOKIE);
        return response;
      }

      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.search = "?expired=1";
      const redirect = NextResponse.redirect(url);
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
      redirect.cookies.delete(IDLE_COOKIE);
      return redirect;
    }

    // Still active: move the 30-minute clock forward. Background prefetches
    // made by the browser don't count as activity.
    const isPrefetch =
      request.headers.get("next-router-prefetch") !== null ||
      request.headers.get("purpose") === "prefetch";
    if (!isPrefetch) {
      response.cookies.set(IDLE_COOKIE, await makeStamp(now), idleCookieOptions);
    }
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
