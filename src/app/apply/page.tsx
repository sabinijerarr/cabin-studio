'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AGREEMENT_TEXT = `CABIN STUDIO — MONTHLY STUDIO RENTAL AGREEMENT

This agreement is between Cabin Studio ("Studio") and the applicant ("Member").

1. MEMBERSHIP: Member receives 25 hours of studio access per calendar month at $500/month ($20/hr), billed automatically via Stripe on the 1st of each month.

2. ACCESS HOURS: Monthly members may only book studio time between 12:00 AM and 12:00 PM (midnight to noon). Regular business hours (12:00 PM – midnight) are reserved for regular session bookings.

3. SELF-RECORDING ONLY: Monthly membership is for self-recording only. No in-house engineer is provided during member sessions.

4. OVERAGE: Hours used beyond 25/month are billed at $20/hr automatically.

5. DEPOSIT: A security deposit (amount set by Studio) is due before access is granted. The deposit is refundable upon cancellation provided the studio is returned in good condition.

6. CONDUCT: Member agrees to treat the studio equipment and space with care. Damage to equipment may result in charges and immediate termination of membership.

7. CANCELLATION: Either party may cancel with 30 days notice. The Studio reserves the right to terminate membership immediately for violations of this agreement.

8. EQUIPMENT: Member may not alter, move, or remove any Studio equipment. Member brings their own hard drives and storage media.

9. GUEST POLICY: Member may not allow non-members access to the studio during their booked sessions without prior written approval from Studio management.

By checking the box below, you agree to all terms of this rental agreement.`

export default function ApplyPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    how_using: '',
    social_links: '',
  })
  const [idFile, setIdFile] = useState<File | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('You must agree to the studio rental agreement.'); return }
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      let id_photo_url: string | null = null

      // Upload ID photo to Supabase Storage
      if (idFile) {
        const ext = idFile.name.split('.').pop()
        const path = `applications/${Date.now()}-${form.email.replace('@', '_')}.${ext}`
        const { data: upload, error: uploadError } = await supabase.storage
          .from('id-photos')
          .upload(path, idFile, { upsert: false })
        if (uploadError) throw uploadError
        id_photo_url = upload.path
      }

      const { error: insertError } = await supabase.from('renter_applications').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        how_using: form.how_using,
        social_links: form.social_links || null,
        id_photo_url,
        agreement_signed_at: new Date().toISOString(),
        status: 'pending',
      })

      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1A1610] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="font-cinzel text-[#D4A853] text-2xl tracking-wide mb-4">Application Received</p>
          <p className="font-cormorant text-[#C4B99A] text-lg leading-relaxed">
            Thank you, {form.full_name.split(' ')[0]}. We&apos;ll review your application and reach out to <strong>{form.email}</strong> within 1–2 business days.
          </p>
          <a href="/" className="inline-block mt-8 font-cinzel text-[11px] tracking-[0.2em] uppercase text-[#D4A853] hover:underline">
            ← Back to Cabin Studio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1610] py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <a href="/" className="font-cinzel text-[#D4A853]/60 text-xs tracking-[0.2em] uppercase hover:text-[#D4A853]">← Cabin Studio</a>
          <h1 className="font-cinzel text-3xl text-[#D4A853] tracking-wide mt-4 mb-2">Monthly Membership</h1>
          <p className="font-cormorant text-[#C4B99A]/70 text-lg italic">Apply for self-recording access · $500/month · 25 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="space-y-4">
            <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/50 uppercase border-b border-[#3A3020] pb-2">Personal Information</h2>

            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">Full Name *</label>
              <input required value={form.full_name} onChange={e => set('full_name', e.target.value)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="Your full legal name" />
            </div>

            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">Email *</label>
              <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="your@email.com" />
            </div>

            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">Phone *</label>
              <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="(312) 555-0000" />
            </div>
          </div>

          {/* Studio info */}
          <div className="space-y-4">
            <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/50 uppercase border-b border-[#3A3020] pb-2">About Your Use</h2>

            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">How will you use the studio? *</label>
              <textarea required value={form.how_using} onChange={e => set('how_using', e.target.value)}
                rows={3}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors resize-none"
                placeholder="Describe your music, genre, projects…" />
            </div>

            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">Social / Music Links</label>
              <input value={form.social_links} onChange={e => set('social_links', e.target.value)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="Instagram, SoundCloud, Spotify…" />
            </div>
          </div>

          {/* ID upload */}
          <div className="space-y-4">
            <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/50 uppercase border-b border-[#3A3020] pb-2">ID Verification</h2>
            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-1.5">
                Photo ID (driver&apos;s license or passport) *
              </label>
              <input
                type="file"
                required
                accept="image/*,.pdf"
                onChange={e => setIdFile(e.target.files?.[0] ?? null)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A]/60 font-cormorant text-sm px-4 py-3 file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-[#D4A853] file:text-[#1A1610] file:font-cinzel file:text-[10px] file:tracking-[0.1em] file:uppercase cursor-pointer"
              />
              <p className="font-cormorant text-xs text-[#C4B99A]/40 mt-1">Used for identity verification only. Not shared with third parties.</p>
            </div>
          </div>

          {/* Rental agreement */}
          <div className="space-y-4">
            <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/50 uppercase border-b border-[#3A3020] pb-2">Studio Rental Agreement</h2>
            <div className="bg-[#2C2518] border border-[#3A3020] p-4 h-48 overflow-y-auto">
              <pre className="font-cormorant text-xs text-[#C4B99A]/70 whitespace-pre-wrap leading-relaxed">{AGREEMENT_TEXT}</pre>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#D4A853] shrink-0"
              />
              <span className="font-cormorant text-[#C4B99A]/80 text-sm leading-snug">
                I have read and agree to the Cabin Studio Monthly Rental Agreement. I understand the access hours (12 AM – 12 PM), the $500/month billing, and the self-recording only policy.
              </span>
            </label>
          </div>

          {error && <p className="font-cormorant text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-[#D4A853] text-[#1A1610] font-cinzel text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#E8C070] transition-colors disabled:opacity-40"
          >
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
