import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EvidenceRowProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  detail?: string
  tone?: 'default' | 'positive' | 'warning' | 'negative'
  className?: string
}

const toneClasses = {
  default: 'text-paper',
  positive: 'text-accent',
  warning: 'text-warning',
  negative: 'text-error',
}

export function EvidenceRow({ label, value, icon, detail, tone = 'default', className }: EvidenceRowProps) {
  return (
    <div className={cn('flex items-start gap-3 border-b border-line py-3 last:border-b-0', className)}>
      {icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-panel-soft text-muted" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">{label}</span>
          <span className={cn('text-right text-sm font-medium tabular-nums', toneClasses[tone])}>{value}</span>
        </div>
        {detail ? <p className="mt-1 text-xs leading-relaxed text-faint">{detail}</p> : null}
      </div>
    </div>
  )
}
