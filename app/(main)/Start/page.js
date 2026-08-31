'use client'

import React, { useState, useEffect, useRef } from 'react'
// import { EvervaultCard, Icon } from '@/components/ui/enervault-card'

const Start = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const firstName = "RAIHAN"
  const lastName = "SHAIKH"
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div 
      ref={containerRef}
      className='relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 text-center sm:px-6' >
      <div 
        className='absolute inset-0 z-0 overflow-hidden text-[clamp(4.25rem,19vw,18rem)] font-extrabold'
        style={{
          WebkitMaskImage: `radial-gradient(100px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          maskImage: `radial-gradient(100px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          width: '100%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h1 className='text-gray-700 p-1'>DEVOPS</h1>
      </div>

      <h1 className='z-10 flex max-w-full flex-col justify-center gap-x-6 font-mono text-[clamp(2.6rem,12vw,8rem)] font-bold leading-[0.9] tracking-[-0.07em] sm:flex-row sm:tracking-tight'>
        {[firstName, lastName].map((word, wordIndex) => (
          <div key={wordIndex} className="flex justify-center">
            {word.split('').map((char, charIndex) => (
              <span
                key={`${wordIndex}-${charIndex}`}
                className={`inline-block transition-all duration-300 ease-in-out ${
                  hoveredIndex === `${wordIndex}-${charIndex}`
                    ? 'text-teal-300 transform translate-y-[-20px]'
                    : 'text-white hover:text-gray-300'
                }`}
                onMouseEnter={() => setHoveredIndex(`${wordIndex}-${charIndex}`)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </h1>
      <p className='z-10 mt-6 select-none text-sm tracking-[0.2em] text-gray-400 sm:text-lg md:text-xl'>
        WEB DEVELOPER & DEVOPS
      </p>
    </div>
  )
}

export default Start
