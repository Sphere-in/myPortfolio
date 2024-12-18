import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AboutUsPage() {
  const [aboutContent, setAboutContent] = useState('')

  useEffect(() => {
    const storedContent = localStorage.getItem('aboutContent') || ''
    setAboutContent(storedContent)
  }, [])

  const handleSave = () => {
    localStorage.setItem('aboutContent', aboutContent)
    alert('About Us content saved successfully!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit About Us</h2>
      <Textarea
        value={aboutContent}
        onChange={(e) => setAboutContent(e.target.value)}
        placeholder="Enter your 'About Us' content here..."
        className="h-[calc(100vh-250px)] bg-[#002626] border-[#00FFB2]/20 text-[#00FFB2]"
      />
      <Button onClick={handleSave} className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90">
        Save Changes
      </Button>
    </div>
  )
}