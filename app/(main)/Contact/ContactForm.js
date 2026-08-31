"use client"

import { useState } from "react"
import { Mail, User } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialForm = { name: "", email: "", company: "", message: "" }

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateForm() {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = "Name is required"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = "Enter a valid email"
    if (formData.message.trim().length < 10) nextErrors.message = "Please write at least 10 characters"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting || !validateForm()) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Unable to send message")
      toast.success("Thanks — I’ll get back to you soon.")
      setFormData(initialForm)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-sm sm:p-7 lg:flex-1">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Start a conversation</p>
      <h2 className="mb-6 mt-2 text-2xl font-bold text-white sm:text-3xl">Get in touch</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="name" className="text-white">Name</Label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input id="name" name="name" value={formData.name} onChange={handleChange} maxLength={100} className={`border-white/15 bg-white/5 pl-10 text-white ${errors.name ? "border-red-500" : ""}`} /></div>{errors.name && <p className="text-sm text-red-400">{errors.name}</p>}</div>
          <div className="space-y-2"><Label htmlFor="email" className="text-white">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} maxLength={254} className={`border-white/15 bg-white/5 pl-10 text-white ${errors.email ? "border-red-500" : ""}`} /></div>{errors.email && <p className="text-sm text-red-400">{errors.email}</p>}</div>
        </div>
        <div className="space-y-2"><Label htmlFor="company" className="text-white">Company <span className="text-gray-500">(optional)</span></Label><Input id="company" name="company" value={formData.company} onChange={handleChange} maxLength={150} className="border-white/15 bg-white/5 text-white" /></div>
        <div className="space-y-2"><Label htmlFor="message" className="text-white">Message</Label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} maxLength={5000} className={`min-h-36 resize-y border-white/15 bg-white/5 text-white ${errors.message ? "border-red-500" : ""}`} />{errors.message && <p className="text-sm text-red-400">{errors.message}</p>}</div>
        <Button type="submit" className="h-11 w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button>
      </form>
    </div>
  )
}
