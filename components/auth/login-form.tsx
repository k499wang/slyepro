import Link from 'next/link'
import { login } from '@/app/(auth)/actions'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthMessage } from '@/components/auth/auth-message'
import { Button } from '@/components/ui/button'

type LoginFormProps = {
  error?: string
  success?: string
}

export function LoginForm({ error, success }: LoginFormProps) {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in to manage your ASMR workspace."
      footer={
        <span>
          New here?{' '}
          <Link href="/signup" className="text-zinc-200 hover:text-white transition-colors underline decoration-zinc-500 underline-offset-4 hover:decoration-white">
            Create an account
          </Link>
        </span>
      }
    >
      <form action={login} className="space-y-4">
        <AuthMessage message={error} tone="error" />
        <AuthMessage message={success} tone="success" />
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-10 transition-colors"
        >
          Sign in
        </Button>
      </form>
    </AuthCard>
  )
}
