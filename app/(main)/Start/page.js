'use client'

import React, { useState } from 'react'

const Start = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const name = "RAIHAN SHAIKH" // Proper space explicitly added

  return (
    <div className='flex flex-col justify-center items-center p-4 text-center h-screen'>
      <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-mono mb-4 tracking-tight cursor-default'>
        {name.split('').map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ease-in-out ${
              hoveredIndex === index
                ? 'text-teal-300 transform translate-y-[-10px]'
                : 'text-white hover:text-gray-300'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <p className='text-lg sm:text-xl md:text-2xl text-gray-400 tracking-wide select-none'>
        WEB DEVELOPER & DEVOPS
      </p>
    </div>
  )
}

export default Start
