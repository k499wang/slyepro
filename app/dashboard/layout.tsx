import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { createClient } from '@/lib/supabase/server'
import type { UserSummary } from '@/types'
import { redirect } from 'next/navigation'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, avatar_url, credits')
    .eq('id', authData.user.id)
    .single()

  const metadataName =
    typeof authData.user.user_metadata?.full_name === 'string'
      ? authData.user.user_metadata.full_name
      : undefined

  const user: UserSummary = {
    email: profile?.email ?? authData.user.email,
    full_name:
      profile?.full_name ??
      metadataName ??
      'User',
    avatar_url: profile?.avatar_url ?? null,
  }
  const credits = profile?.credits ?? 0

  return (
    <div className="min-h-screen bg-background">
      <Sidebar credits={credits} />
      <div className="md:pl-64">
        <Header user={user} credits={credits} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
