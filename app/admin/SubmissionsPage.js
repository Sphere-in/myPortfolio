"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const SubmissionsClient = dynamic(() => import("./Submission-Client"), {
  ssr: false,
})

export default function SubmissionsPage() {
  return (
    <div className="h-full">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <Skeleton className="h-64 rounded-lg" />
          </div>
        }
      >
        <SubmissionsClient />
      </Suspense>
    </div>
  )
}
