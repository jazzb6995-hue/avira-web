"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AviraMotif } from "@/components/ui/AviraMotif";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Try again.");
    }
  }

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-red-500 text-sm mb-4">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="text-[var(--color-plum)] underline text-sm">Request a new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm text-[var(--color-warm-grey)] mb-4">Password reset! Redirecting to login…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-1.5">New Password</label>
        <input {...register("password")} type="password" placeholder="At least 8 characters"
          className="w-full border border-[var(--color-warm-grey-light)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-plum)] bg-transparent" />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-1.5">Confirm Password</label>
        <input {...register("confirm")} type="password" placeholder="Repeat password"
          className="w-full border border-[var(--color-warm-grey-light)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-plum)] bg-transparent" />
        {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button type="submit" disabled={isSubmitting}
        className="w-full bg-[var(--color-plum)] text-[var(--color-ivory)] py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
        {isSubmitting ? "Saving…" : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <AviraMotif size={28} className="mx-auto mb-4" />
          <h1 className="font-[var(--font-display)] text-2xl">Set New Password</h1>
        </div>
        <Suspense fallback={<div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[var(--color-plum)] border-t-transparent rounded-full animate-spin" /></div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
