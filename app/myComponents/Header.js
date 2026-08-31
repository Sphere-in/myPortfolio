"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { href: "#home", label: "// Home" },
  { href: "#about", label: "// About me" },
  { href: "#projects", label: "// Projects" },
  { href: "#contact", label: "// Contact me" },
]

function NavItem({ href, label, active, onClick }) {
  return (
    <li className="relative w-auto">
      <Link
        href={href}
        onClick={onClick}
        className={`transition-colors duration-300 group-hover:opacity-50 hover:!text-teal-300 hover:!opacity-100 ${active ? "text-teal-300" : "text-white"}`}
      >
        {label}
      </Link>
      {active && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-teal-300" />}
    </li>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let animationFrame = null
    let scrollTimer = null

    function updateActiveSection() {
      const current = navItems.find(({ href }) => {
        const element = document.getElementById(href.slice(1))
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 110 && rect.bottom >= 110
      })
      if (current) setActiveSection(current.href.slice(1))
    }

    function handleScroll() {
      const currentScrollY = window.scrollY
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(() => {
          setIsScrolling(true)
          setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
          updateActiveSection()
          lastScrollY = currentScrollY
          animationFrame = null
        })
      }
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        setIsScrolling(false)
        setIsVisible(true)
      }, 150)
    }

    updateActiveSection()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(scrollTimer)
    }
  }, [])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  function handleNavClick(event, href) {
    event.preventDefault()
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 text-white transition-transform duration-300 ${isVisible || !isScrolling ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="relative px-4 backdrop-blur-sm md:bg-black/80 md:px-4 md:pt-2">
        <div className="mb-4 flex w-full items-center justify-between md:mb-6">
          <Link href="#home" onClick={(event) => handleNavClick(event, "#home")} className="z-20 font-mono text-2xl font-bold md:text-4xl">
            <span className="inline-block text-teal-300">RAIHAN</span>._
          </Link>

          <button
            type="button"
            className="z-20 grid h-10 w-10 place-items-center md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="portfolio-navigation"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav
          id="portfolio-navigation"
          aria-label="Portfolio navigation"
          className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 top-full z-10 min-h-[calc(100svh-4rem)] w-full flex-col items-start justify-start bg-black/90 px-6 pt-20 text-xl font-medium backdrop-blur-sm md:left-1/2 md:top-1/2 md:flex md:min-h-0 md:w-auto md:-translate-x-1/2 md:-translate-y-1/2 md:flex-row md:justify-center md:bg-transparent md:px-0 md:pt-0 md:text-sm lg:text-xl`}
        >
          <ul className="group flex flex-col items-start gap-4 font-mono md:flex-row md:items-center md:gap-5 lg:gap-10">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={activeSection === item.href.slice(1)}
                onClick={(event) => handleNavClick(event, item.href)}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
