import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Star, Mail, BarChart2, Settings, Image, Megaphone, Globe } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={16} /> },
  { href: "/admin/collections", label: "Collections", icon: <Tag size={16} /> },
  { href: "/admin/campaigns", label: "Campaigns", icon: <Megaphone size={16} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={16} /> },
  { href: "/admin/customers", label: "Customers", icon: <Users size={16} /> },
  { href: "/admin/reviews", label: "Reviews", icon: <Star size={16} /> },
  { href: "/admin/newsletter", label: "Newsletter", icon: <Mail size={16} /> },
  { href: "/admin/media", label: "Media", icon: <Image size={16} /> },
  { href: "/admin/homepage", label: "Homepage", icon: <Globe size={16} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={16} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("avira_admin_token");

  // Basic token check — full JWT validation is in the middleware-equivalent proxy
  if (!adminToken?.value) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8F5F2]">
      {/* Sidebar */}
      <aside className="w-56 bg-[var(--color-plum)] text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <p className="font-[var(--font-display)] text-xl tracking-widest">AVIRA</p>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action="/api/admin/logout" method="POST">
            <button className="text-xs text-white/50 hover:text-white transition-colors">Sign Out</button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between">
          <div /> {/* breadcrumb placeholder */}
          <p className="text-xs text-[var(--color-warm-grey)]">AVIRA Admin CRM</p>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
