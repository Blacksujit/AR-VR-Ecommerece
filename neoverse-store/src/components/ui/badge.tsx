import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gradient' | 'accent'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/80',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    gradient: 'gradient-border text-white bg-white/5',
    accent: 'bg-accent/20 text-accent',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium', variants[variant], className)} {...props} />
  )
}
