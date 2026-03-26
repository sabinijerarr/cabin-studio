'use client'

import { useState } from 'react'

const SESSION_TYPES = [
  { value: 'session_2hr', label: '2 Hour Session — $120', deposit: 60 },
  { value: 'session_3hr', label: '3 Hour Session — $180 (Most Popular)', deposit: 90 },
  { value: 'session_4hr', label: '4 Hour Session — $240', deposit: 120 },
  { value: 'mix_essential', label: 'Essential Mix & Master — $89', deposit: 45 },
  { value: 'mix_premium', label: 'Premium Mix & Master — $149', deposit: 75 },
  { value: 'beat', label: 'Custom Beat — $99', deposit: 50 },
]

export default function BookingSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    sessionType: 'session_3hr',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedSession = SESSION_TYPES.find((s) => s.value === form.sessionType)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-cream/20 text-cream font-cormorant text-lg px-4 py-3 focus:outline-none focus:border-amber transition-colors placeholder:text-cream/30'
  const labelClass =
    'block font-jetbrains text-[11px] tracking-[0.3em] text-amber uppercase mb-2'

  return (
    <section
      id="booking"
      className="relative bg-warm-black py-24 px-4 sm:px-8"
      aria-label="Book a studio session"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            Step Inside
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-4">
            Book a Session
          </h2>
          <p className="font-cormorant text-xl text-cream/60 italic">
            {selectedSession
              ? `50% deposit — $${selectedSession.deposit} today`
              : 'Secure your spot with a 50% deposit'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Artist or legal name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="(312) 000-0000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="date" className={labelClass}>
                Preferred Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sessionType" className={labelClass}>
              Session Type
            </label>
            <select
              id="sessionType"
              name="sessionType"
              value={form.sessionType}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              {SESSION_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-warm-black text-cream">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Tell us about your project, genre, what you're recording..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="font-jetbrains text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-cinzel text-sm tracking-[0.25em] uppercase text-warm-black bg-amber hover:bg-amber-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading
              ? 'Redirecting to Checkout...'
              : `Reserve with $${selectedSession?.deposit ?? 50} Deposit`}
          </button>

          <p className="text-center font-cormorant text-sm text-cream/40 italic">
            Powered by Stripe. Cash, Credit Card, Venmo, and CashApp also accepted at the studio.
          </p>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest to-transparent" />
    </section>
  )
}
