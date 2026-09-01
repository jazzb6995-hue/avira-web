import { requireAdmin } from "@/lib/admin-auth";
import { CollectionForm } from "@/components/admin/CollectionForm";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">New Collection</h1>
      <CollectionForm />
    </div>
  );
}
