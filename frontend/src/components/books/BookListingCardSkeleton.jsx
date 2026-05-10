import { Card } from '../ui/Card'
import Skeleton from '../ui/Skeleton'

export default function BookListingCardSkeleton() {
  return (
    <Card
      interactive={false}
      className="flex h-full flex-col overflow-hidden border-neutral-100 p-0 shadow-soft"
    >
      <Skeleton className="aspect-[3/4] w-full rounded-none rounded-t-xl" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </Card>
  )
}
