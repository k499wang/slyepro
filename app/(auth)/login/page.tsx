import { LoginForm } from '@/components/auth/login-form'

type LoginPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const error = getParam(resolvedParams?.error)
  const success = getParam(resolvedParams?.success)

  return <LoginForm error={error} success={success} />
}
