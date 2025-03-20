"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: number
  title: string
  description: string
  read: boolean
  timestamp: number
}

export function NotificationHandler() {
  const { toast } = useToast()

  // Check for pending notifications on mount and when lessonCompleted event is fired
  const checkPendingNotifications = () => {
    const pendingNotificationsStr = localStorage.getItem("pendingNotifications")
    if (!pendingNotificationsStr) return

    try {
      const pendingNotifications: Notification[] = JSON.parse(pendingNotificationsStr)

      if (pendingNotifications.length > 0) {
        // Get unread notifications
        const unreadNotifications = pendingNotifications.filter((n) => !n.read)

        // Show each unread notification
        unreadNotifications.forEach((notification) => {
          toast({
            title: notification.title,
            description: notification.description,
            duration: 5000,
          })
        })

        // Mark all as read
        const updatedNotifications = pendingNotifications.map((n) => ({ ...n, read: true }))
        localStorage.setItem("pendingNotifications", JSON.stringify(updatedNotifications))
      }
    } catch (error) {
      console.error("Failed to parse pending notifications:", error)
    }
  }

  useEffect(() => {
    // Check for pending notifications on mount
    checkPendingNotifications()

    // Listen for the lessonCompleted event
    const handleLessonCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>
      toast({
        title: customEvent.detail.title,
        description: customEvent.detail.description,
        duration: 5000,
      })
    }

    window.addEventListener("lessonCompleted", handleLessonCompleted)

    // Also check when the window gets focus
    window.addEventListener("focus", checkPendingNotifications)

    return () => {
      window.removeEventListener("lessonCompleted", handleLessonCompleted)
      window.removeEventListener("focus", checkPendingNotifications)
    }
  }, [toast])

  // This component doesn't render anything
  return null
}

