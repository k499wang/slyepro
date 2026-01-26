import { AuthBrand } from '@/components/auth/auth-brand'

type AuthShellProps = {
  children: React.ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20">
      <div className="relative grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <AuthBrand />
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 bg-zinc-950/50 backdrop-blur-3xl">
          {children}
        </div>
      </div>
    </div>
  )
}
