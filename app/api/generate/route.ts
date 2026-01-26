/**
 * POST /api/generate
 *
 * Request body:
 * {
 *   type: string           // Generation type (e.g., 'asmr_video')
 *   prompt: string         // The generation prompt
 *   aspectRatio?: string   // '9:16' | '16:9' | '1:1'
 * }
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startGeneration, GenerationError, isValidType } from '@/lib/generations'
import { ASPECT_RATIOS, type AspectRatio } from '@/types'

export const runtime = 'nodejs'

type GenerateRequestBody = {
  type?: string
  prompt?: string
  aspectRatio?: string
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseGenerateBody = (value: unknown): GenerateRequestBody | null => {
  if (!isRecord(value)) return null

  return {
    type: typeof value.type === 'string' ? value.type : undefined,
    prompt: typeof value.prompt === 'string' ? value.prompt : undefined,
    aspectRatio:
      typeof value.aspectRatio === 'string' ? value.aspectRatio : undefined,
  }
}

const isAspectRatio = (value: string): value is AspectRatio =>
  ASPECT_RATIOS.some((ratio) => ratio === value)

export async function POST(request: Request) {
  // Authenticate
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return jsonError('Unauthorized', 401)
  }

  // Parse body
  try {
    const payload = await request.json()
    const body = parseGenerateBody(payload)
    if (!body) {
      return jsonError('Invalid JSON body.')
    }
    // Validate type
    const type = body.type?.trim() ?? ''
    if (!isValidType(type)) {
      return jsonError(`Invalid generation type: ${type}`)
    }

    // Validate prompt
    const prompt = body.prompt?.trim() ?? ''
    if (!prompt) {
      return jsonError('Prompt is required.')
    }

    // Validate aspectRatio (optional)
    let aspectRatio: AspectRatio | undefined
    if (body.aspectRatio !== undefined) {
      if (!isAspectRatio(body.aspectRatio)) {
        return jsonError(
          `Invalid aspectRatio. Must be one of: ${ASPECT_RATIOS.join(', ')}`
        )
      }
      aspectRatio = body.aspectRatio
    }

    try {
      const result = await startGeneration({
        userId: authData.user.id,
        type,
        prompt,
        options: aspectRatio ? { aspectRatio } : undefined,
      })
      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof GenerationError) {
        return jsonError(error.message, error.status)
      }
      console.error('Generation error:', error)
      return jsonError('Failed to start generation.', 500)
    }
  } catch {
    return jsonError('Invalid JSON body.')
  }
}
