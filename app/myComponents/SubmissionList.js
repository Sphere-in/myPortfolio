'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebase"
import { useToast } from '@/hooks/use-toast'
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

import { useState } from 'react'

export default function SubmissionList({ submissions, selectedSubmission, setSelectedSubmission, setSubmissions, isLoading }) {
  const { toast } = useToast()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState(null)

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Submissions", id))
      setSubmissions(submissions.filter(sub => sub.id !== id))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
      toast({
        title: "Submission deleted",
        description: "The submission has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      })
    }
    setDeleteConfirmOpen(false)
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading submissions...</div>
  }

  if (submissions.length === 0) {
    return <div className="text-center py-4">No submissions found.</div>
  }

  return (
    <>
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
      ))}
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
    </>
  )
}

