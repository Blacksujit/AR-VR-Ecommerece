'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ChevronRight } from 'lucide-react'
import { useFeaturedProducts } from '@/lib/hooks/useProducts'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/components/ui/ProductImage'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'
import type { ProductItem } from '@/lib/product-types'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  initialData?: ProductItem[]
}

export function FeaturedProducts({ initialData }: FeaturedProductsProps) {
  const { data: res, isLoading } = useFeaturedProducts(8, initialData)
  const addToCart = useCartStore((s) => s.addItem)

  const products = res?.data ?? []

  if (!isLoading && products.length === 0) return null

  return (
    <section className="relative border-b border-line py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-medium text-electric">A considered starting point</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              Objects worth a closer look
            </h2>
            <p className="mt-3 max-w-xl text-lg text-muted">
              Curated products with the details, dimensions, and immersive tools to help you choose well.
            </p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-surface border border-line bg-panel">
                <Skeleton className="aspect-4/3 rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => {
              const discountedPrice = product.discount > 0
                ? calculateDiscountedPrice(product.price, product.discount)
                : null

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <div className="group relative overflow-hidden rounded-surface border border-line bg-panel transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block aspect-4/3 overflow-hidden bg-panel-soft"
                      aria-label={`View ${product.name}`}
                    >
                      {product.discount > 0 && (
                        <span className="absolute left-3 top-3 z-10 rounded-md bg-error px-2 py-1 text-xs font-semibold text-ink">
                          -{product.discount}%
                        </span>
                      )}
                      {product.isVRSupported && product.modelUrl && (
                        <span className="absolute right-3 top-3 z-10 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-ink">
                          3D
                        </span>
                      )}
                      <ProductImage
                        src={product.images[0] || ''}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>

                    <div className="p-4">
                      <p className="mb-1 truncate text-xs font-medium text-muted">
                        {product.brand}
                      </p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="truncate text-sm font-semibold text-paper transition-colors hover:text-electric">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-1 flex items-center gap-1">
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
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => addToCart(product as unknown as Product)}
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-light text-sm font-medium transition-colors"
          >
            View All Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
