'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Star, ChevronRight, Package } from 'lucide-react'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/components/ui/ProductImage'
import { PRODUCT_API_BASE } from '@/lib/constants'
import type { ProductItem, ProductsResponse } from '@/lib/product-types'

interface ProductRecommendationsProps {
  productId: string
  limit?: number
  title?: string
}

export default function ProductRecommendations({
  productId,
  limit = 8,
  title = 'You May Also Like',
}: ProductRecommendationsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'recommendations', productId],
    queryFn: () =>
      fetch(`${PRODUCT_API_BASE}/products?limit=${limit + 4}`).then(r => r.json()) as Promise<ProductsResponse>,
    staleTime: 120_000,
    retry: 1,
  })

  const products = error
    ? []
    : (data?.data ?? []).filter(p => p._id !== productId).slice(0, limit)

  if (error) {
    return (
      <section className="mt-16" aria-label="Recommended products">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">{(error as Error).message}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-16" aria-label={title}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">{title}</h2>
          <p className="text-white/40 text-sm mt-1">Based on your selection</p>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1 text-primary hover:text-primary-light text-sm font-medium transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
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
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No recommendations available yet</p>
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
                  className="group block glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
                  aria-label={`View ${product.name}`}
                >
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    <ProductImage
                      src={product.images[0] || ''}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-error/90 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        -{product.discount}%
                      </span>
                    )}
                    {product.isVRSupported && (
                      <span className="absolute top-2 right-2 bg-accent/90 text-black text-xs font-semibold px-2 py-1 rounded-md">
                        VR
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1 truncate">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-white/60">
                        {product.rating.toFixed(1)} ({product.numReviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(discountedPrice ?? product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs text-white/30 line-through">
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
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light text-sm font-medium transition-colors"
        >
          View All Products
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
