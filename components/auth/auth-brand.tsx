import Link from 'next/link'
import { Play, Sparkles, Zap } from 'lucide-react'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Crisp presets',
    description: 'Curated ASMR recipes tuned for satisfying results.',
  },
  {
    icon: Zap,
    title: 'Fast generation',
    description: 'Queue a batch and get fresh clips in minutes.',
  },
  {
    icon: Play,
    title: 'Share-ready',
    description: 'Export in formats optimized for social feeds.',
  },
]

export function AuthBrand() {
  return (
    <aside className="hidden flex-col justify-between border-r border-white/5 bg-zinc-950 p-10 lg:flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 -z-10" />
      
      <div className="space-y-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-lg shadow-white/10">
            <Sparkles className="h-4 w-4 text-black fill-black" />
          </span>
          <span className="text-lg font-medium tracking-tight text-white">{APP_NAME}</span>
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-tight text-white leading-tight">
            Make soothing AI ASMR videos <span className="text-zinc-500">your audience replays.</span>
          </h1>
          <p className="text-base text-zinc-400 font-light max-w-md leading-relaxed">{APP_DESCRIPTION}</p>
        </div>
        <div className="space-y-6 pt-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 group">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                <Icon className="h-5 w-5 text-zinc-300 group-hover:text-white transition-colors" />
              </span>
              <div>
                <p className="text-sm font-medium text-white tracking-wide">{title}</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed group-hover:text-zinc-400 transition-colors">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <Button asChild variant="ghost" className="justify-start text-zinc-400 hover:text-white hover:bg-white/5 -ml-4">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </aside>
  )
}
