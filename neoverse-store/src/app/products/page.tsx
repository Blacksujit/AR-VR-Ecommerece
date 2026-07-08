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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">All Products</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore our collection of premium futuristic products
          </p>
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
