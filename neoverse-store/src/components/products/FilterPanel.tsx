'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceRange {
  label: string
  min: number
  max: number
}

interface FilterPanelProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRanges: PriceRange[]
  selectedPriceRange: { min: number; max: number } | null
  onPriceRangeChange: (range: { min: number; max: number } | null) => void
  minRating: number
  onRatingChange: (rating: number) => void
  arOnly: boolean
  onArOnlyChange: (value: boolean) => void
  vrOnly: boolean
  onVrOnlyChange: (value: boolean) => void
}

export function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRanges,
  selectedPriceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  arOnly,
  onArOnlyChange,
  vrOnly,
  onVrOnlyChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { onCategoryChange(cat) }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategory === cat
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                onPriceRangeChange(
                  selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                    ? null
                    : { min: range.min, max: range.max }
                )
              }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Minimum Rating</h3>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star === minRating ? 0 : star)}
              className="p-1 transition-colors hover:scale-110"
              aria-label={`${star} stars`}
            >
              <Star
                className={cn(
                  'w-5 h-5',
                  star <= minRating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Compatibility</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={arOnly}
              onChange={() => onArOnlyChange(!arOnly)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">AR Compatible</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={vrOnly}
              onChange={() => onVrOnlyChange(!vrOnly)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">VR Compatible</span>
          </label>
        </div>
      </div>
    </div>
  )
}
