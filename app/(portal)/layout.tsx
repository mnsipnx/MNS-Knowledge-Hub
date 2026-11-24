import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

// Everything inside the portal stays out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Signed-in pages read the visitor's session, so they load at request time.
export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted">Loading…</p>}>
      {children}
    </Suspense>
  );
}
