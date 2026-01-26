'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

type PromptEditorProps = {
  prompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: () => void
  isGenerating: boolean
  credits: number
  cost: number
}

export function PromptEditor({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  credits,
  cost,
}: PromptEditorProps) {
  const canGenerate = prompt.trim().length > 0 && credits >= cost && !isGenerating

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="prompt" className="text-zinc-200 font-medium">
          Prompt
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe the ASMR video you want to create..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[140px] bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 resize-none focus:border-white/20 focus:ring-0 transition-all rounded-lg"
        />
        <p className="text-xs text-zinc-600 text-right font-mono">
          {prompt.length} chars
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <p className="text-sm text-zinc-500">
          Cost: <span className="text-zinc-200 font-medium">{cost} credits</span>
        </p>
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="bg-white text-black hover:bg-zinc-200 px-8 transition-all font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {credits < cost && (
        <p className="text-sm text-red-900/80 bg-red-950/30 p-2 rounded border border-red-900/50 text-center">
          Insufficient credits. You need {cost - credits} more credits.
        </p>
      )}
    </div>
  )
}
