import { cn } from '../../utils/cn'

const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'animate-pulse rounded-lg bg-neutral-200/80 motion-reduce:animate-none',
      className
    )}
    {...props}
  />
)

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-surface p-4 shadow-soft">
      <Skeleton className="mb-4 h-48 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export default Skeleton
