"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max = 4 }: Props) {
  const [uploading, setUploading] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const slots = Array.from({ length: max }, (_, i) => value[i] ?? null);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files).slice(0, max - value.length);
    if (list.length === 0) return;

    const startIndex = value.length;
    setUploading((prev) => [...prev, ...list.map((_, i) => startIndex + i)]);

    const uploaded: string[] = [];
    for (const file of list) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        uploaded.push(json.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }

    onChange([...value, ...uploaded]);
    setUploading([]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {slots.map((url, i) => (
          <div
            key={i}
            onDrop={!url ? handleDrop : undefined}
            onDragOver={(e) => e.preventDefault()}
            className="relative aspect-square border border-dashed border-[var(--color-border)] bg-[var(--color-cream)] overflow-hidden flex items-center justify-center"
          >
            {url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Product photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X size={12} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-white/90 text-[var(--color-charcoal)] text-[10px] uppercase tracking-wide px-1.5 py-0.5">
                    Primary
                  </span>
                )}
              </>
            ) : uploading.includes(i) ? (
              <Loader2 size={20} className="animate-spin text-[var(--color-warm-grey)]" />
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center gap-1 text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] transition-colors w-full h-full justify-center"
              >
                <Upload size={18} />
                <span className="text-[10px] uppercase tracking-wide">Photo {i + 1}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <p className="text-xs text-[var(--color-warm-grey)] mt-2">
        Click a slot or drag photos in. Up to {max} photos, JPG/PNG/WEBP, 8MB each. First photo is the primary image.
      </p>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
