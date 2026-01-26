import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          <span>Next Generation Audio Synthesis</span>
        </div>

        <h1 className="text-5xl sm:text-8xl font-light tracking-tight text-white mb-8">
          Experience <span className="font-semibold text-white">AI ASMR</span>
          <br />
          <span className="text-zinc-500">like never before.</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Generate hyper-realistic, spatial audio content tailored to your senses.
          The future of relaxation is here.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Button size="lg" asChild className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-12 text-base">
            <Link href="/signup">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 text-base bg-transparent">
            <Link href="/dashboard/generate/asmr">
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Link>
          </Button>
        </div>

        {/* Hero Visual */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-zinc-950/50 aspect-[16/9] flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
          <div className="relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 group-hover:scale-105">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </div>
            <p className="text-sm font-medium text-zinc-400 tracking-widest uppercase">Watch Trailer</p>
          </div>
        </div>
      </div>
    </section>
  )
}
