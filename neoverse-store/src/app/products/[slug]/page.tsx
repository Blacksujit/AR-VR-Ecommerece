import { Suspense } from 'react'
import ProductDetailClient from './ProductDetailClient'
import { serverFetch } from '@/lib/server-api'
import type { ApiResponse } from '@/lib/api'
import type { Product } from '@/types'

export async function generateStaticParams() {
  try {
    const res = await serverFetch<ApiResponse<Product[]>>('/products?limit=50')
    const products = res?.data ?? []
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const res = await serverFetch<ApiResponse<Product>>(`/products/${slug}`)
    const product = res?.data
    if (product) {
      return { title: `${product.name} | NeoVerse Store` }
    }
  } catch {}
  return { title: 'Product Details | NeoVerse Store' }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductDetailClient slug={slug} />
    </Suspense>
  )
}
