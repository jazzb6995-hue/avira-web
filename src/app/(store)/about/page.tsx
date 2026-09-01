import type { Metadata } from "next";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { AviraMotif } from "@/components/ui/AviraMotif";

export const metadata: Metadata = {
  title: "Our Story | AVIRA",
  description: "The story behind AVIRA — jewellery rooted in the belief that little things make life beautiful.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl mb-4">Our Story</h1>
        <p className="text-[var(--color-warm-grey)] text-sm">Little Things. Beautiful You.</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-[var(--color-charcoal)]">
        <div className="flex justify-center mb-8">
          <AviraMotif size={48} />
        </div>

        <p className="text-lg leading-relaxed font-[var(--font-display)] text-center italic">
          "We believe beauty lives in the small moments — the glimmer of a bracelet caught in sunlight, the weight of a delicate ring on your finger, the quiet confidence a pair of earrings can give you."
        </p>

        <p className="text-sm leading-loose">
          AVIRA was born from a simple truth: the pieces we wear every day aren't accessories — they're expressions. They carry memories, mark milestones, and become part of who we are. We set out to create jewellery that feels personal, that speaks without words.
        </p>

        <p className="text-sm leading-loose">
          Every piece in our collection is crafted with intention. We work with artisans who understand that quality isn't just about material — it's about feel, about the way something sits on your skin, catches the light, and makes you pause.
        </p>

        <div className="bg-[var(--color-plum)] text-white p-8 text-center my-10">
          <AviraMotif size={32} fill="#FBF7F2" />
          <p className="font-[var(--font-display)] text-2xl mt-4 italic">"Made for the woman who finds magic in ordinary moments."</p>
        </div>

        <p className="text-sm leading-loose">
          Our roots are Indian. Our aesthetic is modern. We believe Indian women deserve jewellery that moves with them — from morning chai to midnight celebrations — without compromise on beauty or quality.
        </p>

        <p className="text-sm leading-loose">
          Every AVIRA piece arrives in packaging designed with the same care as the jewellery itself, because we believe the unboxing should feel like a gift — to yourself, or someone you love.
        </p>
      </div>
    </div>
  );
}
