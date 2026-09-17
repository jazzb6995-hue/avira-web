"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  sku: z.string().min(1, "SKU required"),
  emotionalName: z.string().optional(),
  longDescription: z.string().optional(),
  careInstructions: z.string().optional(),
  categoryId: z.string().optional(),
  mrp: z.coerce.number().positive("MRP required"),
  salePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  weightGrams: z.coerce.number().optional(),
  material: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  isFeatured: z.boolean(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  categories: any[];
  tags: any[];
  initialData?: any;
}

export function ProductForm({ categories, tags, initialData }: Props) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags?.map((t: any) => t.tagId) ?? []);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialData?.media?.map((m: any) => m.url) ?? []);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      sku: initialData?.sku ?? "",
      emotionalName: initialData?.emotionalName ?? "",
      longDescription: initialData?.longDescription ?? "",
      careInstructions: initialData?.careInstructions ?? "",
      categoryId: initialData?.categoryId ?? "",
      mrp: initialData?.mrp ? Number(initialData.mrp) : undefined,
      salePrice: initialData?.salePrice ? Number(initialData.salePrice) : undefined,
      costPrice: initialData?.costPrice ? Number(initialData.costPrice) : undefined,
      stock: initialData?.inventory?.stock ?? 0,
      weightGrams: initialData?.weightGrams ? Number(initialData.weightGrams) : undefined,
      material: initialData?.material ?? "",
      status: initialData?.status ?? "DRAFT",
      isNewArrival: initialData?.isNewArrival ?? false,
      isBestSeller: initialData?.isBestSeller ?? false,
      isFeatured: initialData?.isFeatured ?? false,
    },
  });

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const payload = {
        ...data,
        tags: selectedTags,
        mediaUrls,
      };
      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Failed to save product"); return; }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}

      <div className="bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-medium text-sm">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Title *</label>
            <input {...register("title")} onBlur={(e) => { if (!initialData) setValue("slug", autoSlug(e.target.value)); }}
              className="input-admin" placeholder="e.g., Lunar Curve Earrings" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label-admin">Emotional Name</label>
            <input {...register("emotionalName")} className="input-admin" placeholder="e.g., Moonlit Grace" />
          </div>
          <div>
            <label className="label-admin">Slug *</label>
            <input {...register("slug")} className="input-admin font-mono text-xs" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="label-admin">SKU *</label>
            <input {...register("sku")} className="input-admin font-mono text-xs" />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
          </div>
        </div>
        <div>
          <label className="label-admin">Description</label>
          <textarea {...register("longDescription")} rows={4} className="input-admin" />
        </div>
        <div>
          <label className="label-admin">Care Instructions</label>
          <textarea {...register("careInstructions")} rows={2} className="input-admin" />
        </div>
      </div>

      <div className="bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-medium text-sm">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label-admin">MRP (₹) *</label>
            <input {...register("mrp")} type="number" step="0.01" className="input-admin" />
            {errors.mrp && <p className="text-red-500 text-xs mt-1">{errors.mrp.message}</p>}
          </div>
          <div>
            <label className="label-admin">Sale Price (₹)</label>
            <input {...register("salePrice")} type="number" step="0.01" className="input-admin" />
          </div>
          <div>
            <label className="label-admin">Cost Price (₹)</label>
            <input {...register("costPrice")} type="number" step="0.01" className="input-admin" />
          </div>
          <div>
            <label className="label-admin">Stock</label>
            <input {...register("stock")} type="number" className="input-admin" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Weight (grams)</label>
            <input {...register("weightGrams")} type="number" step="0.1" className="input-admin" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-medium text-sm">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Category</label>
            <select {...register("categoryId")} className="input-admin">
              <option value="">— Select category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-admin">Material</label>
            <input {...register("material")} className="input-admin" placeholder="e.g., 925 Sterling Silver" />
          </div>
        </div>
        <div>
          <label className="label-admin">Tags</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag: any) => (
              <button key={tag.id} type="button"
                onClick={() => setSelectedTags((prev) => prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id])}
                className={`text-xs px-3 py-1.5 border transition-colors ${selectedTags.includes(tag.id) ? "bg-[var(--color-plum)] text-white border-[var(--color-plum)]" : "border-gray-200 text-gray-500 hover:border-[var(--color-plum)]"}`}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-medium text-sm">Photos</h2>
        <ImageUploader value={mediaUrls} onChange={setMediaUrls} max={4} />
      </div>

      <div className="bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-medium text-sm">Status & Flags</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label-admin">Status</label>
            <select {...register("status")} className="input-admin">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "isNewArrival" as const, label: "New Arrival" },
            { name: "isBestSeller" as const, label: "Best Seller" },
            { name: "isFeatured" as const, label: "Featured" },
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
          {initialData ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 text-sm border border-gray-200 hover:border-gray-400 text-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
}
