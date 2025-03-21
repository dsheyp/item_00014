"use client"

import { useState, useEffect, use } from "react"

import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, Heart, MessageSquare, Users, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingSummary } from "@/components/rating-summary"
import { ReviewForm } from "@/components/review-form"
import { ReviewList } from "@/components/review-list"
import { StarRating } from "@/components/star-rating"
import { useEnrollment } from "@/contexts/enrollment-context"
import { allCourses, type Course } from "@/data/courses"
import { useToast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Extended review interface
interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  date: string
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()

  const courseId = Number.parseInt(id)
  // Find the course in allCourses
  const foundCourse = allCourses.find(course => course.id === courseId)

  // If course not found, use a default course or handle the error
  const initialCourse: Course = foundCourse || {
    id: 0,
    title: "Course Not Found",
    description: "This course does not exist or has been removed.",
    category: "Unknown",
    level: "Unknown",
    students: 0,
    lessons: 0,
    image: "/placeholder.svg?height=400&width=800",
    rating: 0,
    reviews: [],
    price: 0,
    longDescription: "Course not found.",
    duration: "0 hours",
    lastUpdated: "Unknown",
    instructor: {
      name: "Unknown",
      bio: "Unknown",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [],
    ratings: {
      average: 0,
      total: 0,
      distribution: {},
      },
  }

  const [course, setCourse] = useState<Course>(initialCourse)
  const {
    isEnrolled,
    enrollInCourse,
    unenrollFromCourse,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    pendingUnenrollments,
    pendingWishlistRemovals,
  } = useEnrollment()
  const [enrolled, setEnrolled] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)


  // Check enrollment and wishlist status when component mounts
  useEffect(() => {
    setEnrolled(isEnrolled(courseId))
    setInWishlist(isInWishlist(courseId))
  }, [courseId, isEnrolled, isInWishlist])






  const handleEnroll = () => {
    // In a real app, this would make an API call to enroll the user
    enrollInCourse({
      id: course.id,
      title: course.title,
      image: course.image,
      lessons: course.lessons,
    })
    setEnrolled(true)
  }


  const handleUnenroll = () => {

    setIsAlertOpen(false)
      unenrollFromCourse(course.id)

  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
        removeFromWishlist(course.id, true)
    } else {
      addToWishlist({
        id: course.id,
        title: course.title,
        image: course.image,
        price: course.price || 0,
        category: course.category,
        level: course.level,
        lessons: course.lessons,
      })
      setInWishlist(true)
    }
  }

  const handleReviewSubmitted = (newReview: Review) => {
    // Update the course state with the new review
    setCourse((prevCourse) => {
      // Check if this is an update to an existing review
      const existingReviewIndex = prevCourse.reviews.findIndex((r) => r.userName === newReview.userName)
      let updatedReviews = [...prevCourse.reviews]
      // Calculate rating changes
      let oldRating = 0
      if (existingReviewIndex >= 0) {
        oldRating = updatedReviews[existingReviewIndex].rating
        updatedReviews[existingReviewIndex] = newReview
      } else {
        updatedReviews = [newReview, ...updatedReviews]
      }

      // Update rating distribution
      const newDistribution = { ...(prevCourse.ratings?.distribution || {}) }
      if (existingReviewIndex >= 0) {
        // If updating, decrement the old rating count
        newDistribution[oldRating] = Math.max(0, (newDistribution[oldRating] || 0) - 1)
      }
      // Increment the new rating count
      newDistribution[newReview.rating] = (newDistribution[newReview.rating] || 0) + 1
      // Calculate new average rating
      const totalRatings =
        existingReviewIndex >= 0 ? prevCourse.ratings?.total || 0 : (prevCourse.ratings?.total || 0) + 1
      let totalScore = 0
      // Sum up all ratings based on distribution
      Object.entries(newDistribution).forEach(([rating, count]) => {
        totalScore += Number(rating) * count
      })
      const newAverage = totalScore / totalRatings

      return {
        ...prevCourse,
        rating: newAverage, // Update the main rating field
        ratings: {
          average: newAverage,
          total: totalRatings,
          distribution: newDistribution,
        },
        reviews: updatedReviews,
      }
    })
  }

  // If course not found, show a message
  if (course.id === 0) {
    return (
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </Link>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/courses"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Course Info */}
          <div className="md:col-span-2">
            <img
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              className="w-full rounded-lg mb-6 h-[30rem] object-cover"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">{course.title}</h1>
              <div className="flex items-center gap-2">
                <StarRating rating={course.rating} />
                <span className="font-medium">{course.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({course.reviews.length as unknown as string} ratings)</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {course.category}
              </span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {course.level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Users className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">{course.students.toLocaleString()} Students</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <BookOpen className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">{course.lessons} Lessons</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">{course.duration}</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Calendar className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Updated {course.lastUpdated}</span>
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-1">
                  Reviews
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-1 py-0.5 text-xs font-medium text-primary">
                  {course.reviews.length as unknown as string}
                  </span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">About This Course</h3>
                  <p className="whitespace-pre-line">{course.longDescription}</p>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Course Content</h3>
                  <div>
                    <p className="text-muted-foreground mb-4">
                      {course.modules?.length || 0} modules • {course.lessons} lessons • {course.duration} total length
                    </p>
                    <div className="space-y-4">
                      {course.modules?.map((module, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{module.title}</CardTitle>
                            <CardDescription>{module.lessons.length} lessons</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li key={lessonIndex} className="flex items-center justify-between py-2">
                                  <div className="flex items-center">
                                    <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Your Instructor</h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor?.avatar || "/placeholder.svg"}
                      alt={course.instructor?.name}
                      className="rounded-full h-16 w-16 object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{course.instructor?.name}</h4>
                      <p className="text-muted-foreground">{course.instructor?.bio}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  <h3 className="text-xl font-bold">Student Reviews</h3>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <RatingSummary
                        averageRating={course.rating}
                        totalReviews={course.reviews.length}
                        ratingCounts={course.ratings?.distribution}
                      />
                    </div>
                    <div>
                    {enrolled ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Write a Review</CardTitle>
                          <CardDescription>Share your experience with this course</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ReviewForm
                            courseId={course.id}
                            onReviewSubmitted={handleReviewSubmitted}
                            existingReviews={course.reviews || []}
                          />
                        </CardContent>
                      </Card>
                    ) : ""}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Student Feedback
                    </h4>
                  <ReviewList reviews={course.reviews || []} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enrollment Card */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">${course.price?.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={course.rating} />
                  <span className="font-medium">{course.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({course.reviews.length as unknown as string} ratings)</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>{course.lessons} lessons</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {enrolled ? (
                  <>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard?tab=my-courses`}>Go to My Courses</Link>
                    </Button>
                  <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={!!pendingUnenrollments[course.id]}>
                            <Trash2 className="h-4 w-4 mr-2" />
                        {pendingUnenrollments[course.id] ? "Unenrolling..." : "Unenroll"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Unenroll from course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to unenroll from "{course.title}"? Your progress will be lost.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnenroll}>Unenroll</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </>
                ) : (
                  <>
                    <Button className="w-full" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={handleWishlistToggle}
                    disabled={!!pendingWishlistRemovals[course.id]}
                  >
                      <Heart className={inWishlist ? "fill-primary text-primary" : ""} size={16} />
                    {pendingWishlistRemovals[course.id]
                      ? "Removing..."
                      : inWishlist
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
  )
}
