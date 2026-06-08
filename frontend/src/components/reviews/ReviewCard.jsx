import { ThumbsUp, BadgeCheck } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/format'
import { Card } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import StarDisplay from './StarDisplay'

function initials(name = 'R') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
  onHelpful,
  showActions = false,
}) {
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const userId = user?._id || user?.id
  const reviewUserId = review.user?._id || review.user?.id
  const isOwner = userId && reviewUserId && String(userId) === String(reviewUserId)
  const helpfulCount = review.helpful?.count ?? 0
  const userMarkedHelpful = review.helpful?.users?.includes?.(user?._id)

  const handleHelpful = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to mark reviews as helpful')
      return
    }
    try {
      const { data } = await api.post(`/reviews/${review._id}/helpful`)
      onHelpful?.(review._id, data.helpfulCount)
      toast.success('Marked as helpful')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update')
    }
  }

  return (
    <Card className="border-neutral-200 p-5 shadow-soft md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-800 text-small font-bold text-white"
            aria-hidden
          >
            {initials(review.user?.name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">
                {review.user?.name || 'Reader'}
              </p>
              {review.isVerified && (
                <Badge variant="success" className="gap-1">
                  <BadgeCheck className="h-3 w-3" />
                  Verified purchase
                </Badge>
              )}
            </div>
            <StarDisplay value={review.rating} className="mt-1" />
          </div>
        </div>
        <time className="text-small text-ink-muted">
          {formatDate(review.createdAt)}
        </time>
      </div>

      {review.title && (
        <p className="mt-3 font-semibold text-ink">{review.title}</p>
      )}
      <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
        {review.comment}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={userMarkedHelpful}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-small font-medium text-ink-muted transition-colors hover:bg-neutral-100 hover:text-ink disabled:opacity-60"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({helpfulCount})
        </button>

        {(showActions || isOwner) && isOwner && (
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit?.(review)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-error hover:text-error"
              onClick={() => onDelete?.(review)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
