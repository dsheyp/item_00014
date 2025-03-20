"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

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
  removeFromWishlist: (courseId: number) => void
}

// Create the context with a default value
const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

// Provider component
export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [wishlist, setWishlist] = useState<WishlistCourse[]>([])
  const [showLessonCompleteToast, setShowLessonCompleteToast] = useState<boolean>(false)
  const { toast } = useToast()
  const ENROLLED_TOAST_DURATION = 2000

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
    // Show toast notification
    toast({
      title: "Lessons Completed.",
      description: `Course instructor has confirmed your completion of ${lessonsToAdd} lesson${lessonsToAdd > 1 ? "s" : ""} in "${course.title}".`,
      duration: 6000,
    })
  }

  // Check if a user is enrolled in a specific course
  const isEnrolled = (courseId: number): boolean => {
    return enrolledCourses.some((course) => course.id === courseId)
  }

  // Enroll in a course
  const enrollInCourse = (course: { id: number; title: string; image: string; lessons: number }) => {
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
      removeFromWishlist(course.id)
    }

    toast({
      title: "Enrolled Successfully!",
      description: `You are now enrolled in "${course.title}"`,
      duration: ENROLLED_TOAST_DURATION,
    })
  }

  // Unenroll from a course
  const unenrollFromCourse = (courseId: number) => {
    const course = enrolledCourses.find((c) => c.id === courseId)

    if (!course) {
      return
    }

    setEnrolledCourses((prev) => prev.filter((course) => course.id !== courseId))

    toast({
      title: "Unenrolled",
      description: `You have unenrolled from "${course.title}"`,
      duration: ENROLLED_TOAST_DURATION,
    })
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
  // Remove a course from the wishlist
  const removeFromWishlist = (courseId: number) => {
    const course = wishlist.find((c) => c.id === courseId)
    if (!course) {
      return
    }
    setWishlist((prev) => prev.filter((course) => course.id !== courseId))
    toast({
      title: "Removed from Wishlist",
      description: `"${course.title}" has been removed from your wishlist`,
      duration: ENROLLED_TOAST_DURATION,
    })
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

