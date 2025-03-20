"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Filter, Search, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"

import { allCourses } from "@/data/courses"

// Extract unique categories and levels for filter options
const categories = Array.from(new Set(allCourses.map((course) => course.category)))
const levels = Array.from(new Set(allCourses.map((course) => course.level)))

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [filteredCourses, setFilteredCourses] = useState(allCourses)
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)

  // Apply filters when search term, category, or level changes
  useEffect(() => {
    let result = allCourses

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((course) => course.category === selectedCategory)
    }

    // Filter by level
    if (selectedLevel && selectedLevel !== "all") {
      result = result.filter((course) => course.level === selectedLevel)
    }

    setFilteredCourses(result)

    // Check if any filters are applied
    setIsFiltersApplied(
      searchTerm !== "" ||
        (selectedCategory !== null && selectedCategory !== "all") ||
        (selectedLevel !== null && selectedLevel !== "all"),
    )
  }, [searchTerm, selectedCategory, selectedLevel])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value)
  }

  // Handle level selection
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value === "all" ? null : value)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setSelectedLevel(null)
  }

  return (
    <div className="container flex flex-col min-h-screen">
        <div className="container px-4 py-8 md:px-6 md:py-12">
            <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">All Courses</h1>
            <p className="text-muted-foreground">Browse our complete catalog of courses.</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 mt-8 md:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
                />
                {searchTerm && (
                <button
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                </button>
                )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                        {category}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select value={selectedLevel || "all"} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                        {level}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button
                variant={isFiltersApplied ? "default" : "outline"}
                size="icon"
                onClick={clearFilters}
                disabled={!isFiltersApplied}
                >
                {isFiltersApplied ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                <span className="sr-only">{isFiltersApplied ? "Clear filters" : "Filter"}</span>
                </Button>
            </div>
            </div>

            {/* Active Filters */}
            {isFiltersApplied && (
            <div className="flex flex-wrap gap-2 mt-4">
                {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm("")}>
                    <X className="h-3 w-3 ml-1" />
                    <span className="sr-only">Remove search filter</span>
                    </button>
                </Badge>
                )}
                {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}>
                    <X className="h-3 w-3 ml-1" />
                    <span className="sr-only">Remove category filter</span>
                    </button>
                </Badge>
                )}
                {selectedLevel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                    Level: {selectedLevel}
                    <button onClick={() => setSelectedLevel(null)}>
                    <X className="h-3 w-3 ml-1" />
                    <span className="sr-only">Remove level filter</span>
                    </button>
                </Badge>
                )}
                {isFiltersApplied && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
                    Clear all filters
                </Button>
                )}
            </div>
            )}

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {allCourses.length} courses
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                    <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{course.description}</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {course.category}
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {course.level}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={course.rating} size="sm" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({course.reviews.length as unknown as string} reviews)</span>
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
            ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
            )}
        </div>
    </div>
  )
}

