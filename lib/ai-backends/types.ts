/**
 * AI Backend Interface Types
 *
 * These types define the contract that all AI backends must implement.
 * To add a new backend (e.g., Replicate, Runway), create a new file that
 * implements the AIBackend interface.
 */

import type { GenerationOptionsMap, GenerationType } from '@/types'

export type TaskState = 'pending' | 'processing' | 'completed' | 'failed'

export type TaskOptions = GenerationOptionsMap[GenerationType] & {
  callbackUrl?: string
}

export type TaskInput = {
  prompt: string
  model: string
  options?: TaskOptions
}

export type RawBackendResponse = Record<
  string,
  string | number | boolean | null | undefined
>

export type TaskStatus = {
  state: TaskState
  outputUrl?: string | null
  error?: string | null
  rawResponse?: RawBackendResponse | null
}

export type CreateTaskResult = {
  taskId: string
}

/**
 * Interface that all AI backends must implement.
 *
 * Example usage:
 * ```ts
 * const backend = getBackend('kie')
 * const { taskId } = await backend.createTask({ prompt, model, options })
 * const status = await backend.getTaskStatus(taskId)
 * ```
 */
export type AIBackend = {
  /** Unique identifier for this backend */
  readonly name: string

  /** Submit a new generation task */
  createTask(input: TaskInput): Promise<CreateTaskResult>

  /** Check the status of an existing task */
  getTaskStatus(taskId: string): Promise<TaskStatus>
}

/**
 * Error thrown when a backend encounters a rate limit.
 * Callers should implement retry logic with backoff.
 */
export class BackendRateLimitError extends Error {
  readonly status = 429
  readonly backend: string

  constructor(backend: string, message?: string) {
    super(message || `${backend} rate limited`)
    this.backend = backend
    this.name = 'BackendRateLimitError'
  }
}

/**
 * Error thrown for general backend failures.
 */
export class BackendError extends Error {
  readonly status: number
  readonly backend: string

  constructor(backend: string, message: string, status = 500) {
    super(message)
    this.backend = backend
    this.status = status
    this.name = 'BackendError'
  }
}
