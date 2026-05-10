import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-primary-600 text-white shadow-soft hover:bg-primary-700 hover:shadow-card focus-visible:ring-primary-500/40',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:ring-neutral-400/30',
  outline:
    'border border-neutral-200 bg-white text-neutral-700 shadow-soft hover:border-neutral-300 hover:bg-surface-subtle focus-visible:ring-primary-500/25',
  ghost: 'text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-400/30',
  danger:
    'bg-error text-white shadow-soft hover:opacity-95 focus-visible:ring-error/40',
  inverse:
    'bg-white text-primary-700 shadow-card hover:bg-primary-50 focus-visible:ring-primary-500/35',
  outlineInverse:
    'border-2 border-white/90 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/35',
}

const sizes = {
  sm: 'h-9 px-3 text-small rounded-lg gap-1.5',
  md: 'h-11 px-4 text-body-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-body rounded-xl gap-2',
  icon: 'h-10 w-10 shrink-0 rounded-lg p-0',
}

const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled,
      as: As = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const isNativeButton = As === 'button'
    return (
      <As
        ref={ref}
        type={isNativeButton ? type : undefined}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100',
          variants[variant],
          sizes[size],
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </As>
    )
  }
)

Button.displayName = 'Button'

export default Button
