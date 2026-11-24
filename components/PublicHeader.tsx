import Link from "next/link";
import LogoPlaceholder from "@/components/LogoPlaceholder";
import { nav } from "@/lib/content";
import { btnPrimary } from "@/lib/ui";

export default function PublicHeader() {
  return (
    <header className="flex h-16 items-center gap-[22px] border-b border-border bg-white px-6">
      <Link href="/" aria-label="MNS home">
        <LogoPlaceholder />
      </Link>

      <nav className="hidden items-center gap-[22px] font-heading text-sm font-medium text-copy md:flex">
        {nav.map((item) =>
          "items" in item ? (
            <div key={item.label} className="group relative">
              <button type="button" className="flex cursor-pointer items-center gap-1 py-5">
                {item.label} <span className="text-[8px]">▾</span>
              </button>
              <ul className="invisible absolute top-full left-0 z-20 min-w-52 rounded-xl border border-border bg-white p-2 opacity-0 shadow-md group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {item.items.map((sub) => (
                  <li key={sub.label}>
                    <a
                      href={sub.href}
                      className="block rounded-lg px-3 py-2 hover:bg-surface-alt"
                    >
                      {sub.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          )
        )}
      </nav>

      <div className="flex-1" />
      <Link href="/signin" className={btnPrimary}>
        Sign in
      </Link>
    </header>
  );
}
