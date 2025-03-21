import { StarRating } from "./star-rating"

interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  date: string
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">{review.date}</span>
          </div>
          <h4 className="font-medium mb-1">{review.userName}</h4>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

