import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CreditPackage = {
  id: string
  name: string
  credits: number
  price: number
}

type CreditPackageCardProps = {
  pkg: CreditPackage
  isPopular?: boolean
}

export function CreditPackageCard({
  pkg,
  isPopular = false,
}: CreditPackageCardProps) {
  return (
    <Card
      className={`bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 ${
        isPopular ? 'ring-1 ring-white shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-white/10' : 'hover:bg-white/10'
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-medium">{pkg.name}</CardTitle>
          {isPopular ? <Badge className="bg-white text-black hover:bg-zinc-200 border-none">Popular</Badge> : null}
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
            {Math.floor(pkg.credits / 5)} ASMR videos
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <Check className="h-4 w-4 text-white" />
            Never expires
          </li>
        </ul>
        <Button asChild className="w-full bg-white text-black hover:bg-zinc-200 font-medium">
          <Link href={`/api/credits/checkout?package=${pkg.id}`}>Purchase</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
