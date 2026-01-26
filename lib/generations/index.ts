/**
 * Generations Module
 *
 * This module exports everything needed for content generation.
 *
 * Usage:
 * ```ts
 * import { startGeneration, getNicheConfig, GenerationError } from '@/lib/generations'
 *
 * const result = await startGeneration({
 *   userId: 'user-123',
 *   type: 'asmr_video',
 *   prompt: 'Satisfying soap cutting',
 * })
 * ```
 */

// Core service functions
export {
  startGeneration,
  syncGenerationStatus,
  GenerationError,
  type StartGenerationInput,
  type StartGenerationResult,
} from './service'

// Configuration
export {
  getNicheConfig,
  getCreditCost,
  getAvailableTypes,
  isValidType,
  GENERATION_CONFIGS,
  type NicheConfig,
  type CustomizableField,
} from './config'

// Legacy export for backwards compatibility
// TODO: Remove after migrating all usages
export { startAsmrGeneration } from './asmr'
export type { StartAsmrInput, StartAsmrResult } from './asmr'
