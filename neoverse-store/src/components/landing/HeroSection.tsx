'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Sparkles, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleBackground } from '@/components/ui/particle-background'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Products', value: '50K+', suffix: '' },
  { label: 'Happy Customers', value: '100K+', suffix: '' },
  { label: 'Categories', value: '20+', suffix: '' },
]

const floatingPills = [
  { text: 'AR Ready', x: '15%', y: '20%', delay: 0 },
  { text: 'AI Powered', x: '75%', y: '15%', delay: 1 },
  { text: '3D Shopping', x: '80%', y: '60%', delay: 2 },
  { text: 'VR Showroom', x: '10%', y: '70%', delay: 0.5 },
]

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const numeric = parseInt(value.replace(/[^0-9]/g, ''))
  return (
    <span>
      {numeric}
      {value.includes('+') ? '+' : ''}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,127,255,0.08)_0%,transparent_70%)]" />

      {floatingPills.map((pill) => (
        <motion.div
          key={pill.text}
          className="absolute hidden lg:block"
          style={{ left: pill.x, top: pill.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pill.delay, duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="glass rounded-full px-4 py-2 text-sm text-white/60 whitespace-nowrap"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, delay: pill.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {pill.text}
          </motion.div>
        </motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 text-center lg:text-left"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary-light mb-8">
                  <Sparkles className="w-4 h-4" />
                  Next-Gen Shopping Experience
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] tracking-tight"
              >
                <span className="text-white">The Future of</span>
                <br />
                <span className="gradient-text">Shopping Begins Here.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg sm:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Step into the next dimension of e-commerce. Explore products in
                immersive AR/VR, powered by AI recommendations that understand
                your style.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link href="/products">
                  <Button variant="primary" size="xl" className="group">
                    <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                    Explore Products
                  </Button>
                </Link>
                <Link href="/vr-showroom">
                  <Button variant="glass" size="xl" className="group">
                    <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    Experience VR
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-16 flex items-center justify-center lg:justify-start gap-10 sm:gap-14"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-display font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex-1 relative w-full max-w-lg lg:max-w-none"
            >
              <div className="relative aspect-square w-full">
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-primary/20 via-purple/10 to-accent/10 animate-pulse-glow" />
                <div className="absolute inset-4 rounded-[32px] glass flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-6 animate-float">
                      <ShoppingBag className="w-10 h-10 text-white/80" />
                    </div>
                    <p className="text-white/40 text-sm">3D Product Preview</p>
                    <p className="text-white/20 text-xs mt-1">Loading immersive experience...</p>
                  </div>
                </div>
                <div className="absolute -inset-4 rounded-[48px] border border-primary/10 -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
