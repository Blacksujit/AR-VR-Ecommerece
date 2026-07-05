'use client'
import { lazy } from 'react'
import ProductRecommendations from '@/components/product/ProductRecommendations'

const VRShowroomScene = lazy(() =>
  import('@/components/ar-vr/VRShowroomScene').then(mod => ({ default: mod.VRShowroomScene }))
)

export default function VRShowroomWrapper() {
  return (
    <div className="space-y-16">
      <VRShowroomScene />

      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Explore More Products</span>
          </h2>
          <p className="text-white/50 mt-2 max-w-xl mx-auto">
            Discover other items you might love, recommended just for you
          </p>
        </div>
        <ProductRecommendations productId="vr-showroom" limit={8} title="" />
      </section>
    </div>
  )
}
