// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "sonner"

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     company: "",
//     subject: "",
//     message: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Validate form
//     if (!formData.name || !formData.email || !formData.message) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to submit form")
//       }

//       toast.success("Your message has been sent successfully!")
//       setFormData({
//         name: "",
//         email: "",
//         company: "",
//         subject: "",
//         message: "",
//       })
//     } catch (error) {
//       console.error("Error submitting form:", error)
//       toast.error(error.message || "Failed to submit form")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">
//             Name <span className="text-destructive">*</span>
//           </Label>
//           <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="email">
//             Email <span className="text-destructive">*</span>
//           </Label>
//           <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="company">Company</Label>
//           <Input id="company" name="company" value={formData.company} onChange={handleChange} />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="subject">Subject</Label>
//           <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="message">
//           Message <span className="text-destructive">*</span>
//         </Label>
//         <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
//       </div>

//       <Button type="submit" disabled={isSubmitting} className="w-full">
//         {isSubmitting ? "Sending..." : "Send Message"}
//       </Button>
//     </form>
//   )
// }
