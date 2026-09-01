import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { status: "active" },
      orderBy: { subscribedAt: "desc" },
    });

    const rows = ["email,subscribed_at,source"];
    for (const s of subscribers) {
      rows.push(`"${s.email}","${new Date(s.subscribedAt).toISOString()}","${s.source ?? ""}"`);
    }

    return new NextResponse(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="subscribers.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
