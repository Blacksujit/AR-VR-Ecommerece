'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/ProductImage'
import type { ProductItem } from '@/lib/product-types'

interface ProductCardProps {
  product: ProductItem
  index: number
  viewMode: 'grid' | 'list'
  gradientMap: Record<string, string>
}

function getGradient(category: string, gradientMap: Record<string, string>): string {
  return gradientMap[category] || 'from-panel-soft to-panel'
}

function getBadge(product: ProductItem): string | null {
  if (product.discount > 20) return 'Hot deal'
  if (product.featured) return 'Best seller'
  if (product.newArrival) return 'New'
  if (product.trending) return 'Popular'
  if (product.discount > 0) return `-${product.discount}%`
  return null
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars from ${reviews} reviews`}>
      <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
      <span className="text-xs tabular-nums text-muted">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
      {reviews > 0 && <span className="text-xs text-muted/70">({reviews})</span>}
    </div>
  )
}

export function ProductCard({ product, index, viewMode, gradientMap }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
  const badge = getBadge(product)
  const gradient = getGradient(product.category, gradientMap)
  const showId = product._id || product.slug

  return (
    <motion.article
      key={showId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.3 }}
      className={viewMode === 'grid' ? undefined : 'border-b border-line pb-4'}
    >
      {viewMode === 'grid' ? (
        <div className="group overflow-hidden rounded-surface border border-line bg-panel transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft">
          <Link href={`/products/${product.slug}`} className="block">
            <div className={cn('relative aspect-4/3 overflow-hidden bg-linear-to-br', gradient)}>
              <ProductImage
                src={product.images?.[0] || ''}
                alt={product.name}
                fill
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {badge && <Badge variant="default">{badge}</Badge>}
                  {product.discount > 0 && <Badge variant="error">-{product.discount}%</Badge>}
                </div>
                <div className="flex gap-1.5">
                  {product.isARSupported && <Badge variant="primary">AR</Badge>}
                  {product.isVRSupported && <Badge variant="accent">3D</Badge>}
                </div>
              </div>
            </div>
          </Link>
          <div className="space-y-3 p-4">
            <div>
              <p className="mb-1 text-xs font-medium text-muted">{product.brand}</p>
              <Link href={`/products/${product.slug}`}>
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-paper transition-colors group-hover:text-electric">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Rating rating={product.rating} reviews={product.numReviews} />
              <span className={cn('text-xs', product.stock > 0 ? 'text-accent' : 'text-error')}>
                {product.stock > 0 ? 'In stock' : 'Sold out'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tabular-nums text-paper">{formatPrice(discountedPrice)}</span>
              {product.discount > 0 && <span className="text-sm tabular-nums text-muted/60 line-through">{formatPrice(product.price)}</span>}
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/products/${product.slug}`} className="group flex gap-5 rounded-surface border border-line bg-panel p-4 transition-[border-color,box-shadow] duration-200 hover:border-electric/40 hover:shadow-soft">
          <div className={cn('relative h-28 w-28 shrink-0 overflow-hidden rounded-control bg-linear-to-br', gradient)}>
            <ProductImage src={product.images?.[0] || ''} alt={product.name} fill className="h-full w-full" sizes="112px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted">{product.brand}</p>
                <h3 className="text-lg font-semibold text-paper transition-colors group-hover:text-electric">{product.name}</h3>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {product.isARSupported && <Badge variant="primary">AR</Badge>}
                {product.isVRSupported && <Badge variant="accent">3D</Badge>}
              </div>
            </div>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <Rating rating={product.rating} reviews={product.numReviews} />
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tabular-nums text-paper">{formatPrice(discountedPrice)}</span>
                {product.discount > 0 && <span className="text-sm tabular-nums text-muted/60 line-through">{formatPrice(product.price)}</span>}
              </div>
            </div>
          </div>
        </Link>
      )}
    </motion.article>
  )
}
