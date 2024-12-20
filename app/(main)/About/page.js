import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Linkedin, Instagram, Globe, Github } from 'lucide-react'
import ImageSlider from "./image-slider"
import EducationField from "./EducationField"
import Skills from "./Skills"

export default function Component() {
  return (
    <div className="min-h-screen  bg-[#091c24]  text-white p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto pt-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start relative">
          {/* Social Icons Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl md:text-5xl font-bold">Hi, I&apos;m <span className="text-emerald-300">Mohammad Raihan</span></h1>
              </div>
              <h2 className="text-xl md:text-2xl text-emerald-500">Web Developer</h2>
            </div>

            {/* Scrollable introduction text */}
            <div className="max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-gray-800">
              <p className="text-gray-400">
                A versatile and passionate developer with expertise in modern web technologies, cloud solutions, automation, and programming. With a strong foundation in software development and problem-solving, I thrive on creating efficient and scalable solutions for complex challenges.
                <br /><br />
                I specialize in Next.js (React, HTML, CSS), crafting responsive and interactive web applications. My experience extends to cloud platforms like AWS, where I design and manage robust infrastructures. I'm also proficient in databases (both SQL and NoSQL), ensuring optimized data storage and retrieval for applications.
                <br /><br />
                In addition to web development, I have hands-on expertise in automation tools like Jenkins and Ansible, as well as shell scripting, enabling seamless CI/CD pipelines and server management. I'm adept in programming with Python, C, and C++, further diversifying my ability to tackle various technical challenges.
                <br /><br />
                Whether it's developing feature-rich applications, automating workflows, or deploying scalable systems, I am driven by a commitment to deliver excellence in every project I undertake. Let's create something amazing together!
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </Link>
            </div>

            {/* Download CV Button */}
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 select-none">
              Download CV
            </Button>
          </div>

          {/* Image Column */}
          <div className="relative md:sticky md:top-16">
            {/* Decorative Circles */}
            <div className="absolute right-0 top-0 w-48 h-48  rounded-full opacity-20 blur-3xl" />
            <div className="absolute right-20 top-20 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-3xl" />

            {/* Profile Image */}
            <div className="relative z-10 max-w-md mx-auto">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src="/me.png"
                  alt="Profile picture"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageSlider />
      <EducationField />
      <Skills/>
    </div>
  )
}

