'use client';

import { useState } from "react";
import { User, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [alertInfo, setAlertInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const docRef = await addDoc(collection(db, "Submissions"), {
          ...formData,
          timestamp: new Date().toISOString(),
        });

        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: `New contact from ${formData.name}`,
            message: `Company: ${formData.company}\n\nMessage: ${formData.message}`,
          }),
        });

        if ( docRef.id || response.ok) {
          toast.success("We'll get back to you as soon as possible.")
          setFormData({ name: "", email: "", company: "", message: "" });
        } else {
          throw new Error("Failed to send message or save submission.");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again later.")
        console.error("Error during submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  return (
    <div className="w-full lg:w-2/5 bg-black/50 backdrop-blur-sm p-6 rounded-xl">
      <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`bg-white/10 border-white/20 text-white pl-10 ${errors.name ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-white/10 border-white/20 text-white pl-10 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-white">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`bg-white/10 border-white/20 text-white min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {alertInfo && (
        <Alert variant={alertInfo.type === 'success' ? 'default' : 'destructive'} className="mt-4">
          <AlertTitle>{alertInfo.title}</AlertTitle>
          <AlertDescription>{alertInfo.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

