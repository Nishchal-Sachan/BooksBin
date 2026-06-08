import { cn } from '../../utils/cn'

export function Card({ className, interactive, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-surface shadow-soft',
        interactive &&
          'transition-card hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-card motion-reduce:transform-none motion-reduce:hover:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardImage({ className, ...props }) {
  return (
    <div
      className={cn('overflow-hidden rounded-t-xl bg-surface-muted', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4 md:p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        'mt-auto flex flex-wrap items-center gap-2 border-t border-neutral-200 p-4 md:p-5 pt-4',
        className
      )}
      {...props}
    />
  )
}
