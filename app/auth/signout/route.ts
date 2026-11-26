import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/audit";
import { IDLE_COOKIE } from "@/lib/idle";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    await logEvent("sign_out", { userId: data.user.id, email: data.user.email });
  }
  await supabase.auth.signOut();
  const res = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  res.cookies.delete(IDLE_COOKIE);
  return res;
}
