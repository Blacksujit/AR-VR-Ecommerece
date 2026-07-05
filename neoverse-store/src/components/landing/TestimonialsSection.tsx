'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Card } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Tech Enthusiast',
    quote:
      'The AR preview feature is revolutionary. I placed a gaming chair in my room before buying — it was like having a showroom at home. Never going back to traditional online shopping.',
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Digital Creator',
    quote:
      'NeoVerse completely changed how I shop for tech. The AI recommendations are scarily accurate — it suggested a monitor that perfectly matches my setup. The VR showroom is mind-blowing.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Early Adopter',
    quote:
      'From browsing to delivery in under 48 hours, and the AR try-on made me confident about my purchase. This is what e-commerce should have been from the start.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Smart Home Builder',
    quote:
      'Being able to visualize how a smart speaker would look in my kitchen through AR saved me from making expensive mistakes. The product quality matches the premium experience.',
    rating: 4,
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  const testimonial = testimonials[current]

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              What Our <span className="gradient-text">Community Says</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Join thousands of satisfied shoppers experiencing the future of retail
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
            <button
              onClick={goPrev}
              className="absolute -left-4 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-full overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full"
                >
                  <Card
                    variant="glass"
                    className="p-8 sm:p-10 lg:p-12 text-center relative"
                  >
                    <Quote className="w-10 h-10 text-primary/20 mx-auto mb-6" />

                    <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-semibold text-white">
                        {getInitials(testimonial.name)}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-white/40">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={goNext}
              className="absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'w-8 bg-primary'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
