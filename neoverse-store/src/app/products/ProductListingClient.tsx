'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Mic,
  SlidersHorizontal,
  Star,
  Grid3X3,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import VoiceSearch from '@/components/search/VoiceSearch'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { api, type ApiResponse } from '@/lib/api'
import type { Product } from '@/types'
import { CATEGORIES, ITEMS_PER_PAGE } from '@/lib/constants'

const categories = ['All', ...CATEGORIES.map(c => c.name)]

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

const gradientMap: Record<string, string> = {
  'Gaming': 'from-red-600/20 to-rose-600/20',
  'Audio': 'from-blue-600/20 to-cyan-600/20',
  'Computing': 'from-purple-600/20 to-pink-600/20',
  'Wearables': 'from-emerald-600/20 to-teal-600/20',
  'Smart Home': 'from-slate-600/20 to-zinc-600/20',
  'Photography': 'from-amber-600/20 to-orange-600/20',
}

function getGradient(product: Product): string {
  return gradientMap[product.category] || 'from-primary/20 to-accent/20'
}

function getBadge(product: Product): string | null {
  if (product.discount > 20) return 'Hot Deal'
  if (product.featured) return 'Best Seller'
  if (product.newArrival) return 'New'
  if (product.trending) return 'Popular'
  if (product.discount > 0) return `-${product.discount}%`
  return null
}

interface ProductListingClientProps {
  initialFilters: { [key: string]: string | string[] | undefined }
}

export default function ProductListingClient({ initialFilters }: ProductListingClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [minRating, setMinRating] = useState(0)
  const [arOnly, setArOnly] = useState(false)
  const [vrOnly, setVrOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value)
      setCurrentPage(1)
    }, 400)
  }, [])

  const buildFilters = useCallback(() => {
    const params = new URLSearchParams()
    params.set('page', String(currentPage))
    params.set('limit', String(ITEMS_PER_PAGE))
    if (debouncedSearch) params.set('keyword', debouncedSearch)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (selectedPriceRange) {
      params.set('minPrice', String(selectedPriceRange.min))
      if (selectedPriceRange.max < Infinity) params.set('maxPrice', String(selectedPriceRange.max))
    }
    if (minRating > 0) params.set('rating', String(minRating))
    if (arOnly) params.set('arCompatible', 'true')
    if (vrOnly) params.set('vrCompatible', 'true')
    const sortMap: Record<string, string> = {
      'price-asc': 'price_asc', 'price-desc': 'price_desc',
      'rating': 'rating', 'newest': 'newest', 'popular': 'createdAt',
    }
    params.set('sort', sortMap[sort] || 'createdAt')
    return params.toString()
  }, [currentPage, debouncedSearch, selectedCategory, selectedPriceRange, minRating, arOnly, vrOnly, sort])

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['products', buildFilters()],
    queryFn: () => api.get<ApiResponse<Product[]>>(`/products?${buildFilters()}`),
  })

  const products = apiData?.data ?? []
  const pagination = apiData?.pagination
  const totalPages = pagination?.pages ?? 1
  const currentSortLabel = sortOptions.find(o => o.value === sort)?.label || 'Sort by'

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1) }}
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
                setSelectedPriceRange(
                  selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                    ? null
                    : { min: range.min, max: range.max }
                )
                setCurrentPage(1)
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
              onClick={() => setMinRating(star === minRating ? 0 : star)}
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
              onChange={() => { setArOnly(!arOnly); setCurrentPage(1) }}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">AR Compatible</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={vrOnly}
              onChange={() => { setVrOnly(!vrOnly); setCurrentPage(1) }}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">VR Compatible</span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="glass rounded-2xl p-5 sticky top-28">
          <FilterContent />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
                if (SR) {
                  const recognition = new SR()
                  recognition.lang = 'en-US'
                  recognition.onresult = (e: { results: { transcript: string }[][] }) => {
                    const transcript = e.results[0][0].transcript
                    setSearchQuery(transcript)
                    handleSearch(transcript)
                  }
                  recognition.start()
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-primary transition-colors"
              aria-label="Voice search"
              title="Search by voice"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full sm:w-44 flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white transition-colors"
              >
                <span className="truncate">{currentSortLabel}</span>
                <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', sortDropdownOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {sortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 right-0 w-full min-w-[200px] glass border border-glass-border rounded-xl py-2 z-30 shadow-soft"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSort(option.value); setSortDropdownOpen(false) }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm transition-colors',
                          sort === option.value
                            ? 'text-primary bg-primary/10'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center glass rounded-xl border border-glass-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white')}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white')}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-white/40 mb-6">
          {isLoading ? 'Loading...' : `Showing ${products.length} of ${pagination?.total ?? 0} products`}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-white/40 text-lg">No products found</p>
            <p className="text-white/20 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              )}
            >
              {products.map((product, index) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
                const badge = getBadge(product)
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <Card variant="glass" className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[0_0_40px_rgba(91,127,255,0.12)]">
                        <Link href={`/products/${product.slug}`}>
                          <div className={cn('relative aspect-[4/3] bg-gradient-to-br flex items-center justify-center overflow-hidden', getGradient(product))}>
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-2xl font-display font-bold text-white/30">{product.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {badge && <Badge variant="gradient">{badge}</Badge>}
                              {product.discount > 0 && <Badge variant="error">-{product.discount}%</Badge>}
                            </div>
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              {product.isARSupported && <Badge variant="primary">AR</Badge>}
                              {product.isVRSupported && <Badge variant="primary">VR</Badge>}
                            </div>
                          </div>
                        </Link>
                        <div className="p-4">
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{product.brand}</p>
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="text-base font-semibold text-white/90 hover:text-primary-light transition-colors">{product.name}</h3>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                            ))}
                            <span className="text-xs text-white/40 ml-1">({product.numReviews})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-white">{formatPrice(discountedPrice)}</span>
                            {product.discount > 0 && <span className="text-sm text-white/30 line-through">{formatPrice(product.price)}</span>}
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Link href={`/products/${product.slug}`}>
                        <Card variant="glass" className="flex gap-5 p-4 group hover:border-primary/30 transition-all duration-300">
                          <div className={cn('w-28 h-28 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center', getGradient(product))}>
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <span className="text-2xl font-display font-bold text-white/30">{product.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">{product.brand}</p>
                                <h3 className="text-lg font-semibold text-white/90 group-hover:text-primary-light transition-colors">{product.name}</h3>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                {product.isARSupported && <Badge variant="primary">AR</Badge>}
                                {product.isVRSupported && <Badge variant="primary">VR</Badge>}
                              </div>
                            </div>
                            <p className="text-sm text-white/50 mt-1.5 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                                ))}
                                <span className="text-xs text-white/40 ml-1">({product.numReviews})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white">{formatPrice(discountedPrice)}</span>
                                {product.discount > 0 && <span className="text-sm text-white/30 line-through">{formatPrice(product.price)}</span>}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl glass border border-glass-border text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                      page === currentPage
                        ? 'bg-primary text-white shadow-glow'
                        : 'glass border border-glass-border text-white/60 hover:text-white'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl glass border border-glass-border text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters">
        <FilterContent />
        <div className="mt-6">
          <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  )
}
