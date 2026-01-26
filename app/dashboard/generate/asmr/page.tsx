'use client'

import { useMemo, useState } from 'react'
import { Sparkles, Music } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryTabs } from '@/components/generator/category-tabs'
import { PromptEditor } from '@/components/generator/prompt-editor'
import { GenerationOutput } from '@/components/generator/generation-output'
import { Input } from '@/components/ui/input'
import { presets } from '@/data/presets'
import { getCreditCost } from '@/lib/generations'
import { useAsmrGeneration } from '@/hooks/use-asmr-generation'
import { ASPECT_RATIOS } from '@/types'
import type { Preset, AspectRatio } from '@/types'

type GlassObjectChoice = {
  id: string
  label: string
  value: string
}

const GLASS_PROMPT_TOKEN = '{object}'

const GLASS_OBJECT_PRESETS: GlassObjectChoice[] = [
  { id: 'glass-apple', label: 'Apple', value: 'apple' },
  { id: 'glass-banana', label: 'Banana', value: 'banana' },
  { id: 'glass-orange', label: 'Orange', value: 'orange' },
  { id: 'glass-pear', label: 'Pear', value: 'pear' },
  { id: 'glass-bottle', label: 'Bottle', value: 'bottle' },
  { id: 'glass-vase', label: 'Vase', value: 'vase' },
]

const buildGlassPrompt = (template: string, objectValue: string): string => {
  const trimmed = objectValue.trim()
  if (!trimmed) return template

  return template.includes(GLASS_PROMPT_TOKEN)
    ? template.replace(GLASS_PROMPT_TOKEN, trimmed)
    : `${template} ${trimmed}`
}

export default function GeneratePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [glassObject, setGlassObject] = useState('')
  const { status, outputUrl, error, isGenerating, start } = useAsmrGeneration()
  const cost = getCreditCost('asmr_video')

  // TODO: Fetch from Supabase
  const credits = 10

  const isGlassPreset = selectedPreset?.id === 'glass-cutting'

  const filteredPresets = useMemo(() => {
    if (activeCategory === 'all') return presets
    return presets.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset)
    if (preset.id === 'glass-cutting') {
      setGlassObject('')
    }
    setPrompt(preset.prompt)
  }

  const handleGenerate = () => {
    if (!prompt.trim()) return
    const finalPrompt = isGlassPreset
      ? buildGlassPrompt(prompt, glassObject)
      : prompt
    void start({ prompt: finalPrompt, options: { aspectRatio } })
  }

  return (
    <div className="h-[calc(100vh-4rem)] grid lg:grid-cols-12 gap-6 overflow-hidden">
      {/* Left Panel: Controls */}
      <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        <div className="pt-2">
          <h1 className="text-3xl font-light tracking-tight text-white">Studio</h1>
          <p className="text-zinc-500 mt-2 font-light">
            Craft your sonic landscape.
          </p>
        </div>

        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
          <CardContent className="p-5 space-y-5">
            <div className="space-y-3">
              <label className="text-zinc-200 text-sm font-medium">Dimensions</label>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      aspectRatio === ratio
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
            {isGlassPreset && (
              <div className="space-y-3">
                <label className="text-zinc-200 text-sm font-medium">Glass Object</label>
                <div className="flex flex-wrap gap-2">
                  {GLASS_OBJECT_PRESETS.map((preset) => {
                    const isActive = glassObject === preset.value
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setGlassObject(preset.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    )
                  })}
                </div>
                <Input
                  value={glassObject}
                  onChange={(event) => setGlassObject(event.target.value)}
                  placeholder="Or type a custom object (e.g., roses, chess pieces)"
                  className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600"
                />
              </div>
            )}
            <PromptEditor
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              credits={credits}
              cost={cost}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light text-white tracking-wide flex items-center gap-2">
              <Music className="h-4 w-4 text-zinc-400" />
              Presets
            </h2>
          </div>
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="grid gap-3 sm:grid-cols-2">
             {filteredPresets.map((preset) => (
               // We inline the grid logic here since PresetGrid forces 3 cols which is too wide for sidebar
                <div 
                  key={preset.id} 
                  onClick={() => handleSelectPreset(preset)}
                  className={`
                    cursor-pointer rounded-lg border p-3 transition-all duration-300 group
                    ${selectedPreset?.id === preset.id 
                      ? 'bg-white/10 border-white ring-1 ring-white' 
                      : 'bg-zinc-900/40 border-white/5 hover:bg-white/5 hover:border-white/10'}
                  `}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-md border border-white/5 mb-3">
                    <img src={preset.image} alt={preset.name} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className={`font-medium text-sm ${selectedPreset?.id === preset.id ? 'text-white' : 'text-zinc-300'}`}>{preset.name}</h3>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Stage */}
      <div className="hidden lg:flex lg:col-span-7 h-full rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm relative flex-col items-center justify-center p-8 text-center overflow-hidden">
        {/* Background Ambient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 to-transparent pointer-events-none" />
        
        {status === 'idle' && !outputUrl ? (
          <div className="max-w-md space-y-4 relative z-10">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
              <Sparkles className="h-10 w-10 text-white/50" />
            </div>
            <h3 className="text-xl font-light text-white tracking-wide">Ready to Imagine</h3>
            <p className="text-zinc-500 font-light">
              Enter a prompt or select a preset to generate a high-fidelity ASMR video. The result will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col relative z-10">
             <GenerationOutput status={status} outputUrl={outputUrl} error={error} minimal={true} />
          </div>
        )}
      </div>

      {/* Mobile-only Output (appears below controls on small screens) */}
      <div className="lg:hidden">
         <GenerationOutput status={status} outputUrl={outputUrl} error={error} />
      </div>
    </div>
  )
}
