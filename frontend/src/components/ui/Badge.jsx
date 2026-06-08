import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-neutral-200 text-ink-muted',
  primary: 'bg-primary-100 text-primary-900',
  secondary: 'bg-secondary-100 text-secondary-900',
  success: 'bg-success-muted text-success-foreground',
  sale: 'bg-error text-white',
  new: 'bg-accent-100 text-accent-800 ring-1 ring-inset ring-accent-300',
  outline: 'border border-neutral-300 bg-white text-ink-muted',
}

const Badge = ({ className, variant = 'default', children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-semibold',
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
)

export default Badge
