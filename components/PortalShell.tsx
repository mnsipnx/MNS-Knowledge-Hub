import type { ReactNode } from "react";
import LogoPlaceholder from "@/components/LogoPlaceholder";
import UtilityBar from "@/components/UtilityBar";
import { roleLabel } from "@/lib/roles";
import type { Profile } from "@/lib/auth";

// Shared frame for the four signed-in views. Navigation items are placeholders in Step 1.
export default function PortalShell({
  view,
  nav,
  profile,
  children,
}: {
  view: string;
  nav: string[];
  profile: Profile;
  children: ReactNode;
}) {
  const initial = (profile.full_name ?? profile.email).charAt(0).toUpperCase();
  return (
    <>
      <UtilityBar label={view}>
        <form action="/auth/signout" method="post">
          <button type="submit" className="cursor-pointer uppercase">
            Sign out
          </button>
        </form>
      </UtilityBar>
      <header className="flex h-16 items-center gap-[22px] border-b border-border bg-white px-6">
        <LogoPlaceholder />
        <nav className="hidden items-center gap-[22px] font-heading text-sm font-medium text-copy md:flex">
          {nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
        <div className="flex-1" />
        <span className="rounded-full bg-ink px-3 py-1 font-heading text-xs font-semibold text-white">
          {roleLabel[profile.role]}
        </span>
        <span
          aria-hidden
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-border-strong bg-placeholder text-xs font-bold text-ink"
        >
          {initial}
        </span>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </>
  );
}
