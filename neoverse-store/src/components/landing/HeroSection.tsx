'use client'

import { useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Rotate3D } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Hero3DModel = dynamic(
  () => import('@/components/landing/Hero3DModel').then((m) => ({ default: m.Hero3DModel })),
  { ssr: false }
)

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line">

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-24">
        <motion.div style={{ y, opacity }} className="max-w-2xl">
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-electric"
          >
            <span className="h-px w-8 bg-electric" aria-hidden="true" />
            Product inspection, before checkout
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: easeOut }}
            className="max-w-xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-paper sm:text-6xl lg:text-7xl"
          >
            Make the decision before the delivery.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: easeOut }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-muted"
          >
            Compare the details that matter, inspect supported products in 3D, and move to checkout with fewer unanswered questions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: easeOut }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/products">
              <Button size="xl" className="w-full sm:w-auto">
                Explore products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vr-showroom">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                Visit the showroom
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4, ease: easeOut }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted"
          >
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Price and stock shown clearly</span>
            <span className="flex items-center gap-2"><Rotate3D className="h-4 w-4 text-electric" /> 3D tools where supported</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: easeOut }}
          className="relative mx-auto w-full max-w-155"
        >
          <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Interactive product stage</span>
            <span className="flex items-center gap-1"><Rotate3D className="h-3.5 w-3.5" /> Drag to inspect</span>
          </div>
          <div className="rounded-media border border-line bg-panel p-2 shadow-elevated sm:p-3">
            <Hero3DModel />
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted">
            <span>Product evidence stage</span>
            <span>Drag, zoom, reset</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
