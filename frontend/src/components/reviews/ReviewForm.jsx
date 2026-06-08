import { useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { Card } from '../ui/Card'
import Button from '../ui/Button'
import StarRatingInput from './StarRatingInput'

export default function ReviewForm({
  bookId,
  orderId,
  existingReview,
  onSuccess,
  onCancel,
}) {
  const isEdit = Boolean(existingReview?._id)
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating < 1) {
      toast.error('Please select a star rating')
      return
    }
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      }

      if (isEdit) {
        await api.put(`/reviews/${existingReview._id}`, payload)
        toast.success('Review updated')
      } else {
        await api.post('/reviews', {
          ...payload,
          bookId,
          orderId,
        })
        toast.success('Thank you for your review!')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-primary-200 bg-primary-50/30 p-5 shadow-soft md:p-6">
      <h3 className="text-h3 text-ink">
        {isEdit ? 'Edit your review' : 'Write a review'}
      </h3>
      <p className="mt-1 text-body-sm text-ink-muted">
        {isEdit
          ? 'Update your rating and feedback for this product.'
          : 'Share your experience with other readers. Only verified buyers can review.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />

        <div>
          <label
            htmlFor="review-title"
            className="mb-2 block text-small font-semibold text-ink-muted"
          >
            Review title (optional)
          </label>
          <input
            id="review-title"
            type="text"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            className="input-field"
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-small font-semibold text-ink-muted"
          >
            Your review
          </label>
          <textarea
            id="review-comment"
            rows={4}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike? Would you recommend it?"
            className="input-field min-h-[120px] resize-y"
            disabled={submitting}
            required
          />
          <p className="mt-1 text-small text-ink-muted">
            {comment.length}/1000 · minimum 10 characters
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting
              ? 'Saving…'
              : isEdit
                ? 'Update review'
                : 'Submit review'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
