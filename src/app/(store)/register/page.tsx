"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    getProviders().then((providers) => {
      setGoogleAvailable(Boolean(providers?.google));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Registration failed.");
        return;
      }
      // Auto sign in after registration
      await signIn("credentials", { email, password, callbackUrl, redirect: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl">Create Account</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-1">Join AVIRA and discover little things</p>
      </div>

      {googleAvailable && (
        <>
          <button
            onClick={handleGoogle}
            className="w-full border border-[var(--color-border)] py-3 flex items-center justify-center gap-3 text-sm hover:bg-[var(--color-cream)] transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative text-center text-xs text-[var(--color-warm-grey)] mb-6">
            <span className="bg-white px-3 relative z-10">or create with email</span>
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-border)]" /></div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"
            className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
            className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8}
              className="w-full border border-[var(--color-border)] px-3 py-2.5 pr-10 text-sm outline-none focus:border-[var(--color-plum)] transition-colors" />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-grey)]">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="text-xs text-[var(--color-warm-grey)] mt-1">Minimum 8 characters</p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>Create Account</Button>
      </form>

      <p className="text-center text-sm text-[var(--color-warm-grey)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-plum)] underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
