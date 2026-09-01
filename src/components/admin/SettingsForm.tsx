"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";

interface SettingField {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "url";
  hint?: string;
}

const SETTING_FIELDS: SettingField[] = [
  { key: "site_name", label: "Site Name" },
  { key: "site_tagline", label: "Tagline" },
  { key: "free_shipping_threshold", label: "Free Shipping Threshold (₹)", type: "number", hint: "Orders above this get free shipping" },
  { key: "flat_shipping_rate", label: "Flat Shipping Rate (₹)", type: "number" },
  { key: "first_order_discount_pct", label: "First Order Discount (%)", type: "number", hint: "Applied automatically on customer's first order" },
  { key: "whatsapp_number", label: "WhatsApp Number", hint: "Include country code, no +, no spaces (e.g. 919XXXXXXXXX)" },
  { key: "support_email", label: "Support Email", type: "email" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "meta_title", label: "Default Meta Title" },
  { key: "meta_description", label: "Default Meta Description" },
];

interface Props {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: Props) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: initialSettings });

  async function onSubmit(data: Record<string, string>) {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {saved && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-2">Settings saved successfully.</div>
      )}

      <div className="bg-white p-5 shadow-sm space-y-4">
        {SETTING_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="label-admin">{field.label}</label>
            <input {...register(field.key)} type={field.type ?? "text"} className="input-admin" />
            {field.hint && <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">{field.hint}</p>}
          </div>
        ))}
      </div>

      <button type="submit" disabled={isSubmitting}
        className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-60">
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Save Settings
      </button>
    </form>
  );
}
