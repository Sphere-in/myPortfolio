const fs = require("node:fs")
const path = require("node:path")

function parseCredential(value) {
  if (!value) throw new Error("Credential value is empty")
  const normalized = value.trim().replace(/^['"]|['"]$/g, "")
  const json = normalized.startsWith("{")
    ? normalized
    : Buffer.from(normalized.replace(/\s+/g, ""), "base64").toString("utf8")
  const serviceAccount = JSON.parse(json)
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Service-account JSON is missing required fields")
  }
  return serviceAccount
}

function readWrappedCredentialFromEnvFile() {
  const envPath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) return null
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)
  const keyPattern = /^[A-Za-z_][A-Za-z0-9_]*=/
  const startIndex = lines.findIndex((line) => line.startsWith("ADMIN_CREDENTIALS_BASE64="))
  if (startIndex < 0) return null

  const chunks = [lines[startIndex].slice("ADMIN_CREDENTIALS_BASE64=".length).trim()]
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line || line.startsWith("#")) continue
    if (keyPattern.test(line)) break
    chunks.push(line)
  }
  return chunks.join("")
}

function getServiceAccount() {
  const candidates = [process.env.ADMIN_CREDENTIALS_BASE64, readWrappedCredentialFromEnvFile()].filter(Boolean)
  for (const candidate of candidates) {
    try {
      return parseCredential(candidate)
    } catch {
      // Try the local wrapped form before reporting a configuration error.
    }
  }
  throw new Error("ADMIN_CREDENTIALS_BASE64 must be complete raw JSON or base64-encoded service-account JSON")
}

module.exports = { getServiceAccount, parseCredential }
