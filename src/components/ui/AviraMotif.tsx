import { cn } from "@/lib/utils";

interface AviraMotifProps {
  className?: string;
  size?: number;
  fill?: string;
}

// Four-petal jewellery-inspired AVIRA signature motif
export function AviraMotif({ className, size = 16, fill }: AviraMotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(fill ? "" : "text-[var(--color-plum)]", className)}
      style={fill ? { color: fill } : undefined}
      aria-hidden="true"
    >
      <path
        d="M8 1C8 4.31 8 4.31 8 7.5C8 4.31 10.69 1.62 14 1.62C10.69 1.62 10.69 1.62 8 1Z"
        fill="currentColor"
        opacity="0.6"
      />
      <ellipse cx="8" cy="4" rx="1.5" ry="3.5" fill="currentColor" opacity="0.8" />
      <ellipse cx="8" cy="12" rx="1.5" ry="3.5" fill="currentColor" opacity="0.8" />
      <ellipse cx="4" cy="8" rx="3.5" ry="1.5" fill="currentColor" opacity="0.8" />
      <ellipse cx="12" cy="8" rx="3.5" ry="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function MotifDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-[var(--color-plum)] opacity-30",
        className
      )}
    >
      <span className="flex-1 h-px bg-current" />
      <AviraMotif size={12} />
      <span className="flex-1 h-px bg-current" />
    </div>
  );
}
