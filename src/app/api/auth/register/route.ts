import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(8).max(72),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await db.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (existing) {
    const message = existing.email === email
      ? "An account with this email already exists."
      : "An account with this mobile number already exists.";
    return NextResponse.json({ message }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      profile: { create: {} },
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
