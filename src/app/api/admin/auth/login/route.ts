import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "Invalid request." }, { status: 400 });

  const { email, password } = parsed.data;

  try {
    const admin = await db.adminUser.findUnique({ where: { email, active: true } });
    if (!admin) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

    const token = await new SignJWT({ sub: admin.id, role: admin.role, email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(secret);

    // Update last login
    await db.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("avira_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
