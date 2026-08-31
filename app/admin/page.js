"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import AboutUsPage from "./AboutUsPage"
import Projects from "./Projects"
import SubmissionsPage from "./SubmissionsPage"

function DashboardView() {
  const view = useSearchParams().get("view") || "submissions"
  if (view === "projects") return <Projects />
  if (view === "about") return <AboutUsPage />
  return <SubmissionsPage />
}

export default function AdminPage() {
  return <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}><DashboardView /></Suspense>
}
