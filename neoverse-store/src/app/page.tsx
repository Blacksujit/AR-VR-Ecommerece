import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { TrustedBrands } from '@/components/landing/TrustedBrands'
import { WhyNeoVerse } from '@/components/landing/WhyNeoVerse'
import { HowARWorks } from '@/components/landing/HowARWorks'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { NewsletterSection } from '@/components/landing/NewsletterSection'
import { serverFetch } from '@/lib/server-api'
import type { ApiResponse } from '@/lib/api'
import type { Product, Category } from '@/types'

export default async function HomePage() {
  let featuredData: Product[] = []
  let categoriesData: (Category & { productCount: number })[] = []

  try {
    const [featuredRes, catRes] = await Promise.allSettled([
      serverFetch<ApiResponse<Product[]>>('/products/featured'),
      serverFetch<ApiResponse<(Category & { productCount: number })[]>>('/categories'),
    ])
    if (featuredRes.status === 'fulfilled') featuredData = featuredRes.value.data ?? []
    if (catRes.status === 'fulfilled') categoriesData = catRes.value.data ?? []
  } catch {}

  return (
    <main>
      <AuthRedirect />
      <HeroSection />
      <TrustedBrands />
      <CategoriesSection initialData={categoriesData} />
      <FeaturedProducts initialData={featuredData} />
      <WhyNeoVerse />
      <HowARWorks />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
