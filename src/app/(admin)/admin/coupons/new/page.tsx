import { requireAdmin } from "@/lib/admin-auth";
import { CouponForm } from "@/components/admin/CouponForm";

export const dynamic = "force-dynamic";

export default async function NewCouponPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl mb-6">New Coupon</h1>
      <CouponForm />
    </div>
  );
}
