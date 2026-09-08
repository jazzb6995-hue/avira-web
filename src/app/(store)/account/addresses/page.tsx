import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Saved Addresses | AVIRA" };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let addresses: any[] = [];
  try {
    addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  } catch { /* db not connected */ }

  return (
    <div>
      <MotifDivider className="mb-5 max-w-xs" />
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mb-6">Saved Addresses</h1>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={48} className="text-[var(--color-warm-grey-light)] mx-auto mb-4" />
          <p className="text-[var(--color-warm-grey)] text-sm">Your saved addresses will appear here after your first order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`border p-4 ${addr.isDefault ? "border-[var(--color-plum)]" : "border-[var(--color-border)]"}`}>
              {addr.isDefault && <span className="text-[10px] uppercase tracking-widest text-[var(--color-plum)] font-medium">Default</span>}
              <p className="font-medium text-sm mt-1">{addr.name}</p>
              <p className="text-sm text-[var(--color-warm-grey)]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p className="text-sm text-[var(--color-warm-grey)]">{addr.city}, {addr.state}, {addr.pincode}</p>
              <p className="text-sm text-[var(--color-warm-grey)]">{addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
