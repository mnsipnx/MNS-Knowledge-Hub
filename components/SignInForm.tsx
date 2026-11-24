"use client";

import { useState, useTransition } from "react";
import { requestCode, verifyCode } from "@/app/signin/actions";
import { btnPrimary } from "@/lib/ui";

const input =
  "w-full rounded-lg border border-border-strong bg-white px-4 py-[10px] text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none";

export default function SignInForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    start(async () => {
      const res = await requestCode(email);
      if (res.ok) setStep("code");
      else setError(true);
    });
  }

  function checkCode(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    start(async () => {
      const res = await verifyCode(email, code);
      // On success the server redirects; we only get here on failure.
      if (res && !res.ok) setError(true);
    });
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-[380px] rounded-[14px] border border-border bg-white p-8 shadow-[0_1px_1.5px_rgba(0,0,0,0.06)]">
      <h1 className="font-heading text-[28px] font-bold text-ink">Sign in</h1>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-5 space-y-4">
          <p className="text-sm text-copy">Use the account you were given.</p>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
          <button disabled={pending} className={`${btnPrimary} w-full`}>
            {pending ? "Please wait…" : "Continue"}
          </button>
          <p className="text-xs text-muted">We will email you a verification code.</p>
        </form>
      ) : (
        <form onSubmit={checkCode} className="mt-5 space-y-4">
          <p className="text-sm text-copy">
            If this email has an account, we have sent a code to it. Enter the code below.
          </p>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${input} text-center tracking-widest`}
          />
          <button disabled={pending} className={`${btnPrimary} w-full`}>
            {pending ? "Please wait…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(false);
            }}
            className="text-xs text-muted underline"
          >
            Use a different email
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-brand-red">
          We could not sign you in.
        </p>
      )}

      <p className="mt-6 text-xs text-muted">Need access? Contact [MNS contact].</p>
    </div>
  );
}
