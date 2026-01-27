"use client"

import { Check, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 499,
  },
  {
    id: 'popular',
    name: 'Popular',
    credits: 150,
    price: 999,
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 500,
    price: 2499,
  }
]

export function Pricing() {
  return (
    <section className="py-24 bg-black border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-400 font-light max-w-xl mx-auto">
            Pay for what you use. No subscriptions, no hidden fees. Credits never expire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 ${
                pkg.popular
                  ? 'ring-1 ring-white shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-white/10'
                  : 'hover:bg-white/10'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-medium">{pkg.name}</CardTitle>
                  {pkg.popular && (
                    <Badge className="bg-white text-black hover:bg-zinc-200 border-none">
                      Popular
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-light tracking-tight text-white">
                    ${(pkg.price / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <Zap className="h-4 w-4 text-white fill-white" />
                  <span className="font-medium">{pkg.credits} credits</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-white" />
                    {Math.floor(pkg.credits / 5)} videos
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-white" />
                    Never expires
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-white" />
                    Commercial usage rights
                  </li>
                </ul>
                <Button asChild className="w-full bg-white text-black hover:bg-zinc-200 font-medium">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
