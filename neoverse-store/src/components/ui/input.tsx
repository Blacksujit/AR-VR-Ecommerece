import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-white/80">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
            icon && 'pl-12',
            error && 'border-error/50 focus:border-error/50 focus:ring-error/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export { Input }
