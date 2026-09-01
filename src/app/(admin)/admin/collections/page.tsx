import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  await requireAdmin();

  let collections: any[] = [];
  try {
    collections = await db.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch { /* DB not connected */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Collections</h1>
        <Link href="/admin/collections/new"
          className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-4 py-2 text-sm hover:opacity-90">
          <Plus size={14} /> New Collection
        </Link>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Products</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[var(--color-warm-grey)] text-sm">
                  No collections yet. <Link href="/admin/collections/new" className="text-[var(--color-plum)] underline">Create one</Link>
                </td>
              </tr>
            ) : (
              collections.map((c: any) => (
                <tr key={c.id} className="hover:bg-[var(--color-ivory)]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-warm-grey)] hidden md:table-cell">{c.slug}</td>
                  <td className="px-4 py-3 text-sm">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/collections/${c.id}`} className="text-xs text-[var(--color-plum)] underline">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
