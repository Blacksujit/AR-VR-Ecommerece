import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined)
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-paper">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">{icon}</div>}
        <input
          {...props}
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'min-h-11 w-full rounded-control border border-line bg-panel-soft px-4 py-3 text-paper placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-11',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
        />
      </div>
      {error && <p id={errorId} className="text-sm text-error" role="alert">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export { Input }
