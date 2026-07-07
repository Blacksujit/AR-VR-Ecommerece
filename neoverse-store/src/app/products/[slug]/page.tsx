import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { serverFetch } from '@/lib/server-api'
import type { ApiResponse } from '@/lib/api'
import type { Product } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  try {
    const { slug } = await params
    const res = await serverFetch<ApiResponse<Product>>(`/products/${slug}`)
    if (res?.data?.name) {
      return { title: `${res.data.name} | NeoVerse Store` }
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

  let initialProduct: Product | null = null
  try {
    const res = await serverFetch<ApiResponse<Product>>(`/products/${slug}`)
    if (res?.data) initialProduct = res.data
  } catch {}

  if (!initialProduct) {
    // Let the client component handle the Not Found state
  }

  return <ProductDetailClient slug={slug} initialProduct={initialProduct} />
}
