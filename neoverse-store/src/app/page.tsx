import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { TrustedBrands } from '@/components/landing/TrustedBrands'
import { WhyNeoVerse } from '@/components/landing/WhyNeoVerse'
import { HowARWorks } from '@/components/landing/HowARWorks'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { NewsletterSection } from '@/components/landing/NewsletterSection'

export default function HomePage() {
  return (
    <main>
      <AuthRedirect />
      <HeroSection />
      <TrustedBrands />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyNeoVerse />
      <HowARWorks />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
