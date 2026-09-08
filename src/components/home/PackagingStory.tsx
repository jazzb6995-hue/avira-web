import { MotifDivider } from "@/components/ui/AviraMotif";

export function PackagingStory() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)] mb-4">
          Beautiful from the moment it arrives.
        </h2>
        <p className="text-[var(--color-warm-grey)] text-sm max-w-md mx-auto leading-relaxed">
          Every AVIRA piece is thoughtfully packaged, ready to gift or to treasure.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Signature Box", desc: "Deep plum keepsake box" },
          { label: "Jewellery Pouch", desc: "Soft velvet protection" },
          { label: "Tissue Wrap", desc: "Ivory satin tissue" },
          { label: "Thank You Card", desc: "Handwritten message option" },
        ].map((item) => (
          <div key={item.label} className="bg-[var(--color-cream)] aspect-square flex flex-col items-center justify-center p-6 text-center group hover:bg-[var(--color-blush)] transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[var(--color-plum)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-plum)]/20 transition-colors">
              <div className="w-5 h-5 rounded-full bg-[var(--color-plum)]/40" />
            </div>
            <p className="font-[var(--font-display)] text-base text-[var(--color-charcoal)] mb-1">{item.label}</p>
            <p className="text-xs text-[var(--color-warm-grey)]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
