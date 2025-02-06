'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, Send, X } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SubmissionsClient() {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState(null)
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [alert, setAlert] = useState(null)

  const showAlert = (title, description, variant = "default") => {
    setAlert({ title, description, variant })
    setTimeout(() => setAlert(null), 5000) // Hide alert after 5 seconds
  }

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
      showAlert("Error", "Failed to fetch submissions", "destructive")
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Submissions", id))
      setSubmissions(submissions.filter(sub => sub.id !== id))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
      showAlert("Success", "The submission has been deleted successfully")
    } catch (error) {
      console.error("Error deleting submission:", error)
      showAlert("Error", "Failed to delete submission", "destructive")
    }
    setDeleteConfirmOpen(false)
  }

  const handleReply = async () => {
    if (selectedSubmission && reply) {
      setIsSending(true);
      try {
        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Raihan Shaikh',
            email: process.env.ADMIN_EMAIL,
            subject: `Re: ${selectedSubmission.subject || 'Your message'}`,
            message: reply,
            to: selectedSubmission.email,
          }),
        });
  
        if (response.ok) {
          showAlert("Success", "Your reply has been sent successfully")
          setReply('');
        } else {
          throw new Error("Failed to send reply");
        }
      } catch (error) {
        console.error("Error sending reply:", error);
        showAlert("Error", "Failed to send reply", "destructive")
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="flex h-full relative">
      {alert && (
        <Alert 
          variant={alert.variant}
          className="absolute top-4 right-4 w-96 z-50"
        >
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          <Button 
            variant="ghost" 
            className="h-4 w-4 absolute top-4 right-4 p-0" 
            onClick={() => setAlert(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
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
          {isLoading ? (
            <div className="text-center py-4">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-4">No submissions found.</div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className={`p-4 mb-2 rounded cursor-pointer transition-colors ${
                  selectedSubmission?.id === sub.id 
                    ? 'bg-[#00FFB2]/10 border border-[#00FFB2]/20' 
                    : 'bg-[#002626] hover:bg-[#00FFB2]/5'
                }`}
                onClick={() => setSelectedSubmission(sub)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{sub.name}</h3>
                    <p className="text-sm text-[#00FFB2]/70">{sub.email}</p>
                    <p className="text-xs text-[#00FFB2]/50">{new Date(sub.timestamp).toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSubmissionToDelete(sub)
                      setDeleteConfirmOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-[#00FFB2]/70" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      <div className="flex-1 pl-6">
        {!selectedSubmission ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#00FFB2]/50">Select a submission to view details</p>
          </div>
        ) : (
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
              <div className="space-y-4">
                <div className="bg-[#001a1a] p-4 rounded-lg">
                  <p className="text-[#00FFB2]/90">{selectedSubmission.message}</p>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-auto">
              <div className="flex items-center space-x-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-[#001a1a] border-[#00FFB2]/20 text-[#00FFB2]"
                />
                <Button 
                  onClick={handleReply}
                  disabled={isSending}
                  className="bg-[#00FFB2] text-[#001a1a] hover:bg-[#00FFB2]/90"
                >
                  {isSending ? (
                    <Send className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-slate-900">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(submissionToDelete?.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

