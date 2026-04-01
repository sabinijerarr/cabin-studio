import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/types'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()
    if (profile?.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { applicationId, email, fullName, depositAmountCents, ownerNotes } = await req.json()
    if (!applicationId || !email || !depositAmountCents) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send Supabase invite email — user lands at /portal/setup-password
    const admin = await createAdminClient()
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/setup-password`,
      data: { full_name: fullName, role: 'renter' },
    })
    if (inviteError) throw inviteError

    // Create profile for the invited user
    await admin.from('profiles').insert({
      id: invited.user.id,
      full_name: fullName,
      role: 'renter',
      status: 'active',
    })

    // Update application
    await admin.from('renter_applications').update({
      status: 'approved',
      deposit_amount: depositAmountCents,
      reviewed_at: new Date().toISOString(),
      owner_notes: ownerNotes ?? null,
      invited_user_id: invited.user.id,
    }).eq('id', applicationId)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
