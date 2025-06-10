"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, Send, Calendar, Mail, Building, FileText } from "lucide-react"
import { getAuth } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { toast } from "sonner"



export default function SubmissionsClient() {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState(null)
  const [reply, setReply] = useState("")
  const [isSending, setIsSending] = useState(false)
  const auth = getAuth()

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("Not authenticated")
      }

      const idToken = await user.getIdToken()

      const response = await fetch("/api/contact", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch submissions")
      }

      const data = await response.json()
      setSubmissions(
        data.submissions.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
      )
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast.error("Failed to fetch submissions")
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
      const user = auth.currentUser
      if (!user) {
        throw new Error("Not authenticated")
      }

      const idToken = await user.getIdToken()

      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete submission", response.statusText)
      }

      setSubmissions(submissions.filter((sub) => sub.id !== id))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
      toast.success("The submission has been deleted successfully")
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast.error("Failed to delete submission")
    }
    setDeleteConfirmOpen(false)
  }

  const handleReply = async () => {
    if (selectedSubmission && reply) {
      setIsSending(true)
      try {
        const user = auth.currentUser
        if (!user) {
          throw new Error("Not authenticated")
        }

        const idToken = await user.getIdToken()

        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: user.displayName || "Admin",
            email: user.email || process.env.ADMIN_EMAIL,
            subject: `Re: ${selectedSubmission.subject || "Your message"}`,
            message: reply,
            to: selectedSubmission.email,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send reply")
        }

        toast.success("Your reply has been sent successfully")
        setReply("")

        // Mark as read
        await fetch(`/api/submissions/${selectedSubmission.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            read: true,
          }),
        })

        // Update local state
        setSubmissions(submissions.map((sub) => (sub.id === selectedSubmission.id ? { ...sub, read: true } : sub)))

        if (selectedSubmission) {
          setSelectedSubmission({ ...selectedSubmission, read: true })
        }
      } catch (error) {
        console.error("Error sending reply:", error)
        toast.error("Failed to send reply")
      } finally {
        setIsSending(false)
      }
    }
  }

  const markAsRead = async (submission) => {
    if (submission.read) return

    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("Not authenticated")
      }

      const idToken = await user.getIdToken()

      await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          read: true,
        }),
      })

      // Update local state
      setSubmissions(submissions.map((sub) => (sub.id === submission.id ? { ...sub, read: true } : sub)))

      if (selectedSubmission && selectedSubmission.id === submission.id) {
        setSelectedSubmission({ ...selectedSubmission, read: true })
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <Card className="md:w-1/3 h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Submissions</CardTitle>
            <Button onClick={handleReload} disabled={isLoading} variant="outline" size="sm">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Reload</span>
            </Button>
          </div>
          <CardDescription>Manage incoming contact form submissions</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-120px)]">
          <ScrollArea className="h-full pr-4">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No submissions found.</div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <Card
                    key={sub.id}
                    className={`cursor-pointer transition-all ${
                      selectedSubmission?.id === sub.id ? "ring-2 ring-primary" : "hover:bg-accent/50"
                    } ${!sub.read ? "border-l-4 border-l-primary" : ""}`}
                    onClick={() => {
                      setSelectedSubmission(sub)
                      markAsRead(sub)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-medium ${!sub.read ? "font-semibold" : ""}`}>{sub.name}</h3>
                          <p className="text-sm text-muted-foreground">{sub.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(sub.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSubmissionToDelete(sub)
                            setDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex-1">
        {!selectedSubmission ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Select a submission to view details</p>
            </div>
          </div>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedSubmission.name}`} />
                  <AvatarFallback>{selectedSubmission.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedSubmission.name}</CardTitle>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {selectedSubmission.email}
                    </div>
                    {selectedSubmission.company && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        {selectedSubmission.company}
                      </div>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {new Date(selectedSubmission.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ScrollArea className="h-[calc(100vh-450px)] md:h-[300px]">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="mb-4" />
              <div className="flex items-center space-x-2 w-full">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1"
                />
                <Button onClick={handleReply} disabled={isSending || !reply.trim()}>
                  {isSending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </CardFooter>
          </Card>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => submissionToDelete && handleDelete(submissionToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
