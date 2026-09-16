'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useProducts, useCategories } from '@/lib/hooks/useProducts'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { SearchBar } from '@/components/products/SearchBar'
import { FilterPanel } from '@/components/products/FilterPanel'
import { ProductGrid } from '@/components/products/ProductGrid'
import { PaginationBar } from '@/components/products/PaginationBar'
import type { CategoryItem, ProductItem } from '@/lib/product-types'

const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: 'Over $1000', min: 1000, max: Infinity },
]

const sortOptions = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
] as const


interface ProductListingClientProps {
  initialFilters: { [key: string]: string | string[] | undefined }
  initialData?: ProductItem[]
  initialPagination?: { total: number; pages: number; page: number; limit: number }
  initialCategories?: CategoryItem[]
}

export default function ProductListingClient({ initialFilters, initialData, initialPagination, initialCategories }: ProductListingClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState<(typeof sortOptions)[number]['value']>('popular')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [minRating, setMinRating] = useState(0)
  const [arOnly, setArOnly] = useState(false)
  const [vrOnly, setVrOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const initialParamApplied = useRef(false)

  const { data: catRes } = useCategories(initialCategories)
  const categories = ['All', ...(catRes?.data ?? []).map(c => c.name)]

  useEffect(() => {
    if (initialParamApplied.current) return
    const initialCategory = initialFilters?.['category']
    if (initialCategory && typeof initialCategory === 'string' && initialCategory !== 'All') {
      const matched = catRes?.data?.find(c => c.slug === initialCategory || c.name === initialCategory)
      if (matched) {
        const timer = window.setTimeout(() => {
          setSelectedCategory(matched.name)
          initialParamApplied.current = true
        }, 0)
        return () => window.clearTimeout(timer)
      }
    }
  }, [initialFilters, catRes])

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value)
      setCurrentPage(1)
    }, 400)
  }, [])

  const sortMap = useMemo<Record<string, string>>(() => ({
    'price-asc': 'price_asc', 'price-desc': 'price_desc',
    'rating': 'rating', 'newest': 'newest', 'popular': 'createdAt',
  }), [])

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(debouncedSearch ? { keyword: debouncedSearch } : {}),
    ...(selectedCategory !== 'All' ? { category: selectedCategory } : {}),
    ...(selectedPriceRange ? { minPrice: selectedPriceRange.min } : {}),
    ...(selectedPriceRange && selectedPriceRange.max < Infinity ? { maxPrice: selectedPriceRange.max } : {}),
    ...(minRating > 0 ? { rating: minRating } : {}),
    ...(arOnly ? { arCompatible: true } : {}),
    ...(vrOnly ? { vrCompatible: true } : {}),
    ...(sort !== 'popular' ? { sort: sortMap[sort] } : {}),
  }), [currentPage, debouncedSearch, selectedCategory, selectedPriceRange, minRating, arOnly, vrOnly, sort, sortMap])

  const { data: apiData, isLoading } = useProducts(queryParams, initialData, initialPagination)

  const products = apiData?.data ?? []
  const pagination = apiData?.pagination
  const totalPages = pagination?.pages ?? 1
  const currentSortLabel = sortOptions.find(o => o.value === sort)?.label || 'Sort by'

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 rounded-surface border border-line bg-panel p-5">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(c) => { setSelectedCategory(c); setCurrentPage(1) }}
            priceRanges={priceRanges}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={(r) => { setSelectedPriceRange(r); setCurrentPage(1) }}
            minRating={minRating}
            onRatingChange={(r) => setMinRating(r)}
            arOnly={arOnly}
            onArOnlyChange={(v) => { setArOnly(v); setCurrentPage(1) }}
            vrOnly={vrOnly}
            onVrOnlyChange={(v) => { setVrOnly(v); setCurrentPage(1) }}
          />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          currentSortLabel={currentSortLabel}
          sortDropdownOpen={sortDropdownOpen}
          onToggleSort={() => setSortDropdownOpen(!sortDropdownOpen)}
          sortOptions={sortOptions}
          sort={sort}
          onSortChange={(v) => { setSort(v as (typeof sortOptions)[number]['value']); setSortDropdownOpen(false) }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        />

        <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm text-muted">
            {isLoading ? 'Loading products' : `${pagination?.total ?? 0} products`}
          </p>
          {(selectedCategory !== 'All' || selectedPriceRange || minRating > 0 || arOnly || vrOnly || debouncedSearch) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setDebouncedSearch('')
                setSelectedCategory('All')
                setSelectedPriceRange(null)
                setMinRating(0)
                setArOnly(false)
                setVrOnly(false)
                setCurrentPage(1)
              }}
              className="text-sm text-electric transition-colors hover:text-primary-light"
            >
              Clear filters
            </button>
          )}
        </div>

        <ProductGrid products={products} viewMode={viewMode} isLoading={isLoading} />

        <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters">
        <FilterPanel
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => { setSelectedCategory(c); setCurrentPage(1) }}
          priceRanges={priceRanges}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={(r) => { setSelectedPriceRange(r); setCurrentPage(1) }}
          minRating={minRating}
          onRatingChange={(r) => setMinRating(r)}
          arOnly={arOnly}
          onArOnlyChange={(v) => { setArOnly(v); setCurrentPage(1) }}
          vrOnly={vrOnly}
          onVrOnlyChange={(v) => { setVrOnly(v); setCurrentPage(1) }}
        />
        <div className="mt-6">
          <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  )
}
