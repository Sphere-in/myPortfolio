"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AtSign, GitBranch, Globe, Link2 } from "lucide-react"
import { getAboutContent } from "@/lib/firebase"
import { DEFAULT_ABOUT_CONTENT } from "@/data/about-defaults"
import EducationField from "./EducationField"
import ImageSlider from "./image-slider"
import Skills from "./Skills"

export default function AboutSection() {
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT)

  useEffect(() => {
    getAboutContent().then(setContent).catch((error) => console.error("Unable to load About content:", error))
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className={`grid items-center gap-10 ${content.imageVisible && content.imageUrl ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16" : ""}`}>
          <div className="min-w-0">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">{content.eyebrow}</p>
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Hi, I&apos;m <span className="text-emerald-300">{content.name}</span></h2>
            <p className="mt-4 text-lg font-medium text-emerald-400 sm:text-xl">{content.role}</p>
            <div className="mt-7 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-300 sm:text-lg">{content.description}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                ["LinkedIn", "https://www.linkedin.com/in/raihan-shk", Link2],
                ["Instagram", "#", AtSign],
                ["Website", "https://raihan-shk.vercel.app", Globe],
                ["GitHub", "https://github.com/Sphere-in", GitBranch],
              ].map(([label, href, Icon]) => (
                <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-200">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {content.imageVisible && content.imageUrl && (
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-400/20 to-cyan-400/5 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl sm:aspect-square lg:aspect-[4/5]">
                <Image src={content.imageUrl} alt={content.imageAlt || content.name} fill sizes="(max-width: 1024px) 90vw, 420px" className="object-cover" priority />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative mx-auto mt-16 max-w-7xl sm:mt-20"><ImageSlider /></div>
      <EducationField />
      <Skills />
    </div>
  )
}
