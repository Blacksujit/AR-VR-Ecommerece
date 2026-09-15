'use client'

import Link from 'next/link'
import { useCategories } from '@/lib/hooks/useProducts'
import {

  Monitor,
  Watch,
  Home,
  Camera,

  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Card } from '@/components/ui/card'
import type { CategoryItem } from '@/lib/product-types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  'beauty': Sparkles,
  'fragrances': Sparkles,
  'furniture': Home,
  'groceries': Home,
  'home-decoration': Home,
  'kitchen-accessories': Home,
  'laptops': Monitor,
  'mens-shirts': Sparkles,
  'mens-shoes': Sparkles,
  'mens-watches': Watch,
  'mobile-accessories': Monitor,
  'motorcycle': Sparkles,
  'skin-care': Sparkles,
  'smartphones': Monitor,
  'sports-accessories': Sparkles,
  'sunglasses': Camera,
  'tablets': Monitor,
  'tops': Sparkles,
  'vehicle': Sparkles,
  'womens-bags': Sparkles,
  'womens-dresses': Sparkles,
  'womens-jewellery': Sparkles,
  'womens-shoes': Sparkles,
  'womens-watches': Watch,
}

const gradientMap: Record<string, string> = {
  'beauty': 'from-pink-500/20 to-pink-500/5',
  'fragrances': 'from-purple-500/20 to-purple-500/5',
  'furniture': 'from-amber-500/20 to-amber-500/5',
  'groceries': 'from-green-500/20 to-green-500/5',
  'home-decoration': 'from-orange-500/20 to-orange-500/5',
  'kitchen-accessories': 'from-yellow-500/20 to-yellow-500/5',
  'laptops': 'from-blue-500/20 to-blue-500/5',
  'mens-shirts': 'from-gray-500/20 to-gray-500/5',
  'mens-shoes': 'from-slate-500/20 to-slate-500/5',
  'mens-watches': 'from-emerald-500/20 to-emerald-500/5',
  'mobile-accessories': 'from-cyan-500/20 to-cyan-500/5',
  'motorcycle': 'from-red-500/20 to-red-500/5',
  'skin-care': 'from-pink-500/20 to-pink-500/5',
  'smartphones': 'from-indigo-500/20 to-indigo-500/5',
  'sports-accessories': 'from-lime-500/20 to-lime-500/5',
  'sunglasses': 'from-teal-500/20 to-teal-500/5',
  'tablets': 'from-blue-500/20 to-blue-500/5',
  'tops': 'from-rose-500/20 to-rose-500/5',
  'vehicle': 'from-sky-500/20 to-sky-500/5',
  'womens-bags': 'from-violet-500/20 to-violet-500/5',
  'womens-dresses': 'from-fuchsia-500/20 to-fuchsia-500/5',
  'womens-jewellery': 'from-amber-500/20 to-amber-500/5',
  'womens-shoes': 'from-pink-500/20 to-pink-500/5',
  'womens-watches': 'from-emerald-500/20 to-emerald-500/5',
}

interface CategoriesSectionProps {
  initialData?: CategoryItem[]
}

export function CategoriesSection({ initialData }: CategoriesSectionProps) {
  const { data: res, isLoading } = useCategories(initialData)

  const categories = res?.data ?? []

  return (
    <section className="relative border-b border-line py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="mb-3 text-sm font-medium text-electric">Start with what matters</p>
            <h2 className="text-3xl font-display font-semibold tracking-tight text-paper sm:text-4xl lg:text-5xl">
              Find your next object
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Browse by category, then inspect the products in the space where they will live.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="min-h-50 animate-pulse sm:min-h-60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.slice(0, 8).map((category, index) => {
              const Icon = iconMap[category.slug] || Sparkles
              const gradient = gradientMap[category.slug] || 'from-primary/20 to-primary/5'
              return (
                <ScrollReveal key={category._id} delay={index * 0.1} direction="up">
                  <Link href={`/products?category=${category.slug}`}>
                    <Card
                      variant="glass"
                      className={cn(
                        'group relative flex min-h-50 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-surface border border-line bg-panel p-6 text-center transition-[border-color,box-shadow,transform] duration-200 sm:min-h-60 sm:p-8',
                        'hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                          gradient
                        )}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-control border border-line bg-panel-soft transition-colors duration-200 group-hover:bg-electric/10 sm:h-16 sm:w-16">
                          <Icon className="h-7 w-7 text-muted transition-colors duration-200 group-hover:text-electric sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-paper transition-colors duration-200 group-hover:text-electric sm:text-lg">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted">
                            {category.productCount.toLocaleString()} Products
                          </p>
                        </div>
                      </div>


                    </Card>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
