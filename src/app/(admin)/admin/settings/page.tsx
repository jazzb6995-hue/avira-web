import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();

  let settings: Record<string, string> = {};
  try {
    const rows = await db.siteSetting.findMany();
    for (const r of rows) { settings[r.key] = String(r.value ?? ""); }
  } catch { /* DB not connected */ }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Site Settings</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
