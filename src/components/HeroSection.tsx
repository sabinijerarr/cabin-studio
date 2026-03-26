'use client'

import { useState, useEffect } from 'react'

const DESKTOP_VIDEO = 'https://github.com/sabinijerarr/cabin-studio/releases/download/v1.0.0/hero-bg.mp4'
const MOBILE_VIDEO = 'https://github.com/sabinijerarr/cabin-studio/releases/download/v1.0.0/mobile-hero.mp4'

interface HeroSectionProps {
  onBookClick: () => void
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const [videoSrc, setVideoSrc] = useState(DESKTOP_VIDEO)

  useEffect(() => {
    setVideoSrc(window.innerWidth < 768 ? MOBILE_VIDEO : DESKTOP_VIDEO)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/40 via-warm-black/10 to-warm-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center px-4">
        <div className="mb-6">
<h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-semibold text-cream leading-none tracking-wide">
            Cabin Studio
          </h1>
          <p className="font-cormorant text-xl sm:text-2xl text-cream/70 italic mt-3 tracking-wide">
            Professional recording studio in Chicago
          </p>
          <p className="font-cormorant text-base text-cream/50 mt-2">
            Rap · R&amp;B · Indie · All genres welcome
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onBookClick}
            className="group relative px-10 py-4 font-cinzel text-sm tracking-[0.25em] uppercase text-warm-black bg-amber hover:bg-amber-light transition-all duration-300 overflow-hidden"
            aria-label="Book a recording session at Cabin Studio Chicago"
          >
            <span className="relative z-10">Book a Session</span>
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <a
            href="#services"
            className="px-10 py-4 font-cinzel text-sm tracking-[0.25em] uppercase text-amber border border-amber/50 hover:border-amber hover:bg-amber/10 transition-all duration-300"
          >
            View Rates
          </a>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="font-jetbrains text-[10px] tracking-[0.3em] text-cream uppercase">Scroll</span>
          <div className="h-8 w-px bg-cream/50" />
        </div>
      </div>
    </section>
  )
}
