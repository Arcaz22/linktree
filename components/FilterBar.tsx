'use client'

interface FilterBarProps {
  categories: string[]
  activeCategory: string
  onSelect: (cat: string) => void
}

export default function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="filter-pill shrink-0 text-sm px-4 py-1.5 rounded-full font-medium border"
          style={activeCategory === cat ? {
            background: 'var(--ink)',
            color: 'var(--cream)',
            borderColor: 'var(--ink)',
          } : {
            background: 'white',
            color: 'var(--ink-muted)',
            borderColor: 'var(--border)',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
