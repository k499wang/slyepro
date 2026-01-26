'use client'

/**
 * Generic Generation Hook
 *
 * This hook handles the generation lifecycle for ANY niche type.
 * It manages state, API calls, and polling automatically.
 *
 * Usage:
 * ```tsx
 * function MyGeneratorPage() {
 *   const { status, outputUrl, error, isGenerating, start } = useGeneration('asmr_video')
 *
 *   const handleGenerate = () => {
 *     start({ prompt: 'My prompt', options: { aspectRatio: '16:9' } })
 *   }
 * }
 * ```
 */

import { useCallback, useEffect, useState } from 'react'
import type { GenerationType, GenerationOptions } from '@/types'

type Status = 'idle' | 'processing' | 'completed' | 'failed'

type StartInput<T extends GenerationType> = {
  prompt: string
  options?: GenerationOptions<T>
}

type GenerationState = {
  id: string | null
  status: Status
  outputUrl: string | null
  error: string | null
  isGenerating: boolean
}

type StartResponse = {
  id: string
}

type StatusResponse = {
  status?: string
  output_url?: string | null
  error_message?: string | null
}

const DEFAULT_STATE: GenerationState = {
  id: null,
  status: 'idle',
  outputUrl: null,
  error: null,
  isGenerating: false,
}

const POLL_INTERVAL_MS = 4000

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

const getErrorMessage = (value: unknown): string | null => {
  if (!isRecord(value)) return null
  return typeof value.error === 'string' ? value.error : null
}

const parseStartResponse = (value: unknown): StartResponse | null => {
  if (!isRecord(value)) return null
  return typeof value.id === 'string' ? { id: value.id } : null
}

const parseStatusResponse = (value: unknown): StatusResponse | null => {
  if (!isRecord(value)) return null
  return {
    status: typeof value.status === 'string' ? value.status : undefined,
    output_url:
      typeof value.output_url === 'string' || value.output_url === null
        ? value.output_url
        : undefined,
    error_message:
      typeof value.error_message === 'string' || value.error_message === null
        ? value.error_message
        : undefined,
  }
}

const normalizeStatus = (status?: string): Status =>
  status === 'completed'
    ? 'completed'
    : status === 'failed'
      ? 'failed'
      : status
        ? 'processing'
        : 'idle'

/**
 * Hook for managing generation lifecycle.
 *
 * @param type - The generation type (niche) to use
 * @returns Generation state and control functions
 */
export function useGeneration<T extends GenerationType>(type: T) {
  const [state, setState] = useState<GenerationState>(DEFAULT_STATE)

  const start = useCallback(
    async ({ prompt, options }: StartInput<T>) => {
      setState({ ...DEFAULT_STATE, status: 'processing', isGenerating: true })

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt, ...options }),
      })

      const payload = await readJson(response)

      if (!response.ok) {
        setState({
          ...DEFAULT_STATE,
          status: 'failed',
          error: getErrorMessage(payload) || 'Failed to start generation.',
        })
        return
      }

      const data = parseStartResponse(payload)
      if (!data) {
        setState({
          ...DEFAULT_STATE,
          status: 'failed',
          error: 'Unexpected response from server.',
        })
        return
      }
      setState((prev) => ({ ...prev, id: data.id }))
    },
    [type]
  )

  const reset = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  useEffect(() => {
    if (!state.id || state.status === 'completed' || state.status === 'failed') return

    let active = true
    let timeoutId: ReturnType<typeof setTimeout>

    const poll = async () => {
      const response = await fetch(`/api/generations/${state.id}`)

      const payload = await readJson(response)

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - retry with longer delay
          if (active) timeoutId = setTimeout(poll, POLL_INTERVAL_MS * 2)
          return
        }
        if (!active) return
        setState({
          ...DEFAULT_STATE,
          status: 'failed',
          error: getErrorMessage(payload) || 'Failed to fetch status.',
        })
        return
      }

      const data = parseStatusResponse(payload)

      if (!active) return
      if (!data) {
        setState({
          ...DEFAULT_STATE,
          status: 'failed',
          error: 'Unexpected status response.',
        })
        return
      }

      const nextStatus = normalizeStatus(data.status)
      setState((prev) => ({
        ...prev,
        status: nextStatus,
        outputUrl: data.output_url ?? prev.outputUrl,
        error: data.error_message ?? prev.error,
        isGenerating: nextStatus === 'processing',
      }))

      if (active && nextStatus === 'processing') {
        timeoutId = setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    timeoutId = setTimeout(poll, POLL_INTERVAL_MS)

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [state.id, state.status])

  return { ...state, start, reset, type }
}

/**
 * Legacy hook for ASMR generation.
 * @deprecated Use useGeneration('asmr_video') instead
 */
export function useAsmrGeneration() {
  return useGeneration('asmr_video')
}
