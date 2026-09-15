'use client'

import ProductViewer from '@/components/product/ProductViewer'

export function Hero3DModel() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-media bg-ink">
      <ProductViewer productName="Featured product" />
    </div>
  )
}
