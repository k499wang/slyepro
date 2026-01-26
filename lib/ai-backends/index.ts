/**
 * AI Backends Module
 *
 * This module provides a registry of AI backends and a factory function
 * to get the appropriate backend for a generation type.
 *
 * To add a new backend:
 * 1. Create a new file (e.g., replicate.ts) implementing AIBackend
 * 2. Import and register it in the BACKENDS map below
 * 3. Reference it in your niche config
 */

import type { AIBackend } from './types'
import { kieBackend } from './kie'

export type BackendName = 'kie' // Add new backends here: | 'replicate' | 'runway'

/**
 * Registry of all available backends.
 * Add new backends here after implementing them.
 */
const BACKENDS: Record<BackendName, AIBackend> = {
  kie: kieBackend,
  // replicate: replicateBackend,
  // runway: runwayBackend,
}

/**
 * Get a backend by name.
 * Throws if the backend doesn't exist.
 */
export function getBackend(name: BackendName): AIBackend {
  const backend = BACKENDS[name]
  if (!backend) {
    throw new Error(`Unknown backend: ${name}`)
  }
  return backend
}

/**
 * Check if a backend exists.
 */
export function hasBackend(name: string): name is BackendName {
  return name in BACKENDS
}

// Re-export types for convenience
export * from './types'
