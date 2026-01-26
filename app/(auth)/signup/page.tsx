import { SignupForm } from '@/components/auth/signup-form'

type SignupPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const error = getParam(resolvedParams?.error)

  return <SignupForm error={error} />
}
