"use client"

import { Play, TrendingUp, Eye, Heart } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ViralExamples() {
  const examples = [
    {
      title: "Cosmic Slime",
      category: "Satisfying",
      views: "2.5M",
      likes: "142K",
      video: "/presets/A_surreal_asmr_202601261707_m6obt.mp4",
      poster: "/presets/slime.jpg",
    },
    {
      title: "Obsidian Cutting",
      category: "Triggers",
      views: "1.8M",
      likes: "98K",
      video: "/presets/A_surreal_asmr_202601261707_t19mu.mp4",
      poster: "/presets/objectcutting.jpg",
    },
    {
      title: "Kinetic Sand",
      category: "Textures",
      views: "4.2M",
      likes: "310K",
      video: "/presets/A_surreal_asmr_202601261707_t97lm.mp4",
      poster: "/presets/sand.png",
    }
  ]

  return (
    <section id="examples" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Examples</span>
            </h2>
            <p className="text-zinc-400 max-w-xl text-lg font-light leading-relaxed">
              See what creators are generating. These formats are algorithmically proven to drive massive engagement.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest">Total Views Generated</span>
            </div>
            <p className="text-5xl font-bold text-white tracking-tight">142,000,000+</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {examples.map((example, i) => (
            <VideoCard key={i} example={example} />
          ))}
        </div>

        <div className="text-center">
           <Button variant="outline" size="lg" className="rounded-full border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/10 px-8 bg-transparent" asChild>
             <Link href="/signup">
               Explore All 50+ Presets
             </Link>
           </Button>
        </div>
      </div>
    </section>
  )
}

function VideoCard({ example }: { example: any }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div 
      className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_theme(colors.indigo.500/0.3)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Layer */}
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          src={example.video}
          poster={example.poster}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          muted
          loop
          playsInline
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Play Icon */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30">
          <Play className="h-6 w-6 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Stats overlay (visible on hover) */}
       <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isPlaying ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-xs font-medium text-white">
             <Eye className="h-3 w-3" />
             {example.views}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-xs font-medium text-white">
             <Heart className="h-3 w-3 text-red-500 fill-red-500" />
             {example.likes}
          </div>
       </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-0">
        <div className="mb-2 inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
           {example.category}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{example.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 group-hover:text-zinc-300 transition-colors">
          Generated in 30s • High Retention
        </p>
      </div>
    </div>
  )
}
