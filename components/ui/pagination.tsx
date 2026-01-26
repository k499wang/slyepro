import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={hasPrevious ? getPageUrl(currentPage - 1) : '#'}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          hasPrevious
            ? 'text-zinc-400 hover:text-white hover:bg-white/5'
            : 'text-zinc-700 cursor-not-allowed'
        )}
        aria-disabled={!hasPrevious}
        tabIndex={hasPrevious ? 0 : -1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
              page === currentPage
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={hasNext ? getPageUrl(currentPage + 1) : '#'}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          hasNext
            ? 'text-zinc-400 hover:text-white hover:bg-white/5'
            : 'text-zinc-700 cursor-not-allowed'
        )}
        aria-disabled={!hasNext}
        tabIndex={hasNext ? 0 : -1}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
