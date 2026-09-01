"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const schema = z.object({
  code: z.string().min(1, "Code required"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive("Value required"),
  minOrderAmount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
  perCustomerLimit: z.coerce.number().int().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
  isFirstOrderOnly: z.boolean(),
  stackable: z.boolean(),
  singleUse: z.boolean(),
});
type FormData = z.infer<typeof schema>;

interface Props { initialData?: any }

export function CouponForm({ initialData }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const promo = initialData?.promotion;

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      code: initialData?.code ?? "",
      type: promo?.discountType ?? "PERCENTAGE",
      value: promo?.discountValue ? Number(promo.discountValue) : undefined,
      minOrderAmount: promo?.minimumSpend ? Number(promo.minimumSpend) : undefined,
      usageLimit: promo?.usageLimit ?? undefined,
      perCustomerLimit: promo?.perCustomerLimit ?? undefined,
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 10) : "",
      isActive: initialData?.active ?? true,
      isFirstOrderOnly: promo?.firstOrderOnly ?? false,
      stackable: promo?.stackable ?? false,
      singleUse: initialData?.singleUse ?? false,
    },
  });

  const typeValue = watch("type");

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      };
      const url = initialData ? `/api/admin/coupons/${initialData.id}` : "/api/admin/coupons";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Failed to save"); return; }
      router.push("/admin/coupons");
      router.refresh();
    } catch {
      setError("Network error.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}

      <div className="bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Coupon Code *</label>
            <input {...register("code")} className="input-admin font-mono uppercase" placeholder="SUMMER10" />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="label-admin">Type *</label>
            <select {...register("type")} className="input-admin">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Discount Value * {typeValue === "PERCENTAGE" ? "(%)" : "(₹)"}</label>
            <input {...register("value")} type="number" step="0.01" className="input-admin" />
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
          </div>
          <div>
            <label className="label-admin">Min Order Amount (₹)</label>
            <input {...register("minOrderAmount")} type="number" step="0.01" className="input-admin" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Total Usage Limit</label>
            <input {...register("usageLimit")} type="number" className="input-admin" placeholder="Blank = unlimited" />
          </div>
          <div>
            <label className="label-admin">Per Customer Limit</label>
            <input {...register("perCustomerLimit")} type="number" className="input-admin" placeholder="1" />
          </div>
        </div>
        <div>
          <label className="label-admin">Expires On</label>
          <input {...register("expiresAt")} type="date" className="input-admin" />
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "isActive" as const, label: "Active" },
            { name: "isFirstOrderOnly" as const, label: "First Order Only" },
            { name: "stackable" as const, label: "Stackable with Sales" },
            { name: "singleUse" as const, label: "Single Use" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input {...register(name)} type="checkbox" className="accent-[var(--color-plum)]" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-60">
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {initialData ? "Save Changes" : "Create Coupon"}
        </button>
        <button type="button" onClick={() => router.push("/admin/coupons")}
          className="px-6 py-2.5 text-sm border border-gray-200 hover:border-gray-400 text-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
}
