import { CreditPackageCard } from '@/components/credits/credit-package-card'
import { CreditsBalanceCard } from '@/components/credits/credits-balance-card'
import { CreditsMessages } from '@/components/credits/credits-messages'
import { CREDIT_PACKAGES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

type CreditsPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CreditsPage({ searchParams }: CreditsPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const errorMessage = getParam(resolvedParams?.error)
  const successMessage = getParam(resolvedParams?.success)

  let currentCredits = 0
  if (authData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', authData.user.id)
      .single()

    currentCredits = profile?.credits ?? 0
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white">Credits</h1>
        <p className="text-zinc-500 mt-2 font-light">Purchase credits to generate high-fidelity content</p>
      </div>

      <CreditsMessages
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      <CreditsBalanceCard credits={currentCredits} />

      <div className="grid gap-6 md:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg, index) => (
          <CreditPackageCard
            key={pkg.id}
            pkg={pkg}
            isPopular={index === 1}
          />
        ))}
      </div>
    </div>
  )
}
