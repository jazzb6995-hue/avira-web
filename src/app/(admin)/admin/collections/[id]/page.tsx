import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditCollectionPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  let collection: any = null;
  try { collection = await db.collection.findUnique({ where: { id } }); } catch {}
  if (!collection) notFound();

  return (
    <div>
      <Link href="/admin/collections" className="flex items-center gap-1 text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] mb-6">
        <ChevronLeft size={14} /> Collections
      </Link>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Edit Collection</h1>
      <CollectionForm initialData={collection} />
    </div>
  );
}
