"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Lightbulb, MessageCircle, Target, Puzzle, X } from "lucide-react"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
const softSkills = [
  { name: "Critical Thinking", icon: Brain },
  { name: "Teamwork", icon: Users },
  { name: "Creativity", icon: Lightbulb },
  { name: "Communication", icon: MessageCircle },
  { name: "Problem Solving", icon: Puzzle },
  { name: "Adaptability", icon: Target },
]

const skills = [
  { name: "Next.js", level: "Advanced", description: "Server-side rendering, routing, and API routes" },
  { name: "React", level: "Advanced", description: "Component-based UI dev with hooks and context" },
  { name: "Node.js", level: "Intermediate", description: "Server-side JavaScript, Express.js, and RESTful APIs" },
  { name: "AWS", level: "Intermediate", description: "EC2, S3, Lambda, and CloudFormation" },
  { name: "Python", level: "Advanced", description: "Data analysis, automation, and backend development" },
  { name: "C/C++", level: "Intermediate", description: "System programming and algorithm implementation" },
  { name: "SQL", level: "Intermediate", description: "Database design, complex queries, and optimization" },
  { name: "NoSQL", level: "Intermediate", description: "MongoDB, DynamoDB, and data modeling" },
  { name: "Jenkins", level: "Intermediate", description: "CI/CD pipelines and build automation" },
  { name: "Ansible", level: "Intermediate", description: "Infrastructure as code and configuration management" },
  {
    name: "Shell Scripting",
    level: "Intermediate",
    description: "Bash scripting for automation and system administration",
  },
]

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
          className="fixed top-0 right-0 w-full sm:w-[30%] h-full bg-gray-800 z-50 overflow-y-auto"
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

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill)
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <section className="py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-8">Technical Skills</h2>
        <div className="overflow-hidden">
          <HoverEffect
            items={skills.map((skill) => ({
              title: skill.name,
              description: skill.description,
              level: skill.level,
            }))}
            onItemClick={handleSkillClick}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-9">
        <h2 className="text-lg sm:text-2xl font-extrabold text-white mb-4 sm:mb-8">Soft Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
          {softSkills.map((skill, index) => (
            <div key={index} className="relative">
               {/* <GlowingEffect
                  spread={100}
                  glow={true}
                  disabled={false}
                  proximity={100}
                  inactiveZone={0.2}
                  borderWidth={3}
                /> */}
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