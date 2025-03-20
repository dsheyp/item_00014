"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "./star-rating"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
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
        <h4 className="font-medium">{hasReviewed ? "Your Review" : "Your Rating"}</h4>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} interactive size="lg" onRatingChange={setRating} />
          <span className="text-sm text-muted-foreground">
            {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">{hasReviewed ? "Edit Your Review" : "Your Review"}</h4>
        <Textarea
          placeholder="Share your experience with this course..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
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

