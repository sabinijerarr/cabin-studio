'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import StudioCalendar from '@/components/portal/StudioCalendar'
import BookingModal from '@/components/portal/BookingModal'
import type { Profile } from '@/lib/supabase/types'

export default function SchedulePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookingSlot, setBookingSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>()
      setProfile(data)
    }
    load()
  }, [])

  if (!profile) return null

  const canBook = profile.role === 'owner' || profile.role === 'employee'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide">Studio Schedule</h1>
          <p className="font-cormorant text-[#C4B99A]/50 italic text-sm mt-0.5">
            {profile.role === 'renter' ? 'Your bookings shown in gold · Others shown in brown' : 'All studio bookings'}
          </p>
        </div>
        {canBook && (
          <button
            onClick={() => setBookingSlot({ start: new Date(), end: new Date(Date.now() + 3600000) })}
            className="bg-[#D4A853] text-[#1A1610] font-cinzel text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#E8C070] transition-colors"
          >
            + Add Booking
          </button>
        )}
      </div>

      <StudioCalendar
        key={refreshKey}
        role={profile.role}
        userId={profile.id}
        onBookSlot={canBook ? (s, e) => setBookingSlot({ start: s, end: e }) : undefined}
      />

      {bookingSlot && (
        <BookingModal
          role={profile.role}
          initialStart={bookingSlot.start}
          initialEnd={bookingSlot.end}
          onClose={() => setBookingSlot(null)}
          onSaved={() => { setBookingSlot(null); setRefreshKey(k => k + 1) }}
        />
      )}
    </div>
  )
}
