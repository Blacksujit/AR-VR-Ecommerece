import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const metadata = {
  title: 'Product Details | NeoVerse Store',
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ProductDetailClient slug={slug} />
}
