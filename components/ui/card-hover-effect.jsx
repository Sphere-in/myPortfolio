import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { GlowingEffect } from "./glowing-effect"

export const HoverEffect = ({
  items,
  className,
  onItemClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 p-2 sm:p-4 w-full max-w-7xl mx-auto",
      className
    )}>
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
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0.8, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeInOut" },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
              />
            )}
          </AnimatePresence>
          {/* <GlowingEffect
                            spread={100}
                            glow={true}
                            disabled={false}
                            proximity={100}
                            inactiveZone={0.2}
                            // blur={20}
                            borderWidth={3}
                          /> */}
          <Card>
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
        "rounded-xl border border-slate-700 p-3 sm:p-4 bg-card text-card-foreground shadow-lg relative z-20",
        "transition-all duration-300 ease-in-out",
        "hover:border-teal-300/50 hover:shadow-xl hover:-translate-y-1 bg-slate-950 cursor-pointer",
        "min-h-40 sm:min-h-44 w-full",
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
        "text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 line-clamp-2",
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
        "text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3",
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
        "mt-3 border-emerald-300/60 bg-emerald-300/15 text-xs font-semibold text-emerald-200 shadow-sm backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        "group-hover:border-emerald-200 group-hover:bg-emerald-300 group-hover:text-slate-950",
        className,
      )}
    >
      {children}
    </Badge>
  )
}

export default HoverEffect;
