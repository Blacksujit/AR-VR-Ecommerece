import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { serverFetch } from '@/lib/server-api'
import type { ApiResponse } from '@/lib/api'
import type { Category } from '@/types'

export const metadata = {
  title: 'Categories | NeoVerse Store',
}

export default async function CategoriesPage() {
  let initialCategories: (Category & { productCount: number })[] = []
  try {
    const res = await serverFetch<ApiResponse<(Category & { productCount: number })[]>>('/categories')
    if (res?.data) initialCategories = res.data
  } catch {}

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 max-w-2xl">
          <p className="text-sm text-muted">Browse the collection</p>
          <h1 className="mt-2 text-4xl font-display font-medium tracking-tight md:text-5xl">Find the right object for your space</h1>
          <p className="mt-4 text-base leading-7 text-muted">Start with the way you live, work, listen, or make.</p>
        </div>
      </div>
      <CategoriesSection initialData={initialCategories} />
    </div>
  )
}
