import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CREDIT_PACKAGES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function redirectWithError(origin: string, message: string) {
  const url = new URL('/dashboard/credits', origin)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url)
}

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return null
  }

  return new Stripe(secretKey, { apiVersion: '2025-12-15.clover' })
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const packageId = searchParams.get('package')?.trim()

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    const url = new URL('/login', origin)
    url.searchParams.set('error', 'Please log in to purchase credits.')
    return NextResponse.redirect(url)
  }

  if (!packageId) {
    return redirectWithError(origin, 'Missing package selection.')
  }

  const selectedPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId)
  if (!selectedPackage) {
    return redirectWithError(origin, 'Invalid credit package.')
  }

  const stripe = getStripe()
  if (!stripe) {
    return redirectWithError(origin, 'Stripe secret key is missing.')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: selectedPackage.price,
          product_data: {
            name: `${selectedPackage.name} Credits`,
          },
        },
      },
    ],
    success_url: `${origin}/api/credits/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/credits?canceled=1`,
    metadata: {
      packageId: selectedPackage.id,
      credits: `${selectedPackage.credits}`,
      userId: authData.user.id,
    },
    client_reference_id: authData.user.id,
  })

  if (!session.url) {
    return redirectWithError(origin, 'Stripe session could not be created.')
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
