'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Star, ArrowRight, Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api, type ApiResponse } from '@/lib/api'
import { useCartStore } from '@/store/cart-store'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function FeaturedProducts() {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const { data: res, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get<ApiResponse<Product[]>>('/products/featured'),
    staleTime: 60_000,
  })

  const products = res?.data ?? []

  if (!isLoading && products.length === 0) return null

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
                Featured <span className="gradient-text">Products</span>
              </h2>
              <p className="mt-4 text-white/50 text-lg max-w-xl">
                Curated picks from the future of technology
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-white/40 hover:text-primary-light transition-colors duration-300 group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-white/5 rounded" />
                  <div className="h-5 w-40 bg-white/5 rounded" />
                  <div className="h-3 w-32 bg-white/5 rounded" />
                  <div className="h-6 w-24 bg-white/5 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
              return (
                <ScrollReveal key={product._id} delay={index * 0.1} direction="up">
                  <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[0_0_40px_rgba(91,127,255,0.12)]">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-purple/10 flex items-center justify-center overflow-hidden">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <span className="text-5xl font-display font-bold text-white/20">{product.name.charAt(0)}</span>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && <Badge variant="gradient">Featured</Badge>}
                          {product.discount > 0 && (
                            <Badge variant="error">-{product.discount}%</Badge>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {product.isARSupported && <Badge variant="primary">AR</Badge>}
                          {product.isVRSupported && <Badge variant="primary">VR</Badge>}
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <Button
                            size="sm"
                            variant="primary"
                            className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100"
                            onClick={(e) => { e.preventDefault(); addItem(product) }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="glass"
                            className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200"
                            onClick={(e) => { e.preventDefault(); router.push(`/products/${product.slug}`) }}
                          >
                            <Eye className="w-4 h-4" />
                            Quick View
                          </Button>
                        </div>
                      </div>
                    </Link>

                    <div className="p-5">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                        {product.brand}
                      </p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-lg font-semibold text-white/90 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3.5 h-3.5',
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-white/20'
                            )}
                          />
                        ))}
                        <span className="text-xs text-white/40 ml-1">
                          ({product.numReviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xl font-bold text-white">
                          {formatPrice(discountedPrice)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-white/30 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        )}

        <ScrollReveal delay={0.3}>
          <div className="flex sm:hidden justify-center mt-10">
            <Link href="/products">
              <Button variant="glass">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
