import { Star, Quote, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "ASMR Creator",
      quote: "I went from 0 to 100k subs in 3 months using these presets. The quality is indistinguishable from real life. My retention skyrocketed.",
      avatar: "AR",
      earnings: "$4.2k/mo",
      platform: "YouTube Shorts",
    },
    {
      name: "Sarah Chen",
      role: "TikTok Growth Expert",
      quote: "Finally an AI tool that actually understands what makes ASMR satisfying. The audio spatialization is on another level.",
      avatar: "SC",
      earnings: "$2.8k/mo",
      platform: "TikTok",
    },
    {
      name: "Marcus J.",
      role: "Automation Empire",
      quote: "This scaled my production by 10x. I run 5 channels now with just one account. The ROI is insane.",
      avatar: "MJ",
      earnings: "$12k/mo",
      platform: "Instagram Reels",
    }
  ]

  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-800 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight">
            Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Success Stories</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
             Join thousands of creators who are building full-time incomes with AI-generated content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 relative hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all duration-300 group">
              <Quote className="absolute top-8 right-8 h-8 w-8 text-zinc-800 group-hover:text-indigo-500/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-white fill-white group-hover:text-indigo-400 group-hover:fill-indigo-400 transition-colors" />
                ))}
              </div>
              
              <p className="text-zinc-300 mb-8 leading-relaxed font-light text-lg">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-zinc-800 pt-6 group-hover:border-indigo-500/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium text-sm group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-white font-medium">{t.name}</h4>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 group-hover:text-indigo-400/70 transition-colors">{t.platform}</span>
                   <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                     {t.earnings}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-indigo-500/30 transition-colors duration-500">
           {/* Gradient Background */}
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20" />
           
           <div className="relative z-10 px-8 py-20 text-center">
              <h3 className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight">Ready to Go Viral?</h3>
              <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light">
                 Start generating professional ASMR content today. No credit card required.
              </p>
              <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-full px-10 h-14 text-lg font-medium shadow-lg shadow-indigo-500/20" asChild>
                 <Link href="/signup">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
              </Button>
           </div>
        </div>
      </div>
    </section>
  )
}
