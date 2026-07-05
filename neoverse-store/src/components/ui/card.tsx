import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow'
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'glass', ...props }, ref) => {
  const variants = {
    default: 'bg-surface border border-border rounded-2xl',
    glass: 'glass rounded-2xl',
    glow: 'glass rounded-2xl glow',
  }
  return <div ref={ref} className={cn(variants[variant], className)} {...props} />
})
Card.displayName = 'Card'

export { Card }
