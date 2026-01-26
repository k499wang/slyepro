/**
 * Generic Generation Service
 *
 * This service handles the generation lifecycle for ALL niches.
 * It uses the niche config to determine which backend and settings to use.
 *
 * You should NOT need to modify this file when adding new niches.
 * Instead, add your niche configuration to config.ts.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { getBackend, BackendRateLimitError, hasBackend } from '@/lib/ai-backends'
import { getNicheConfig } from './config'
import type { GenerationStatus, GenerationType, GenerationOptions } from '@/types'

/**
 * Input for starting a generation.
 */
export type StartGenerationInput<T extends GenerationType = GenerationType> = {
  userId: string
  type: T
  prompt: string
  options?: GenerationOptions<T>
}


/**
 * Result from starting a generation.
 */
export type StartGenerationResult = {
  id: string
  taskId: string
  status: 'processing'
}

type GenerationUpdate = {
  status: GenerationStatus
  output_url?: string | null
  error_message?: string | null
}

type GenerationMetadataFields = {
  taskId?: string
  kieTaskId?: string
  backend?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readMetadata = (value: unknown): GenerationMetadataFields => {
  if (!isRecord(value)) return {}

  return {
    taskId: typeof value.taskId === 'string' ? value.taskId : undefined,
    kieTaskId: typeof value.kieTaskId === 'string' ? value.kieTaskId : undefined,
    backend: typeof value.backend === 'string' ? value.backend : undefined,
  }
}

/**
 * Custom error class for generation failures.
 */
export class GenerationError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.status = status
    this.name = 'GenerationError'
  }
}

/**
 * Start a generation of any type.
 *
 * This function:
 * 1. Validates the user has enough credits
 * 2. Creates a database record
 * 3. Deducts credits
 * 4. Submits the task to the appropriate AI backend
 * 5. Handles errors with automatic refunds
 *
 * Note: Options should be validated before calling this function.
 */
export async function startGeneration<T extends GenerationType>({
  userId,
  type,
  prompt,
  options,
}: StartGenerationInput<T>): Promise<StartGenerationResult> {

  // Get the niche configuration
  const config = getNicheConfig(type)
  const backend = getBackend(config.backend)

  // Merge default options with user options
  const mergedOptions = { ...config.defaultOptions, ...(options ?? {}) }

  // Initialize admin client
  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    throw new GenerationError('Server configuration error.', 500)
  }

  // Check user credits
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (profileError) {
    throw new GenerationError('Unable to load credits.', 500)
  }

  const currentCredits = profile?.credits ?? 0
  if (currentCredits < config.creditCost) {
    throw new GenerationError('Insufficient credits.', 402)
  }

  // Create generation record
  const { data: generation, error: genError } = await admin
    .from('generations')
    .insert({
      user_id: userId,
      type,
      prompt,
      status: 'pending',
      credits_used: config.creditCost,
      metadata: {
        model: config.model,
        backend: config.backend,
        ...mergedOptions,
      },
    })
    .select('id')
    .single()

  if (genError || !generation) {
    throw new GenerationError('Failed to create generation.', 500)
  }

  // Deduct credits
  const { error: creditError } = await admin
    .from('profiles')
    .update({ credits: currentCredits - config.creditCost })
    .eq('id', userId)

  if (creditError) {
    await admin
      .from('generations')
      .update({ status: 'failed', error_message: 'Credit update failed.' })
      .eq('id', generation.id)
    throw new GenerationError('Credit update failed.', 500)
  }

  // Log transaction
  await admin.from('credit_transactions').insert({
    user_id: userId,
    amount: -config.creditCost,
    type: 'usage',
    description: `${config.displayName} generation`,
    generation_id: generation.id,
  })

  // Submit to AI backend
  try {
    const { taskId } = await backend.createTask({
      prompt,
      model: config.model,
      options: mergedOptions,
    })

    // Update generation with task ID
    await admin
      .from('generations')
      .update({
        status: 'processing',
        metadata: {
          taskId,
          model: config.model,
          backend: config.backend,
          ...mergedOptions,
        },
      })
      .eq('id', generation.id)

    return { id: generation.id, taskId, status: 'processing' }
  } catch (error) {
    // Handle backend failure - refund credits
    const message = error instanceof Error ? error.message : 'Backend error'
    const isRateLimit = error instanceof BackendRateLimitError

    await admin
      .from('generations')
      .update({ status: 'failed', error_message: message })
      .eq('id', generation.id)

    // Refund credits
    await admin
      .from('profiles')
      .update({ credits: currentCredits })
      .eq('id', userId)

    await admin.from('credit_transactions').insert({
      user_id: userId,
      amount: config.creditCost,
      type: 'refund',
      description: `${config.displayName} generation failed`,
      generation_id: generation.id,
    })

    throw new GenerationError(
      isRateLimit ? 'Service rate limited. Please retry.' : 'Failed to start generation.',
      isRateLimit ? 429 : 500
    )
  }
}

/**
 * Check the status of a generation and update the database if needed.
 *
 * This is called by the polling endpoint to sync with the AI backend.
 */
export async function syncGenerationStatus(
  generationId: string,
  userId: string
): Promise<{
  id: string
  status: GenerationStatus
  output_url: string | null
  error_message: string | null
} | null> {
  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    throw new GenerationError('Server configuration error.', 500)
  }

  // Fetch generation
  const { data: generation, error } = await admin
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .eq('user_id', userId)
    .single()

  if (error || !generation) {
    return null
  }

  // If already terminal, return as-is
  if (generation.status === 'completed' || generation.status === 'failed') {
    return generation
  }

  // Get task ID from metadata
  const metadata = readMetadata(generation.metadata)
  const taskId = metadata.taskId ?? metadata.kieTaskId

  if (!taskId) {
    return generation
  }

  // Determine which backend to use
  const backendName =
    metadata.backend && hasBackend(metadata.backend) ? metadata.backend : 'kie'
  const backend = getBackend(backendName)

  // Fetch status from backend
  const taskStatus = await backend.getTaskStatus(taskId)

  // Build update object
  const update: GenerationUpdate = { status: taskStatus.state }

  if (taskStatus.state === 'failed') {
    update.error_message = taskStatus.error || 'Generation failed.'
  }

  if (taskStatus.outputUrl) {
    update.output_url = taskStatus.outputUrl
  }

  // Handle completed but missing output
  if (taskStatus.state === 'completed' && !taskStatus.outputUrl) {
    update.status = 'failed'
    update.error_message = 'Missing output from backend.'
  }

  // Skip update if nothing changed
  if (taskStatus.state === generation.status && !update.output_url) {
    return generation
  }

  // Update database
  const { data: updated, error: updateError } = await admin
    .from('generations')
    .update(update)
    .eq('id', generation.id)
    .select('*')
    .single()

  if (updateError || !updated) {
    throw new GenerationError('Failed to update generation.', 500)
  }

  return updated
}
