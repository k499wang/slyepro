import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function redirectWithMessage(
  origin: string,
  key: 'error' | 'success',
  message: string
) {
  const url = new URL('/dashboard/credits', origin)
  url.searchParams.set(key, message)
  return NextResponse.redirect(url)
}

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return null
  }

  return new Stripe(secretKey, { apiVersion: '2024-06-20' })
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const sessionId = searchParams.get('session_id')?.trim()

  if (!sessionId) {
    return redirectWithMessage(origin, 'error', 'Missing checkout session.')
  }

  const stripe = getStripe()
  if (!stripe) {
    return redirectWithMessage(origin, 'error', 'Stripe secret key is missing.')
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    return redirectWithMessage(origin, 'error', 'Payment not completed.')
  }

  const creditsValue = session.metadata?.credits
  const sessionUserId = session.metadata?.userId

  if (!creditsValue || !sessionUserId) {
    return redirectWithMessage(origin, 'error', 'Missing checkout metadata.')
  }

  const creditsToAdd = Number(creditsValue)
  if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
    return redirectWithMessage(origin, 'error', 'Invalid credit amount.')
  }

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    const url = new URL('/login', origin)
    url.searchParams.set('error', 'Please log in to finish checkout.')
    return NextResponse.redirect(url)
  }

  if (authData.user.id !== sessionUserId) {
    return redirectWithMessage(origin, 'error', 'Account mismatch detected.')
  }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return redirectWithMessage(origin, 'error', 'Server configuration error.')
  }
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('credits')
    .eq('id', sessionUserId)
    .single()

  if (profileError) {
    return redirectWithMessage(origin, 'error', 'Unable to load profile.')
  }

  const updatedCredits = (profile?.credits ?? 0) + creditsToAdd
  const { error: updateError } = await admin
    .from('profiles')
    .update({ credits: updatedCredits })
    .eq('id', sessionUserId)

  if (updateError) {
    return redirectWithMessage(origin, 'error', 'Failed to update credits.')
  }

  return redirectWithMessage(origin, 'success', 'Credits added successfully.')
}
