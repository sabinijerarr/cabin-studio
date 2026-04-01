import { createClient } from '@/lib/supabase/server'
import type { Profile, Booking, MonthlyUsage } from '@/lib/supabase/types'
import { format, startOfMonth } from 'date-fns'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single<Profile>()
  if (!profile) return null

  const today = new Date()
  const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')

  // Upcoming bookings
  const { data: upcoming } = await supabase
    .from('bookings')
    .select('*, profile:profiles(full_name)')
    .gte('start_time', today.toISOString())
    .eq('status', 'confirmed')
    .order('start_time', { ascending: true })
    .limit(profile.role === 'renter' ? 5 : 10)
    .returns<Booking[]>()

  // Monthly usage (renter only)
  let usage: MonthlyUsage | null = null
  if (profile.role === 'renter') {
    const { data } = await supabase
      .from('monthly_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', monthStart)
      .single<MonthlyUsage>()
    usage = data
  }

  const hoursUsed = usage?.hours_used ?? 0
  const hoursLeft = Math.max(0, 25 - hoursUsed)

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide mb-1">
        Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
      </h1>
      <p className="font-cormorant text-[#C4B99A]/50 italic mb-8">
        {format(today, 'EEEE, MMMM d, yyyy')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Hours card — renter only */}
        {profile.role === 'renter' && (
          <div className="bg-[#2C2518] border border-[#3A3020] p-5">
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-3">Hours This Month</p>
            <p className="font-cinzel text-3xl text-[#D4A853]">{hoursLeft}<span className="text-sm text-[#C4B99A]/40 ml-1">/ 25 left</span></p>
            <div className="mt-3 h-1.5 bg-[#1A1610] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4A853] transition-all"
                style={{ width: `${Math.min(100, (hoursUsed / 25) * 100)}%` }}
              />
            </div>
            <p className="font-cormorant text-xs text-[#C4B99A]/40 mt-2">{hoursUsed} hrs used</p>
          </div>
        )}

        <div className="bg-[#2C2518] border border-[#3A3020] p-5">
          <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-3">Upcoming Sessions</p>
          <p className="font-cinzel text-3xl text-[#C4B99A]">{upcoming?.length ?? 0}</p>
          <a href="/portal/schedule" className="font-cormorant text-xs text-[#D4A853] mt-2 block hover:underline">View schedule →</a>
        </div>

        {profile.role === 'renter' && (
          <div className="bg-[#2C2518] border border-[#3A3020] p-5">
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-3">Quick Book</p>
            <a
              href="/portal/book"
              className="inline-block mt-1 bg-[#D4A853] text-[#1A1610] font-cinzel text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-[#E8C070] transition-colors"
            >
              Book Studio Time
            </a>
          </div>
        )}

        {(profile.role === 'owner' || profile.role === 'employee') && (
          <div className="bg-[#2C2518] border border-[#3A3020] p-5">
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/50 uppercase mb-3">Actions</p>
            <a href="/portal/schedule" className="block font-cormorant text-sm text-[#D4A853] hover:underline mb-1">+ Add booking</a>
            {profile.role === 'owner' && (
              <a href="/portal/admin/renters" className="block font-cormorant text-sm text-[#D4A853] hover:underline">Review applications</a>
            )}
          </div>
        )}
      </div>

      {/* Upcoming bookings list */}
      <div>
        <h2 className="font-cinzel text-sm tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-4">Upcoming Bookings</h2>
        {!upcoming?.length ? (
          <p className="font-cormorant text-[#C4B99A]/40 italic">No upcoming bookings.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(b => (
              <div key={b.id} className="bg-[#2C2518] border border-[#3A3020] px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-cormorant text-[#C4B99A] text-base">
                    {format(new Date(b.start_time), 'EEE, MMM d')}
                    <span className="text-[#C4B99A]/50 ml-2 text-sm">
                      {format(new Date(b.start_time), 'h:mm a')} – {format(new Date(b.end_time), 'h:mm a')}
                    </span>
                  </p>
                  {profile.role !== 'renter' && b.profile && (
                    <p className="font-cormorant text-xs text-[#C4B99A]/40 mt-0.5">{b.profile.full_name}</p>
                  )}
                </div>
                <span className="font-cinzel text-[9px] tracking-[0.15em] text-[#D4A853] uppercase border border-[#D4A853]/30 px-2 py-1">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
