"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AviraMotif } from "@/components/ui/AviraMotif";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <AviraMotif size={28} className="mx-auto mb-4" />
          <h1 className="font-[var(--font-display)] text-2xl">Reset Password</h1>
          <p className="text-sm text-[var(--color-warm-grey)] mt-2">
            {sent ? "Check your inbox" : "We'll send a reset link to your email"}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-[var(--color-blush)] text-[var(--color-plum)] px-4 py-3 text-sm mb-6">
              If an account exists for that email, we've sent a password reset link. Check your spam folder too.
            </div>
            <Link href="/login" className="text-sm text-[var(--color-plum)] underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-[var(--color-warm-grey-light)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-plum)] bg-transparent"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-plum)] text-[var(--color-ivory)] py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send Reset Link"}
            </button>

            <p className="text-center text-xs text-[var(--color-warm-grey)]">
              Remember your password?{" "}
              <Link href="/login" className="text-[var(--color-plum)] underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
