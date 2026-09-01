import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Package, Heart, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let recentOrders: any[] = [];
  let wishlistCount = 0;
  let addressCount = 0;

  try {
    [recentOrders, wishlistCount, addressCount] = await Promise.all([
      db.order.findMany({
        where: { userId: session.user.id, paymentStatus: "PAID" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: { take: 1 } },
      }),
      db.wishlistItem.count({ where: { wishlist: { userId: session.user.id } } }),
      db.address.count({ where: { userId: session.user.id } }),
    ]);
  } catch { /* db not connected */ }

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <MotifDivider className="mb-6 max-w-xs" />
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mb-1">Hello, {firstName}</h1>
      <p className="text-[var(--color-warm-grey)] text-sm mb-8">{session.user.email}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Package size={20} />, label: "Orders", value: recentOrders.length, href: "/account/orders" },
          { icon: <Heart size={20} />, label: "Wishlist", value: wishlistCount, href: "/account/wishlist" },
          { icon: <MapPin size={20} />, label: "Addresses", value: addressCount, href: "/account/addresses" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-[var(--color-cream)] p-4 text-center hover:shadow-sm transition-shadow">
            <div className="flex justify-center text-[var(--color-plum)] mb-2">{stat.icon}</div>
            <p className="font-semibold text-xl">{stat.value}</p>
            <p className="text-xs text-[var(--color-warm-grey)]">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[var(--font-display)] text-lg">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs text-[var(--color-plum)] underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-[var(--color-cream)] px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-[var(--color-warm-grey)]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(Number(order.total))}</p>
                  <span className="text-xs text-[var(--color-plum)] capitalize">{order.status.toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
