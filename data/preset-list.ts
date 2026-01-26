import type { Preset } from '@/types'
import { satisfyingPresets } from '@/data/presets-satisfying'
import { naturePresets } from '@/data/presets-nature'
import { foodPresets } from '@/data/presets-food'
import { relaxationPresets } from '@/data/presets-relaxation'
import { craftsPresets } from '@/data/presets-crafts'

export const presets: Preset[] = [
  ...satisfyingPresets,
  ...naturePresets,
  ...foodPresets,
  ...relaxationPresets,
  ...craftsPresets,
]
