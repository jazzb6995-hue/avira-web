"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { SHIPPING } from "@/lib/constants";
import { ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";

interface Address {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: Address = {
  name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu and Kashmir","Ladakh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Address | "email", string>>>({});

  const sub = subtotal();
  const shippingFee = sub >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.FLAT_RATE;
  const total = Math.max(0, sub + shippingFee - (couponDiscount ?? 0));

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const validate = () => {
    const errs: typeof errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = "Valid email required";
    if (!address.name.trim()) errs.name = "Required";
    if (!address.phone || !/^\d{10}$/.test(address.phone)) errs.phone = "Valid 10-digit phone required";
    if (!address.line1.trim()) errs.line1 = "Required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errs.pincode = "Valid 6-digit pincode required";
    return errs;
  };

  const handlePayment = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, address, items, couponCode, couponDiscount, shippingFee, total }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message ?? "Order creation failed");

      // 2. Load Razorpay and open checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "AVIRA",
          description: "Little Things. Beautiful You.",
          order_id: orderData.razorpayOrderId,
          prefill: { email, contact: address.phone, name: address.name },
          theme: { color: "#54283C" },
          handler: async (response: any) => {
            // 3. Verify payment on server
            const verifyRes = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: orderData.orderId }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-confirmation/${verifyData.orderNumber}`);
            } else {
              router.push(`/checkout/failed?orderId=${orderData.orderId}`);
            }
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
        });
        rzp.open();
      };
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      alert(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const field = (
    key: keyof Address,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">{label}</label>
      <input
        type={type}
        value={address[key]}
        onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors"
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Checkout</h1>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[var(--color-warm-grey)]">
          <Lock size={12} /> Secure checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-[var(--font-display)] text-xl mb-4">Contact</h2>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-[var(--font-display)] text-xl mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("name", "Full Name")}
              {field("phone", "Mobile Number", "tel", "10-digit mobile")}
              <div className="sm:col-span-2">{field("line1", "Address Line 1", "text", "House / Flat / Street")}</div>
              <div className="sm:col-span-2">{field("line2", "Address Line 2 (optional)", "text", "Landmark, Area")}</div>
              {field("city", "City")}
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">State</label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] bg-white"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              {field("pincode", "Pincode", "text", "6-digit pincode")}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-[var(--font-display)] text-xl mb-4">Payment</h2>
            <div className="bg-[var(--color-cream)] p-4 flex items-center gap-3 border border-[var(--color-border)]">
              <ShieldCheck size={18} className="text-[var(--color-plum)] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Secure payment via Razorpay</p>
                <p className="text-xs text-[var(--color-warm-grey)]">UPI · Cards · Net Banking · Wallets</p>
              </div>
            </div>
            <p className="text-xs text-[var(--color-warm-grey)] mt-2 flex items-center gap-1">
              <Lock size={10} /> All transactions are encrypted. No COD.
            </p>
          </section>

          <Button variant="primary" size="lg" className="w-full" onClick={handlePayment} loading={loading}>
            Pay {formatPrice(total)}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--color-cream)] p-6 sticky top-24">
            <h2 className="font-[var(--font-display)] text-xl mb-5">Order Summary</h2>
            <div className="space-y-4 mb-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-start">
                  <div className="relative">
                    <Image src={item.imageUrl} alt={item.title} width={56} height={72} className="object-cover bg-white w-14 h-18" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-plum)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    {item.colour && <p className="text-xs text-[var(--color-warm-grey)]">{item.colour}</p>}
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-warm-grey)]">Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-warm-grey)]">Shipping</span>
                <span className={shippingFee === 0 ? "text-green-600" : ""}>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-[var(--color-border)] pt-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
