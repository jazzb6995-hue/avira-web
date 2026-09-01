import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/cart/MiniCart";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ExitIntentPopup } from "@/components/ui/ExitIntentPopup";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart />
      <WhatsAppButton />
      <ExitIntentPopup />
    </>
  );
}
