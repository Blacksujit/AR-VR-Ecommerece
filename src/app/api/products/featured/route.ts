import { NextResponse } from 'next/server'
import { getFeaturedProducts } from '@/lib/services/product-service'

export const revalidate = 300

export async function GET() {
  try {
    const result = await getFeaturedProducts(8)
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[API/products/featured] Error:', error)
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    )
  }
}