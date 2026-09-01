"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update({ name });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <MotifDivider className="mb-5 max-w-xs" />
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mb-6">Profile</h1>

      <form onSubmit={handleSave} className="max-w-sm space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email</label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            disabled
            className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm bg-[var(--color-cream)] text-[var(--color-warm-grey)]"
          />
          <p className="text-xs text-[var(--color-warm-grey)] mt-1">Email cannot be changed</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="md" loading={saving}>Save Changes</Button>
          {saved && <span className="text-xs text-green-600">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
