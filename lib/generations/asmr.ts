/**
 * @deprecated This file is kept for backwards compatibility.
 *
 * Use the following instead:
 * - import { startGeneration } from '@/lib/generations'
 * - await startGeneration({ userId, type: 'asmr_video', prompt, options })
 */

import { startGeneration, GenerationError } from './service'
import type { StartGenerationInput, StartGenerationResult } from './service'

export { GenerationError }

export type StartAsmrInput = Omit<StartGenerationInput<'asmr_video'>, 'type'>

export type StartAsmrResult = StartGenerationResult

/**
 * @deprecated Use startGeneration({ type: 'asmr_video', ... }) instead
 */
export async function startAsmrGeneration({
  userId,
  prompt,
  options,
}: StartAsmrInput): Promise<StartAsmrResult> {
  return startGeneration({
    userId,
    type: 'asmr_video',
    prompt,
    options,
  })
}
