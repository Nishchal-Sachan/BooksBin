import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StarDisplay({ value = 0, className, size = 'md' }) {
  const v = Math.round((value || 0) * 2) / 2
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]',
    lg: 'h-5 w-5',
  }

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const full = v >= i
        const half = !full && v >= i - 0.5
        return (
          <Star
            key={i}
            className={cn(
              sizes[size],
              full && 'fill-amber-400 text-amber-400',
              half && 'fill-amber-400/50 text-amber-400',
              !full && !half && 'text-neutral-300'
            )}
            aria-hidden
          />
        )
      })}
    </div>
  )
}
