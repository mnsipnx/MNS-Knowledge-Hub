import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ExpiredNotice from "@/components/ExpiredNotice";
import LogoPlaceholder from "@/components/LogoPlaceholder";
import SignInForm from "@/components/SignInForm";
import UtilityBar from "@/components/UtilityBar";

export const metadata: Metadata = {
  title: "Sign in | MNS",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <>
      <UtilityBar label="Managed Network Services" />
      <header className="flex h-16 items-center border-b border-border bg-white px-6">
        <Link href="/" aria-label="MNS home">
          <LogoPlaceholder />
        </Link>
        <div className="flex-1" />
        <Link href="/" className="text-sm text-copy hover:text-ink">
          Back to homepage
        </Link>
      </header>
      <main className="px-4">
        <Suspense fallback={null}>
          <ExpiredNotice />
        </Suspense>
        <SignInForm />
      </main>
    </>
  );
}
