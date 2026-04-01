'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
import type { Booking, Role } from '@/lib/supabase/types'

interface Props {
  role: Role
  userId: string
  onBookSlot?: (start: Date, end: Date) => void
}

export default function StudioCalendar({ role, userId, onBookSlot }: Props) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  // Hours to show: 0–23
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    const from = weekStart.toISOString()
    const to = addDays(weekStart, 7).toISOString()
    const res = await fetch(`/api/portal/bookings?from=${from}&to=${to}`)
    if (res.ok) setBookings(await res.json())
    setLoading(false)
  }, [weekStart])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  function getBookingsForDayHour(day: Date, hour: number): Booking[] {
    return bookings.filter(b => {
      const start = parseISO(b.start_time)
      const end = parseISO(b.end_time)
      return isSameDay(start, day) && start.getHours() <= hour && end.getHours() > hour
    })
  }

  function handleCellClick(day: Date, hour: number) {
    if (!onBookSlot) return
    const start = new Date(day)
    start.setHours(hour, 0, 0, 0)
    const end = new Date(start)
    end.setHours(hour + 1)
    // Enforce renter time restriction in UI
    if (role === 'renter' && hour >= 12) return
    onBookSlot(start, end)
  }

  const isRenterCell = (hour: number) => role === 'renter' && hour >= 12

  return (
    <div className="bg-[#1E1A12] border border-[#3A3020] overflow-hidden">
      {/* Week nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3A3020]">
        <button
          onClick={() => setWeekStart(d => addDays(d, -7))}
          className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#C4B99A]/50 hover:text-[#D4A853] transition-colors px-2 py-1"
        >← Prev</button>
        <p className="font-cinzel text-xs tracking-[0.15em] text-[#C4B99A]">
          {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </p>
        <button
          onClick={() => setWeekStart(d => addDays(d, 7))}
          className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#C4B99A]/50 hover:text-[#D4A853] transition-colors px-2 py-1"
        >Next →</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[3rem_repeat(7,1fr)] border-b border-[#3A3020]">
        <div />
        {days.map(day => (
          <div key={day.toISOString()} className={`py-2 text-center border-l border-[#3A3020] ${isSameDay(day, new Date()) ? 'bg-[#D4A853]/10' : ''}`}>
            <p className="font-cinzel text-[9px] tracking-[0.1em] text-[#C4B99A]/50 uppercase">{format(day, 'EEE')}</p>
            <p className={`font-cinzel text-sm mt-0.5 ${isSameDay(day, new Date()) ? 'text-[#D4A853]' : 'text-[#C4B99A]'}`}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid — scrollable */}
      <div className="overflow-y-auto max-h-[60vh]">
        {loading && (
          <div className="text-center py-8 font-cormorant text-[#C4B99A]/40 italic">Loading schedule…</div>
        )}
        {!loading && hours.map(hour => (
          <div key={hour} className="grid grid-cols-[3rem_repeat(7,1fr)] border-b border-[#3A3020]/40 min-h-[2.5rem]">
            {/* Hour label */}
            <div className="flex items-start justify-end pr-2 pt-1">
              <span className="font-jetbrains text-[9px] text-[#C4B99A]/30">
                {hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`}
              </span>
            </div>
            {/* Day cells */}
            {days.map(day => {
              const cellBookings = getBookingsForDayHour(day, hour)
              const blocked = isRenterCell(hour)
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => !blocked && cellBookings.length === 0 && handleCellClick(day, hour)}
                  className={`border-l border-[#3A3020]/40 relative min-h-[2.5rem] group transition-colors
                    ${blocked ? 'bg-[#2C2518]/30 cursor-not-allowed' : cellBookings.length === 0 && onBookSlot ? 'hover:bg-[#D4A853]/5 cursor-pointer' : ''}
                    ${isSameDay(day, new Date()) ? 'bg-[#D4A853]/5' : ''}
                  `}
                >
                  {/* Blocked indicator for renters */}
                  {blocked && hour === 12 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-cinzel text-[8px] text-[#C4B99A]/30 tracking-wide">members 12a–12p only</span>
                    </div>
                  )}
                  {cellBookings.map(b => (
                    <div
                      key={b.id}
                      className={`absolute inset-x-0.5 inset-y-0.5 px-1 py-0.5 text-[9px] font-cinzel tracking-wide rounded-sm overflow-hidden
                        ${b.user_id === userId ? 'bg-[#D4A853]/90 text-[#1A1610]' : 'bg-[#4A3F2F] text-[#C4B99A]'}
                      `}
                    >
                      {b.profile?.full_name ?? 'Booked'}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
