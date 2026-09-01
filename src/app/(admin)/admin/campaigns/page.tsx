import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  await requireAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Campaigns</h1>
        <Link href="/admin/campaigns/new"
          className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-4 py-2 text-sm hover:opacity-90">
          <Plus size={14} /> New Campaign
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Campaigns let you create promotional banners, countdown timers, and site-wide announcements. Connect your database to manage campaigns.
        </p>
      </div>

      <div className="bg-white p-8 shadow-sm text-center">
        <p className="text-[var(--color-warm-grey)] text-sm mb-4">No campaigns yet.</p>
        <Link href="/admin/campaigns/new"
          className="inline-flex items-center gap-2 bg-[var(--color-plum)] text-white px-4 py-2 text-sm hover:opacity-90">
          <Plus size={14} /> Create your first campaign
        </Link>
      </div>
    </div>
  );
}
