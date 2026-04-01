'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, startOfMonth, subMonths } from 'date-fns'
import type { Profile, MonthlyUsage, Payment } from '@/lib/supabase/types'

export default function MyHoursPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [usage, setUsage] = useState<MonthlyUsage | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [overageHours, setOverageHours] = useState('1')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>()
      setProfile(p)

      const monthKey = format(startOfMonth(new Date()), 'yyyy-MM-dd')
      const { data: u } = await supabase.from('monthly_usage').select('*').eq('user_id', user.id).eq('month', monthKey).single<MonthlyUsage>()
      setUsage(u)

      const { data: pmts } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .returns<Payment[]>()
      setPayments(pmts ?? [])
    }
    load()
  }, [])

  async function buyOverage() {
    const hours = parseFloat(overageHours)
    if (isNaN(hours) || hours <= 0) return
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/portal/stripe/overage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      // Redirect to Stripe checkout
      if (json.url) window.location.href = json.url
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Error processing payment')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return null

  const hoursUsed = usage?.hours_used ?? 0
  const hoursLeft = Math.max(0, 25 - hoursUsed)
  const overageCost = (parseFloat(overageHours) || 0) * 20

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide mb-1">My Hours</h1>
      <p className="font-cormorant text-[#C4B99A]/50 italic mb-8">{format(new Date(), 'MMMM yyyy')}</p>

      {/* Usage card */}
      <div className="bg-[#2C2518] border border-[#3A3020] p-6 mb-6">
        <div className="flex justify-between mb-3">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase">Monthly Hours</span>
          <span className="font-cinzel text-xs text-[#D4A853]">{hoursUsed.toFixed(1)} of 25 used</span>
        </div>
        <div className="h-3 bg-[#1A1610] rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all ${hoursUsed >= 25 ? 'bg-red-400' : hoursUsed >= 20 ? 'bg-yellow-400' : 'bg-[#D4A853]'}`}
            style={{ width: `${Math.min(100, (hoursUsed / 25) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between font-cormorant text-xs text-[#C4B99A]/40">
          <span>0 hrs</span>
          <span className={hoursLeft > 0 ? 'text-[#D4A853]' : 'text-red-400'}>
            {hoursLeft > 0 ? `${hoursLeft.toFixed(1)} hrs remaining` : 'No hours remaining'}
          </span>
          <span>25 hrs</span>
        </div>
      </div>

      {/* Subscription status */}
      <div className="bg-[#2C2518] border border-[#3A3020] p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-1">Membership</p>
          <p className="font-cormorant text-[#C4B99A]">$500 / month · Auto-renews on the 1st</p>
        </div>
        <span className={`font-cinzel text-[9px] tracking-[0.15em] uppercase border px-2 py-1 ${profile.stripe_subscription_id ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'}`}>
          {profile.stripe_subscription_id ? 'Active' : 'Pending'}
        </span>
      </div>

      {/* Buy overage */}
      <div className="bg-[#2C2518] border border-[#3A3020] p-5 mb-8">
        <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-4">Buy Extra Hours · $20 / hr</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-1">Hours</label>
            <input
              type="number"
              min="1"
              max="25"
              step="0.5"
              value={overageHours}
              onChange={e => setOverageHours(e.target.value)}
              className="w-full bg-[#1A1610] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853]"
            />
          </div>
          <div className="text-right pb-3">
            <p className="font-cormorant text-[#C4B99A]/50 text-sm">Total</p>
            <p className="font-cinzel text-[#D4A853] text-lg">${overageCost.toFixed(2)}</p>
          </div>
        </div>
        {msg && <p className="font-cormorant text-red-400 text-sm mt-2">{msg}</p>}
        <button
          onClick={buyOverage}
          disabled={loading}
          className="mt-4 w-full bg-[#D4A853] text-[#1A1610] font-cinzel text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-[#E8C070] transition-colors disabled:opacity-50"
        >
          {loading ? 'Redirecting to payment…' : `Pay $${overageCost.toFixed(2)} for ${overageHours} hr${parseFloat(overageHours) !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Payment history */}
      <div>
        <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-4">Payment History</h2>
        {!payments.length ? (
          <p className="font-cormorant text-[#C4B99A]/30 italic">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-[#2C2518] border border-[#3A3020] px-4 py-3">
                <div>
                  <p className="font-cormorant text-[#C4B99A] text-sm">{p.description ?? p.type}</p>
                  <p className="font-cormorant text-xs text-[#C4B99A]/40">{format(new Date(p.created_at), 'MMM d, yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="font-cinzel text-[#D4A853] text-sm">${(p.amount_cents / 100).toFixed(2)}</p>
                  <span className={`font-cinzel text-[8px] tracking-[0.1em] uppercase ${p.status === 'paid' ? 'text-green-400' : p.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
