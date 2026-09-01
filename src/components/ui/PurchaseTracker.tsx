"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/components/analytics/Analytics";

interface Props {
  orderNumber: string;
  total: number;
  items: { id: string; name: string; price: number; qty: number }[];
}

export function PurchaseTracker({ orderNumber, total, items }: Props) {
  useEffect(() => {
    trackPurchase(orderNumber, total, items);
  }, [orderNumber, total, items]);

  return null;
}
