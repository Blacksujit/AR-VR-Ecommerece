'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Check,
  Share2,
  ChevronLeft,
  Box,
  Eye,
  Maximize2,
  Truck,
  Shield,
  RotateCcw,
  Clock,
  MessageCircle,
  X,
  Send,
  Smartphone,
} from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { api, type ApiResponse } from '@/lib/api'
import type { Product, Review } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useAuth } from '@/components/auth/AuthContext'
import ProductViewer from '@/components/product/ProductViewer'
const ARViewer = dynamic(() => import('@/components/ar-vr/ARViewer'), { ssr: false })
import ProductRecommendations from '@/components/product/ProductRecommendations'
import toast from 'react-hot-toast'

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

export default function ProductDetailClient({ slug, initialProduct }: { slug: string; initialProduct?: Product | null }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const addItem = useCartStore((s) => s.addItem)
  const { isInWishlist, toggleItem, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()
  const { user } = useAuth()
  const imageRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  const wishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isInWishlist(productId)) {
        await api.delete(`/wishlist/${productId}`)
        removeWishlist(productId)
      } else {
        await api.post('/wishlist', { productId })
        addWishlist(productId)
      }
    },
    onError: () => toast.error('Failed to update wishlist'),
  })

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<ApiResponse<Product>>(`/products/${slug}`),
    staleTime: 120_000,
    retry: 3,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 10000),
    ...(initialProduct ? { initialData: { success: true, data: initialProduct } } : {}),
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['product-reviews', slug],
    queryFn: () => api.get<{ success: boolean; data: Review[] }>(`/products/${slug}/reviews`),
    staleTime: 120_000,
    retry: 3,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 10000),
  })

  const reviewMutation = useMutation({
    mutationFn: (data: { rating: number; title: string; comment: string }) =>
      api.post(`/products/${slug}/reviews`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', slug] })
      queryClient.invalidateQueries({ queryKey: ['product', slug] })
      setShowReviewForm(false)
      setReviewForm({ rating: 5, title: '', comment: '' })
      toast.success('Review submitted!')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const product = apiData?.data ?? null
  const reviews = reviewsData?.data ?? []

  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product?.name, url }) } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }, [product?.name])

  const handleFullscreen = useCallback(() => {
    if (imageRef.current?.requestFullscreen) {
      imageRef.current.requestFullscreen().catch(() => {})
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <Box className="w-8 h-8 text-white/30" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-white/50 mb-8">The product you are looking for does not exist.</p>
        <Link href="/products">
          <Button variant="primary">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
  const gradient = getGradient(product)
  const badge = getBadge(product)
  const inWishlist = isInWishlist(product._id)

  const gradientVariants = [
    gradient,
    gradient.replace('600/20', '500/15').replace('600/20', '500/15'),
    gradient.replace('600/20', '700/25').replace('600/20', '700/25'),
    gradient.replace('600/20', '400/10').replace('600/20', '400/10'),
  ]

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`Added ${product.name} to cart`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white/70">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div ref={imageRef}>
            <div className={cn('relative aspect-square rounded-3xl bg-gradient-to-br flex items-center justify-center overflow-hidden', gradientVariants[selectedImage])}>
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-40 h-40 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-7xl font-display font-bold text-white/30">{product.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {badge && <Badge variant="gradient">{badge}</Badge>}
                {product.discount > 0 && <Badge variant="error">-{product.discount}%</Badge>}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {product.isARSupported && <Badge variant="primary">AR</Badge>}
                {product.isVRSupported && <Badge variant="primary">VR</Badge>}
              </div>
              <button onClick={handleFullscreen} className="absolute bottom-4 right-4 p-3 rounded-xl bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center border-2 transition-all',
                    gradientVariants[i] || gradient,
                    selectedImage === i ? 'border-primary' : 'border-transparent hover:border-white/20'
                  )}
                >
                  {product.images?.[i] ? (
                    <img src={product.images[i]} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-lg font-display font-bold text-white/30">{product.name.charAt(0)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-2">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('w-5 h-5', i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')}
                  />
                ))}
              </div>
              <span className="text-white/50 text-sm">{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-white">{formatPrice(discountedPrice)}</span>
              {product.discount > 0 && (
                <span className="text-xl text-white/30 line-through">{formatPrice(product.price)}</span>
              )}
              {product.discount > 0 && (
                <Badge variant="error">Save {product.discount}%</Badge>
              )}
            </div>

            <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="glass rounded-2xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center glass rounded-xl border border-glass-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button variant="primary" size="lg" className="w-full sm:w-auto flex-1 group" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                  Add to Cart - {formatPrice(discountedPrice * quantity)}
                </Button>

                <button
                  onClick={() => {
                    if (user) {
                      wishlistMutation.mutate(product._id)
                    } else {
                      toggleItem(product._id)
                      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
                    }
                  }}
                  className={cn('p-4 rounded-xl border transition-all', inWishlist
                    ? 'bg-error/10 border-error/30 text-error'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-error hover:border-error/30'
                  )}
                >
                  <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
                </button>

                <button onClick={handleShare} className="p-4 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {(product.isARSupported || product.isVRSupported) && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/10">
                  {product.isARSupported && (
                    <Button variant="glass" onClick={() => viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                      <Eye className="w-4 h-4" />
                      View in AR
                    </Button>
                  )}
                  {product.isVRSupported && (
                    <Button variant="glass" onClick={() => window.open('/vr-showroom', '_blank')}>
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
                <div key={item.label} className="glass rounded-xl p-4 text-center">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-white/80">{item.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <Card variant="glass" className="p-6 sm:p-8">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Specifications</h2>
                <div className="space-y-0">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={spec.key}
                      className={cn(
                        'flex items-center justify-between py-4',
                        i < product.specifications.length - 1 && 'border-b border-white/5'
                      )}
                    >
                      <span className="text-white/50 text-sm">{spec.key}</span>
                      <span className="text-white/90 text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card variant="glass" className="p-6 sm:p-8 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white">Customer Reviews</h2>
                  <Badge variant="gradient">{product.rating}/5 ({reviews.length})</Badge>
                </div>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-white/40 text-center py-8">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="pb-6 border-b border-white/5 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {review.user?.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{review.user?.name || 'Anonymous'}</span>
                                {review.isVerifiedPurchase && (
                                  <span className="text-xs text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-white/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn('w-3 h-3', i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')}
                                />
                              ))}
                            </div>
                            {review.title && <p className="text-sm font-medium text-white/80 mb-1">{review.title}</p>}
                            <p className="text-sm text-white/50">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  {showReviewForm ? (
                    <form onSubmit={(e) => { e.preventDefault(); reviewMutation.mutate(reviewForm) }} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/60">Rating:</span>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button key={r} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: r }))}>
                            <Star className={cn('w-5 h-5', r <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20')} />
                          </button>
                        ))}
                      </div>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-sm"
                        placeholder="Review title"
                        value={reviewForm.title}
                        onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                        required
                      />
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 min-h-[100px] resize-none text-sm"
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" isLoading={reviewMutation.isPending}>
                          <Send className="w-4 h-4" />
                          Submit Review
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button variant="glass" className="w-full" onClick={() => {
                      if (!user) { toast.error('Please sign in to review'); return }
                      setShowReviewForm(true)
                    }}>
                      <MessageCircle className="w-4 h-4" />
                      Write a Review
                    </Button>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollReveal delay={0.2}>
              <Card variant="glass" className="p-6 sm:p-8 sticky top-28" ref={viewerRef}>
                <h3 className="text-lg font-semibold text-white mb-4">3D View</h3>
                <ProductViewer modelUrl={product.modelUrl} productName={product.name} />
                <div className="mt-4">
                  <ARViewer modelUrl={product.modelUrl} productName={product.name} poster={product.images?.[0]} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
                  <Clock className="w-4 h-4" />
                  Est. delivery: 3-5 business days
                </div>
              </Card>
            </ScrollReveal>
            <ProductRecommendations productId={product._id} title="You May Also Like" />
          </div>
        </div>
      </div>
    </div>
  )
}
