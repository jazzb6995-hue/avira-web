import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  let product: any = null;
  let categories: any[] = [];
  let tags: any[] = [];

  try {
    [product, categories, tags] = await Promise.all([
      db.product.findUnique({
        where: { id },
        include: {
          media: { orderBy: { sortOrder: "asc" } },
          tags: true,
        },
      }),
      db.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
      db.tag.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch { /* DB not connected */ }

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="flex items-center gap-1 text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] mb-6">
        <ChevronLeft size={14} /> Products
      </Link>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Edit Product</h1>
      <ProductForm categories={categories} tags={tags} initialData={product} />
    </div>
  );
}
