'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Lightbulb, MessageCircle, Target, Puzzle } from 'lucide-react'
import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"


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
    { name: "React", level: "Advanced", description: "Component-based UI development with hooks and context" },
    { name: "Node.js", level: "Intermediate", description: "Server-side JavaScript, Express.js, and RESTful APIs" },
    { name: "AWS", level: "Intermediate", description: "EC2, S3, Lambda, and CloudFormation" },
    { name: "Python", level: "Advanced", description: "Data analysis, automation, and backend development" },
    { name: "C/C++", level: "Intermediate", description: "System programming and algorithm implementation" },
    { name: "SQL", level: "Intermediate", description: "Database design, complex queries, and optimization" },
    { name: "NoSQL", level: "Intermediate", description: "MongoDB, DynamoDB, and data modeling" },
    { name: "Jenkins", level: "Intermediate", description: "CI/CD pipelines and build automation" },
    { name: "Ansible", level: "Intermediate", description: "Infrastructure as code and configuration management" },
    { name: "Shell Scripting", level: "Intermediate", description: "Bash scripting for automation and system administration" },
]

export default function Skills() {
    const [expandedSkill, setExpandedSkill] = useState(null)

    return (
        <section className="py-8 mt-6 sm:py-12 sm:mt-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">Technical Skills</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.name}
                            className="bg-gray-800 rounded-lg p-3 sm:p-4 cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-0">{skill.name}</h3>
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400 text-xs sm:text-sm">
                                    {skill.level}
                                </Badge>
                            </div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedSkill === skill.name ? "auto" : 0,
                                    opacity: expandedSkill === skill.name ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <p className="text-gray-400 mt-2 text-sm sm:text-base">{skill.description}</p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 sm:mb-8">Soft Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {softSkills.map((skill, index) => (
                        <Card key={index} className="border-primary/20 bg-slate-700">
                            <CardHeader className="p-3 sm:p-4">
                                <CardTitle className="flex items-center space-x-2 text-white text-sm sm:text-base">
                                    <skill.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                                    <span>{skill.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4">
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    Proficient in {skill.name.toLowerCase()}, enhancing overall professional effectiveness.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
