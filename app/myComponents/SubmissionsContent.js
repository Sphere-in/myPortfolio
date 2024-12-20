'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import SubmissionList from './SubmissionList'
import SubmissionDetail from './SubmissionDetail'

export default function SubmissionsContent() {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

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
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

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
          <SubmissionList 
            submissions={submissions} 
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
            setSubmissions={setSubmissions}
            isLoading={isLoading}
          />
        </ScrollArea>
      </div>
      <div className="flex-1 pl-6">
        <SubmissionDetail 
          selectedSubmission={selectedSubmission} 
          setSubmissions={setSubmissions}
        />
      </div>
    </div>
  )
}

