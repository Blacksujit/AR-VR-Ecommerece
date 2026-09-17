'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Box,
  Eye,
  Clock,
} from 'lucide-react'
import { cn, formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProductImage } from '@/components/ui/ProductImage'
import { useProduct } from '@/lib/hooks/useProducts'
import { api } from '@/lib/api'
import type { ProductItem } from '@/lib/product-types'
import type { Review } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useAuth } from '@/components/auth/AuthContext'
import ProductViewer from '@/components/product/ProductViewer'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductInfo } from '@/components/products/ProductInfo'
import { SpecsTable } from '@/components/products/SpecsTable'
import { ReviewsSection } from '@/components/products/ReviewsSection'
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

function getGradient(category: string): string {
  return gradientMap[category] || 'from-primary/20 to-accent/20'
}

function getBadge(product: ProductItem): string | null {
  if (product.discount > 20) return 'Hot Deal'
  if (product.featured) return 'Best Seller'
  if (product.newArrival) return 'New'
  if (product.trending) return 'Popular'
  if (product.discount > 0) return `-${product.discount}%`
  return null
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const { isInWishlist, toggleItem, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()
  const { user } = useAuth()
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

  const { data: apiData, isLoading } = useProduct(slug)

  const { data: reviewsData } = useQuery({
    queryKey: ['product-reviews', slug],
    queryFn: () => api.get<{ success: boolean; data: Review[] }>(`/products/${slug}/reviews`),
    staleTime: 120_000,
    enabled: !!apiData?.data,
  })

  const reviewMutation = useMutation({
    mutationFn: (data: { rating: number; title: string; comment: string }) =>
      api.post(`/products/${slug}/reviews`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', slug] })
      queryClient.invalidateQueries({ queryKey: ['product', slug] })
      toast.success('Review submitted!')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const product = apiData?.data ?? null
  const legacyProduct = product ? {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    category: product.category,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    images: product.images,
    modelUrl: product.modelUrl || '',
    specifications: product.specifications,
    rating: product.rating,
    numReviews: product.numReviews,
    isARSupported: product.isARSupported,
    isVRSupported: product.isVRSupported,
    aiScore: product.aiScore,
    featured: product.featured,
    trending: product.trending,
    newArrival: product.newArrival,
    flashSale: product.flashSale,
    tags: product.tags,
    createdAt: '',
    updatedAt: '',
  } : null
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
  const gradient = getGradient(product.category)
  const badge = getBadge(product)
  const hasVerified3D = !!product.modelUrl && /^https:\/\//i.test(product.modelUrl) && /\.(glb|gltf)(?:[?#].*)?$/i.test(product.modelUrl)
  const hasVerifiedAR = hasVerified3D && product.isARSupported === true
  const inWishlist = isInWishlist(product._id)

  const gradientVariants = [
    gradient,
    gradient.replace('600/20', '500/15').replace('600/20', '500/15'),
    gradient.replace('600/20', '700/25').replace('600/20', '700/25'),
    gradient.replace('600/20', '400/10').replace('600/20', '400/10'),
  ]

  const handleAddToCart = () => {
    if (legacyProduct) addItem(legacyProduct, quantity)
    toast.success(`Added ${product.name} to cart`)
  }

  const galleryBadges = [
    ...(badge ? [{ label: badge, variant: 'gradient' as const }] : []),
    ...(product.discount > 0 ? [{ label: `-${product.discount}%`, variant: 'error' as const }] : []),
  ]

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
          <ProductGallery
            images={product.images || []}
            name={product.name}
            gradient={gradientVariants[selectedImage]}
            selectedIndex={selectedImage}
            onSelectImage={setSelectedImage}
          >
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {galleryBadges.map((b, i) => (
                <Badge key={i} variant={b.variant}>{b.label}</Badge>
              ))}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {hasVerifiedAR && <Badge variant="primary">AR</Badge>}
              {hasVerified3D && product.isVRSupported === true && <Badge variant="primary">VR</Badge>}
            </div>
          </ProductGallery>

          <ProductInfo
            product={product}
            inWishlist={inWishlist}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => {
              if (user) {
                wishlistMutation.mutate(product._id)
              } else {
                toggleItem(product._id)
                toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
              }
            }}
            onShare={handleShare}
            onViewAR={() => viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <SpecsTable specs={product.specifications || []} />
            <ReviewsSection
              reviews={reviews}
              rating={product.rating}
              isAuthenticated={!!user}
              isSubmitting={reviewMutation.isPending}
              onSubmitReview={(data) => reviewMutation.mutate(data)}
            />
          </div>

          <div className="space-y-6">
            <ScrollReveal delay={0.2}>
              <Card variant="glass" className="p-6 sm:p-8 sticky top-28" ref={viewerRef}>
                <h3 className="text-lg font-semibold text-white mb-4">3D View</h3>
                <ProductViewer
                  modelUrl={product.modelUrl}
                  productName={product.name}
                  imageUrl={product.images?.[0]}
                  specifications={product.specifications}
                />
                <div className="mt-4">
                  <ARViewer
                    modelUrl={product.modelUrl}
                    modelUsdzUrl={product.modelUsdzUrl}
                    productName={product.name}
                    poster={product.images?.[0]}
                    arSupported={hasVerifiedAR}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
                  <Clock className="w-4 h-4" />
                  Est. delivery: 3-5 business days
                </div>
              </Card>
            </ScrollReveal>
            <ProductRecommendations productId={product._id} category={product.category} title="You May Also Like" />
          </div>
        </div>
      </div>
    </div>
  )
}
