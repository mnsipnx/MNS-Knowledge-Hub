"use client";

import { useSearchParams } from "next/navigation";

// Shown on the sign-in page after an automatic sign-out.
export default function ExpiredNotice() {
  const params = useSearchParams();
  if (params.get("expired") !== "1") return null;
  return (
    <p
      role="status"
      className="mx-auto mt-10 w-full max-w-[380px] rounded-[14px] border border-border bg-surface-alt px-4 py-3 text-sm text-copy"
    >
      You were signed out after 30 minutes of inactivity. Please sign in again.
    </p>
  );
}
