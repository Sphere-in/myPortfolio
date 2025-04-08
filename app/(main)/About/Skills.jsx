"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useMedia from "use-media"

import { Brain, Users, Lightbulb, MessageCircle, Target, Puzzle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react"
import HoverEffect from "@/components/ui/card-hover-effect"
const softSkills = [
  { name: "Critical Thinking", icon: Brain },
  { name: "Teamwork", icon: Users },
  { name: "Creativity", icon: Lightbulb },
  { name: "Communication", icon: MessageCircle },
  { name: "Problem Solving", icon: Puzzle },
  { name: "Adaptability", icon: Target },
]

const skills = [
  { name: "Next.js", level: "Advanced", description: "Server-side rendering, routing, and API routes", category: "Frontend" },
  { name: "React", level: "Advanced", description: "Component-based UI dev with hooks and context", category: "Frontend" },
  { name: "Node.js", level: "Intermediate", description: "Server-side JavaScript, Express.js, and RESTful APIs", category: "Backend" },
  { name: "AWS", level: "Intermediate", description: "EC2, S3, Lambda, and CloudFormation", category: "DevOps" },
  { name: "Python", level: "Advanced", description: "Data analysis, automation, and backend development", category: "Backend" },
  { name: "C/C++", level: "Intermediate", description: "System programming and algorithm implementation", category: "Languages" },
  { name: "SQL", level: "Intermediate", description: "Database design, complex queries, and optimization", category: "Database" },
  { name: "NoSQL", level: "Intermediate", description: "MongoDB, DynamoDB, and data modeling", category: "Database" },
  { name: "Jenkins", level: "Intermediate", description: "CI/CD pipelines and build automation", category: "DevOps" },
  { name: "Ansible", level: "Intermediate", description: "Infrastructure as code and configuration management", category: "DevOps" },
  { name: "Shell Scripting", level: "Intermediate", description: "Bash scripting for automation and system administration", category: "DevOps" },
  { name: "Docker", level: "Intermediate", description: "Containerization and orchestration", category: "DevOps" },
  { name: "Git", level: "Advanced", description: "Version control, branching, and collaboration", category: "Tools" },
  { name: "Tailwind CSS", level: "Intermediate", description: "Utility-first CSS framework for rapid UI development", category: "Frontend" },
  { name: "Figma", level: "Intermediate", description: "UI/UX design and prototyping", category: "Design" },
  { name: "TypeScript", level: "Intermediate", description: "Static typing for JavaScript", category: "Languages" },
]

const categories = ["All", "Frontend", "Backend", "DevOps", "Database", "Languages", "Tools", "Design"]

const Sidebar = ({ isOpen, onClose, skill }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-full sm:w-96 h-full bg-gray-800 z-50 overflow-y-auto"
        >
          <div className="p-4 sm:p-6">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            {skill && (
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{skill.name}</h2>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400 text-sm mb-4">
                  {skill.level}
                </Badge>
                <p className="text-sm sm:text-base text-gray-300">{skill.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(0)
  const isLargeScreen = useMedia({ minWidth: 1024 }) // lg breakpoint
  const itemsPerPage = isLargeScreen ? 8 : 6
  
  const categories = ["All", "Frontend", "Backend", "DevOps", "Database", "Languages", "Tools", "Design"]
  
  // Filter skills based on selected category
  const filteredSkills = activeCategory === "All" 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)
  
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage)
  const displayedSkills = filteredSkills.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  )

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill)
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  return (
    <section className="py-6 sm:py-12">
      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-8">Technical Skills</h2>
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto py-2 mb-4 -mx-3 px-3 scrollbar-thin scrollbar-track-transparent">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setCurrentPage(0)
                }}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Display limited number of skills with original HoverEffect */}
        <div className="overflow-hidden">
          <HoverEffect
            items={displayedSkills.map((skill) => ({
              title: skill.name,
              description: skill.description,
              level: skill.level,
            }))}
            onItemClick={handleSkillClick}
          />
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={prevPage}
              className="p-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-300 text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="p-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Original Soft Skills Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-9">
        <h2 className="text-lg sm:text-2xl font-extrabold text-white mb-4 sm:mb-8">Soft Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
          {softSkills.map((skill, index) => (
            <div key={index} className="relative">
              <Card className="border-primary/20 bg-slate-700 relative z-10">
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
                    <skill.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="truncate">{skill.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                    Proficient in {skill.name.toLowerCase()}, enhancing overall professional effectiveness.
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} skill={selectedSkill} />
    </section>
  )
}

export default Skills