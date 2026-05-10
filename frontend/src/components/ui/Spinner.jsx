import { cn } from '../../utils/cn'

const sizes = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-[3px]',
}

export default function Spinner({ className, size = 'md', label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-primary-200 border-t-primary-600 motion-reduce:animate-none',
          sizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
