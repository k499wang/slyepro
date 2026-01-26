import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CREDIT_PACKAGES } from '@/lib/constants'

type CheckoutPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CreditsCheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const packageId = getParam(resolvedParams?.package)
  const selectedPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
        <p className="text-zinc-400 mt-1">
          Review your credit pack before continuing.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-white">Selected package</CardTitle>
          <CardDescription className="text-zinc-400">
            {selectedPackage
              ? 'You are ready to complete your purchase.'
              : 'Pick a package to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPackage ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white">
                      {selectedPackage.name}
                    </span>
                    <Badge className="bg-violet-600">Selected</Badge>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {(selectedPackage.credits / 5).toFixed(0)} ASMR videos
                  </p>
                </div>
                <span className="text-2xl font-bold text-white">
                  ${(selectedPackage.price / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Zap className="h-4 w-4 text-violet-400" />
                <span>{selectedPackage.credits} credits</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-zinc-300">
                Stripe checkout is not configured yet. This page is the
                placeholder step.
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/dashboard/credits">Back to credits</Link>
                </Button>
                <Button variant="outline" className="border-white/10" disabled>
                  Complete purchase
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-emerald-400" />
                Visit the credits page to select a package.
              </div>
              <Button asChild className="bg-violet-600 hover:bg-violet-700">
                <Link href="/dashboard/credits">View credit packs</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
