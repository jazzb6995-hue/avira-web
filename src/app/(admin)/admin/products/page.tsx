import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  let products: any[] = [];
  try {
    products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        category: { select: { name: true } },
        media: { take: 1, orderBy: { sortOrder: "asc" } },
      },
    });
  } catch {
    // DB not connected
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Products</h1>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-4 py-2 text-sm hover:opacity-90">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-xs text-[var(--color-warm-grey)] uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-[var(--color-warm-grey)] uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[var(--color-warm-grey)] text-sm">
                  No products yet. <Link href="/admin/products/new" className="text-[var(--color-plum)] underline">Add your first product</Link>
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id} className="hover:bg-[var(--color-ivory)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.media[0]?.url ? (
                        <img src={p.media[0].url} alt={p.title} className="w-10 h-10 object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">IMG</div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-[var(--color-warm-grey)]">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    {p.salePrice ? (
                      <div>
                        <span className="font-medium">{formatPrice(Number(p.salePrice))}</span>
                        <span className="text-xs text-[var(--color-warm-grey)] line-through ml-1">{formatPrice(Number(p.mrp))}</span>
                      </div>
                    ) : (
                      <span className="font-medium">{formatPrice(Number(p.mrp))}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "PUBLISHED" ? "bg-green-50 text-green-700" :
                      p.status === "DRAFT" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {p.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">{p.inventory}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="text-xs text-[var(--color-plum)] underline">Edit</Link>
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
