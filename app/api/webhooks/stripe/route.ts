import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripeClient, getStripePackageConfig } from '@/lib/stripe/server'

export const runtime = 'nodejs'

type SessionUserResult =
  | { ok: true; userId: string }
  | { ok: false; error: string }

type LineItemResult =
  | { ok: true; unitAmount: number; currency: string; quantity: number }
  | { ok: false; error: string }

type CreditGrantResult =
  | { ok: true; alreadyProcessed: boolean }
  | { ok: false; error: string }

function getSessionUserId(
  session: Stripe.Checkout.Session
): SessionUserResult {
  const referenceId = session.client_reference_id?.trim() ?? ''
  const metadataUserId = session.metadata?.userId?.trim() ?? ''

  if (!referenceId && !metadataUserId) {
    return { ok: false, error: 'Missing session user reference.' }
  }

  if (referenceId && metadataUserId && referenceId !== metadataUserId) {
    return { ok: false, error: 'Session user mismatch detected.' }
  }

  return { ok: true, userId: referenceId || metadataUserId }
}

async function fetchLineItem(
  stripe: Stripe,
  sessionId: string
): Promise<LineItemResult> {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 1,
  })
  if (lineItems.has_more) {
    return { ok: false, error: 'Unexpected multiple line items.' }
  }
  const lineItem = lineItems.data[0]

  if (!lineItem || lineItems.data.length !== 1) {
    return { ok: false, error: 'Missing checkout line item.' }
  }

  const unitAmount = lineItem.price?.unit_amount
  if (unitAmount === null || unitAmount === undefined) {
    return { ok: false, error: 'Missing line item amount.' }
  }

  const currency = lineItem.price?.currency
  if (!currency) {
    return { ok: false, error: 'Missing line item currency.' }
  }

  const quantity = lineItem.quantity ?? 0
  if (quantity !== 1) {
    return { ok: false, error: 'Invalid line item quantity.' }
  }

  return { ok: true, unitAmount, currency, quantity }
}

async function addCreditsToUser(
  userId: string,
  credits: number,
  stripeSessionId: string,
  packageId: string
): Promise<CreditGrantResult> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('add_credits_for_stripe_session', {
    p_user_id: userId,
    p_credits: credits,
    p_stripe_payment_id: stripeSessionId,
    p_package_id: packageId,
  })

  if (error) {
    console.error('Failed to record credit purchase:', error)
    return { ok: false, error: 'Failed to record credit purchase.' }
  }

  if (data === null) {
    return { ok: false, error: 'Unexpected credit response.' }
  }

  return { ok: true, alreadyProcessed: data === false }
}

export async function POST(request: Request) {
  const stripeResult = getStripeClient()
  if (!stripeResult.ok) {
    console.error('Stripe not configured')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = stripeResult.value
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Webhook secret not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Only process paid sessions
      if (session.payment_status !== 'paid') {
        console.log(`Session ${session.id} not paid, skipping`)
        break
      }

      if (session.mode !== 'payment') {
        console.error(`Unexpected session mode: ${session.mode}`)
        return NextResponse.json(
          { error: 'Unexpected checkout session mode.' },
          { status: 400 }
        )
      }

      const userIdResult = getSessionUserId(session)
      if (!userIdResult.ok) {
        console.error(userIdResult.error, session.id)
        return NextResponse.json({ error: userIdResult.error }, { status: 400 })
      }

      const packageId = session.metadata?.packageId?.trim() ?? ''
      if (!packageId) {
        console.error('Missing package metadata', session.id)
        return NextResponse.json({ error: 'Missing package metadata.' }, { status: 400 })
      }

      const lineItemResult = await fetchLineItem(stripe, session.id)
      if (!lineItemResult.ok) {
        console.error(lineItemResult.error, session.id)
        return NextResponse.json({ error: lineItemResult.error }, { status: 400 })
      }

      const packageResult = getStripePackageConfig(packageId)
      if (!packageResult.ok) {
        console.error(packageResult.error, session.id)
        return NextResponse.json({ error: packageResult.error }, { status: 400 })
      }

      if (lineItemResult.currency !== packageResult.value.currency) {
        console.error('Currency mismatch', session.id)
        return NextResponse.json({ error: 'Currency mismatch.' }, { status: 400 })
      }

      if (lineItemResult.unitAmount !== packageResult.value.price) {
        console.error('Price mismatch', session.id)
        return NextResponse.json({ error: 'Price mismatch.' }, { status: 400 })
      }

      const creditsToAdd = packageResult.value.credits * lineItemResult.quantity
      if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
        console.error('Invalid credit calculation', session.id)
        return NextResponse.json({ error: 'Invalid credit amount.' }, { status: 400 })
      }

      const result = await addCreditsToUser(
        userIdResult.userId,
        creditsToAdd,
        session.id,
        packageResult.value.id
      )

      if (!result.ok) {
        console.error('Failed to add credits:', result.error)
        // Return 500 so Stripe will retry
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      if (result.alreadyProcessed) {
        console.log(`Session ${session.id} already processed, skipping`)
      }

      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`Checkout session expired: ${session.id}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
