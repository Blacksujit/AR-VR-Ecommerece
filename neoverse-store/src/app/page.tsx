import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { TrustedBrands } from '@/components/landing/TrustedBrands'
import { WhyNeoVerse } from '@/components/landing/WhyNeoVerse'
import { HowARWorks } from '@/components/landing/HowARWorks'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { NewsletterSection } from '@/components/landing/NewsletterSection'
import { getFeaturedProducts, getCategories } from '@/lib/services/product-service'
import type { ProductItem, CategoryItem } from '@/lib/product-types'

export default async function HomePage() {
  let featuredData: ProductItem[] = []
  let categoriesData: (CategoryItem)[] = []

  try {
    const [featuredRes, catRes] = await Promise.allSettled([
      getFeaturedProducts(8),
      getCategories(),
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
