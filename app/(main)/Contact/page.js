// 'use client';

// import { useState } from "react";
// import { Check, Copy, Mail, User } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { db } from "@/firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     company: "",
//     message: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [copied, setCopied] = useState(false);
//   const [alertInfo, setAlertInfo] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.message.trim()) newErrors.message = "Message is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return; // Prevent multiple submissions
//     if (validateForm()) {
//       setIsSubmitting(true);
//       try {
//         // Save submission to Firestore
//         const docRef = await addDoc(collection(db, "Submissions"), {
//           ...formData,
//           timestamp: new Date().toISOString(),
//         });

//         // Send email
//         const response = await fetch('/api/sendEmail', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: formData.name,
//             email: formData.email,
//             subject: `New contact from ${formData.name}`,
//             message: `Company: ${formData.company}\n\nMessage: ${formData.message}`,
//           }),
//         });

//         if (response.ok && docRef.id) {
          
//           setAlertInfo({
//             type: 'success',
//             title: 'Success!',
//             message: "We'll get back to you as soon as possible.",
//           });
//           setTimeout(() => {setAlertInfo(null)}, 4000);
//           setFormData({ name: "", email: "", company: "", message: "" });
//         } else {
//           throw new Error("Failed to send message or save submission.");
//         }
//       } catch (error) {
//         setAlertInfo({
//           type: 'error',
//           title: 'Error!',
//           message: "Something went wrong. Please try again later.",
//         });
//         setTimeout(() => {setAlertInfo(null)}, 4000);
//         console.error("Error during submission:", error);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     if (errors[e.target.name]) {
//       setErrors((prev) => ({ ...prev, [e.target.name]: null }));
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     toast({
//       description: "Email copied to clipboard!",
//     });
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black p-4 sm:p-8 ">
//       <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 mt-28 ">
//         <div className="w-full lg:w-2/5 bg-black/50 backdrop-blur-sm p-6 rounded-xl ">
//           <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name" className="text-white">Name</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`bg-white/10 border-white/20 text-white pl-10 ${errors.name ? 'border-red-500' : ''}`}
//                 />
//               </div>
//               {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-white">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`bg-white/10 border-white/20 text-white pl-10 ${errors.email ? 'border-red-500' : ''}`}
//                 />
//               </div>
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="company" className="text-white">Company (Optional)</Label>
//               <Input
//                 id="company"
//                 name="company"
//                 value={formData.company}
//                 onChange={handleChange}
//                 className="bg-white/10 border-white/20 text-white"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="message" className="text-white">Message</Label>
//               <Textarea
//                 id="message"
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 className={`bg-white/10 border-white/20 text-white min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
//               />
//               {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
//             </div>
//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? 'Sending...' : 'Send Message'}
//             </Button>
//           </form>
//         </div>

//         <div className="w-full lg:w-2/5 bg-black/50 backdrop-blur-sm p-6 rounded-xl">
//           <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
//           <div className="space-y-4 mb-10">
//             <div className="flex items-center gap-3">
//               <User className="h-5 w-5 text-primary" />
//               <span className="text-white">Mohammad Raihan Shaikh</span>
//             </div>
//             <div
//               className="flex items-center gap-3 cursor-pointer group"
//               onClick={() => copyToClipboard('shkmraihan@gmail.com')}
//             >
//               <Mail className="h-5 w-5 text-primary" />
//               <span className="text-white group-hover:text-primary transition-colors">
//                 shkmraihan@gmail.com
//               </span>
//               <div className="relative">
//                 {copied ? (
//                   <Check className="h-4 w-4 text-green-500" />
//                 ) : (
//                   <Copy className="h-4 w-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
//                 )}
//               </div>
//             </div>
//           </div>
//           {alertInfo && (
//             <Alert variant={alertInfo.type === 'success' ? 'default' : 'destructive'} className="mb-4">
//               <AlertTitle>{alertInfo.title}</AlertTitle>
//               <AlertDescription>{alertInfo.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ContactForm = dynamic(() => import('./ContactForm'), {
  loading: () => <Skeleton className="w-full h-[400px]" />,
});

const ContactInfo = dynamic(() => import('./ContactInfo'), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black p-4 sm:p-8 ">
      <div className="container  mx-auto flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 mt-10">
        <Suspense fallback={<Skeleton className="w-full lg:w-2/5 h-[400px] bg-slate-900" />}>
          <ContactForm />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full lg:w-2/5 h-[200px] bg-slate-900" />}>
          <ContactInfo />
        </Suspense>
      </div>
    </div>
  );
}

