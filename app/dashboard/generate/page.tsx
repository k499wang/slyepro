'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Music, Film, Split, Megaphone, ArrowRight } from 'lucide-react'

type GenerationType = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  href: string
  available: boolean
  featured?: boolean
  previewVideo?: string
}

const generationTypes: GenerationType[] = [
  {
    id: 'asmr',
    name: 'ASMR Video',
    description: 'Generate high-fidelity ASMR videos with custom prompts and curated presets. Perfect for relaxation, sleep, and focus content.',
    icon: <Music className="h-6 w-6" />,
    href: '/dashboard/generate/asmr',
    available: true,
    featured: true,
    previewVideo: '/presets/asmr.mp4',
  },
  {
    id: 'longform',
    name: 'Long Form Stories',
    description: 'Cinematic long-form videos with rich narratives and stunning visuals.',
    icon: <Film className="h-5 w-5" />,
    href: '/dashboard/generate/longform',
    available: false,
    previewVideo: '/presets/disneymovie.mp4',
  },
  {
    id: 'which-one',
    name: 'Which One Videos',
    description: 'Viral comparison videos that engage viewers with satisfying choices.',
    icon: <Split className="h-5 w-5" />,
    href: '/dashboard/generate/which-one',
    available: false,
    previewVideo: '/presets/which.mp4',
  },
  {
    id: 'ugc',
    name: 'UGC Ad Videos',
    description: 'Authentic user-generated style content perfect for social ads.',
    icon: <Megaphone className="h-5 w-5" />,
    href: '/dashboard/generate/ugc',
    available: false,
    previewVideo: '/presets/ai_ugc.mp4',
  },
]

function FeaturedCard({ type }: { type: GenerationType }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Link
      href={type.href}
      className="group block rounded-xl border border-white/10 bg-zinc-900/50 overflow-hidden transition-all duration-300 hover:bg-zinc-900/80 hover:border-white/20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col md:flex-row">
        {/* Video Preview */}
        <div className="relative w-full md:w-80 lg:w-96 aspect-video bg-zinc-950 overflow-hidden flex-shrink-0">
          {type.previewVideo && (
            <video
              ref={videoRef}
              src={type.previewVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex items-center">
          <div className="flex items-start justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white">
                {type.icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-medium text-white">{type.name}</h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Available
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-400 font-light max-w-md">
                  {type.description}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ComingSoonCard({ type }: { type: GenerationType }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className="group rounded-xl border border-white/5 bg-zinc-900/30 overflow-hidden transition-all duration-200 hover:bg-zinc-900/50 hover:border-white/10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Preview */}
      <div className="relative aspect-video bg-zinc-950 overflow-hidden">
        {type.previewVideo && (
          <video
            ref={videoRef}
            src={type.previewVideo}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
          />
        )}
        {!type.previewVideo && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-zinc-700">{type.icon}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {type.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-zinc-300 group-hover:text-zinc-200 transition-colors">
              {type.name}
            </h3>
            <p className="text-xs text-zinc-600 font-light truncate">
              {type.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GenerateIndexPage() {
  const featured = generationTypes.find((t) => t.featured)
  const upcoming = generationTypes.filter((t) => !t.available)

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white">Create</h1>
        <p className="text-zinc-500 mt-2 font-light">
          Choose a generation type to get started.
        </p>
      </div>

      {/* Featured Generation Type */}
      {featured && <FeaturedCard type={featured} />}

      {/* Coming Soon Section */}
      {upcoming.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Coming Soon
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((type) => (
              <ComingSoonCard key={type.id} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
