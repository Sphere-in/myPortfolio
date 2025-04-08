"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"
import { toast } from "sonner"

export default function AboutUsPage() {
  const [aboutContent, setAboutContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const storedContent = localStorage.getItem("aboutContent") || ""
    setAboutContent(storedContent)
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem("aboutContent", aboutContent)
      toast.success("About Us content saved successfully!")
      setIsSaving(false)
    }, 500)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Edit About Us</CardTitle>
        <CardDescription>Update the About Us content for your website</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={aboutContent}
          onChange={(e) => setAboutContent(e.target.value)}
          placeholder="Enter your 'About Us' content here..."
          className="min-h-[calc(100vh-300px)] resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
