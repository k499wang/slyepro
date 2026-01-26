'use client'

import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

type Generation = {
  id: string
  prompt: string
  status: GenerationStatus
  output_url: string | null
  created_at: string
  type: string
}

type HistoryTableProps = {
  generations: Generation[]
}

const statusStyles: Record<GenerationStatus, string> = {
  pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  processing: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  failed: 'bg-red-500/10 text-red-300 border-red-500/20',
}

const typeLabels: Record<string, string> = {
  asmr_video: 'ASMR',
  general: 'General',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function HistoryTable({ generations }: HistoryTableProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/30 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900/50 border-b border-white/5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        <div className="col-span-5 sm:col-span-6">Prompt</div>
        <div className="col-span-2 hidden sm:block">Type</div>
        <div className="col-span-3 sm:col-span-2">Status</div>
        <div className="col-span-4 sm:col-span-2 text-right">Action</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Prompt */}
            <div className="col-span-5 sm:col-span-6">
              <p className="text-sm text-zinc-300 line-clamp-2 font-light">
                {generation.prompt}
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                {formatDate(generation.created_at)}
              </p>
            </div>

            {/* Type */}
            <div className="col-span-2 hidden sm:block">
              <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">
                {typeLabels[generation.type] || generation.type}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-3 sm:col-span-2">
              <Badge className={`text-xs border ${statusStyles[generation.status]}`}>
                {generation.status}
              </Badge>
            </div>

            {/* Action */}
            <div className="col-span-4 sm:col-span-2 text-right">
              {generation.output_url ? (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <a href={generation.output_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    View
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-zinc-600">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
