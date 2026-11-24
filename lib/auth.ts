import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/roles";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  organization_id: string;
  department: string | null;
  is_admin: boolean;
  organization_name: string | null;
};

// The signed-in person's profile, or null. Inactive accounts return null
// because row-level security hides their profile.
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,role,organization_id,department,is_admin,organizations(name)"
    )
    .eq("id", auth.user.id)
    .maybeSingle();
  if (!data) return null;

  const org = data.organizations as unknown as { name: string } | null;
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role as Role,
    organization_id: data.organization_id,
    department: data.department,
    is_admin: data.is_admin,
    organization_name: org?.name ?? null,
  };
}

// Use at the top of every protected page. Not signed in: go to sign-in.
// Wrong role: a plain "not found", so nothing reveals which areas exist.
export async function requireRole(allowed: Role[]): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/signin");
  if (!allowed.includes(profile.role)) notFound();
  return profile;
}
