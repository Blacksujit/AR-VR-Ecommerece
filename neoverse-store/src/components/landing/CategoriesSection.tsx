'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Gamepad2,
  Headphones,
  Monitor,
  Watch,
  Home,
  Camera,
  Code2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Card } from '@/components/ui/card'
import { api, type ApiResponse } from '@/lib/api'
import { cn } from '@/lib/utils'

interface Category {
  _id: string
  name: string
  slug: string
  image: string
  description: string
  productCount: number
}

const iconMap: Record<string, LucideIcon> = {
  'vr-headsets': Sparkles,
  'ar-glasses': Monitor,
  'controllers': Gamepad2,
  'wearables': Watch,
  'accessories': Home,
  'cameras': Camera,
  'audio': Headphones,
  'development-kits': Code2,
}

const gradientMap: Record<string, string> = {
  'vr-headsets': 'from-purple-500/20 to-purple-500/5',
  'ar-glasses': 'from-blue-500/20 to-blue-500/5',
  'controllers': 'from-red-500/20 to-red-500/5',
  'wearables': 'from-emerald-500/20 to-emerald-500/5',
  'accessories': 'from-gray-500/20 to-gray-500/5',
  'cameras': 'from-amber-500/20 to-amber-500/5',
  'audio': 'from-cyan-500/20 to-cyan-500/5',
  'development-kits': 'from-indigo-500/20 to-indigo-500/5',
}

export function CategoriesSection() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<ApiResponse<Category[]>>('/categories'),
    staleTime: 120_000,
  })

  const categories = res?.data ?? []

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Explore our curated collections across cutting-edge categories
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="min-h-[200px] sm:min-h-[240px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((category, index) => {
              const Icon = iconMap[category.slug] || Sparkles
              const gradient = gradientMap[category.slug] || 'from-primary/20 to-primary/5'
              return (
                <ScrollReveal key={category._id} delay={index * 0.1} direction="up">
                  <Link href={`/products?category=${category.slug}`}>
                    <Card
                      variant="glass"
                      className={cn(
                        'group relative overflow-hidden p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[200px] sm:min-h-[240px] cursor-pointer transition-all duration-500',
                        'hover:scale-[1.03] hover:border-primary/30 hover:shadow-[0_0_40px_rgba(91,127,255,0.15)]'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                          gradient
                        )}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white/60 group-hover:text-primary-light transition-colors duration-300" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-xs text-white/30 mt-1">
                            {category.productCount.toLocaleString()} Products
                          </p>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
