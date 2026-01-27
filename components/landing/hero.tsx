"use client"

import Link from 'next/link'
import { ArrowRight, Play, CheckCircle2, DollarSign, Sparkles, Send, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    // Redirect to signup with prompt (in a real app, you'd pass this via query param or state)
    router.push('/signup')
  }

  return (
    <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 overflow-hidden bg-zinc-950">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>The Ultimate AI Marketing Toolkit</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              <span className="block text-zinc-300">Ideas.</span>
              <span className="block text-white">Virality.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Money.
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 mb-10 font-light leading-relaxed">
              Create viral shorts, ads, and organic content in seconds. 
              The all-in-one platform to dominate attention and drive revenue.
            </p>
            
            {/* Prompt Input Simulation */}
            <form onSubmit={handleGenerate} className="relative max-w-lg mx-auto lg:mx-0 mb-12 group">
              <div className="relative flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-full focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all shadow-2xl hover:shadow-indigo-500/10 hover:border-white/20">
                 <div className="pl-4 text-zinc-500">
                    <Sparkles className="h-5 w-5" />
                 </div>
                 <input 
                   type="text" 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Describe your ad or video..." 
                   className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-500 focus:ring-0 px-2 py-3 text-sm min-w-0"
                 />
                 <Button 
                   type="submit"
                   size="sm" 
                   className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 h-10 shadow-lg shadow-indigo-500/20"
                 >
                   Generate
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </div>
              <p className="text-center lg:text-left text-xs text-zinc-500 mt-3 pl-4">
                 Try: "Viral Disney Story" • "Product Showcase" • "ASMR Ad"
              </p>
            </form>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                <span>10x Content Output</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                <span>Commercial Usage Rights</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Refined Centered Stack */}
          <div className="flex-1 w-full flex justify-center lg:justify-end py-12 relative">
             <div className="relative w-full max-w-[420px] h-[550px] flex justify-center items-center">
                
                {/* Background Phone 1 (Left Overlap) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[200px] aspect-[9/19] bg-zinc-900 rounded-[2rem] border-2 border-zinc-800 shadow-2xl overflow-hidden -rotate-6 opacity-30 z-0 scale-90 translate-x-4">
                   <video src="/presets/ai_ugc.mp4" className="w-full h-full object-cover" autoPlay muted loop playsInline />
                </div>

                {/* Background Phone 2 (Right Overlap) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[200px] aspect-[9/19] bg-zinc-900 rounded-[2rem] border-2 border-zinc-800 shadow-2xl overflow-hidden rotate-6 opacity-30 z-0 scale-90 -translate-x-4">
                   <video src="/presets/which.mp4" className="w-full h-full object-cover" autoPlay muted loop playsInline />
                </div>

                {/* Main Front Phone */}
                <div className="relative w-[280px] sm:w-[280px] aspect-[9/19] bg-zinc-950 rounded-[2.5rem] border-4 border-zinc-900 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10 z-10">
                   <div className="absolute inset-0 bg-zinc-800">
                      <video 
                        src="/presets/asmr.mp4" 
                        className="w-full h-full object-cover opacity-90"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      
                      {/* Minimal UI Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                      
                      <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center text-white/90">
                         <div className="flex flex-col items-center gap-1">
                           <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                             <span className="text-sm">❤️</span>
                           </div>
                           <span className="text-[10px] font-medium">1.2M</span>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                             <span className="text-sm">💬</span>
                           </div>
                           <span className="text-[10px] font-medium">8.4K</span>
                         </div>
                      </div>

                      <div className="absolute bottom-6 left-4 right-12 text-white/90">
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-6 h-6 rounded-full bg-indigo-500 border border-indigo-400" />
                           <span className="font-medium text-xs">Marketing AI</span>
                         </div>
                         <p className="text-xs opacity-80 line-clamp-2">Scale your brand with automated content. Link in bio. 🚀</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
