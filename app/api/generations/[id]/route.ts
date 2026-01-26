/**
 * GET /api/generations/[id]
 *
 * Fetch the status of a generation, syncing with the AI backend if needed.
 *
 * This endpoint works for ALL generation types - it reads the backend
 * from the generation's metadata and uses the appropriate client.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncGenerationStatus, GenerationError } from '@/lib/generations'
import { BackendRateLimitError } from '@/lib/ai-backends'

type RouteParams = { params: Promise<{ id: string }> }

const jsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status })

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params

  // Authenticate
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const generation = await syncGenerationStatus(id, authData.user.id)

    if (!generation) {
      return jsonError('Generation not found.', 404)
    }

    return NextResponse.json(generation)
  } catch (error) {
    if (error instanceof BackendRateLimitError) {
      return jsonError('Service rate limited. Retry shortly.', 429)
    }
    if (error instanceof GenerationError) {
      return jsonError(error.message, error.status)
    }
    console.error('Generation status error:', error)
    return jsonError('Failed to fetch generation status.', 502)
  }
}
