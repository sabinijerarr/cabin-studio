import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// Deposit amounts in cents (50% of session price)
const DEPOSITS: Record<string, { label: string; amount: number }> = {
  session_2hr:    { label: '2 Hour Session',           amount: 6000  }, // $60
  session_3hr:    { label: '3 Hour Session',           amount: 9000  }, // $90
  session_4hr:    { label: '4 Hour Session',           amount: 12000 }, // $120
  mix_essential:  { label: 'Essential Mix & Master',   amount: 4500  }, // $45
  mix_premium:    { label: 'Premium Mix & Master',     amount: 7500  }, // $75
  beat:           { label: 'Custom Beat',              amount: 5000  }, // $50
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, date, sessionType, notes } = body

    if (!name || !email || !date || !sessionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const session = DEPOSITS[sessionType]
    if (!session) {
      return NextResponse.json({ error: 'Invalid session type' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: session.amount,
            product_data: {
              name: `${session.label} Deposit — Cabin Studio`,
              description: `Session on ${date}${notes ? ` · ${notes.slice(0, 100)}` : ''}`,
              images: [`${siteUrl}/images/og-image.jpg`],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: name,
        customerPhone: phone ?? '',
        sessionDate: date,
        sessionType,
        notes: notes?.slice(0, 500) ?? '',
      },
      success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#booking`,
    })

    return NextResponse.json({ url: checkout.url })
  } catch (err) {
    console.error('[Stripe checkout error]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
