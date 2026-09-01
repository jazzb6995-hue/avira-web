import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

function getSecret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "avira-reset-secret-fallback");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { token, email, password } = parsed.data;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.email !== email || payload.purpose !== "password-reset") {
      return NextResponse.json({ error: "Reset link is invalid." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.update({ where: { email }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
