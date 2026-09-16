'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard } from './ProductCard'
import type { ProductItem } from '@/lib/product-types'


interface ProductGridProps {
  products: ProductItem[]
  viewMode: 'grid' | 'list'
  isLoading: boolean

}

export function ProductGrid({ products, viewMode, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'space-y-4'
      )}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-surface border border-line bg-panel animate-pulse">
            <div className="aspect-4/3 bg-panel-soft" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 rounded bg-panel-soft" />
              <div className="h-4 w-2/3 rounded bg-panel-soft" />
              <div className="h-3 w-1/4 rounded bg-panel-soft" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-surface border border-line bg-panel">
          <Search className="h-5 w-5 text-muted" />
        </div>
        <p className="text-lg text-paper">No products found</p>
        <p className="mt-1 text-sm text-muted">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className={cn(
      viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
        : 'space-y-4'
    )}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id || product.slug}
          product={product}
          index={index}
          viewMode={viewMode}

        />
      ))}
    </div>
  )
}
