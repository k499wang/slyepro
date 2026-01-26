import { Coins } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type CreditsBalanceCardProps = {
  credits: number
}

export function CreditsBalanceCard({ credits }: CreditsBalanceCardProps) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-white/10 rounded-lg border border-white/5">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Current Balance</p>
            <p className="text-3xl font-light tracking-tight text-white">{credits} credits</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
