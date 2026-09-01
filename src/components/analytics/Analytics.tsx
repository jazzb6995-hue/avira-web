"use client";

import Script from "next/script";

interface Props {
  ga4Id?: string;
  metaPixelId?: string;
}

export function Analytics({ ga4Id, metaPixelId }: Props) {
  if (!ga4Id && !metaPixelId) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}

// Tracking helpers — call from client components after events
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export function trackAddToCart(item: { id: string; name: string; price: number; currency?: string }) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "add_to_cart", {
    currency: item.currency ?? "INR",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: 1 }],
  });
  window.fbq?.("track", "AddToCart", { content_ids: [item.id], content_name: item.name, value: item.price, currency: item.currency ?? "INR" });
}

export function trackInitiateCheckout(value: number, numItems: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "begin_checkout", { currency: "INR", value, num_items: numItems });
  window.fbq?.("track", "InitiateCheckout", { value, currency: "INR", num_items: numItems });
}

export function trackPurchase(orderNumber: string, value: number, items: { id: string; name: string; price: number; qty: number }[]) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "purchase", {
    transaction_id: orderNumber,
    currency: "INR",
    value,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
  });
  window.fbq?.("track", "Purchase", {
    content_ids: items.map((i) => i.id),
    value,
    currency: "INR",
    num_items: items.length,
  });
}

export function trackViewContent(productId: string, name: string, price: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "view_item", {
    currency: "INR",
    value: price,
    items: [{ item_id: productId, item_name: name, price }],
  });
  window.fbq?.("track", "ViewContent", { content_ids: [productId], content_name: name, value: price, currency: "INR" });
}

export function trackSearch(query: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "search", { search_term: query });
  window.fbq?.("track", "Search", { search_string: query });
}
