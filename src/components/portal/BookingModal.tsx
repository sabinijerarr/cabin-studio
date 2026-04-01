'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Role } from '@/lib/supabase/types'

interface Props {
  role: Role
  initialStart: Date
  initialEnd: Date
  bookingId?: string    // for editing
  onClose: () => void
  onSaved: () => void
}

export default function BookingModal({ role, initialStart, initialEnd, bookingId, onClose, onSaved }: Props) {
  const [start, setStart] = useState(toDatetimeLocal(initialStart))
  const [end, setEnd] = useState(toDatetimeLocal(initialEnd))
  const [notes, setNotes] = useState('')
  const [userId, setUserId] = useState('')
  const [renters, setRenters] = useState<Pick<Profile, 'id' | 'full_name'>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      if (role === 'owner' || role === 'employee') {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'renter')
          .eq('status', 'active')
          .returns<Pick<Profile, 'id' | 'full_name'>[]>()
        setRenters(data ?? [])
      }
    }
    load()
  }, [role])

  async function handleSave() {
    setError('')
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
        notes,
      }
      if ((role === 'owner' || role === 'employee') && userId) {
        body.userId = userId
      }

      const res = await fetch('/api/portal/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      onSaved()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error saving booking')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!bookingId) return
    setLoading(true)
    const res = await fetch(`/api/portal/bookings?id=${bookingId}`, { method: 'DELETE' })
    if (res.ok) onSaved()
    else {
      const json = await res.json()
      setError(json.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#1E1A12] border border-[#3A3020] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-[#D4A853] tracking-wide">{bookingId ? 'Edit Booking' : 'Book Studio Time'}</h2>
          <button onClick={onClose} className="text-[#C4B99A]/40 hover:text-[#C4B99A] text-xl">×</button>
        </div>

        <div className="space-y-4">
          {/* Member selector — owner/employee only */}
          {(role === 'owner' || role === 'employee') && renters.length > 0 && (
            <div>
              <label className="block font-cinzel text-[10px] tracking-[0.15em] text-[#C4B99A]/50 uppercase mb-1.5">Member</label>
              <select
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853]"
              >
                <option value="">— General booking —</option>
                {renters.map(r => (
                  <option key={r.id} value={r.id}>{r.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.15em] text-[#C4B99A]/50 uppercase mb-1.5">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.15em] text-[#C4B99A]/50 uppercase mb-1.5">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853]"
            />
          </div>

          {role === 'renter' && (
            <p className="font-cormorant text-xs text-[#D4A853]/70 italic">Members may only book between 12:00 AM and 12:00 PM.</p>
          )}

          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.15em] text-[#C4B99A]/50 uppercase mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] resize-none"
              placeholder="Session details…"
            />
          </div>

          {error && <p className="font-cormorant text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#D4A853] text-[#1A1610] font-cinzel text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-[#E8C070] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Confirm Booking'}
            </button>
            {bookingId && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 border border-red-400/40 text-red-400 font-cinzel text-[11px] tracking-[0.15em] uppercase hover:bg-red-400/10 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
