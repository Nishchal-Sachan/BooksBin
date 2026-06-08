import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StarRatingInput({
  value = 0,
  onChange,
  size = 'md',
  disabled = false,
  label = 'Your rating',
}) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-8 w-8',
  }

  return (
    <div>
      <p className="mb-2 text-small font-semibold text-ink-muted">{label}</p>
      <div className="flex items-center gap-1" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(star)}
            className={cn(
              'rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={value >= star}
          >
            <Star
              className={cn(
                sizes[size],
                value >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-neutral-300'
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-body-sm font-medium text-ink">
            {value} / 5
          </span>
        )}
      </div>
    </div>
  )
}
