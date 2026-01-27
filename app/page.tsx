import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Footer } from '@/components/landing/footer'
import { LogoTicker } from '@/components/landing/logo-ticker'
import { VideoMarquee } from '@/components/landing/video-marquee'
import { ProvenNiches } from '@/components/landing/proven-niches'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <Hero />
        <LogoTicker />
        <ProvenNiches />
        <VideoMarquee />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
