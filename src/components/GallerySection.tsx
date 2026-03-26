'use client'

import { useState } from 'react'
import Image from 'next/image'

const photos = [
  { src: '/images/studio-main.jpg', alt: 'Cabin Studio main room', label: 'Main Room' },
  { src: '/images/studio-1.jpg', alt: 'Recording booth', label: 'Vocal Booth' },
  { src: '/images/studio-about.png', alt: 'Inside the studio', label: 'The Vibe' },
]

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section
      id="gallery"
      className="relative bg-warm-black py-24 px-4 sm:px-8"
      aria-label="Studio gallery"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            Inside the Studio
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold">
            Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden border border-amber/10 hover:border-amber/40 transition-colors duration-300 ${
                i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-square'
              }`}
              aria-label={`View ${photo.label}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-warm-black/0 group-hover:bg-warm-black/40 transition-colors duration-300 flex items-end p-4">
                <span className="font-jetbrains text-[10px] tracking-[0.3em] text-cream/0 group-hover:text-cream/80 uppercase transition-colors duration-300">
                  {photo.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-warm-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 font-cinzel text-cream/60 hover:text-cream text-xl"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={photos[lightbox].src}
              alt={photos[lightbox].alt}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* Prev / Next */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 font-cinzel text-amber/60 hover:text-amber text-2xl px-3 py-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length) }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 font-cinzel text-amber/60 hover:text-amber text-2xl px-3 py-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length) }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
    </section>
  )
}
