"use client"

import { LoadedVideo } from "./loaded-video"

export function VideoMarquee() {
  const videos = [
    "/presets/ai_ugc.mp4",
    "/presets/which.mp4",
    "/presets/disneymovie.mp4",
    "/presets/asmr.mp4",
    "/presets/A_surreal_asmr_202601261707_m6obt.mp4",
    "/presets/A_surreal_asmr_202601261707_t19mu.mp4"
  ]

  return (
    <section className="py-24 bg-zinc-950 overflow-hidden border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Infinite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Possibilities</span>
        </h2>
        <p className="text-zinc-400">
           From oddly satisfying textures to cinematic roleplays.
        </p>
      </div>

      <div className="relative w-full">
        <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="flex gap-4 items-center pr-4">
                {videos.map((src, idx) => (
                  <div key={idx} className="relative w-64 h-96 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_theme(colors.indigo.500/0.3)] transition-all duration-300">
                     <LoadedVideo
                        src={src}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                        autoPlay
                        muted
                        loop
                        playsInline
                     />
                  </div>
                ))}
             </div>
          ))}
        </div>
      </div>
    </section>
  )
}
