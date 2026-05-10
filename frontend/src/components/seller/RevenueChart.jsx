import { TrendingUp } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function RevenueChart({ data, className }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  const totalPeriod = data.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className={cn('rounded-2xl border border-neutral-200/90 bg-surface p-6 shadow-soft md:p-8', className)}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-h3 text-neutral-900">Revenue trend</h2>
          <p className="mt-1 text-body-sm text-neutral-500">
            Mock gross revenue by month — illustrative only
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50/80 px-3 py-2 text-small font-medium text-primary-800">
          <TrendingUp className="h-4 w-4" />
          6-mo sum {formatPrice(totalPeriod)}
        </div>
      </div>

      <div className="flex h-52 items-end gap-2 sm:gap-3 md:h-56">
        {data.map((d) => {
          const pct = Math.max(8, (d.revenue / max) * 100)
          return (
            <div
              key={d.key}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-small font-semibold tabular-nums text-neutral-600">
                {(d.revenue / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 shadow-soft transition-transform hover:scale-[1.02] sm:max-w-none"
                style={{ height: `${pct}%` }}
                title={formatPrice(d.revenue)}
              />
              <span className="text-small font-medium text-neutral-500">
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
