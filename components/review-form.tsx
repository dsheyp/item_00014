"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "./star-rating"
// Define the validation schema with Zod
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters long")
    .max(500, "Comment must be less than 500 characters"),
})
type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  courseId: number
  onReviewSubmitted: (review: {
    id: number
    rating: number
    comment: string
    userName: string
    date: string
  }) => void
  existingReviews: Array<{
    id: number
    rating: number
    comment: string
    userName: string
    date: string
  }>
}

export function ReviewForm({ courseId, onReviewSubmitted, existingReviews }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({})
  const { toast } = useToast()
  // Check if the current user has already submitted a review
  // In a real app, this would use the authenticated user's ID
  // For this demo, we'll assume "Current User" is the logged-in user
  useEffect(() => {
    const userReview = existingReviews.find((review) => review.userName === "Current User")
    if (userReview) {
      setHasReviewed(true)
      setRating(userReview.rating)
      setComment(userReview.comment)
    }
  }, [existingReviews])
  const validateForm = (): boolean => {
    try {
      reviewSchema.parse({ rating, comment })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { rating?: string; comment?: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0] === "rating") {
            formattedErrors.rating = err.message
          }
          if (err.path[0] === "comment") {
            formattedErrors.comment = err.message
          }
        })
        setErrors(formattedErrors)
      }
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call to submit review
    setTimeout(() => {
      // Create a new review object
      const newReview = {
        id: hasReviewed
          ? existingReviews.find((review) => review.userName === "Current User")?.id || Math.floor(Math.random() * 1000)
          : Math.floor(Math.random() * 1000),
        rating,
        comment,
        userName: "Current User", // In a real app, this would come from auth
        date: new Date().toLocaleDateString(),
      }

      onReviewSubmitted(newReview)

      // Don't reset form if it's an update
      if (!hasReviewed) {
        setHasReviewed(true)
      }
      setIsSubmitting(false)

      toast({
        title: hasReviewed ? "Review updated" : "Review submitted",
        description: hasReviewed ? "Your review has been updated!" : "Thank you for your feedback!",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">{hasReviewed ? "Your Rating" : "Your Rating"}</h4>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} interactive size="lg" onRatingChange={setRating} />
          <span className="text-sm text-muted-foreground">
            {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
          </span>
        </div>
        {errors.rating && <p className="text-sm font-medium text-destructive mt-1">{errors.rating}</p>}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">{hasReviewed ? "Edit Your Review" : "Your Review"}</h4>
        <Textarea
          placeholder="Share your experience with this course..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className={errors.comment ? "border-destructive" : ""}
        />
        {errors.comment && <p className="text-sm font-medium text-destructive">{errors.comment}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {hasReviewed ? "Updating..." : "Submitting..."}
          </>
        ) : hasReviewed ? (
          "Update Review"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  )
}

