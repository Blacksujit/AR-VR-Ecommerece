import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/services/product-service'

export const revalidate = 300

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12))

  if (!q.trim()) {
    return NextResponse.json(
      { success: false, data: [], pagination: { total: 0 } },
      { status: 400 }
    )
  }

  try {
    const result = await searchProducts(q, limit)
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[API/products/search] Error:', error)
    return NextResponse.json(
      { success: false, data: [], pagination: { total: 0 } },
      { status: 500 }
    )
  }
}
