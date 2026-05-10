import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-success-muted text-success-foreground',
  sale: 'bg-error-muted text-error-foreground',
  new: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200/80',
  outline: 'border border-neutral-200 bg-white text-neutral-600',
}

const Badge = ({ className, variant = 'default', children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium',
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
)

export default Badge
