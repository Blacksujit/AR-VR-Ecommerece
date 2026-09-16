'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CircleAlert, Rotate3D, Star } from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { ProductImage } from '@/components/ui/ProductImage'
import { Status } from '@/components/ui/status'
import type { ProductItem } from '@/lib/product-types'

interface ProductCardProps {
  product: ProductItem
  index: number
  viewMode: 'grid' | 'list'
  gradientMap?: Record<string, string>
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  if (!rating) {
    return <span className="text-xs text-muted">No reviews yet</span>
  }

  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars from ${reviews} reviews`}>
      <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
      <span className="text-xs tabular-nums text-muted">{rating.toFixed(1)}</span>
      {reviews > 0 ? <span className="text-xs text-faint">({reviews})</span> : null}
    </div>
  )
}

function CapabilityStatus({ product }: { product: ProductItem }) {
  if (product.isARSupported) {
    return <Status tone="electric"><span className="sr-only">Capability: </span>Place in your space</Status>
  }

  if (product.isVRSupported) {
    return <Status tone="electric"><span className="sr-only">Capability: </span>3D inspection</Status>
  }

  return null
}

function StockStatus({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Status tone="negative">Out of stock</Status>
  }

  if (stock <= 10) {
    return <Status tone="warning">Only {stock} left</Status>
  }

  return <Status tone="positive">Available now</Status>
}

function MediaFrame({ product, compact = false }: { product: ProductItem; compact?: boolean }) {
  return (
    <div className={cn('relative overflow-hidden bg-panel-soft', compact ? 'h-28 w-28 shrink-0 rounded-control' : 'aspect-4/3 rounded-media')}>
      <ProductImage
        src={product.images?.[0] || ''}
        alt={product.name}
        fill
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        sizes={compact ? '112px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      />
      {!product.images?.[0] ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-panel-soft text-center text-xs text-muted" aria-hidden="true">
          <CircleAlert className="h-5 w-5 text-faint" />
          Media unavailable
        </div>
      ) : null}
    </div>
  )
}

export function ProductCard({ product, index, viewMode }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
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
          <Link href={`/products/${product.slug}`} className="block" aria-label={`Inspect ${product.name}`}>
            <MediaFrame product={product} />
          </Link>
          <div className="space-y-4 p-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-xs font-medium text-muted">{product.brand}</p>
                <CapabilityStatus product={product} />
              </div>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-[15px] font-semibold leading-snug text-paper transition-colors group-hover:text-electric">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Rating rating={product.rating} reviews={product.numReviews} />
              <StockStatus stock={product.stock} />
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tabular-nums text-paper">{formatPrice(discountedPrice)}</span>
                {product.discount > 0 ? <span className="text-sm tabular-nums text-faint line-through">{formatPrice(product.price)}</span> : null}
              </div>
              <Link href={`/products/${product.slug}`} className="inline-flex min-h-9 items-center gap-1 rounded-control border border-line px-3 text-xs font-medium text-electric transition-colors hover:border-electric/50 hover:bg-electric/10">
                <Rotate3D className="h-3.5 w-3.5" aria-hidden="true" />
                Inspect
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/products/${product.slug}`} className="group flex gap-5 rounded-surface border border-line bg-panel p-4 transition-[border-color,box-shadow] duration-200 hover:border-electric/40 hover:shadow-soft" aria-label={`Inspect ${product.name}`}>
          <MediaFrame product={product} compact />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{product.brand}</p>
                <h3 className="mt-1 text-lg font-semibold text-paper transition-colors group-hover:text-electric">{product.name}</h3>
              </div>
              <CapabilityStatus product={product} />
            </div>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Rating rating={product.rating} reviews={product.numReviews} />
                <StockStatus stock={product.stock} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tabular-nums text-paper">{formatPrice(discountedPrice)}</span>
                {product.discount > 0 ? <span className="text-sm tabular-nums text-faint line-through">{formatPrice(product.price)}</span> : null}
              </div>
            </div>
          </div>
        </Link>
      )}
    </motion.article>
  )
}
