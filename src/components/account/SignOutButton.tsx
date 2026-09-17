"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full text-left py-2 px-3 text-sm text-[var(--color-warm-grey)] hover:text-red-500 transition-colors"
    >
      Sign Out
    </button>
  );
}
