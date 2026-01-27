"use client"

import { useTheme } from "next-themes"

export function LogoTicker() {
  const logos = [
    { name: "YouTube Shorts", icon: "▶" },
    { name: "TikTok", icon: "♪" },
    { name: "Instagram Reels", icon: "Eq" },
    { name: "Snapchat Spotlight", icon: "👻" },
    { name: "Pinterest Watch", icon: "P" },
    { name: "YouTube Shorts", icon: "▶" },
    { name: "TikTok", icon: "♪" },
    { name: "Instagram Reels", icon: "Eq" },
    { name: "Snapchat Spotlight", icon: "👻" },
    { name: "Pinterest Watch", icon: "P" },
  ]

  return (
    <section className="py-10 border-y border-zinc-800 bg-zinc-950/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
          Powering channels on every major platform
        </p>
      </div>
      
      <div className="flex overflow-hidden group">
        <div className="flex gap-16 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              {logos.map((logo, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300">
                   {/* Placeholder for actual SVGs, using styled text for now */}
                   <span className="text-2xl font-bold text-white">{logo.icon}</span>
                   <span className="text-xl font-semibold text-zinc-300">{logo.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
