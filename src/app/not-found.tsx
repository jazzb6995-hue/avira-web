import Link from "next/link";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <MotifDivider className="mb-6 max-w-xs mx-auto" />
      <p className="text-[120px] font-[var(--font-display)] leading-none text-[var(--color-blush)] select-none">404</p>
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mt-4 mb-3">Page Not Found</h1>
      <p className="text-[var(--color-warm-grey)] text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist. Perhaps you'd like to explore our collections instead?
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button variant="outline" size="md">Go Home</Button>
        </Link>
        <Link href="/new-arrivals">
          <Button variant="primary" size="md">Shop New Arrivals</Button>
        </Link>
      </div>
    </div>
  );
}
