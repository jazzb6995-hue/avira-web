"use client";

import { useState } from "react";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) { setSent(true); setName(""); setEmail(""); setMessage(""); }
      else { const d = await res.json(); setError(d.message ?? "Could not send message."); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Get in Touch</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-2">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-3">
            <MessageCircle size={18} className="text-[var(--color-plum)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">WhatsApp</p>
              <a href={`https://wa.me/91${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] transition-colors">
                +91 {WHATSAPP_NUMBER}
              </a>
              <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">Fastest response</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail size={18} className="text-[var(--color-plum)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <a href="mailto:hello@avira.in" className="text-sm text-[var(--color-warm-grey)] hover:text-[var(--color-plum)] transition-colors">
                hello@avira.in
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock size={18} className="text-[var(--color-plum)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Response Time</p>
              <p className="text-sm text-[var(--color-warm-grey)]">Within 24 hours</p>
              <p className="text-xs text-[var(--color-warm-grey)]">Mon to Sat, 10am to 6pm IST</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {sent ? (
            <div className="bg-[var(--color-cream)] p-8 text-center">
              <p className="font-[var(--font-display)] text-xl mb-2">Message Received!</p>
              <p className="text-sm text-[var(--color-warm-grey)]">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--color-warm-grey)] block mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
                  className="w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors resize-none" />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button type="submit" variant="primary" size="md" loading={loading}>Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
