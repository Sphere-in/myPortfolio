"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Eye, ImagePlus, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { adminFetch, uploadAdminImage } from "@/lib/admin-client"
import { DEFAULT_ABOUT_CONTENT } from "@/data/about-defaults"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function AboutUsPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch("/api/about").then((response) => response.json()).then((data) => setContent({ ...DEFAULT_ABOUT_CONTENT, ...data.content })).catch(() => toast.error("Could not load About content")).finally(() => setLoading(false))
  }, [])

  function update(field, value) {
    setContent((current) => ({ ...current, [field]: value }))
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const imageUrl = await uploadAdminImage(file, "about-images")
      update("imageUrl", imageUrl)
      toast.success("Image uploaded. Save changes to publish it.")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const data = await adminFetch("/api/about", { method: "PATCH", body: JSON.stringify(content) })
      setContent((current) => ({ ...current, ...data.content }))
      toast.success("About section published")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-80 animate-pulse rounded-3xl bg-muted" />

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-medium text-muted-foreground">Website content</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">About section</h1><p className="mt-1 text-sm text-muted-foreground">Update the copy, profile image, and image visibility shown on the portfolio.</p></div>
        <Button disabled={saving} className="gap-2 sm:w-auto"><Save className="h-4 w-4" />{saving ? "Publishing…" : "Publish changes"}</Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle>Content</CardTitle><CardDescription>Keep the introduction short and easy to scan on mobile.</CardDescription></CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="about-eyebrow">Section label</Label><Input id="about-eyebrow" value={content.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="about-name">Name</Label><Input id="about-name" value={content.name} onChange={(e) => update("name", e.target.value)} required /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="about-role">Role</Label><Input id="about-role" value={content.role} onChange={(e) => update("role", e.target.value)} required /></div>
            <div className="space-y-2 sm:col-span-2"><div className="flex items-center justify-between"><Label htmlFor="about-description">Introduction</Label><span className="text-xs text-muted-foreground">{content.description.length}/5000</span></div><Textarea id="about-description" value={content.description} onChange={(e) => update("description", e.target.value)} className="min-h-64 resize-y leading-relaxed" maxLength={5000} required /></div>
          </CardContent>
        </Card>

        <Card className="h-fit rounded-2xl">
          <CardHeader><CardTitle>Profile image</CardTitle><CardDescription>JPG, PNG, WebP, or GIF up to 5 MB.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
              {content.imageUrl ? <Image src={content.imageUrl} alt={content.imageAlt || "About image preview"} fill sizes="368px" className="object-cover" /> : <div className="grid h-full place-items-center text-muted-foreground"><ImagePlus className="h-10 w-10" /></div>}
              {!content.imageVisible && <div className="absolute inset-0 grid place-items-center bg-background/80"><span className="rounded-full bg-muted px-3 py-1 text-sm">Hidden on website</span></div>}
            </div>
            <Label htmlFor="about-upload" className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background text-sm font-medium transition-colors hover:bg-accent">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{uploading ? "Uploading…" : "Choose new image"}
            </Label>
            <Input id="about-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="sr-only" disabled={uploading} />
            <div className="space-y-2"><Label htmlFor="about-image-alt">Alternative text</Label><Input id="about-image-alt" value={content.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} placeholder="Describe the image" /></div>
            <div className="flex items-center justify-between rounded-xl border p-4"><div className="pr-3"><p className="flex items-center gap-2 text-sm font-medium"><Eye className="h-4 w-4" />Show image</p><p className="text-xs text-muted-foreground">The text expands when hidden.</p></div><Switch checked={content.imageVisible} onCheckedChange={(value) => update("imageVisible", value)} /></div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
