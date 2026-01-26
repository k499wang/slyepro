import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type GenerationOutputProps = {
  status: 'idle' | 'processing' | 'completed' | 'failed'
  outputUrl: string | null
  error: string | null
  minimal?: boolean
}

export function GenerationOutput({
  status,
  outputUrl,
  error,
  minimal = false,
}: GenerationOutputProps) {
  if (status === 'idle' && !error && !outputUrl) {
    return null
  }

  const message =
    status === 'processing'
      ? 'Generating your ASMR video...'
      : status === 'completed'
        ? 'Generation complete.'
        : status === 'failed'
          ? error || 'Generation failed.'
          : 'Preparing generation.'

  const content = (
    <div className="space-y-4 w-full h-full flex flex-col justify-center">
       {!minimal && (
          <h3 className="text-lg font-light tracking-wide text-white mb-2">Generation Status</h3>
       )}
        <p className={cn("text-center", status === 'failed' ? 'text-red-400' : 'text-zinc-300 font-light')}>
          {message}
        </p>
        {outputUrl ? (
          <video
            className="w-full max-h-[60vh] object-contain rounded-lg border border-white/10 shadow-2xl bg-black"
            controls
            src={outputUrl}
            autoPlay
          />
        ) : null}
    </div>
  )

  if (minimal) {
    return content
  }

  return (
    <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white font-light tracking-wide">Generation Status</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  )
}
