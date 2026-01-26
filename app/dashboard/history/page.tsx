import { Clock, Info } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import { HistoryTable } from '@/components/history/history-table'
import { HistoryFilters } from '@/components/history/history-filters'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

type GenerationRow = {
  id: string
  prompt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  output_url: string | null
  created_at: string
  type: string
}

type PageProps = {
  searchParams: Promise<{ page?: string; type?: string }>
}

const ITEMS_PER_PAGE = 10

const GENERATION_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'asmr_video', label: 'ASMR Video' },
]

function parsePageNumber(pageParam: string | undefined): number {
  if (!pageParam) return 1
  const parsed = parseInt(pageParam, 10)
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parsePageNumber(params.page)
  const typeFilter = params.type || 'all'
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  let generations: GenerationRow[] = []
  let totalCount = 0

  if (authData.user) {
    let query = supabase
      .from('generations')
      .select('id,prompt,status,output_url,created_at,type')
      .eq('user_id', authData.user.id)

    let countQuery = supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authData.user.id)

    if (typeFilter !== 'all') {
      query = query.eq('type', typeFilter)
      countQuery = countQuery.eq('type', typeFilter)
    }

    const [generationsResult, countResult] = await Promise.all([
      query
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1),
      countQuery,
    ])

    if (generationsResult.data) {
      generations = generationsResult.data
    }
    if (countResult.count !== null) {
      totalCount = countResult.count
    }
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const buildBasePath = () => {
    if (typeFilter === 'all') return '/dashboard/history'
    return `/dashboard/history?type=${typeFilter}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white">Generation History</h1>
        <p className="text-zinc-500 mt-2 font-light">View your past generations</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <HistoryFilters types={GENERATION_TYPES} currentType={typeFilter} />

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Media files are retained for ~14 days before automatic deletion.</span>
        </div>
      </div>

      {generations.length === 0 && currentPage === 1 ? (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <Clock className="h-12 w-12 text-zinc-700 mb-6" />
            <h3 className="text-lg font-medium text-white mb-2">
              No generations yet
            </h3>
            <p className="text-zinc-500 text-center max-w-sm font-light">
              Start creating content and your history will appear here.
            </p>
          </CardContent>
        </Card>
      ) : generations.length === 0 ? (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <p className="text-zinc-500 text-center font-light">
              No generations found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <HistoryTable generations={generations} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={buildBasePath()}
          />
        </>
      )}
    </div>
  )
}
