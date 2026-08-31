const textFields = ["title", "slug", "subtitle", "description", "longDescription", "githubLink", "liveLink", "technologies", "features", "startDate", "endDate"]
const arrayFields = ["imageUrls", "challenges", "solutions", "goals", "outcomes"]

export function sanitizeProject(input) {
  const project = {}
  for (const field of textFields) project[field] = String(input?.[field] || "").trim().slice(0, field === "longDescription" ? 20000 : 3000)
  for (const field of arrayFields) project[field] = Array.isArray(input?.[field]) ? input[field].slice(0, 30).map((value) => String(value).trim().slice(0, 2000)).filter(Boolean) : []
  project.team = Array.isArray(input?.team) ? input.team.slice(0, 30).map((member) => ({ name: String(member?.name || "").trim().slice(0, 100), role: String(member?.role || "").trim().slice(0, 100) })).filter((member) => member.name || member.role) : []
  project.timeline = { start: String(input?.timeline?.start || "").slice(0, 100), end: String(input?.timeline?.end || "").slice(0, 100), duration: String(input?.timeline?.duration || "").slice(0, 100) }
  project.testimonial = { text: String(input?.testimonial?.text || "").slice(0, 3000), author: String(input?.testimonial?.author || "").slice(0, 200) }
  project.display = input?.display !== false
  project.position = Number.isFinite(Number(input?.position)) ? Number(input.position) : 0
  if (!project.title || !project.description) throw new Error("Title and description are required")
  project.slug = (project.slug || project.title).toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-").slice(0, 120)
  if (!project.slug) throw new Error("A valid project slug is required")
  return project
}
