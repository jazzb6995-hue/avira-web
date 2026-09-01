"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AviraMotif } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const d = await res.json();
        setError(d.message ?? "Invalid credentials");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-plum)] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <AviraMotif size={36} fill="var(--color-plum)" className="mx-auto mb-3" />
          <p className="font-[var(--font-display)] text-2xl tracking-widest text-[var(--color-plum)]">AVIRA</p>
          <p className="text-xs text-[var(--color-warm-grey)] mt-1 uppercase tracking-widest">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-[var(--color-border)] px-3 py-2.5 pr-10 text-sm outline-none focus:border-[var(--color-plum)]" />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-grey)]">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>Sign In</Button>
        </form>
      </div>
    </div>
  );
}
