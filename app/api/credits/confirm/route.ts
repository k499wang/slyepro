import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import {
  getAppUrl,
  getStripeClient,
  getStripePackageConfig,
} from '@/lib/stripe/server'

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

function redirectWithMessage(
  origin: string,
  key: 'error' | 'success',
  message: string
) {
  const url = new URL('/dashboard/credits', origin)
  url.searchParams.set(key, message)
  return NextResponse.redirect(url)
}

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

export async function GET(request: Request) {
  const appUrlResult = getAppUrl()
  if (!appUrlResult.ok) {
    return NextResponse.json({ error: appUrlResult.error }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')?.trim()

  if (!sessionId) {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      'Missing checkout session.'
    )
  }

  const stripeResult = getStripeClient()
  if (!stripeResult.ok) {
    return redirectWithMessage(appUrlResult.value, 'error', stripeResult.error)
  }

  const session = await stripeResult.value.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      'Payment not completed.'
    )
  }

  if (session.mode !== 'payment') {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      'Unexpected checkout session.'
    )
  }

  const sessionUserResult = getSessionUserId(session)
  if (!sessionUserResult.ok) {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      sessionUserResult.error
    )
  }

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    const url = new URL('/login', appUrlResult.value)
    url.searchParams.set('error', 'Please log in to finish checkout.')
    return NextResponse.redirect(url)
  }

  if (authData.user.id !== sessionUserResult.userId) {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      'Account mismatch detected.'
    )
  }

  const packageId = session.metadata?.packageId?.trim() ?? ''
  if (!packageId) {
    return redirectWithMessage(
      appUrlResult.value,
      'error',
      'Missing checkout metadata.'
    )
  }

  const packageResult = getStripePackageConfig(packageId)
  if (!packageResult.ok) {
    return redirectWithMessage(appUrlResult.value, 'error', packageResult.error)
  }

  const lineItemResult = await fetchLineItem(stripeResult.value, sessionId)
  if (!lineItemResult.ok) {
    return redirectWithMessage(appUrlResult.value, 'error', lineItemResult.error)
  }

  if (lineItemResult.currency !== packageResult.value.currency) {
    return redirectWithMessage(appUrlResult.value, 'error', 'Currency mismatch.')
  }

  if (lineItemResult.unitAmount !== packageResult.value.price) {
    return redirectWithMessage(appUrlResult.value, 'error', 'Price mismatch.')
  }

  const creditsToAdd = packageResult.value.credits * lineItemResult.quantity
  if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
    return redirectWithMessage(appUrlResult.value, 'error', 'Invalid credits.')
  }

  const grantResult = await addCreditsToUser(
    sessionUserResult.userId,
    creditsToAdd,
    sessionId,
    packageResult.value.id
  )

  if (!grantResult.ok) {
    return redirectWithMessage(appUrlResult.value, 'error', grantResult.error)
  }

  if (grantResult.alreadyProcessed) {
    return redirectWithMessage(
      appUrlResult.value,
      'success',
      'Credits already applied.'
    )
  }

  return redirectWithMessage(
    appUrlResult.value,
    'success',
    'Credits added successfully.'
  )
}
