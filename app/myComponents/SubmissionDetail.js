'use client'

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SubmissionDetail({ selectedSubmission, setSubmissions }) {
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

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
            name: 'Admin',
            email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `Re: ${selectedSubmission.subject || 'Your message'}`,
            message: reply,
            to: selectedSubmission.email,
          }),
        });
  
        if (response.ok) {
          toast({
            title: "Reply sent",
            description: "Your reply has been sent successfully",
          });
  
          setReply('');
        } else {
          throw new Error("Failed to send reply");
        }
      } catch (error) {
        console.error("Error sending reply:", error);
        toast({
          title: "Error",
          description: "Failed to send reply",
          variant: "destructive",
        });
      } finally {
        setIsSending(false);
      }
    }
  };
  

  if (!selectedSubmission) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#00FFB2]/50">Select a submission to view details</p>
      </div>
    )
  }

  return (
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
          {/* You can add replies here if you fetch them from Firestore */}
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
  )
}

