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
        <section className="py-12 mt-10 ">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white mb-8">Technical Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.name}
                            className="bg-gray-800 rounded-lg p-4 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium text-white">{skill.name}</h3>
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
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
                                <p className="text-gray-400 mt-2">{skill.description}</p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-1 sm:px-6 lg:px-8 py-9">
                <h2 className="text-2xl font-extrabold text-white mb-8">Soft Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {softSkills.map((skill, index) => (
                        <Card key={index} className="border-primary/20 bg-slate-700 ">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-white">
                                    <skill.icon className="h-6 w-6 text-primary" />
                                    <span>{skill.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className=" text-gray-400">
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
