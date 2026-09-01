import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import { CouponForm } from "@/components/admin/CouponForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditCouponPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  let coupon: any = null;
  try { coupon = await db.coupon.findUnique({ where: { id }, include: { promotion: true } }); } catch {}
  if (!coupon) notFound();

  return (
    <div>
      <Link href="/admin/coupons" className="flex items-center gap-1 text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] mb-6">
        <ChevronLeft size={14} /> Coupons
      </Link>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">Edit Coupon</h1>
      <CouponForm initialData={coupon} />
    </div>
  );
}
