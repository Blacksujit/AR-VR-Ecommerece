import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/services/product-service'

export const revalidate = 300

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const result = await getProductBySlug(slug)
    if (!result.data) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error(`[API/products/${slug}] Error:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}