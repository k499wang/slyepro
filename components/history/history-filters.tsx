'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

type FilterType = {
  id: string
  label: string
}

type HistoryFiltersProps = {
  types: FilterType[]
  currentType: string
}

export function HistoryFilters({ types, currentType }: HistoryFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {types.map((type) => {
        const isActive = type.id === currentType
        const href = type.id === 'all' ? '/dashboard/history' : `/dashboard/history?type=${type.id}`

        return (
          <Link
            key={type.id}
            href={href}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            {type.label}
          </Link>
        )
      })}
    </div>
  )
}
