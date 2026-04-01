import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })

const OVERAGE_RATE_CENTS = 2000 // $20/hr

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single<Profile>()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { hours } = await req.json()
    if (!hours || hours <= 0) return NextResponse.json({ error: 'Invalid hours' }, { status: 400 })

    const amountCents = Math.round(hours * OVERAGE_RATE_CENTS)

    // Create or get Stripe customer
    let customerId = profile.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Create Stripe checkout for one-time overage payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Cabin Studio — ${hours} extra hour${hours !== 1 ? 's' : ''}` },
          unit_amount: OVERAGE_RATE_CENTS,
        },
        quantity: hours,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/my-hours?overage_success=1&hours=${hours}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/my-hours`,
      metadata: { supabase_user_id: user.id, overage_hours: String(hours) },
    })

    // Record pending payment
    await supabase.from('payments').insert({
      user_id: user.id,
      type: 'overage',
      amount_cents: amountCents,
      status: 'pending',
      stripe_payment_intent_id: session.id,
      description: `${hours} overage hour${hours !== 1 ? 's' : ''} @ $20/hr`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
