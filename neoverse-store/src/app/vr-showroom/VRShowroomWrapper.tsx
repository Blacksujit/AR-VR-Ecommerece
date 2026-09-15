'use client'
import dynamic from 'next/dynamic'
import ProductRecommendations from '@/components/product/ProductRecommendations'

const VRShowroomScene = dynamic(
  () => import('@/components/ar-vr/VRShowroomScene').then(mod => ({ default: mod.VRShowroomScene })),
  { ssr: false }
)

export default function VRShowroomWrapper() {
  return (
    <div className="space-y-16">
      <VRShowroomScene />

      <section>
        <div className="mb-8 max-w-xl">
          <p className="text-sm text-muted">Keep inspecting</p>
          <h2 className="mt-2 text-2xl font-display font-medium md:text-3xl">More objects from the collection</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Compare another object without leaving the showroom.</p>
        </div>
        <ProductRecommendations productId="vr-showroom" limit={8} title="" />
      </section>
    </div>
  )
}
