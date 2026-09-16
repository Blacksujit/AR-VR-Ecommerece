import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatusProps {
  children: ReactNode
  tone?: 'neutral' | 'positive' | 'warning' | 'negative' | 'electric'
  className?: string
}

const tones = {
  neutral: 'border-line bg-panel-soft text-muted',
  positive: 'border-accent/30 bg-accent/10 text-accent',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  negative: 'border-error/30 bg-error/10 text-error',
  electric: 'border-electric/30 bg-electric/10 text-electric-strong',
}

export function Status({ children, tone = 'neutral', className }: StatusProps) {
  return (
    <span className={cn('inline-flex min-h-7 items-center gap-2 rounded-status border px-2.5 text-xs font-medium', tones[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
