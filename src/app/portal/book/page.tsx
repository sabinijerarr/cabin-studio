'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StudioCalendar from '@/components/portal/StudioCalendar'
import BookingModal from '@/components/portal/BookingModal'
import type { Profile, MonthlyUsage } from '@/lib/supabase/types'
import { format, startOfMonth } from 'date-fns'

export default function BookPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [usage, setUsage] = useState<MonthlyUsage | null>(null)
  const [bookingSlot, setBookingSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>()
      setProfile(p)
      if (p) {
        const monthKey = format(startOfMonth(new Date()), 'yyyy-MM-dd')
        const { data: u } = await supabase.from('monthly_usage').select('*').eq('user_id', user.id).eq('month', monthKey).single<MonthlyUsage>()
        setUsage(u)
      }
    }
    load()
  }, [refreshKey])

  if (!profile) return null

  const hoursUsed = usage?.hours_used ?? 0
  const hoursLeft = Math.max(0, 25 - hoursUsed)

  return (
    <div className="p-8">
      <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide mb-1">Book Studio Time</h1>
      <p className="font-cormorant text-[#C4B99A]/50 italic mb-6">
        Available hours: <span className="text-[#D4A853]">12:00 AM – 12:00 PM</span>
      </p>

      {/* Hours gauge */}
      <div className="bg-[#2C2518] border border-[#3A3020] p-4 mb-6 flex items-center gap-6">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="font-cinzel text-[10px] tracking-[0.15em] text-[#C4B99A]/50 uppercase">Hours this month</span>
            <span className="font-cinzel text-xs text-[#D4A853]">{hoursUsed.toFixed(1)} / 25 used</span>
          </div>
          <div className="h-2 bg-[#1A1610] rounded-full overflow-hidden">
            <div className="h-full bg-[#D4A853] transition-all" style={{ width: `${Math.min(100, (hoursUsed / 25) * 100)}%` }} />
          </div>
          <p className="font-cormorant text-xs text-[#C4B99A]/40 mt-1">{hoursLeft.toFixed(1)} hours remaining</p>
        </div>
        {hoursLeft <= 0 && (
          <a
            href="/portal/my-hours"
            className="shrink-0 bg-[#D4A853] text-[#1A1610] font-cinzel text-[10px] tracking-[0.15em] uppercase px-4 py-2 hover:bg-[#E8C070] transition-colors"
          >
            Buy More Hours
          </a>
        )}
      </div>

      {/* Tip */}
      <div className="bg-[#D4A853]/10 border border-[#D4A853]/20 px-4 py-3 mb-6">
        <p className="font-cormorant text-[#D4A853] text-sm">
          Click any available cell to book that hour. You can also drag to select multiple hours.
          All times are Chicago time (CST/CDT).
        </p>
      </div>

      <StudioCalendar
        key={refreshKey}
        role="renter"
        userId={profile.id}
        onBookSlot={(s, e) => setBookingSlot({ start: s, end: e })}
      />

      {bookingSlot && (
        <BookingModal
          role="renter"
          initialStart={bookingSlot.start}
          initialEnd={bookingSlot.end}
          onClose={() => setBookingSlot(null)}
          onSaved={() => { setBookingSlot(null); setRefreshKey(k => k + 1) }}
        />
      )}
    </div>
  )
}
