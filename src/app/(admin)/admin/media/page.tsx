import { requireAdmin } from "@/lib/admin-auth";
import { Upload, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-display)] text-2xl">Media Library</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 mb-6 flex items-start gap-3">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Media Storage Setup Required</p>
          <p>To enable image uploads, connect a cloud storage provider (Cloudinary, AWS S3, or Vercel Blob) and set the required environment variables.</p>
          <p className="mt-1">Until then, use direct image URLs from your CDN when creating products.</p>
        </div>
      </div>

      <div className="bg-white p-12 shadow-sm border-2 border-dashed border-gray-200 text-center">
        <Upload size={36} className="mx-auto text-gray-300 mb-3" />
        <p className="text-[var(--color-warm-grey)] text-sm">Media library will appear here once storage is configured.</p>
        <p className="text-xs text-[var(--color-warm-grey)] mt-1">Supported: JPG, PNG, WebP, GIF (max 10MB each)</p>
      </div>
    </div>
  );
}
