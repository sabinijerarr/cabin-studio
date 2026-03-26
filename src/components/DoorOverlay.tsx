'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Lenis from 'lenis'

type Phase = 'idle' | 'playing'

interface DoorOverlayProps {
  phase: Phase
  onComplete?: () => void
}

export default function DoorOverlay({ phase, onComplete }: DoorOverlayProps) {
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (phase !== 'playing') return

    const overlay = overlayRef.current
    const video = videoRef.current
    if (!overlay || !video) return

    // Lock scroll
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    lenis?.stop()
    document.body.style.overflow = 'hidden'

    // Start overlay invisible so the door video crossfades in from the hero
    gsap.set(overlay, { opacity: 0, pointerEvents: 'all', backgroundColor: 'transparent' })

    video.currentTime = 0
    video
      .play()
      .then(() => {
        // Longer dissolve — hero melts into the door scene
        gsap.to(overlay, { opacity: 1, duration: 0.8, ease: 'power2.inOut' })
      })
      .catch(() => {
        // Autoplay blocked — skip straight to booking
        lenis?.start()
        document.body.style.overflow = ''
        router.push('/booking')
        onComplete?.()
      })
  }, [phase, router, onComplete])

  const handleVideoEnd = useCallback(() => {
    const overlay = overlayRef.current
    const video = videoRef.current
    if (!overlay || !video) return

    timelineRef.current?.kill()

    timelineRef.current = gsap
      .timeline()
      // Zoom INTO the actual video — slow start, then accelerates through the door
      .to(video, {
        scale: 9,
        duration: 2.2,
        ease: 'power2.in',          // gentler start than power3 — feels more natural
        transformOrigin: '50% 42%',
      })
      // Black creeps in earlier so the cut to /booking is completely hidden
      .to(
        overlay,
        {
          backgroundColor: '#1A1610',
          duration: 1.1,
          ease: 'power1.inOut',     // very gradual, not sudden
        },
        '-=1.4',
      )
      // Hold a beat, then navigate
      .call(() => {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
        lenis?.start()
        document.body.style.overflow = ''
        onComplete?.()
        router.push('/booking')
      }, undefined, '+=0.25')
  }, [router, onComplete])

  useEffect(() => {
    return () => { timelineRef.current?.kill() }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <video
        ref={videoRef}
        className="video-fullscreen"
        src="https://github.com/sabinijerarr/cabin-studio/releases/download/v1.0.0/door-video.mp4"
        playsInline
        muted
        preload="auto"
        onEnded={handleVideoEnd}
        aria-hidden="true"
      />
    </div>
  )
}
