'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { RefreshCw } from 'lucide-react'

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reply, setReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const submissionsCollection = collection(db, "Submissions")
      const submissionDocs = await getDocs(submissionsCollection)
      const fetchedSubmissions = submissionDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setSubmissions(fetchedSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      localStorage.setItem('submissions', JSON.stringify(fetchedSubmissions))
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]')
    if (storedSubmissions.length > 0) {
      setSubmissions(storedSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } else {
      fetchSubmissions()
    }
  }, [])

  const handleReply = () => {
    if (selectedSubmission && reply) {
      console.log(`Replying to ${selectedSubmission.email}: ${reply}`)
      setReply('')
    }
  }

  const handleReload = () => {
    fetchSubmissions()
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 pr-6 border-r border-[#00FFB2]/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Submissions</h2>
          <Button
            onClick={handleReload}
            disabled={isLoading}
            className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Reload</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`p-4 mb-2 rounded cursor-pointer transition-colors ${
                selectedSubmission?.id === sub.id 
                  ? 'bg-[#00FFB2]/10 border border-[#00FFB2]/20' 
                  : 'bg-[#002626] hover:bg-[#00FFB2]/5'
              }`}
              onClick={() => setSelectedSubmission(sub)}
            >
              <h3 className="font-semibold">{sub.name}</h3>
              <p className="text-sm text-[#00FFB2]/70">{sub.email}</p>
              <p className="text-xs text-[#00FFB2]/50">{new Date(sub.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 pl-6">
        {selectedSubmission ? (
          <div className="bg-[#002626] rounded-lg p-6 h-full flex flex-col border border-[#00FFB2]/20">
            <div className="mb-4">
              <Avatar className="h-12 w-12 mb-2 border-2 border-[#00FFB2]/20">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedSubmission.name}`} />
                <AvatarFallback className="bg-[#001a1a] text-[#00FFB2]">
                  {selectedSubmission.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{selectedSubmission.name}</h2>
              <p className="text-[#00FFB2]/70">{selectedSubmission.email}</p>
              {selectedSubmission.company && (
                <p className="text-[#00FFB2]/70">{selectedSubmission.company}</p>
              )}
              <p className="text-xs text-[#00FFB2]/50">
                {new Date(selectedSubmission.timestamp).toLocaleString()}
              </p>
            </div>
            <ScrollArea className="flex-1 mb-4">
              <p className="mb-4 text-[#00FFB2]/90">{selectedSubmission.message}</p>
            </ScrollArea>
            <div className="mt-auto">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="mb-2 bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
              />
              <Button 
                onClick={handleReply}
                className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90"
              >
                Send Reply
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#00FFB2]/50">Select a submission to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}