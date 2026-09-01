"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppButton() {
  const pathname = usePathname();
  // Hide on checkout and admin pages
  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi AVIRA! I have a question.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AVIRA on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#22C55E] hover:scale-110 active:scale-95 transition-all duration-200"
      style={{ width: 52, height: 52 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.102 1.522 5.828L.057 23.804c-.09.356.224.67.58.58l5.976-1.465A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.372l-.359-.214-3.72.912.93-3.641-.234-.374A9.818 9.818 0 1112 21.818z"/>
      </svg>
    </a>
  );
}
