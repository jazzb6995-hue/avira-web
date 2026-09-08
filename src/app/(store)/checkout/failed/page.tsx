"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";

export default function CheckoutFailedPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <XCircle size={56} className="text-red-400" strokeWidth={1.5} />
      </div>
      <MotifDivider className="mb-6 max-w-xs mx-auto" />
      <h1 className="font-[var(--font-display)] text-3xl mb-3">Payment Unsuccessful</h1>
      <p className="text-[var(--color-warm-grey)] text-sm mb-8">
        Something went wrong and your payment could not be processed. Your cart is intact, please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/cart">
          <Button variant="outline" size="lg">Back to Cart</Button>
        </Link>
        <Link href="/checkout">
          <Button variant="primary" size="lg">Try Again</Button>
        </Link>
      </div>
      <p className="text-xs text-[var(--color-warm-grey)] mt-6">
        Need help? WhatsApp us at +91 {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "your number"}
      </p>
    </div>
  );
}
