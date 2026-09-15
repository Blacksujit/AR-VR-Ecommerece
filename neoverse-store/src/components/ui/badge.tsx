import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gradient' | 'accent'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border border-line bg-panel-soft text-muted',
    primary: 'border border-electric/25 bg-electric/10 text-electric',
    success: 'border border-accent/25 bg-accent/10 text-accent',
    warning: 'border border-warning/25 bg-warning/10 text-warning',
    error: 'border border-error/25 bg-error/10 text-error',
    gradient: 'border border-electric/25 bg-electric/10 text-paper',
    accent: 'border border-accent/25 bg-accent/10 text-accent',
  }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props} />
  )
}
