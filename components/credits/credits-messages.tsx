type CreditsMessagesProps = {
  errorMessage?: string
  successMessage?: string
}

export function CreditsMessages({
  errorMessage,
  successMessage,
}: CreditsMessagesProps) {
  return (
    <>
      {errorMessage ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 backdrop-blur-sm px-4 py-3 text-sm text-red-300 font-light">
          {errorMessage}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm px-4 py-3 text-sm text-emerald-300 font-light">
          {successMessage}
        </div>
      ) : null}
    </>
  )
}
