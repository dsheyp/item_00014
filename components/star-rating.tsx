"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const starClass = sizeClasses[size]

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1
        const isFilled = interactive ? starValue <= (hoverRating || rating) : starValue <= rating

        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} p-0.5`}
            onClick={() => {
              if (interactive && onRatingChange) {
                onRatingChange(starValue)
              }
            }}
            onMouseEnter={() => {
              if (interactive) {
                setHoverRating(starValue)
              }
            }}
            onMouseLeave={() => {
              if (interactive) {
                setHoverRating(0)
              }
            }}
            disabled={!interactive}
          >
            <Star
              className={`${starClass} ${
                isFilled ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

