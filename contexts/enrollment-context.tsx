"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Undo } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the enrolled course type
export interface EnrolledCourse {
  id: number
  title: string
  progress: number
  image: string
  lastLesson: string
  totalLessons: number
  completedLessons: number
}
// Define the wishlist course type
export interface WishlistCourse {
  id: number
  title: string
  image: string
  price: number
  category: string
  level: string
  lessons: number
}

// Random lesson names for the notification
const lessonNames = [
  "Introduction to Key Concepts",
  "Advanced Techniques",
  "Practical Applications",
  "Case Study Analysis",
  "Project Implementation",
  "Performance Optimization",
  "Fundamental Principles",
  "Design Patterns",
  "Best Practices",
  "Industry Standards",
]

// Define the context type
interface EnrollmentContextType {
  // Enrolled courses
  enrolledCourses: EnrolledCourse[]
  isEnrolled: (courseId: number) => boolean
  enrollInCourse: (course: {
    id: number
    title: string
    image: string
    lessons: number
  }) => void
  unenrollFromCourse: (courseId: number) => void
  updateCourseProgress: (courseId: number, progress: number, completedLessons: number, lastLesson: string) => void
  // Wishlist
  wishlist: WishlistCourse[]
  isInWishlist: (courseId: number) => boolean
  addToWishlist: (course: WishlistCourse) => void
  removeFromWishlist: (courseId: number, showToast: boolean) => void
  // Pending actions
  pendingUnenrollments: Record<number, NodeJS.Timeout>
  pendingWishlistRemovals: Record<number, NodeJS.Timeout>
  cancelUnenrollment: (courseId: number) => void
  cancelWishlistRemoval: (courseId: number) => void
}

// Create the context with a default value
const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

// Provider component
export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [wishlist, setWishlist] = useState<WishlistCourse[]>([])
  const [showLessonCompleteToast, setShowLessonCompleteToast] = useState<boolean>(false)
  const [pendingUnenrollments, setPendingUnenrollments] = useState<Record<number, NodeJS.Timeout>>({})
  const [pendingWishlistRemovals, setPendingWishlistRemovals] = useState<Record<number, NodeJS.Timeout>>({})
  const { toast } = useToast()
  const ENROLLED_TOAST_DURATION = 2000
  const UNDO_TIMEOUT_DURATION = 5000

  // Load enrolled courses and wishlist from localStorage on initial render
  useEffect(() => {
    const storedCourses = localStorage.getItem("enrolledCourses")
    if (storedCourses) {
      try {
        setEnrolledCourses(JSON.parse(storedCourses))
      } catch (error) {
        console.error("Failed to parse enrolled courses from localStorage:", error)
      }
    }
    const storedWishlist = localStorage.getItem("wishlistCourses")
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
  }
  

  // Save enrolled courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))

    if (showLessonCompleteToast) {
      const randomDelay = Math.floor(Math.random() * 5000) + 5000 // 5000-20000 ms
      setShowLessonCompleteToast(false)

      function timeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      async function sleep(fn: Function, ...args: any) {
        await timeout(randomDelay)
        return fn(...args)
      }

      if (enrolledCourses.length > 0) {
        sleep(simulateLessonCompletion, enrolledCourses[getRandomInt(0, enrolledCourses.length)].id)
      }
    }

  }, [enrolledCourses])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlistCourses", JSON.stringify(wishlist))
  }, [wishlist])

  // handle delayed unenrollments
  useEffect(() => {

    for (const key in pendingUnenrollments) {
      const course = enrolledCourses.find((c) => c.id === parseInt(key))
      if(course) {
        // Show toast with undo option
        toast({
          title: "Unenrolling from course",
          description: `You will be unenrolled from "${course.title}" in 5 seconds.`,
          action: (
            <Button variant="outline" size="sm" onClick={() => cancelUnenrollment(course.id)} className="gap-1">
              Undo
            </Button>
          ),
          duration: UNDO_TIMEOUT_DURATION,
        })
      }
  }

  /*
    return () => {
      // Clear all pending unenrollments
      Object.values(pendingUnenrollments).forEach((timeoutId) => {
        clearTimeout(timeoutId)
      })
      // Clear all pending wishlist removals
      Object.values(pendingWishlistRemovals).forEach((timeoutId) => {
        clearTimeout(timeoutId)
      })
    }
  */

  }, [pendingUnenrollments])

  // handle delayed wishlist removal
  useEffect(() => {

    for (const key in pendingWishlistRemovals) {
      const course = wishlist.find((c) => c.id === parseInt(key))
      const enrolledCourse = enrolledCourses.find((c) => c.id === parseInt(key))
      if(course && ! enrolledCourse) {
        // Show toast with undo option
        toast({
          title: "Removing from wishlist",
          description: `"${course.title}" will be removed from your wishlist in 5 seconds.`,
          action: (
            <Button variant="outline" size="sm" onClick={() => cancelWishlistRemoval(course.id)} className="gap-1">
              Undo
            </Button>
          ),
          duration: UNDO_TIMEOUT_DURATION,
        })
      }
    }
  }, [pendingWishlistRemovals])

  // Simulate lesson completion
  const simulateLessonCompletion = (courseId: number) => {
    //console.log("ok")
    //console.log(enrolledCourses, courseId)
    const course = enrolledCourses.find((c) => c.id === courseId)

    if (!course || course.completedLessons >= course.totalLessons) {
      return
    }
    // Calculate new completed lessons (add 1-5 random lessons)
    const lessonsToAdd = Math.floor(Math.random() * 6) + 1
    const newCompletedLessons = Math.min(course.completedLessons + lessonsToAdd, course.totalLessons)
    // Calculate new progress percentage
    const newProgress = Math.round((newCompletedLessons / course.totalLessons) * 100)
    // Get a random lesson name for the notification
    const randomLessonIndex = Math.floor(Math.random() * lessonNames.length)
    const lastLesson = lessonNames[randomLessonIndex]
    // Update course progress
    updateCourseProgress(courseId, newProgress, newCompletedLessons, lastLesson)
    // Show toast notification - no, let's not. too many conflicts to solve here with other toasts/state related
    /*
    toast({
      title: "Lessons Completed.",
      description: `Course instructor has confirmed your completion of ${lessonsToAdd} lesson${lessonsToAdd > 1 ? "s" : ""} in "${course.title}".`,
      duration: 6000,
    })
    */
  }

  // Check if a user is enrolled in a specific course
  const isEnrolled = (courseId: number): boolean => {
    return enrolledCourses.some((course) => course.id === courseId)
  }

  // Enroll in a course
  const enrollInCourse = (course: { id: number; title: string; image: string; lessons: number }) => {
    // Cancel any pending unenrollment for this course
    if (pendingUnenrollments[course.id]) {
      cancelUnenrollment(course.id)
      return
    }
    if (isEnrolled(course.id)) {
      toast({
        title: "Already Enrolled",
        description: `You are already enrolled in "${course.title}"`,
        duration: ENROLLED_TOAST_DURATION,
      })
      return
    }

    const newEnrolledCourse: EnrolledCourse = {
      id: course.id,
      title: course.title,
      image: course.image,
      progress: 0,
      lastLesson: "Not started yet",
      totalLessons: course.lessons,
      completedLessons: 0,
    }

    setShowLessonCompleteToast(true)

    setEnrolledCourses((prev) => [...prev, newEnrolledCourse])

    // If the course was in the wishlist, remove it
    if (isInWishlist(course.id)) {
      removeFromWishlist(course.id, false)
    }

    toast({
      title: "Enrolled Successfully!",
      description: `You are now enrolled in "${course.title}"`,
      duration: ENROLLED_TOAST_DURATION,
    })
  }

  // Unenroll from a course with undo functionality
  const unenrollFromCourse = (courseId: number) => {
    const course = enrolledCourses.find((c) => c.id === courseId)

    if (!course) {
      return
    }
    // If there's already a pending unenrollment, proceed with immediate unenrollment
    if (pendingUnenrollments[courseId]) {
      // Clear the existing timeout
      clearTimeout(pendingUnenrollments[courseId])
      // Remove the course immediately

    setEnrolledCourses((prev) => prev.filter((course) => course.id !== courseId))
      // Remove from pending unenrollments
      setPendingUnenrollments((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })

    toast({
      title: "Unenrolled",
      description: `You have unenrolled from "${course.title}"`,
      duration: ENROLLED_TOAST_DURATION,
    })
      return
    }

    // Set a timeout to actually unenroll after 5 seconds
    const timeoutId = setTimeout(() => {
      setEnrolledCourses((prev) => prev.filter((course) => course.id !== courseId))
      // Remove from pending unenrollments
      setPendingUnenrollments((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })
      toast({
        title: "Unenrolled",
        description: `You have been unenrolled from "${course.title}"`,
        duration: ENROLLED_TOAST_DURATION,
      })
    }, UNDO_TIMEOUT_DURATION)
    // Add to pending unenrollments
    setPendingUnenrollments((prev) => ({
      ...prev,
      [courseId]: timeoutId,
    }))
  }
  // Cancel a pending unenrollment
  const cancelUnenrollment = (courseId: number) => {
    if (pendingUnenrollments[courseId]) {
      clearTimeout(pendingUnenrollments[courseId])
      // Remove from pending unenrollments
      setPendingUnenrollments((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })
      const course = enrolledCourses.find((c) => c.id === courseId)
      if (course) {
        toast({
          title: "Unenrollment cancelled",
          description: `You're still enrolled in "${course.title}".`,
          duration: ENROLLED_TOAST_DURATION,
        })
      }
    }
  }

  // Update course progress
  const updateCourseProgress = (courseId: number, progress: number, completedLessons: number, lastLesson: string) => {
    setEnrolledCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, progress, completedLessons, lastLesson } : course)),
    )
  }
  // Check if a course is in the wishlist
  const isInWishlist = (courseId: number): boolean => {
    return wishlist.some((course) => course.id === courseId)
  }
  // Add a course to the wishlist
  const addToWishlist = (course: WishlistCourse) => {
    // Cancel any pending wishlist removal for this course
    if (pendingWishlistRemovals[course.id]) {
      cancelWishlistRemoval(course.id)
      return
    }
    if (isInWishlist(course.id)) {
      toast({
        title: "Already in Wishlist",
        description: `"${course.title}" is already in your wishlist`,
        duration: ENROLLED_TOAST_DURATION,
      })
      return
    }
    if (isEnrolled(course.id)) {
      toast({
        title: "Already Enrolled",
        description: `You are already enrolled in "${course.title}"`,
        duration: ENROLLED_TOAST_DURATION,
      })
      return
    }
    setWishlist((prev) => [...prev, course])
    toast({
      title: "Added to Wishlist",
      description: `"${course.title}" has been added to your wishlist`,
      duration: ENROLLED_TOAST_DURATION,
    })
  }
  // Remove a course from the wishlist with undo functionality
  const removeFromWishlist = (courseId: number, showToast: boolean) => {
    const course = wishlist.find((c) => c.id === courseId)
    const courseEnrolled = enrolledCourses.find((c) => c.id === courseId)
    if (!course) {
      return
    }

    // If there's already a pending removal, proceed with immediate removal
    if (!showToast || pendingWishlistRemovals[courseId]) {
      // Clear the existing timeout
      clearTimeout(pendingWishlistRemovals[courseId])
      // Remove the course immediately
      setWishlist((prev) => prev.filter((course) => course.id !== courseId))
      // Remove from pending removals
      setPendingWishlistRemovals((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })
      if(showToast || !courseEnrolled) {
        toast({
          title: "Removed from Wishlist",
          description: `"${course.title}" has been removed from your wishlist`,
          duration: ENROLLED_TOAST_DURATION,
        })
      }
      return
    }

    // Set a timeout to actually remove after 5 seconds
    const timeoutId = setTimeout(() => {
      const courseEnrolled = enrolledCourses.find((c) => c.id === courseId)

      setWishlist((prev) => prev.filter((course) => course.id !== courseId))
      // Remove from pending removals
      setPendingWishlistRemovals((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })
      if(!courseEnrolled) {
        toast({
          title: "Removed from wishlist",
          description: `"${course.title}" has been removed from your wishlist`,
          duration: ENROLLED_TOAST_DURATION,
        })
      }
    }, UNDO_TIMEOUT_DURATION)
    // Add to pending removals
    setPendingWishlistRemovals((prev) => ({
      ...prev,
      [courseId]: timeoutId,
    }))
  }
  // Cancel a pending wishlist removal
  const cancelWishlistRemoval = (courseId: number) => {
    if (pendingWishlistRemovals[courseId]) {
      clearTimeout(pendingWishlistRemovals[courseId])
      // Remove from pending removals
      setPendingWishlistRemovals((prev) => {
        const updated = { ...prev }
        delete updated[courseId]
        return updated
      })
      const course = wishlist.find((c) => c.id === courseId)
      if (course) {
        toast({
          title: "Removal cancelled",
          description: `"${course.title}" is still in your wishlist.`,
          duration: ENROLLED_TOAST_DURATION,
        })
      }
    }
  }

  // Context value
  const value = {
    enrolledCourses,
    isEnrolled,
    enrollInCourse,
    unenrollFromCourse,
    updateCourseProgress,
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    pendingUnenrollments,
    pendingWishlistRemovals,
    cancelUnenrollment,
    cancelWishlistRemoval,
  }

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}

// Custom hook to use the enrollment context
export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (context === undefined) {
    throw new Error("useEnrollment must be used within an EnrollmentProvider")
  }
  return context
}

