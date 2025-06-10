"use client"

import React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollTrigger } from "gsap/ScrollTrigger"



export default function SmoothScroll({
  children,
  speed = 1,
  smoothness = 1,
  wrapperClass = "",
  contentClass = "",
}) {
  const smoothWrapper = useRef(null)
  const smoothContent = useRef(null)

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    // Create the smooth scroller
    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapper.current,
      content: smoothContent.current,
      smooth: smoothness,
      effects: true,
      speed: speed,
      normalizeScroll: true, // Prevents jerky scrolling on some systems
      ignoreMobileResize: true, // Helps with mobile performance
    })

    // Handle hash navigation for smooth scrolling to sections
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const targetElement = document.querySelector(hash)
        if (targetElement && smoother) {
          // Wait a bit to ensure everything is loaded
          setTimeout(() => {
            smoother.scrollTo(targetElement, true, "top top")
          }, 100)
        }
      }
    }

    // Initial check for hash in URL
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Refresh ScrollTrigger when the component mounts
    ScrollTrigger.refresh()

    return () => {
      // Clean up
      if (smoother) smoother.kill()
      window.removeEventListener("hashchange", handleHashChange)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed, smoothness])

  return (
    <div ref={smoothWrapper} className={`smooth-wrapper ${wrapperClass}`}>
      <div ref={smoothContent} className={`smooth-content ${contentClass}`}>
        {children}
      </div>
    </div>
  )
}
