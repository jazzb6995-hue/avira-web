import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/addresses", label: "Saved Addresses" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-52 flex-shrink-0">
          <p className="text-xs uppercase tracking-widest text-[var(--color-warm-grey)] mb-4">My Account</p>
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-3 text-sm transition-colors hover:text-[var(--color-plum)] text-[var(--color-charcoal)]"
              >
                {item.label}
              </Link>
            ))}
            <form action="/api/auth/signout" method="POST">
              <button className="w-full text-left py-2 px-3 text-sm text-[var(--color-warm-grey)] hover:text-red-500 transition-colors">
                Sign Out
              </button>
            </form>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
