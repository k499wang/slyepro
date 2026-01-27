"use client"

import { ArrowUpRight, Check, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LazyVideo } from '@/components/ui/lazy-video'

export function ProvenNiches() {
  const niches = [
    {
      title: "Disney Stories",
      stats: "Avg. Views: 5.2M",
      description: "AI-reimagined narratives and 'what-if' scenarios. Massive global appeal with high retention from Disney fans and families.",
      growth: "+620% Trend",
      video: "/presets/disneymovie.mp4",
      poster: "/presets/book.jpg",
      accounts: [
        { name: "@avraamai", views: "3.4M", link: "https://www.instagram.com/avraamai/" },
        { name: "@avraamai", views: "1.2M", link: "https://www.instagram.com/p/DQwVRANjay6/" }
      ]
    },
    {
      title: "Ultra-Satisfying ASMR",
      stats: "Avg. Views: 3.8M",
      description: "High-fidelity textural triggers. The gold standard for faceless retention. No talking, just pure algorithm-fuelled satisfaction.",
      growth: "+450% Trend",
      video: "/presets/asmr.mp4",
      poster: "/presets/sand.png",
      accounts: [
        { name: "@satisfying.slices.asmr", views: "2.1M", link: "https://www.instagram.com/satisfying.slices.asmr/" },
        { name: "@topaiasmr", views: "940k", link: "https://www.instagram.com/topaiasmr/" }
      ]
    },
    {
      title: "Looksmaxxing AI",
      stats: "Avg. Views: 2.1M",
      description: "The fastest growing niche on TikTok. Face analysis, aesthetic tips, and glow-up transformations that drive massive engagement.",
      growth: "+840% Trend",
      video: "/presets/looksmax.mp4",
      poster: "/presets/keyboard.jpg",
      accounts: [
        { name: "@ineffable_ai22", views: "850k", link: "https://www.instagram.com/ineffable_ai22/" },
        { name: "@itscynthia.ai", views: "420k", link: "https://www.instagram.com/itscynthia.ai/" }
      ]
    }
  ]

  return (
    <section className="py-32 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight">
              Skip the <span className="text-zinc-500 line-through decoration-red-500/50 decoration-4">Guesswork</span>. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Proven Viral Niches.
              </span>
            </h2>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">
              Stop wasting credits on bad prompts. We've reverse-engineered the algorithm's favorite formats so you can just click, generate, and monetize.
            </p>
          </div>
          <div className="shrink-0">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                <Check className="h-4 w-4" />
                <span>Researched & Validated</span>
             </div>
          </div>
        </div>

        {/* Niche Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {niches.map((niche, i) => (
            <div key={i} className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
              
              {/* Video Preview */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <LazyVideo 
                   src={niche.video} 
                   poster={niche.poster}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   autoPlay
                />
                <div className="absolute top-4 left-4 z-10">
                   <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                     {niche.growth}
                   </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-2xl font-bold text-white">{niche.title}</h3>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                  {niche.description}
                </p>

                {/* Social Proof Stats */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Benchmark Performance</span>
                      <span className="text-indigo-300 font-medium">{niche.stats}</span>
                   </div>
                   
                   <div className="space-y-3">
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Viral with this niche</span>
                      {niche.accounts.map((acc, idx) => (
                         <a
                            key={idx}
                            href={acc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors"
                         >
                            <span className="text-sm text-zinc-300 font-medium">{acc.name}</span>
                            <span className="text-xs text-green-500 font-mono">{acc.views} views</span>
                         </a>
                      ))}
                   </div>
                </div>

                <div className="mt-8">
                   <Button className="w-full bg-white text-black hover:bg-zinc-200 border border-transparent font-medium" asChild>
                      <Link href="/signup">
                         Replicate This Niche
                         <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
