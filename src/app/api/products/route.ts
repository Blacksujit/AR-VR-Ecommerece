import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/services/product-service'

export const revalidate = 300

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const params = {
    page: Math.max(1, Number(searchParams.get('page')) || 1),
    limit: Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12)),
    keyword: searchParams.get('keyword') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    inStock: searchParams.get('inStock') === 'true' || undefined,
    arCompatible: searchParams.get('arCompatible') === 'true' || undefined,
    vrCompatible: searchParams.get('vrCompatible') === 'true' || undefined,
    sort: searchParams.get('sort') || undefined,
  }

  try {
    const result = await getProducts(params)
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[API/products] Error:', error)
    return NextResponse.json(
      { success: false, data: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } },
      { status: 500 }
    )
  }
}