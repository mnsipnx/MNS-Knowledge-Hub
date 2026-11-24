import type { Profile } from "@/lib/auth";

export default function PortalWelcome({ profile, blurb }: { profile: Profile; blurb: string }) {
  return (
    <>
      <h1 className="font-heading text-[28px] font-bold text-ink">
        Welcome, {profile.full_name ?? profile.email}
      </h1>
      <p className="mt-2 text-copy">{blurb}</p>
      <p className="mt-6 text-sm text-muted">
        Organisation: {profile.organization_name}
        {profile.department ? ` · Department: ${profile.department}` : ""}
      </p>
      <p className="mt-6 rounded-[14px] border border-dashed border-border-strong p-4 text-sm text-muted">
        Step 1 placeholder. Content for this view is built in later steps.
      </p>
    </>
  );
}
