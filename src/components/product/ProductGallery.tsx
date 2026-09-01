"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";

interface MediaItem {
  url: string;
  altText: string;
  mediaType: string;
}

interface VariantMedia {
  id: string;
  colourName: string;
  hexValue?: string | null;
  media: { url: string; altText: string }[];
}

interface Props {
  media: MediaItem[];
  variants?: VariantMedia[];
  selectedVariantId?: string;
}

export function ProductGallery({ media, variants, selectedVariantId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const activeVariant = variants?.find((v) => v.id === selectedVariantId);
  const displayMedia =
    activeVariant && activeVariant.media.length > 0
      ? activeVariant.media.map((m) => ({ ...m, mediaType: "image" }))
      : media;

  const current = displayMedia[activeIndex] ?? displayMedia[0];

  return (
    <div className="sticky top-20">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-[var(--color-cream)] overflow-hidden group">
        {current?.mediaType === "video" ? (
          <video
            src={current.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <Image
              src={current?.url ?? "/placeholder-product.jpg"}
              alt={current?.altText ?? "Product"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={cn(
                "object-cover transition-transform duration-500",
                zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in group-hover:scale-[1.03]"
              )}
              onClick={() => setZoomed(!zoomed)}
              priority
            />
            <button
              onClick={() => setZoomed(!zoomed)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn size={14} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayMedia.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {displayMedia.map((item, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setZoomed(false); }}
              className={cn(
                "flex-shrink-0 w-16 h-20 bg-[var(--color-cream)] overflow-hidden border-2 transition-colors",
                i === activeIndex
                  ? "border-[var(--color-plum)]"
                  : "border-transparent hover:border-[var(--color-warm-grey-light)]"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={item.url}
                alt={item.altText}
                width={64}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
