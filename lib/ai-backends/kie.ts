/**
 * Kie.ai Backend Implementation
 *
 * This implements the AIBackend interface for Kie.ai's API.
 * Used for text-to-video generation (ASMR videos, etc.)
 */

import type {
  AIBackend,
  TaskInput,
  TaskStatus,
  CreateTaskResult,
  TaskState,
} from './types'
import { BackendRateLimitError, BackendError } from './types'

const KIE_BASE_URL = 'https://api.kie.ai'

type KieCreateTaskResponse = {
  code: number
  msg: string
  data?: { taskId?: string }
}

type KieRecordInfoResponse = {
  code: number
  msg: string
  data?: {
    state?: string
    resultJson?: string
    failMsg?: string
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function getApiKey(): string {
  const apiKey = process.env.KIE_API_KEY
  if (!apiKey) {
    throw new BackendError('kie', 'Missing KIE_API_KEY', 500)
  }
  return apiKey
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function parseCreateTaskResponse(value: unknown): KieCreateTaskResponse | null {
  if (!isRecord(value)) return null
  if (typeof value.code !== 'number' || typeof value.msg !== 'string') return null

  const data = isRecord(value.data) ? value.data : undefined
  const taskId = typeof data?.taskId === 'string' ? data.taskId : undefined

  return {
    code: value.code,
    msg: value.msg,
    data: taskId ? { taskId } : undefined,
  }
}

function parseRecordInfoResponse(value: unknown): KieRecordInfoResponse | null {
  if (!isRecord(value)) return null
  if (typeof value.code !== 'number' || typeof value.msg !== 'string') return null

  const data = isRecord(value.data) ? value.data : undefined
  const state = typeof data?.state === 'string' ? data.state : undefined
  const resultJson = typeof data?.resultJson === 'string' ? data.resultJson : undefined
  const failMsg = typeof data?.failMsg === 'string' ? data.failMsg : undefined

  return {
    code: value.code,
    msg: value.msg,
    data: data
      ? {
          state,
          resultJson,
          failMsg,
        }
      : undefined,
  }
}

async function parseErrorMessage(response: Response): Promise<string | null> {
  const payload = await readJson(response)
  if (!isRecord(payload)) return null
  return typeof payload.msg === 'string' ? payload.msg : null
}

function mapKieState(state?: string): TaskState {
  const value =
    typeof state === 'string' ? state.toLowerCase() : 'waiting'
  if (value === 'success') return 'completed'
  if (value === 'fail') return 'failed'
  if (value === 'generating') return 'processing'
  return 'pending'
}

function parseResultUrl(resultJson?: string): string | null {
  if (typeof resultJson !== 'string') return null
  try {
    const parsed = JSON.parse(resultJson)
    if (!isRecord(parsed)) return null
    const urls = parsed.resultUrls
    if (!Array.isArray(urls)) return null
    return typeof urls[0] === 'string' ? urls[0] : null
  } catch {
    return null
  }
}

export const kieBackend: AIBackend = {
  name: 'kie',

  async createTask(input: TaskInput): Promise<CreateTaskResult> {
    const apiKey = getApiKey()
    const { prompt, model, options } = input

    const response = await fetch(`${KIE_BASE_URL}/api/v1/jobs/createTask`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: {
          prompt,
          aspect_ratio: options?.aspectRatio ?? '9:16',
          mode: options?.mode ?? 'normal',
        },
        callBackUrl: options?.callbackUrl,
      }),
    })

    if (!response.ok) {
      const message = await parseErrorMessage(response)
      if (response.status === 429) {
        throw new BackendRateLimitError('kie', message || undefined)
      }
      throw new BackendError('kie', message || 'KIE request failed')
    }

    const payload = await readJson(response)
    const data = parseCreateTaskResponse(payload)
    if (!data) {
      throw new BackendError('kie', 'Invalid KIE response')
    }
    if (data.code !== 200 || !data.data?.taskId) {
      throw new BackendError('kie', data.msg || 'KIE task error')
    }

    return { taskId: data.data.taskId }
  },

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const apiKey = getApiKey()

    const response = await fetch(
      `${KIE_BASE_URL}/api/v1/jobs/recordInfo?taskId=${taskId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )

    if (!response.ok) {
      const message = await parseErrorMessage(response)
      if (response.status === 429) {
        throw new BackendRateLimitError('kie', message || undefined)
      }
      throw new BackendError('kie', message || 'KIE status request failed')
    }

    const payload = await readJson(response)
    const data = parseRecordInfoResponse(payload)
    if (!data) {
      throw new BackendError('kie', 'Invalid KIE status response')
    }
    if (data.code !== 200) {
      throw new BackendError('kie', data.msg || 'KIE status error')
    }

    const state = mapKieState(data.data?.state)
    const outputUrl = state === 'completed' ? parseResultUrl(data.data?.resultJson) : null
    const error = state === 'failed' ? (data.data?.failMsg || 'Generation failed') : null

    const rawResponse = data.data
      ? {
          state: data.data.state ?? null,
          resultJson: data.data.resultJson ?? null,
          failMsg: data.data.failMsg ?? null,
        }
      : null

    return {
      state,
      outputUrl,
      error,
      rawResponse,
    }
  },
}
