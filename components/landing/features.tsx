import { TrendingUp, DollarSign, Layers, Sparkles, ArrowRight, Zap, Target, Lock } from 'lucide-react'

export function Features() {
  return (
    <section className="py-32 border-t border-zinc-800 relative bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-6">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Scale</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Stop wasting hours editing. Our AI pipeline handles the heavy lifting so you can focus on strategy and monetization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          <FeatureCard
            icon={Target}
            title="Algorithm-Optimized"
            description="Presets designed specifically to trigger retention metrics on TikTok and Shorts. We analyze viral trends so you don't have to."
            delay={0}
          />
          <FeatureCard
            icon={Lock}
            title="100% Unique & Owned"
            description="Every generation is a completely new seed. No copyright strikes, no reused footage. You own the rights to every video."
            delay={100}
          />
          <FeatureCard
            icon={Zap}
            title="High-Velocity Production"
            description="Generate a week's worth of content in minutes. Consistency is the key to growth, and we make it effortless."
            delay={200}
          />
        </div>

        {/* Process Flow */}
        <div className="relative rounded-[2rem] bg-zinc-900 border border-zinc-800 p-8 sm:p-16 overflow-hidden hover:border-indigo-500/30 transition-colors duration-500">
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-12">
               <Layers className="h-3 w-3" />
               <span>The Workflow</span>
             </div>
             
             <div className="grid md:grid-cols-4 gap-8 items-center text-center w-full">
                <ProcessStep step="01" title="Select Niche" description="Choose from Slime, Sand, Cutting, and more." />
                <div className="hidden md:flex justify-center text-zinc-600">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <ProcessStep step="02" title="AI Generation" description="Our engine renders unique visuals & Foley audio." />
                <div className="hidden md:flex justify-center text-zinc-600">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <ProcessStep step="03" title="Publish & Profit" description="Upload to Shorts/Reels/TikTok and monetize." />
             </div>
             
             <div className="mt-16 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-4 hover:border-indigo-500/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                   <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                   <p className="text-xs text-indigo-300/70 font-medium uppercase tracking-wider">Outcome</p>
                   <p className="text-white font-medium">Consistent, Passive Revenue Stream</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay
}: {
  icon: React.ElementType
  title: string
  description: string
  delay: number
}) {
  return (
    <div 
      className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
      <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-400 font-light leading-relaxed">{description}</p>
    </div>
  )
}

function ProcessStep({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-lg font-bold text-white mb-6 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-colors duration-300 shadow-[0_0_0_0_theme(colors.indigo.500/0)] group-hover:shadow-[0_0_20px_-5px_theme(colors.indigo.500/0.5)]">
        {step}
      </div>
      <h4 className="text-lg font-medium text-white mb-2">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px]">{description}</p>
    </div>
  )
}

