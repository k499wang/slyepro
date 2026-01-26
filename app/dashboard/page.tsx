import Link from 'next/link'
import { CheckCircle, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) redirect('/login')

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthStartIso = monthStart.toISOString()

  const [profileResult, totalResult, monthResult, completedResult] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('credits')
        .eq('id', authData.user.id)
        .single(),
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authData.user.id),
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authData.user.id)
        .gte('created_at', monthStartIso),
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authData.user.id)
        .eq('status', 'completed'),
    ])

  const credits = profileResult.data?.credits ?? 0
  const totalCount = totalResult.count ?? 0
  const monthCount = monthResult.count ?? 0
  const completedCount = completedResult.count ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-2 font-light">Overview of your creative studio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Credits Remaining"
          value={`${credits}`}
          icon={Zap}
          description="Available balance"
        />
        <StatsCard
          title="Total Generations"
          value={`${totalCount}`}
          icon={Sparkles}
          description="All time"
        />
        <StatsCard
          title="This Month"
          value={`${monthCount}`}
          icon={TrendingUp}
          description="Generations"
        />
        <StatsCard
          title="Completed"
          value={`${completedCount}`}
          icon={CheckCircle}
          description="Ready to share"
        />
      </div>

      <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-light text-white tracking-wide">Create New Generation</h2>
              <p className="text-zinc-400 mt-2 font-light leading-relaxed">
                Utilize our advanced AI models to generate high-fidelity ASMR content. 
                Select from premium presets or craft a custom sonic landscape.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-medium px-8">
              <Link href="/dashboard/generate/asmr">
                <Sparkles className="mr-2 h-4 w-4" />
                Initialize Generation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
