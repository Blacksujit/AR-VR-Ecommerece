'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface Spec {
  key: string
  value: string
}

interface SpecsTableProps {
  specs: Spec[]
}

export function SpecsTable({ specs }: SpecsTableProps) {
  if (!specs || specs.length === 0) return null

  return (
    <ScrollReveal>
      <Card variant="glass" className="p-6 sm:p-8">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Specifications</h2>
        <div className="space-y-0">
          {specs.map((spec, i) => (
            <div
              key={spec.key}
              className={cn(
                'flex items-center justify-between py-4',
                i < specs.length - 1 && 'border-b border-white/5'
              )}
            >
              <span className="text-white/50 text-sm">{spec.key}</span>
              <span className="text-white/90 text-sm font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </ScrollReveal>
  )
}
