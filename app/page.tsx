import Link from "next/link"
import { ArrowRight, BookOpen, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"

import { allCourses } from "@/data/courses"

interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  date: string
}

// Extended course interface with ratings
export interface Course {
  id: number
  title: string
  description: string
  category: string
  level: string
  students: number
  lessons: number
  image: string
  rating: number
  reviews: Review[]
  price?: number
  duration?: string
  lastUpdated?: string
  instructor?: {
    name: string
    bio: string
    avatar: string
  }
  modules?: {
    title: string
    lessons: {
      title: string
      duration: string
    }[]
  }[]
  ratings?: {
    average: number
    total: number
    distribution: Record<number, number>
  }
  longDescription?: string
}

const featuredCourses: Course[] = (allCourses as unknown as []).sort(() => Math.random() - Math.random()).slice(0, 3)

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Expand Your Knowledge with Our Courses
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover high-quality courses taught by industry experts and take your skills to the next level.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/courses">
                  Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="mt-6 relative -left-2 md:left-0" asChild>
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Courses</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our most popular courses and start learning today.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={course.rating} size="sm" />
                    <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({course.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/courses">
                View All Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Start Learning?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of students already learning with our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

