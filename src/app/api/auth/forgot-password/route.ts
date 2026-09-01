import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { SignJWT } from "jose";

const schema = z.object({ email: z.string().email() });

function getSecret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "avira-reset-secret-fallback");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      const token = await new SignJWT({ email, purpose: "password-reset" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .setIssuedAt()
        .sign(getSecret());

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

      await new Resend(process.env.RESEND_API_KEY ?? "re_placeholder").emails.send({
        from: "AVIRA <noreply@avira.in>",
        to: email,
        subject: "Reset your AVIRA password",
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #333;">
            <h2 style="color: #54283C;">Reset your password</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#54283C;color:#FBF7F2;padding:12px 24px;text-decoration:none;font-size:14px;margin:16px 0;">
              Reset Password
            </a>
            <p style="font-size:12px;color:#999;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    }
  } catch {
    // Silently fail — always return 200 so we don't reveal account existence
  }

  return NextResponse.json({ ok: true });
}
