import { Suspense } from 'react'
import ProductListingClient from './ProductListingClient'
import { serverFetch } from '@/lib/server-api'
import type { ApiResponse } from '@/lib/api'
import type { Product, Category } from '@/types'

export const metadata = {
  title: 'Products | NeoVerse Store',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  let initialProducts: Product[] = []
  let initialTotal = 0
  let initialPages = 0
  let initialCategories: (Category & { productCount: number })[] = []

  try {
    const [prodRes, catRes] = await Promise.allSettled([
      serverFetch<ApiResponse<Product[]>>('/products?page=1&limit=12'),
      serverFetch<ApiResponse<(Category & { productCount: number })[]>>('/categories'),
    ])
    if (prodRes.status === 'fulfilled') {
      initialProducts = prodRes.value.data ?? []
      initialTotal = prodRes.value.pagination?.total ?? 0
      initialPages = prodRes.value.pagination?.pages ?? 0
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
            initialData={initialProducts}
            initialPagination={{ total: initialTotal, pages: initialPages, page: 1, limit: 12 }}
            initialCategories={initialCategories}
          />
        </Suspense>
      </div>
    </div>
  )
}
