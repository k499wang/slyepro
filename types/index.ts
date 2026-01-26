/**
 * Core Type Definitions
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ADDING A NEW GENERATION TYPE (NICHE):                                   │
 * │                                                                         │
 * │ 1. Add your type to the GenerationType union below                      │
 * │ 2. Add a config in lib/generations/config.ts                            │
 * │ 3. That's it! The rest of the system handles it automatically.          │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

/**
 * All available generation types.
 *
 * To add a new niche, add it here AND in lib/generations/config.ts
 */
export type GenerationType = 'asmr_video'
// Add new types here when needed:
// | 'slideshow'
// | 'podcast'

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Valid aspect ratios for video generation.
 * Must match what Kie.ai API accepts.
 */
export const ASPECT_RATIOS = ['9:16', '16:9', '1:1'] as const
export type AspectRatio = (typeof ASPECT_RATIOS)[number]

/**
 * Options for ASMR video generation.
 */
export type AsmrVideoMode = 'normal'

export type AsmrVideoOptions = {
  aspectRatio?: AspectRatio
  mode?: AsmrVideoMode
}

/**
 * Map of generation type to its options type.
 * Add new option interfaces here when adding niches.
 */
export type GenerationOptionsMap = {
  asmr_video: AsmrVideoOptions
}

/**
 * Get the options type for a specific generation type.
 */
export type GenerationOptions<T extends GenerationType> = GenerationOptionsMap[T]

export type AnyGenerationOptions = GenerationOptionsMap[GenerationType]

export type UserSummary = {
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export type GenerationMetadata = {
  taskId?: string
  kieTaskId?: string
  model?: string
  backend?: string
} & AnyGenerationOptions

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  credits: number
  created_at: string
  updated_at: string
}

export type Generation = {
  id: string
  user_id: string
  type: GenerationType
  prompt: string
  input_image_url: string | null
  output_url: string | null
  status: GenerationStatus
  credits_used: number
  error_message: string | null
  /**
   * Flexible metadata storage for type-specific data.
   * Common fields:
   * - taskId: string     - External API task ID
   * - model: string      - AI model used
   * - backend: string    - Which backend (kie, replicate, etc.)
   * - aspectRatio: string
   * - mode: string
   */
  metadata: GenerationMetadata
  created_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'usage' | 'bonus' | 'refund'
  description: string | null
  stripe_payment_id: string | null
  generation_id: string | null
  created_at: string
}

/**
 * Preset for quick generation with pre-filled prompts.
 * Each niche can have its own set of presets.
 */
export type Preset = {
  id: string
  name: string
  description: string
  prompt: string
  category: PresetCategory
  image: string
  credits: number
  generationType?: GenerationType
}

/**
 * Preset categories for ASMR videos.
 * You can create similar category types for other niches.
 */
export type PresetCategory =
  | 'satisfying'
  | 'nature'
  | 'food'
  | 'relaxation'
  | 'crafts'
