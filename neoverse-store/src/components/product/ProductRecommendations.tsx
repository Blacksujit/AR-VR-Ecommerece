'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ChevronRight, Package } from 'lucide-react'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/components/ui/ProductImage'
import { useRecommendations } from '@/lib/hooks/useProducts'


interface ProductRecommendationsProps {
  productId: string
  limit?: number
  title?: string
  category?: string
}

export default function ProductRecommendations({
  productId,
  limit = 8,
  title = 'You May Also Like',
  category,
}: ProductRecommendationsProps) {
  const { data, isLoading, error } = useRecommendations(category || '', productId, limit)
  const products = data ?? []

  if (error) {
    return (
      <section className="mt-16" aria-label="Recommended products">
        <div className="rounded-surface border border-line bg-panel py-12 text-center">
          <Package className="mx-auto mb-4 h-10 w-10 text-muted/50" />
          <p className="text-sm text-muted">Unable to load recommendations</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-16" aria-label={title}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-paper">{title}</h2>
          <p className="mt-1 text-sm text-muted">Based on your selection</p>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm font-medium text-electric transition-colors hover:text-primary-light sm:flex"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-surface border border-line bg-panel">
              <Skeleton className="aspect-square rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-surface border border-line bg-panel py-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted/50" />
          <p className="text-sm text-muted">No recommendations available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const discountedPrice = product.discount > 0
              ? calculateDiscountedPrice(product.price, product.discount)
              : null

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group block overflow-hidden rounded-surface border border-line bg-panel transition-[border-color,box-shadow] duration-200 hover:border-electric/40 hover:shadow-soft"
                  aria-label={`View ${product.name}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-panel-soft">
                    <ProductImage
                      src={product.images[0] || ''}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.discount > 0 && (
                      <span className="absolute left-2 top-2 rounded-md bg-error px-2 py-1 text-xs font-semibold text-ink">
                        -{product.discount}%
                      </span>
                    )}
                    {product.isVRSupported && (
                      <span className="absolute right-2 top-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-ink">
                        3D
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="mb-1 truncate text-xs font-medium text-muted">
                      {product.brand}
                    </p>
                    <h3 className="truncate text-sm font-semibold text-paper transition-colors group-hover:text-electric">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs text-muted">
                        {product.rating > 0 ? product.rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-semibold tabular-nums text-paper">
                        {formatPrice(discountedPrice ?? product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs tabular-nums text-muted/60 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-electric transition-colors hover:text-primary-light"
        >
          View All Products
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
