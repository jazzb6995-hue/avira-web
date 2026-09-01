import type { Metadata } from "next";
import Link from "next/link";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const metadata: Metadata = {
  title: "Shop by Mood | AVIRA",
  description: "Find jewellery that matches how you feel today.",
  alternates: { canonical: "/shop-by-mood" },
};

const MOODS = [
  {
    title: "Everyday Magic",
    subtitle: "Minimal, effortless pieces you can wear every day without thinking",
    tags: ["minimal", "everyday"],
    gradient: "from-[#F0DDD5] to-[#FBF7F2]",
    emoji: "✨",
  },
  {
    title: "Making a Statement",
    subtitle: "Bold, sculptural pieces that walk into a room before you do",
    tags: ["statement"],
    gradient: "from-[#54283C]/10 to-[#FBF7F2]",
    emoji: "👑",
  },
  {
    title: "Office Ready",
    subtitle: "Professional, polished — the jewellery that closes the deal",
    tags: ["office"],
    gradient: "from-[#E8D5B7]/50 to-[#FBF7F2]",
    emoji: "💼",
  },
  {
    title: "The Perfect Gift",
    subtitle: "Thoughtfully chosen pieces she'll open and immediately put on",
    tags: ["gifting"],
    gradient: "from-[#F0DDD5] to-[#FAF0ED]",
    emoji: "🎁",
  },
  {
    title: "Festive Season",
    subtitle: "Celebration-worthy, occasion-perfect — dressed up in gold and colour",
    tags: ["festive"],
    gradient: "from-[#C9956C]/20 to-[#FBF7F2]",
    emoji: "🪔",
  },
  {
    title: "Weekend Casual",
    subtitle: "Easy, relaxed, beautiful — jewellery for the days you just be",
    tags: ["casual"],
    gradient: "from-[#F5EFE7] to-[#FBF7F2]",
    emoji: "☁️",
  },
  {
    title: "Trending Now",
    subtitle: "What everyone is wearing — the pieces we can barely keep in stock",
    tags: ["trending"],
    gradient: "from-[#54283C]/5 to-[#F0DDD5]/50",
    emoji: "🔥",
  },
  {
    title: "Stack & Layer",
    subtitle: "Made for mixing — bangles, chains, and rings that multiply beautifully",
    tags: ["everyday", "minimal"],
    gradient: "from-[#E8D5B7]/40 to-[#FBF7F2]",
    emoji: "🔗",
  },
];

export default function ShopByMoodPage() {
  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-5xl">Shop by Mood</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-3 max-w-sm mx-auto">
          What are you feeling today? Let your mood lead you to the right piece.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {MOODS.map((mood) => (
          <Link
            key={mood.title}
            href={`/search?q=${encodeURIComponent(mood.tags[0])}`}
            className={`group relative bg-gradient-to-br ${mood.gradient} p-6 aspect-square flex flex-col justify-end hover:shadow-md transition-shadow`}
          >
            <span className="text-3xl mb-3 block">{mood.emoji}</span>
            <h2 className="font-[var(--font-display)] text-xl leading-tight group-hover:text-[var(--color-plum)] transition-colors">
              {mood.title}
            </h2>
            <p className="text-xs text-[var(--color-warm-grey)] mt-1 leading-relaxed">{mood.subtitle}</p>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-plum)]">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
