import HeroSlider from "@/components/home/HeroSlider";
import StatsSection from "@/components/home/StatsSection";
import ServicePreview from "@/components/home/ServicePreview";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import TeamPreviewSection from "@/components/home/TeamPreviewSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import MembershipPreview from "@/components/home/MembershipPreview";
import GiftCardSection from "@/components/home/GiftCardSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ServicePreview />
      <StatsSection />
      <WhyChooseUsSection />
      <TeamPreviewSection />
      <TestimonialsSection />
      <GallerySection />
      <MembershipPreview />
      <GiftCardSection />
      <CTASection />
    </>
  );
}
