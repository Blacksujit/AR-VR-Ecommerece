import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow'
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'rounded-surface border border-line bg-panel',
    glass: 'rounded-surface border border-line bg-panel/85 backdrop-blur-xl',
    glow: 'rounded-surface border border-electric/25 bg-panel',
  }

  return <div ref={ref} className={cn(variants[variant], className)} {...props} />
})

Card.displayName = 'Card'

export { Card }
