'use client'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function ScrollReveal({ children, className, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const { ref, isVisible } = useIntersectionObserver()

  const directionVariants = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: -60 },
    right: { x: 60 },
    none: {},
  }

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, ...directionVariants[direction] }}
        animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </div>
  )
}
