import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { EnrollmentProvider } from "@/contexts/enrollment-context"

import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CourseHub - Online Learning Platform",
  description: "Discover high-quality courses taught by industry experts",
  generator: "v0.dev",
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <EnrollmentProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 flex flex-col items-center">{children}</main>
              <footer className="border-t flex flex-col items-center py-6 md:py-0">
                <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </EnrollmentProvider>
        </Providers>
      </body>
    </html>
  )
}