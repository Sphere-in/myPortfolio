"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { adminFetch } from "@/lib/admin-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateAdminPage() {
  const [form, setForm] = useState({ displayName: "", email: "", password: "" })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setResult(null)
    try {
      const data = await adminFetch("/api/admin", { method: "POST", body: JSON.stringify(form) })
      setResult(data)
      setForm({ displayName: "", email: "", password: "" })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
        <p className="text-sm font-medium text-muted-foreground">Access management</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create an administrator</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Create a Firebase Authentication user and grant the secure admin claim. If the email already exists, that user is promoted without changing their password.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem]">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Account details</CardTitle><CardDescription>Use a unique password and share it through a secure channel.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} autoComplete="name" placeholder="Site administrator" /></div>
              <div className="space-y-2"><Label htmlFor="new-admin-email">Email</Label><Input id="new-admin-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="off" required /></div>
              <div className="space-y-2"><Label htmlFor="new-admin-password">Temporary password</Label><Input id="new-admin-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" minLength={6} placeholder="Firebase password policy" /><p className="text-xs text-muted-foreground">Required for a new account; 12+ characters are recommended. It is ignored when promoting an existing user.</p></div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Button asChild type="button" variant="outline"><Link href="/admin">Cancel</Link></Button><Button disabled={submitting} className="gap-2"><ShieldCheck className="h-4 w-4" />{submitting ? "Creating…" : "Create administrator"}</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card className="h-fit rounded-2xl bg-primary text-primary-foreground">
          <CardHeader><CardTitle className="text-lg">Security note</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-primary-foreground/80"><p>Only an authenticated administrator can perform this action.</p><p>The service-account credential remains on the server and is never included in client JavaScript.</p></CardContent>
        </Card>
      </div>
      {result && <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><div><p className="font-medium">{result.message}</p><p className="text-muted-foreground">{result.email}</p></div></div>}
    </div>
  )
}
