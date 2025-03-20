import { StarRating } from "./star-rating"

interface RatingSummaryProps {
  averageRating: number
  totalReviews: number
  ratingCounts?: Record<number, number>
}

export function RatingSummary({ averageRating, totalReviews, ratingCounts = {} }: RatingSummaryProps) {
  // Find the maximum count to calculate proportional bar lengths
  const maxCount = ratingCounts ? Math.max(...Object.values(ratingCounts), 1) : 1

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} size="lg" />
        <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
      </p>

      {ratingCounts && (
        <div className="space-y-1 mt-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0
            // Calculate the proportional width based on the maximum count
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center w-12">
                  <span className="text-sm">{star}</span>
                  <StarRating rating={1} maxRating={1} size="sm" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}