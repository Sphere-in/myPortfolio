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
      className='relative flex flex-col justify-center items-center p-4 text-center min-h-screen'
    >
      <div 
        className='absolute overflow-hidden text-7xl md:text-12xl lg:text-16xl xl:text-20xl 2xl:text-32xl font-extrabold z-0 top-6 h-screen'
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

      <h1 className='z-10 flex flex-col sm:flex-row gap-x-8 justify-center text-7xl sm:text-8xl md:text-8xl lg:text-8xl xl:text-10xl  font-bold font-mono mb-4 tracking-tight cursor-default'>
        {[firstName, lastName].map((word, wordIndex) => (
          <div key={wordIndex} className="flex">
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
      <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 tracking-wide select-none z-10'>
        WEB DEVELOPER & DEVOPS
      </p>
    </div>
  )
}

export default Start