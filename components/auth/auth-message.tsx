type AuthMessageProps = {
  message?: string
  tone?: 'error' | 'success'
}

const toneStyles = {
  error: 'border-red-500/20 bg-red-500/5 text-red-300 backdrop-blur-sm shadow-sm',
  success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300 backdrop-blur-sm shadow-sm',
}

export function AuthMessage({ message, tone = 'error' }: AuthMessageProps) {
  if (!message) {
    return null
  }

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-3 py-2 text-xs font-light tracking-wide ${toneStyles[tone]}`}
    >
      {message}
    </div>
  )
}
