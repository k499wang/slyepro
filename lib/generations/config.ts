/**
 * Generation Configuration System
 *
 * This file is the SINGLE SOURCE OF TRUTH for all generation types (niches).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO ADD A NEW NICHE:                                                 │
 * │                                                                         │
 * │ 1. Add the niche type to GenerationType in types/index.ts               │
 * │ 2. Add a config entry in GENERATION_CONFIGS below                       │
 * │ 3. (Optional) Create a preset file in data/presets-{niche}.ts           │
 * │ 4. Create a page at app/dashboard/generate/{niche}/page.tsx             │
 * │                                                                         │
 * │ That's it! The generation service, API routes, and hooks will all       │
 * │ automatically work with your new niche.                                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import type { BackendName } from '@/lib/ai-backends'
import type { GenerationOptions, GenerationType, AspectRatio } from '@/types'
import { ASPECT_RATIOS } from '@/types'

type FieldOption = { value: string; label: string }
type FieldValue = string | number | boolean

export type NicheConfig<T extends GenerationType = GenerationType> = {
  /** Which AI backend to use */
  backend: BackendName

  /** The model identifier to pass to the backend */
  model: string

  /** Credit cost per generation */
  creditCost: number

  /** Human-readable name for UI */
  displayName: string

  /** Short description for UI */
  description: string

  /** Default options passed to the backend */
  defaultOptions: GenerationOptions<T>

  /** Fields that users can customize (for UI generation) */
  customizableFields?: CustomizableField[]
}

/**
 * Describes a field that users can customize in the UI.
 * Used to auto-generate option forms for each niche.
 */
export type CustomizableField = {
  key: string
  label: string
  type: 'select' | 'number' | 'text' | 'boolean'
  options?: FieldOption[]
  default?: FieldValue
  min?: number
  max?: number
}

type GenerationConfigMap = { [K in GenerationType]: NicheConfig<K> }

const DEFAULT_ASPECT_RATIO: AspectRatio = '9:16'

/**
 * All generation configurations.
 *
 * To add a new niche, add an entry here. The key must match a GenerationType.
 */
export const GENERATION_CONFIGS: GenerationConfigMap = {
  asmr_video: {
    backend: 'kie',
    model: 'grok-imagine/text-to-video',
    creditCost: 5,
    displayName: 'ASMR Video',
    description: 'Generate satisfying ASMR videos with ambient sounds',
    defaultOptions: {
      aspectRatio: DEFAULT_ASPECT_RATIO,
      mode: 'normal',
    },
    customizableFields: [
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        options: ASPECT_RATIOS.map((r) => ({ value: r, label: r })),
        default: DEFAULT_ASPECT_RATIO,
      },
    ],
  },
  general: {
    backend: 'kie',
    model: 'grok-imagine/text-to-video',
    creditCost: 5,
    displayName: 'General Video',
    description: 'Generate videos from any text prompt',
    defaultOptions: {
      aspectRatio: DEFAULT_ASPECT_RATIO,
    },
    customizableFields: [
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        options: ASPECT_RATIOS.map((r) => ({ value: r, label: r })),
        default: DEFAULT_ASPECT_RATIO,
      },
    ],
  },
}

/**
 * Get the configuration for a generation type.
 * Throws if the type doesn't exist.
 */
export function getNicheConfig<T extends GenerationType>(
  type: T
): NicheConfig<T> {
  const config = GENERATION_CONFIGS[type]
  if (!config) {
    throw new Error(`Unknown generation type: ${type}`)
  }
  return config
}

/**
 * Get the credit cost for a generation type.
 */
export function getCreditCost(type: GenerationType): number {
  return getNicheConfig(type).creditCost
}

/**
 * Get all available generation types.
 */
export function getAvailableTypes(): GenerationType[] {
  return Object.keys(GENERATION_CONFIGS).filter(isValidType)
}

/**
 * Check if a generation type is configured.
 */
export function isValidType(type: string): type is GenerationType {
  return type in GENERATION_CONFIGS
}
