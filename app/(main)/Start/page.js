'use client'

import React, { useState } from 'react'

const Start = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const firstName = "RAIHAN"
  const lastName = "SHAIKH"

  return (
    <div className='flex flex-col justify-center items-center p-4 text-center min-h-screen'>
      <h1 className='flex flex-col sm:flex-row gap-x-8 justify-center text-7xl sm:text-8xl md:text-8xl lg:text-8xl xl:text-10xl font-bold font-mono mb-4 tracking-tight cursor-default'>
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
      <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 tracking-wide select-none'>
        WEB DEVELOPER & DEVOPS
      </p>
    </div>
  )
}

export default Start

