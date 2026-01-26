'use client'

import { PresetCard } from './preset-card'
import type { Preset } from '@/types'

type PresetGridProps = {
  presets: Preset[]
  selectedPreset: Preset | null
  onSelectPreset: (preset: Preset) => void
}

export function PresetGrid({
  presets,
  selectedPreset,
  onSelectPreset,
}: PresetGridProps) {
  if (presets.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No presets found for this category.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          selected={selectedPreset?.id === preset.id}
          onSelect={onSelectPreset}
        />
      ))}
    </div>
  )
}
