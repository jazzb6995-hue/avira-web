import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();

  let categories: any[] = [];
  let tags: any[] = [];
  try {
    [categories, tags] = await Promise.all([
      db.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
      db.tag.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch { /* DB not connected */ }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">New Product</h1>
      <ProductForm categories={categories} tags={tags} />
    </div>
  );
}
