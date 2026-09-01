import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export interface AdminSession {
  sub: string;
  role: string;
  email: string;
}

export async function requireAdmin(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get("avira_admin_token")?.value;
  if (!token) redirect("/admin/login");

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminSession;
  } catch {
    redirect("/admin/login");
  }
}
