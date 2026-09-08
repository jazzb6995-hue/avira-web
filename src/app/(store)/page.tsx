import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LifestorySection } from "@/components/home/LifestorySection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { AviraStory } from "@/components/home/AviraStory";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME}: ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NewArrivalsSection />
      <CategoryGrid />
      <LifestorySection />
      <BestSellersSection />
      <AviraStory />
      <ReviewsSection />
    </>
  );
}
