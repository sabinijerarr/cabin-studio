'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gear', href: '#gear' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Artists', href: '#artists' },
  { label: 'Contact', href: '#contact' },
  { label: 'Blog', href: '/blog', external: true },
]

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNavClick(href: string) {
    setMenuOpen(false)
    const el = document.querySelector(href)
    const lenis = (window as unknown as { __lenis?: { scrollTo: (el: Element, opts: object) => void } }).__lenis
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 })
    } else {
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-warm-black/95 backdrop-blur-sm border-b border-cream/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* Logo — text only */}
        <a
          href="#"
          className="font-cinzel text-sm tracking-[0.2em] text-cream uppercase hover:text-amber transition-colors duration-200"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          Cabin Studio
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) =>
            'external' in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="font-cormorant text-base text-cream/60 hover:text-amber transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-cormorant text-base text-cream/60 hover:text-amber transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </button>
            )
          )}
          <button
            onClick={() => { setMenuOpen(false); router.push('/booking') }}
            className="font-cinzel text-xs tracking-[0.2em] uppercase px-5 py-2 border border-amber text-amber hover:bg-amber hover:text-warm-black transition-all duration-300"
          >
            Book Now
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-warm-black/98 border-t border-cream/10 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) =>
            'external' in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-left font-cormorant text-xl text-cream/70 hover:text-amber transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left font-cormorant text-xl text-cream/70 hover:text-amber transition-colors"
              >
                {link.label}
              </button>
            )
          )}
          <button
            onClick={() => { setMenuOpen(false); router.push('/booking') }}
            className="mt-2 font-cinzel text-xs tracking-[0.2em] uppercase px-5 py-3 border border-amber text-amber w-full"
          >
            Book Now
          </button>
        </div>
      )}
    </header>
  )
}
