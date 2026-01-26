import Link from 'next/link'
import { signup } from '@/app/(auth)/actions'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthMessage } from '@/components/auth/auth-message'
import { Button } from '@/components/ui/button'

type SignupFormProps = {
  error?: string
}

export function SignupForm({ error }: SignupFormProps) {
  return (
    <AuthCard
      title="Create your account"
      description="Get started with fresh ASMR content in minutes."
      footer={
        <span>
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-200 hover:text-white transition-colors underline decoration-zinc-500 underline-offset-4 hover:decoration-white">
            Log in
          </Link>
        </span>
      }
    >
      <form action={signup} className="space-y-4">
        <AuthMessage message={error} tone="error" />
        <AuthField
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Alex Rivera"
        />
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
          autoComplete="new-password"
        />
        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <p className="text-xs text-zinc-500 font-light">
          By creating an account, you agree to keep things calm and respectful.
        </p>
        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-10 transition-colors"
        >
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
