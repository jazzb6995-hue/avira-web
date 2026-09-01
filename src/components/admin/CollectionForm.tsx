"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  active: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});
type FormData = z.infer<typeof schema>;

interface Props { initialData?: any }

export function CollectionForm({ initialData }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      active: initialData?.active ?? true,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const url = initialData ? `/api/admin/collections/${initialData.id}` : "/api/admin/collections";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Failed to save"); return; }
      router.push("/admin/collections");
      router.refresh();
    } catch { setError("Network error."); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}

      <div className="bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="label-admin">Name *</label>
          <input {...register("name")} className="input-admin"
            onBlur={(e) => { if (!initialData) setValue("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label-admin">Slug *</label>
          <input {...register("slug")} className="input-admin font-mono text-xs" />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="label-admin">Description</label>
          <textarea {...register("description")} rows={3} className="input-admin" />
        </div>
        <div>
          <label className="label-admin">Cover Image URL</label>
          <input {...register("imageUrl")} type="url" className="input-admin" placeholder="https://cdn.example.com/collection.jpg" />
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Sort Order</label>
            <input {...register("sortOrder")} type="number" className="input-admin" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register("active")} type="checkbox" className="accent-[var(--color-plum)]" />
          <span className="text-sm">Active (visible on site)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-[var(--color-plum)] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-60">
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {initialData ? "Save Changes" : "Create Collection"}
        </button>
        <button type="button" onClick={() => router.push("/admin/collections")}
          className="px-6 py-2.5 text-sm border border-gray-200 hover:border-gray-400 text-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
}
