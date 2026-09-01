import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "Valid email required." }, { status: 400 });

  const { email, source } = parsed.data;

  try {
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.status === "active") return NextResponse.json({ message: "You're already subscribed!" });
      await db.newsletterSubscriber.update({
        where: { email },
        data: { status: "active", unsubscribedAt: null },
      });
      return NextResponse.json({ message: "Welcome back! You've been re-subscribed." });
    }

    await db.newsletterSubscriber.create({ data: { email, source: source ?? null } });
    return NextResponse.json({ message: "Subscribed! Thank you for joining AVIRA." });
  } catch (err) {
    console.error("[newsletter/subscribe]", err);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
