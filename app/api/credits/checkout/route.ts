import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getAppUrl,
  getStripeClient,
  getStripePackageConfig,
} from '@/lib/stripe/server'

export const runtime = 'nodejs'

type CheckoutRequest = {
  packageId: string
}

function redirectWithError(appUrl: string, message: string) {
  const url = new URL('/dashboard/credits', appUrl)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url)
}

function parseCheckoutRequest(formData: FormData): CheckoutRequest | null {
  const packageValue = formData.get('package')
  if (typeof packageValue !== 'string') {
    return null
  }

  const packageId = packageValue.trim()
  if (!packageId) {
    return null
  }

  return { packageId }
}

export async function POST(request: Request) {
  const appUrlResult = getAppUrl()
  if (!appUrlResult.ok) {
    return NextResponse.json({ error: appUrlResult.error }, { status: 500 })
  }

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    const url = new URL('/login', appUrlResult.value)
    url.searchParams.set('error', 'Please log in to purchase credits.')
    return NextResponse.redirect(url)
  }

  const formData = await request.formData()
  const checkoutRequest = parseCheckoutRequest(formData)

  if (!checkoutRequest) {
    return redirectWithError(appUrlResult.value, 'Missing package selection.')
  }

  const selectedPackageResult = getStripePackageConfig(checkoutRequest.packageId)
  if (!selectedPackageResult.ok) {
    return redirectWithError(appUrlResult.value, selectedPackageResult.error)
  }

  const stripeResult = getStripeClient()
  if (!stripeResult.ok) {
    return redirectWithError(appUrlResult.value, stripeResult.error)
  }

  const selectedPackage = selectedPackageResult.value

  const session = await stripeResult.value.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: selectedPackage.currency,
          unit_amount: selectedPackage.price,
          product_data: {
            name: `${selectedPackage.name} credits`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrlResult.value}/api/credits/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrlResult.value}/dashboard/credits?canceled=1`,
    metadata: {
      packageId: selectedPackage.id,
      userId: authData.user.id,
    },
    client_reference_id: authData.user.id,
    customer_email: authData.user.email ?? undefined,
  })

  if (!session.url) {
    return redirectWithError(
      appUrlResult.value,
      'Stripe session could not be created.'
    )
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
