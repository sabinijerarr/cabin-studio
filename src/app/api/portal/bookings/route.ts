import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/types'
import { startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()

    const url = new URL(req.url)
    const from = url.searchParams.get('from') ?? new Date().toISOString()
    const to = url.searchParams.get('to') ?? new Date(Date.now() + 30 * 86400000).toISOString()

    let query = supabase
      .from('bookings')
      .select('*, profile:profiles(full_name)')
      .gte('start_time', from)
      .lte('start_time', to)
      .neq('status', 'cancelled')
      .order('start_time')

    // Renters only see their own bookings
    if (profile?.role === 'renter') {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()

    const body = await req.json()
    const { startTime, endTime, userId, notes } = body

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Invalid times' }, { status: 400 })
    }
    if (end <= start) {
      return NextResponse.json({ error: 'End must be after start' }, { status: 400 })
    }

    const targetUserId: string = (profile?.role === 'renter') ? user.id : (userId ?? user.id)

    // Renter time restriction: 12 AM – 12 PM only
    if (profile?.role === 'renter') {
      const startHour = start.getHours()
      const endHour = end.getHours()
      const endMinute = end.getMinutes()
      const endTotalMins = endHour * 60 + endMinute
      if (startHour >= 12 || endTotalMins > 12 * 60) {
        return NextResponse.json(
          { error: 'Monthly members may only book between 12:00 AM and 12:00 PM.' },
          { status: 400 }
        )
      }
    }

    // Check for overlap
    const { data: overlap } = await supabase
      .from('bookings')
      .select('id')
      .lt('start_time', end.toISOString())
      .gt('end_time', start.toISOString())
      .neq('status', 'cancelled')
    if (overlap && overlap.length > 0) {
      return NextResponse.json({ error: 'That time slot overlaps with an existing booking.' }, { status: 409 })
    }

    // Check monthly hours for renters
    if (profile?.role === 'renter') {
      const monthStart = startOfMonth(start)
      const monthEnd = endOfMonth(start)
      const { data: usageRow } = await supabase
        .from('monthly_usage')
        .select('hours_used')
        .eq('user_id', targetUserId)
        .eq('month', monthStart.toISOString().split('T')[0])
        .single<{ hours_used: number }>()

      const hoursUsed = usageRow?.hours_used ?? 0
      const newHours = (end.getTime() - start.getTime()) / 3600000
      if (hoursUsed + newHours > 25) {
        return NextResponse.json(
          { error: `Only ${(25 - hoursUsed).toFixed(1)} hours remaining this month. Purchase overage or reduce session length.` },
          { status: 400 }
        )
      }
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: targetUserId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'confirmed',
        notes: notes ?? null,
        created_by: user.id,
      })
      .select()
      .single()
    if (error) throw error

    // Update monthly usage for renters
    if (profile?.role === 'renter' || profile?.role === 'owner' || profile?.role === 'employee') {
      const targetProfile = await supabase.from('profiles').select('role').eq('id', targetUserId).single<Pick<Profile, 'role'>>()
      if (targetProfile.data?.role === 'renter') {
        const monthKey = startOfMonth(start).toISOString().split('T')[0]
        const hoursAdded = (end.getTime() - start.getTime()) / 3600000
        await supabase.rpc('increment_usage', { p_user_id: targetUserId, p_month: monthKey, p_hours: hoursAdded })
      }
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()
    const url = new URL(req.url)
    const bookingId = url.searchParams.get('id')
    if (!bookingId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Get booking
    const { data: booking } = await supabase.from('bookings').select('*').eq('id', bookingId).single()
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Renters can only cancel their own
    if (profile?.role === 'renter' && booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)

    // Deduct hours if renter booking cancelled
    if (booking.user_id) {
      const { data: bookedProfile } = await supabase.from('profiles').select('role').eq('id', booking.user_id).single<Pick<Profile, 'role'>>()
      if (bookedProfile?.role === 'renter') {
        const start = new Date(booking.start_time)
        const end = new Date(booking.end_time)
        const monthKey = startOfMonth(start).toISOString().split('T')[0]
        const hoursToRemove = (end.getTime() - start.getTime()) / 3600000
        await supabase.rpc('increment_usage', { p_user_id: booking.user_id, p_month: monthKey, p_hours: -hoursToRemove })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
