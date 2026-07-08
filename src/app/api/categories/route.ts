import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/services/product-service'

export const revalidate = 300

export async function GET() {
  try {
    const result = await getCategories()
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[API/categories] Error:', error)
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    )
  }
}