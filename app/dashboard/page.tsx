"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { BookOpen, Clock, GraduationCap, Heart, LayoutDashboard, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEnrollment } from "@/contexts/enrollment-context"


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

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "overview")
  const {
    enrolledCourses,
    unenrollFromCourse,
    wishlist,
    removeFromWishlist,
    enrollInCourse,
    pendingUnenrollments,
    pendingWishlistRemovals,
  } = useEnrollment()



  // Update activeTab when URL query parameter changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?tab=${tab}`)
  }

  return (
    <div className="container flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg font-semibold">Learning Dashboard</span>
        </div>
        <nav className="space-y-1.5">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "my-courses" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("my-courses")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            My Courses
          </Button>
          <Button
            variant={activeTab === "wishlist" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("wishlist")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
        </nav>
      </div>

      {/* Mobile Tabs */}
      <div className="w-full md:hidden">
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="my-courses">
              <BookOpen className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Continue your learning journey.</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wishlist.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="h-48 w-full object-cover sm:h-auto sm:w-48"
                          />
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex-1">
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-muted-foreground mt-2">Last lesson: {course.lastLesson}</p>
                              <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>
                                    {course.completedLessons} / {course.totalLessons} lessons
                                  </span>
                                  <span>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button asChild>
                                <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-courses" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
              <p className="text-muted-foreground">Manage your enrolled courses.</p>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {enrolledCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-3">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        Progress: {course.completedLessons} of {course.totalLessons} lessons completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={course.progress} className="h-2 mb-2" />
                      <p className="text-sm text-right">{course.progress}% complete</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" disabled={!!pendingUnenrollments[course.id]}>
                            <Trash2 className="h-10 w-4 mr-2" />
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
                            <AlertDialogAction onClick={() => unenrollFromCourse(course.id)}>
                              Unenroll
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button asChild>
                        <Link href={`/courses/${course.id}`}>Continue</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
              <p className="text-muted-foreground">Courses you're interested in taking.</p>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {wishlist.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-3">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {course.category}
                          </span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {course.level}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${course.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">{course.lessons} lessons</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(course.id)}
                        disabled={!!pendingWishlistRemovals[course.id]}
                      >
                        <Heart className="h-4 w-4 mr-2 fill-primary text-primary" />
                        {pendingWishlistRemovals[course.id] ? "Removing..." : "Remove"}
                      </Button>
                      <Button
                        onClick={() => {
                          enrollInCourse({
                            id: course.id,
                            title: course.title,
                            image: course.image,
                            lessons: course.lessons,
                          })
                          handleTabChange("my-courses")
                        }}
                      >
                        Enroll Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-4">Your wishlist is empty.</p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}


      </div>
    </div>
  )
}

