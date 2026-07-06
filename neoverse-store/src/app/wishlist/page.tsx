'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { api, type ApiResponse } from '@/lib/api'
import type { Product } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Heart, ShoppingCart, Star, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'

export default function WishlistPage() {
  const { user, isLoading } = useAuthGuard()
  const queryClient = useQueryClient()
  const addItem = useCartStore((s) => s.addItem)
  const initWishlist = useWishlistStore((s) => s.initItems)
  const removeFromStore = useWishlistStore((s) => s.removeItem)

  const { data: wishlistRes, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get<ApiResponse<Product[]>>('/wishlist'),
    enabled: !!user,
  })

  const products = wishlistRes?.data ?? []
  if (wishlistRes?.data && products.length > 0) {
    initWishlist(products.map(p => p._id))
  }

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/wishlist/${productId}`),
    onSuccess: (_data, productId) => {
      removeFromStore(productId)
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  if (isLoading || wishlistLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Heart className="w-7 h-7 text-error" fill="currentColor" />
              My Wishlist
            </h1>
            <p className="text-white/40 mt-1">{products.length} items saved</p>
          </div>
          <Link href="/products">
            <Button variant="glass">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32">
            <Heart className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-white/40 mb-6">Save items you love to your wishlist</p>
            <Link href="/products">
              <Button variant="primary" size="lg">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
              return (
                <ScrollReveal key={product._id} delay={i * 0.05}>
                  <Card className="group relative overflow-hidden hover:border-primary/30 transition-all duration-500">
                    <Link href={`/products/${product.slug}`}>
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-purple/10 flex items-center justify-center">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl font-display font-bold text-white/20">{product.name.charAt(0)}</span>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={() => removeMutation.mutate(product._id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-sm text-error hover:bg-error/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider">{product.brand}</p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold mt-1 hover:text-primary transition-colors">{product.name}</h3>
                      </Link>

                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                        ))}
                        <span className="text-xs text-white/40 ml-1">({product.numReviews})</span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-lg font-bold">{formatPrice(discountedPrice)}</span>
                          {product.discount > 0 && (
                            <span className="text-xs text-white/30 line-through ml-2">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <Button size="sm" variant="primary" onClick={(e) => { e.preventDefault(); addItem(product) }}>
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
