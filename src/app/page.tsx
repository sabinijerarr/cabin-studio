'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import DoorOverlay from '@/components/DoorOverlay'
import AboutSection from '@/components/AboutSection'
import ServicesSection from '@/components/ServicesSection'
import GearSection from '@/components/GearSection'
import GallerySection from '@/components/GallerySection'
import ClienteleSection from '@/components/ClienteleSection'
import ContactSection from '@/components/ContactSection'
import MembershipSection from '@/components/MembershipSection'

export default function HomePage() {
  const [doorPhase, setDoorPhase] = useState<'idle' | 'playing'>('idle')

  return (
    <>
      <Navbar />

      {/* Hero — looping video background, Book a Session triggers door animation */}
      <HeroSection onBookClick={() => setDoorPhase('playing')} />

      {/* Door animation overlay — navigates to /booking on complete */}
      <DoorOverlay phase={doorPhase} />

      {/*
        All sections below are fully visible in SSR HTML for SEO.
        Crawlers index all content. Users scroll naturally.
        Door animation goes to /booking — not used to reveal these sections.
      */}
      <AboutSection />
      <ServicesSection />
      <GearSection />
      <GallerySection />
      <MembershipSection />
      <ClienteleSection />
      <ContactSection />
    </>
  )
}
