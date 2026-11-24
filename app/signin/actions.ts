"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/audit";
import { homeFor, type Role } from "@/lib/roles";

const EMAIL = /^\S+@\S+\.\S+$/;

// Step 1: send a one-time code to the email address.
// The answer is always the same, so nobody can find out which emails have accounts.
export async function requestCode(email: string): Promise<{ ok: boolean }> {
  const e = email.trim().toLowerCase();
  if (!EMAIL.test(e)) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: e,
    options: { shouldCreateUser: false }, // invite-only: never create accounts here
  });
  if (error) {
    await logEvent("sign_in_failed", { email: e, detail: { step: "request_code" } });
  }
  return { ok: true };
}

// Step 2: check the code, then send the person to the view for their role.
export async function verifyCode(
  email: string,
  code: string
): Promise<{ ok: false }> {
  const e = email.trim().toLowerCase();
  const token = code.replace(/\s/g, "");
  if (!EMAIL.test(e) || !/^\d{6,10}$/.test(token)) return { ok: false };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email: e,
    token,
    type: "email",
  });
  if (error || !data.user) {
    await logEvent("sign_in_failed", { email: e, detail: { step: "verify_code" } });
    return { ok: false };
  }

  // The role comes from the account an administrator set up.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    // Signed in to the login system but has no active Hub account.
    await supabase.auth.signOut();
    await logEvent("sign_in_failed", {
      userId: data.user.id,
      email: e,
      detail: { step: "no_active_profile" },
    });
    return { ok: false };
  }

  await logEvent("sign_in", {
    userId: data.user.id,
    email: e,
    detail: { role: profile.role },
  });
  redirect(homeFor(profile.role as Role));
}
