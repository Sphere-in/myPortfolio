"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import React from "react"
export const HoverEffect = ({
  items,
  className,
  onItemClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4", className)}>
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onItemClick(item)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
              className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-lg "
              layoutId="hoverBackground"
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 1.2, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 },
              }}
            />
            
            )}
          </AnimatePresence>
          <Card className={` `}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardBadge>{item.level}</CardBadge>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export const Card = ({
  className,
  children,
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-lg p-4 bg-card text-card-foreground shadow-lg relative z-20 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:-translate-y-1 bg-black cursor-default h-40 md:36 m-2 w-",
        className,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-50">{children}</div>
    </motion.div>
  )
}

export const CardTitle = ({
  className,
  children,
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-white mb-2",
        "transition-colors duration-300 ease-in-out",
        // "group-hover:text-primary",
        className,
      )}
    >
      {children}
    </h3>
  )
}

export const CardDescription = ({
  className,
  children,
}) => {
  return (
    <p
      className={cn(
        "text-sm text-slate-500 mt-2",
        "transition-colors duration-300 ease-in-out",
        "group-hover:text-slate-300",
        className,
      )}
    >
      {children}
    </p>
  )
}

export const CardBadge = ({
  className,
  children,
}) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs mt-3 bg-white backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        "group-hover:bg-black group-hover:text-white",
        className,
      )}
    >
      {children}
    </Badge>
  )
}

