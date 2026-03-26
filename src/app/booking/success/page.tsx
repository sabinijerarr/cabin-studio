import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your session at Cabin Studio has been reserved.',
  robots: { index: false, follow: false },
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-warm-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="w-20 h-20 border border-amber/40 mx-auto mb-8 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-amber"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
          Deposit Received
        </p>

        <h1 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-6 leading-tight">
          You&apos;re Booked
        </h1>

        <p className="font-cormorant text-xl text-cream/65 leading-relaxed mb-4">
          Your $50 deposit has been processed. We&apos;ll send a confirmation email
          with session details within 24 hours.
        </p>

        <p className="font-cormorant text-lg text-cream/40 italic mb-12">
          Questions? Reach us at{' '}
          <a href="mailto:book@cabinstudio.com" className="text-amber hover:underline">
            book@cabinstudio.com
          </a>
        </p>

        <Link
          href="/"
          className="inline-block border border-amber/40 text-amber font-cinzel text-xs tracking-[0.25em] uppercase px-8 py-3 hover:bg-amber hover:text-warm-black transition-colors duration-300"
        >
          Back to Cabin Studio
        </Link>
      </div>
    </main>
  )
}
