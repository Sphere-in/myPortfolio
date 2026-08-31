"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { FileText, FolderKanban, Info, LayoutDashboard, LogOut, Menu, ShieldCheck, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/ui/Mode-Toggle"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { href: "/admin?view=submissions", view: "submissions", label: "Submissions", icon: FileText },
  { href: "/admin?view=projects", view: "projects", label: "Projects", icon: FolderKanban },
  { href: "/admin?view=about", view: "about", label: "About content", icon: Info },
  { href: "/admin/create-admin", view: "create-admin", label: "Create admin", icon: UserPlus },
]

function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    const result = await login(email.trim(), password)
    if (!result.success) setError(result.error || "Sign-in failed. Check your credentials and admin access.")
    setSubmitting(false)
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-12 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_38%)]" />
      <div className="absolute right-4 top-4"><ModeToggle compact /></div>
      <div className="relative w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
          <div><p className="font-semibold">Portfolio Console</p><p className="text-sm text-muted-foreground">Secure administrator access</p></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="h-11 w-full" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
        </form>
        <Link href="/" className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">Return to portfolio</Link>
      </div>
    </main>
  )
}

function Sidebar({ onNavigate }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()
  const currentView = pathname === "/admin/create-admin" ? "create-admin" : searchParams.get("view") || "submissions"

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-5">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><LayoutDashboard className="h-5 w-5" /></span>
          <span><span className="block font-semibold">Portfolio Admin</span><span className="block text-xs text-muted-foreground">Content workspace</span></span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {navigation.map(({ href, view, label, icon: Icon }) => {
          const active = currentView === view
          return <Link key={view} href={href} onClick={onNavigate} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>
        })}
      </nav>
      <div className="space-y-3 border-t p-4">
        <div className="min-w-0 rounded-xl bg-muted p-3"><p className="truncate text-sm font-medium">{user?.displayName || "Administrator"}</p><p className="truncate text-xs text-muted-foreground">{user?.email}</p></div>
        <ModeToggle />
        <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}><LogOut className="h-4 w-4" />Sign out</Button>
      </div>
    </div>
  )
}

export default function AdminShell({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [open, setOpen] = useState(false)

  if (isLoading) return <div className="grid min-h-screen place-items-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>
  if (!isAuthenticated) return <LoginScreen />

  return (
    <div className="min-h-screen bg-muted/30 text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] border-r bg-background lg:block"><Sidebar /></aside>
      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="outline" size="icon"><Menu className="h-5 w-5" /><span className="sr-only">Open admin menu</span></Button></SheetTrigger>
            <SheetContent side="left" className="w-[min(88vw,19rem)] p-0"><SheetTitle className="sr-only">Admin navigation</SheetTitle><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
          </Sheet>
          <span className="font-semibold">Portfolio Admin</span><ModeToggle compact />
        </header>
        <main className="mx-auto w-full max-w-[1600px] p-3 sm:p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
