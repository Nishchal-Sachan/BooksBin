import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const variantStyles = {
  primary: 'ui-btn-primary bg-primary-800 shadow-soft hover:bg-primary-900 hover:shadow-card focus-visible:ring-primary-600/50',
  secondary:
    'ui-btn-secondary bg-neutral-200 text-ink hover:bg-neutral-300 focus-visible:ring-neutral-400/40',
  outline:
    'ui-btn-outline border border-neutral-300 bg-white text-ink-muted shadow-soft hover:border-neutral-400 hover:bg-surface-subtle focus-visible:ring-primary-500/30',
  ghost:
    'ui-btn-ghost text-ink-muted hover:bg-neutral-100 hover:text-ink focus-visible:ring-neutral-400/30',
  danger:
    'ui-btn-danger bg-error shadow-soft hover:bg-red-700 focus-visible:ring-error/40',
  inverse:
    'ui-btn-inverse bg-white text-primary-900 shadow-card hover:bg-primary-50 focus-visible:ring-white/50',
  outlineInverse:
    'ui-btn-outline-inverse border-2 border-white bg-transparent hover:bg-white/15 focus-visible:ring-white/40',
}

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2',
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
    const isLink = !isNativeButton

    return (
      <As
        ref={ref}
        type={isNativeButton ? type : undefined}
        disabled={disabled}
        data-ui="button"
        data-variant={variant}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100',
          variantStyles[variant],
          sizes[size],
          isLink && 'no-underline',
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
