import 'server-only'
import Stripe from 'stripe'
import { CREDIT_CURRENCY, CREDIT_PACKAGES } from '@/lib/constants'

type CreditPackage = (typeof CREDIT_PACKAGES)[number]
type CreditCurrency = typeof CREDIT_CURRENCY

type StripePackageConfig = {
  id: CreditPackage['id']
  name: CreditPackage['name']
  credits: CreditPackage['credits']
  price: CreditPackage['price']
  currency: CreditCurrency
}

type StripePackageResult =
  | { ok: true; value: StripePackageConfig }
  | { ok: false; error: string }

type StripeClientResult =
  | { ok: true; value: Stripe }
  | { ok: false; error: string }

type AppUrlResult =
  | { ok: true; value: string }
  | { ok: false; error: string }

const STRIPE_API_VERSION: Stripe.StripeConfig['apiVersion'] = '2024-06-20'

export function getStripeClient(): StripeClientResult {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return { ok: false, error: 'Stripe secret key is missing.' }
  }

  return {
    ok: true,
    value: new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION }),
  }
}

export function getStripePackageConfig(packageId: string): StripePackageResult {
  const basePackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId)
  if (!basePackage) {
    return { ok: false, error: 'Invalid credit package.' }
  }

  return {
    ok: true,
    value: {
      ...basePackage,
      currency: CREDIT_CURRENCY,
    },
  }
}

export function getAppUrl(): AppUrlResult {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!rawUrl) {
    return { ok: false, error: 'NEXT_PUBLIC_APP_URL is missing.' }
  }

  try {
    const appUrl = new URL(rawUrl)
    return { ok: true, value: appUrl.origin }
  } catch {
    return { ok: false, error: 'NEXT_PUBLIC_APP_URL is invalid.' }
  }
}
