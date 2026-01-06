import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicePreview from '@/components/home/ServicePreview';
import GallerySection from '@/components/home/GallerySection';
import MembershipPreview from '@/components/home/MembershipPreview';
import GiftCardSection from '@/components/home/GiftCardSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicePreview />
      <GallerySection />
      <MembershipPreview />
      <GiftCardSection />
      <CTASection />
    </>
  );
}