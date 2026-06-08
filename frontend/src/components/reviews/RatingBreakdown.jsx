import StarDisplay from './StarDisplay'

const STARS = [5, 4, 3, 2, 1]

function starCount(distribution, star) {
  if (distribution[star] != null) return distribution[star]
  const keys = { 5: 'five', 4: 'four', 3: 'three', 2: 'two', 1: 'one' }
  return distribution[keys[star]] || 0
}

export default function RatingBreakdown({
  averageRating = 0,
  totalReviews = 0,
  distribution = {},
}) {
  const max = Math.max(...STARS.map((s) => starCount(distribution, s)), 1)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-ink tabular-nums">
          {averageRating.toFixed(1)}
        </span>
        <div>
          <StarDisplay value={averageRating} size="lg" />
          <p className="mt-1 text-small text-ink-muted">
            {totalReviews.toLocaleString()} review
            {totalReviews === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {STARS.map((star) => {
          const count = starCount(distribution, star)
          const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2 text-small">
              <span className="w-8 text-ink-muted">{star}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-ink-muted">
                {Math.round(pct)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
