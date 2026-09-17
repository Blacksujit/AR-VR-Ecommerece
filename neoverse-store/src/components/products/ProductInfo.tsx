'use client'

import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Share2,
  Eye,
  Box,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ProductItem } from '@/lib/product-types'

interface ProductInfoProps {
  product: ProductItem
  inWishlist: boolean
  quantity: number
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void
  onToggleWishlist: () => void
  onShare: () => void
  onViewAR: () => void
}

export function ProductInfo({
  product,
  inWishlist,
  quantity,
  onQuantityChange,
  onAddToCart,
  onToggleWishlist,
  onShare,
  onViewAR,
}: ProductInfoProps) {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

  const discountBadgeText =
    product.discount > 20 ? 'Hot Deal' :
    product.discount > 0 ? `-${product.discount}%` : null

  return (
    <div>
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-muted">{product.brand}</p>
        <h1 className="text-3xl font-display font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn('h-5 w-5', i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted/30')}
            />
          ))}
        </div>
        <span className="text-sm text-muted">{product.rating > 0 ? product.rating.toFixed(1) : 'New'} ({product.numReviews} reviews)</span>
      </div>

      <div className="flex items-baseline gap-3 mb-8">
        <span className="text-4xl font-semibold tabular-nums text-paper">{formatPrice(discountedPrice)}</span>
        {product.discount > 0 && (
          <span className="text-xl tabular-nums text-muted/60 line-through">{formatPrice(product.price)}</span>
        )}
        {discountBadgeText && discountBadgeText.startsWith('-') && (
          <Badge variant="error">{discountBadgeText}</Badge>
        )}
      </div>

      <p className="mb-8 max-w-prose leading-relaxed text-muted">{product.description}</p>

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-panel-soft px-2.5 py-1 text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-8 rounded-surface border border-line bg-panel p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center rounded-control border border-line bg-panel-soft">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-paper"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium tabular-nums text-paper">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              className="flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-paper"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button variant="primary" size="lg" className="w-full flex-1 sm:w-auto group" onClick={onAddToCart} disabled={product.stock < 1}>
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            Add to Cart - {formatPrice(discountedPrice * quantity)}
          </Button>

          <button
            onClick={onToggleWishlist}
            className={cn('flex min-h-12 min-w-12 items-center justify-center rounded-control border transition-colors', inWishlist
              ? 'border-error/30 bg-error/10 text-error'
              : 'border-line bg-panel-soft text-muted hover:border-error/30 hover:text-error'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <button onClick={onShare} className="flex min-h-12 min-w-12 items-center justify-center rounded-control border border-line bg-panel-soft text-muted transition-colors hover:bg-panel hover:text-paper" aria-label="Share product">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {(product.isARSupported || product.isVRSupported) && (
          <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4">
            {product.isARSupported && (
              <Button variant="outline" onClick={onViewAR}>
                <Eye className="w-4 h-4" />
                View in AR
              </Button>
            )}
            {product.isVRSupported && (
              <Button variant="secondary" onClick={() => window.open('/vr-showroom', '_blank')}>
                <Box className="w-4 h-4" />
                View in VR Showroom
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Truck, label: 'Free Shipping', sub: 'On orders over $50' },
          { icon: Shield, label: '2 Year Warranty', sub: 'Full coverage' },
          { icon: RotateCcw, label: '30 Days Return', sub: 'No questions asked' },
        ].map((item) => (
          <div key={item.label} className="rounded-control border border-line bg-panel p-4 text-center">
            <item.icon className="mx-auto mb-2 h-5 w-5 text-electric" />
            <p className="text-sm font-medium text-paper">{item.label}</p>
            <p className="mt-0.5 text-xs text-muted">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
