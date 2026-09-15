'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-electric text-ink hover:bg-primary-light shadow-glow',
      secondary: 'bg-panel-soft text-paper border border-line hover:border-border-hover hover:bg-panel',
      ghost: 'text-muted hover:text-paper hover:bg-panel-soft',
      outline: 'border border-electric/60 text-electric hover:bg-electric/10',
      glass: 'glass glass-hover text-paper',
    }
    const sizes = {
      sm: 'min-h-9 px-3 text-sm',
      md: 'min-h-11 px-5 text-sm',
      lg: 'min-h-12 px-7 text-base',
      xl: 'min-h-14 px-8 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
