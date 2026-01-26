'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Send, Sparkles, Loader2, Video, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ASPECT_RATIOS } from '@/types'
import type { AspectRatio } from '@/types'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  videoUrl?: string
  status?: 'generating' | 'completed' | 'failed'
  aspectRatio?: AspectRatio
  generationId?: string
}

type GenerationStatus = {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  output_url: string | null
  error_message: string | null
}

type ExampleRow = {
  id: string
  prompts: string[]
  duration: string
  direction: 'normal' | 'reverse'
}

const EXAMPLE_PROMPTS = [
  'Satisfying soap cutting with soft studio lighting',
  'Calming rain on window for sleep',
  'Cozy fireplace crackling ambiance',
  'Kinetic sand slicing with crisp audio',
  'Fluffy clouds passing over mountain peak',
  'Neon rain in a busy Tokyo street',
  'Macro view of golden honey dripping',
  'Paper folding origami timelapse',
  'Underwater coral reef life with bubbles',
  'Mechanical keyboard typing ASMR',
]

const rotatePrompts = (prompts: string[], offset: number): string[] => {
  if (prompts.length === 0) return prompts
  const safeOffset = ((offset % prompts.length) + prompts.length) % prompts.length
  return [...prompts.slice(safeOffset), ...prompts.slice(0, safeOffset)]
}

const EXAMPLE_ROWS: ExampleRow[] = [
  {
    id: 'row-1',
    prompts: EXAMPLE_PROMPTS,
    duration: '48s',
    direction: 'normal',
  },
  {
    id: 'row-2',
    prompts: rotatePrompts(EXAMPLE_PROMPTS, 3),
    duration: '60s',
    direction: 'reverse',
  },
  {
    id: 'row-3',
    prompts: rotatePrompts(EXAMPLE_PROMPTS, 6),
    duration: '54s',
    direction: 'normal',
  },
]

const POLL_INTERVAL = 3000

export function ChatGenerator() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  const pollGenerationStatus = useCallback((generationId: string, messageId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/generations/${generationId}`)
        if (!res.ok) return

        const data: GenerationStatus = await res.json()

        if (data.status === 'completed' && data.output_url) {
          // Stop polling
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    content: 'Your video is ready',
                    status: 'completed',
                    videoUrl: data.output_url ?? undefined,
                  }
                : msg
            )
          )
          setIsGenerating(false)
        } else if (data.status === 'failed') {
          // Stop polling
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    content: data.error_message || 'Generation failed. Please try again.',
                    status: 'failed',
                  }
                : msg
            )
          )
          setIsGenerating(false)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    // Start polling
    poll()
    pollingRef.current = setInterval(poll, POLL_INTERVAL)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const prompt = input.trim()
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    }

    const assistantMessageId = crypto.randomUUID()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: `Creating your ${aspectRatio} video`,
      status: 'generating',
      aspectRatio,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          prompt,
          aspectRatio,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to start generation')
      }

      const { id: generationId } = await res.json()

      // Update message with generation ID and start polling
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, generationId }
            : msg
        )
      )

      pollGenerationStatus(generationId, assistantMessageId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: errorMessage,
                status: 'failed',
              }
            : msg
        )
      )
      setIsGenerating(false)
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  const buildMarqueeStyle = (
    duration: string,
    direction: ExampleRow['direction']
  ): CSSProperties => ({
    animationDirection: direction,
    animationDuration: duration,
    animationIterationCount: 'infinite',
    animationName: 'marquee',
    animationTimingFunction: 'linear',
    willChange: 'transform',
  })

  return (
    <div className="relative rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Chat Messages Area */}
      <div className="relative h-[500px] overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar overflow-x-hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500 overflow-hidden relative">
            <h3 className="text-2xl font-light tracking-tight text-white mb-3 z-10">
              Imagine & Create
            </h3>
            <p className="text-zinc-400 font-light max-w-sm mb-10 text-base leading-relaxed z-10">
              Describe the video you want to create and our AI will bring it to life.
            </p>
            
            {/* Carousel Container */}
            <div className="w-full space-y-3 opacity-90">
              {EXAMPLE_ROWS.map((row) => (
                <div
                  key={row.id}
                  className="relative overflow-hidden mask-image-linear-to-r from-transparent via-black to-transparent"
                  style={{
                    maskImage:
                      'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                  }}
                >
                  <div
                    className="flex w-max gap-3 pause-on-hover py-2"
                    style={buildMarqueeStyle(row.duration, row.direction)}
                  >
                    {[...row.prompts, ...row.prompts].map((prompt, i) => (
                      <button
                        key={`${row.id}-${i}`}
                        onClick={() => handleExampleClick(prompt)}
                        className="px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/5 text-sm text-zinc-400 hover:bg-white/[0.08] hover:text-white hover:border-white/10 transition-all duration-300 whitespace-nowrap"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                    <Sparkles className="h-4 w-4 text-white/80" />
                  </div>
                )}
                
                <div
                  className={`flex flex-col max-w-[80%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-5 py-3.5 shadow-md backdrop-blur-sm border ${
                      message.role === 'user'
                        ? 'bg-white text-zinc-950 rounded-2xl rounded-tr-sm border-white/20'
                        : 'bg-zinc-900/60 text-zinc-200 rounded-2xl rounded-tl-sm border-white/5'
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'font-light' : 'font-normal'}`}>
                      {message.content}
                    </p>
                  </div>

                  {message.role === 'assistant' && message.status === 'generating' && (
                    <div className="mt-3 w-full animate-in fade-in duration-500">
                      <div className="rounded-2xl bg-zinc-900/40 border border-white/5 p-4 flex items-center gap-4 max-w-[320px]">
                        <div className="relative w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                          <Loader2 className="h-5 w-5 text-white/50 animate-spin" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-white/90">Generating...</span>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                              {message.aspectRatio}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white/30 w-1/3 animate-[progress_1.5s_ease-in-out_infinite]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' && message.status === 'completed' && message.videoUrl && (
                    <div className="mt-3 w-full animate-in zoom-in-95 duration-300">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black max-w-[280px] group">
                        <video
                          src={message.videoUrl}
                          controls
                          className="w-full h-auto block"
                        />
                        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                      </div>
                      <div className="flex gap-2 mt-2">
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 hover:text-white">
                           <Film className="w-3 h-3 mr-1.5" />
                           Download
                         </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Input Area */}
      <div className="relative p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="group relative flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-[24px] focus-within:ring-2 focus-within:ring-white/10 focus-within:border-white/20 transition-all shadow-lg hover:shadow-xl hover:border-white/15">
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the video you want to create..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-500 focus:ring-0 px-4 py-3 text-sm min-w-0"
            />

            <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

            {/* Aspect Ratio Selector - Compact */}
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 shrink-0">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-300 ${
                    aspectRatio === ratio
                      ? 'bg-white text-black shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={`h-11 w-11 rounded-full shrink-0 transition-all duration-300 ${
                input.trim() && !isGenerating
                  ? 'bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-zinc-800 text-zinc-500 border border-white/5'
              }`}
              size="icon"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          </div>
          
          <div className="text-center mt-3">
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating
                </span>
                <span>You can keep typing — send unlocks when ready</span>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-600 font-medium tracking-wide uppercase">
                AI Generated • 1080p Quality • Stereo Audio
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
