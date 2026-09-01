import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { format } from "date-fns";
import { NewsletterExport } from "@/components/admin/NewsletterExport";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  await requireAdmin();

  let subscribers: any[] = [];
  let total = 0;
  let active = 0;

  try {
    [subscribers, total, active] = await Promise.all([
      db.newsletterSubscriber.findMany({
        orderBy: { subscribedAt: "desc" },
        take: 200,
      }),
      db.newsletterSubscriber.count(),
      db.newsletterSubscriber.count({ where: { status: "active" } }),
    ]);
  } catch { /* DB not connected */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Newsletter</h1>
        <NewsletterExport />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow-sm">
          <p className="text-xs text-[var(--color-warm-grey)] uppercase tracking-wider mb-1">Total Subscribers</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
        <div className="bg-white p-4 shadow-sm">
          <p className="text-xs text-[var(--color-warm-grey)] uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-semibold">{active}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Subscribed</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider hidden md:table-cell">Source</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-warm-grey)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-[var(--color-warm-grey)] text-sm">No subscribers yet.</td>
              </tr>
            ) : (
              subscribers.map((s: any) => (
                <tr key={s.id} className="hover:bg-[var(--color-ivory)]">
                  <td className="px-4 py-3 text-sm">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">
                    {format(new Date(s.subscribedAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warm-grey)] hidden md:table-cell">{s.source ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.status ?? "active"}
                    </span>
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
