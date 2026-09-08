import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { AviraMotif } from "@/components/ui/AviraMotif";

export const metadata: Metadata = {
  title: "Our Story | AVIRA",
  description: "The story behind AVIRA, jewellery rooted in the belief that little things make life beautiful.",
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-ivory)]">
      {/* Hero */}
      <div className="relative w-full h-[50vh] min-h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9519f94c5eb8?w=1400&q=80&auto=format&fit=crop"
          alt="AVIRA Jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-plum)]/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <MotifDivider className="mb-6 max-w-xs mx-auto opacity-50" />
          <h1 className="font-[var(--font-display)] text-4xl md:text-6xl font-light mb-3">Our Story</h1>
          <p className="text-white/80 text-sm tracking-widest uppercase">Little Things. Beautiful You.</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">

        {/* Opening quote */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <AviraMotif size={36} className="mx-auto mb-6 text-[var(--color-plum)]/40" />
          <p className="text-xl md:text-2xl leading-relaxed font-[var(--font-display)] italic text-[var(--color-charcoal)]">
            "We believe beauty lives in the small moments: the glimmer of a bracelet caught in sunlight, the weight of a delicate ring on your finger, the quiet confidence a pair of earrings can give you."
          </p>
        </div>

        {/* Two-column: photo + text */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&auto=format&fit=crop"
              alt="AVIRA craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-4">How It Began</p>
            <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-charcoal)] mb-6 leading-tight">
              Born from a simple truth
            </h2>
            <p className="text-[var(--color-charcoal)]/80 text-base leading-relaxed mb-4">
              AVIRA was born from a simple truth: the pieces we wear every day are not just accessories. They are expressions. They carry memories, mark milestones, and become part of who we are. We set out to create jewellery that feels personal, that speaks without words.
            </p>
            <p className="text-[var(--color-charcoal)]/80 text-base leading-relaxed">
              Every piece in our collection is crafted with intention. We work with artisans who understand that quality is not just about material. It is about feel, about the way something sits on your skin, catches the light, and makes you pause.
            </p>
          </div>
        </div>

        {/* Full-width quote */}
        <div className="bg-[var(--color-plum)] text-white p-10 md:p-16 text-center mb-16">
          <AviraMotif size={32} fill="#FBF7F2" className="mx-auto mb-5" />
          <p className="font-[var(--font-display)] text-2xl md:text-3xl italic leading-relaxed">
            "Made for the woman who finds magic in ordinary moments."
          </p>
        </div>

        {/* Two-column: text + photo */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-4">Our Roots</p>
            <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-charcoal)] mb-6 leading-tight">
              Indian by heart. Modern by design.
            </h2>
            <p className="text-[var(--color-charcoal)]/80 text-base leading-relaxed mb-4">
              Our roots are Indian. Our aesthetic is modern. We believe Indian women deserve jewellery that moves with them, from morning chai to midnight celebrations, without compromise on beauty or quality.
            </p>
            <p className="text-[var(--color-charcoal)]/80 text-base leading-relaxed">
              Every AVIRA piece arrives in packaging designed with the same care as the jewellery itself, because we believe the unboxing should feel like a gift: to yourself, or someone you love.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden md:order-last">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80&auto=format&fit=crop"
              alt="AVIRA collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Handcrafted", desc: "Every piece made by skilled artisans with attention to detail." },
            { title: "Ethically Sourced", desc: "Materials chosen with care for people and the planet." },
            { title: "Thoughtfully Packaged", desc: "Gift-ready from the moment it leaves us." },
            { title: "Quality First", desc: "Built to last, designed to be treasured." },
            { title: "Indian Heritage", desc: "Rooted in tradition, styled for today." },
            { title: "Made With Love", desc: "Because the best things always are." },
          ].map((v) => (
            <div key={v.title} className="bg-white border border-[var(--color-border)] p-6">
              <p className="font-[var(--font-display)] text-lg text-[var(--color-plum)] mb-2">{v.title}</p>
              <p className="text-sm text-[var(--color-charcoal)]/70 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <MotifDivider className="mb-8 max-w-xs mx-auto" />
          <p className="text-[var(--color-warm-grey)] mb-6">Discover pieces made for your everyday moments.</p>
          <Link
            href="/new-arrivals"
            className="inline-block bg-[var(--color-plum)] text-white text-xs tracking-widest uppercase px-10 py-4 hover:opacity-90 transition-opacity"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
