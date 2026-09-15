import { Suspense } from 'react'
import ProductListingClient from './ProductListingClient'
import { getProducts, getCategories } from '@/lib/services/product-service'
import type { ProductItem, ProductsResponse, CategoriesResponse } from '@/lib/product-types'

export const metadata = {
  title: 'Products | NeoVerse Store',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  let initialData: ProductItem[] = []
  let initialPagination = { total: 0, pages: 0, page: 1, limit: 12 }
  let initialCategories: (import('@/lib/product-types').CategoryItem)[] = []

  try {
    const [prodRes, catRes] = await Promise.allSettled([
      getProducts({ page: 1, limit: 12 }),
      getCategories(),
    ])
    if (prodRes.status === 'fulfilled') {
      initialData = prodRes.value.data ?? []
      initialPagination = prodRes.value.pagination ?? { total: 0, pages: 0, page: 1, limit: 12 }
    }
    if (catRes.status === 'fulfilled') {
      initialCategories = catRes.value.data ?? []
    }
  } catch {}

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm text-muted">The collection</p>
          <h1 className="mt-2 text-4xl font-display font-medium tracking-tight md:text-5xl">Objects worth inspecting</h1>
          <p className="mt-4 text-base leading-7 text-muted">Compare dimensions, materials, availability, and spatial tools before you decide.</p>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-white/40">Loading products...</div>}>
          <ProductListingClient
            initialFilters={params}
            initialData={initialData}
            initialPagination={initialPagination}
            initialCategories={initialCategories}
          />
        </Suspense>
      </div>
    </div>
  )
}
