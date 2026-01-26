'use client'

import Image from 'next/image'
import { Coins } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Preset } from '@/types'

type PresetCardProps = {
  preset: Preset
  selected?: boolean
  onSelect: (preset: Preset) => void
}

export function PresetCard({ preset, selected, onSelect }: PresetCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 bg-white/5 border-white/5 backdrop-blur-sm group',
        selected 
          ? 'border-white ring-1 ring-white bg-white/10' 
          : 'hover:bg-white/10 hover:border-white/20'
      )}
      onClick={() => onSelect(preset)}
    >
      <CardContent className="p-4 space-y-3">
        <div className={cn(
          "overflow-hidden rounded-lg border transition-colors",
          selected ? "border-white/20" : "border-white/5 group-hover:border-white/10"
        )}>
          <Image
            src={preset.image}
            alt={preset.name}
            width={800}
            height={600}
            className="h-32 w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={cn("font-medium mb-1 transition-colors", selected ? "text-white" : "text-zinc-200")}>{preset.name}</h3>
            <p className="text-sm text-zinc-500 line-clamp-2 font-light">
              {preset.description}
            </p>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-zinc-300 border border-white/5">
            <Coins className="h-3 w-3 mr-1" />
            {preset.credits}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
