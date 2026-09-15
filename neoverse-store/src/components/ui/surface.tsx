import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'panel' | 'soft' | 'media' | 'outline' | 'floating'
}

const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = 'panel', ...props }, ref) => {
    const variants = {
      panel: 'rounded-surface border border-line bg-panel',
      soft: 'rounded-control border border-line bg-panel-soft',
      media: 'rounded-media overflow-hidden bg-ink',
      outline: 'rounded-surface border border-line bg-transparent',
      floating: 'rounded-control border border-line bg-panel/95 shadow-elevated backdrop-blur-xl',
    }

    return <div ref={ref} className={cn(variants[variant], className)} {...props} />
  }
)

Surface.displayName = 'Surface'

export { Surface }
