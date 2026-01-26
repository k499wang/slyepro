import { Sparkles, Zap, Play } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function Features() {
  return (
    <section className="py-24 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-zinc-950/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl font-light text-white text-center mb-16 tracking-tight">
          Why {APP_NAME}?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Sparkles}
            title="AI-Powered"
            description="State-of-the-art AI generates realistic ASMR videos with synced audio."
          />
          <FeatureCard
            icon={Zap}
            title="Instant Results"
            description="Get your ASMR content in seconds, not hours. No editing required."
          />
          <FeatureCard
            icon={Play}
            title="Curated Presets"
            description="Choose from dozens of satisfying presets or create your own."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors duration-300">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-xl font-medium text-white mb-3 tracking-wide">{title}</h3>
      <p className="text-zinc-500 font-light leading-relaxed">{description}</p>
    </div>
  )
}

