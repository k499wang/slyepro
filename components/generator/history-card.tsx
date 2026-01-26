import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

type HistoryCardProps = {
  prompt: string
  status: GenerationStatus
  createdAt: string
  outputUrl: string | null
}

const statusStyles: Record<GenerationStatus, string> = {
  pending: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20',
  processing: 'bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20',
  failed: 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20',
}

export function HistoryCard({
  prompt,
  status,
  createdAt,
  outputUrl,
}: HistoryCardProps) {
  const dateLabel = new Date(createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="bg-white/5 border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/10 group">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm text-zinc-400 font-normal">{dateLabel}</CardTitle>
          <Badge className={`backdrop-blur-sm shadow-none ${statusStyles[status]}`}>{status}</Badge>
        </div>
        <p className="text-sm text-zinc-300 line-clamp-2 font-light leading-relaxed group-hover:text-white transition-colors">{prompt}</p>
      </CardHeader>
      <CardContent>
        {outputUrl ? (
          <video
            className="w-full rounded-lg border border-white/10 shadow-lg"
            controls
            src={outputUrl}
          />
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5 py-12 text-xs text-zinc-500 font-light tracking-wide">
            Output not ready
          </div>
        )}
      </CardContent>
    </Card>
  )
}
