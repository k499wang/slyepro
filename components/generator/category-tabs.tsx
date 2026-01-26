'use client'

import { cn } from '@/lib/utils'
import { categories } from '@/data/presets'

type CategoryTabsProps = {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeCategory === category.id
              ? 'bg-white text-black shadow-sm shadow-white/10'
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5'
          )}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  )
}
