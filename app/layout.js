import { AuthProvider } from "../contexts/AuthContext"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"

export const metadata = {
  title: "Mohammad Raihan | Web Developer & DevOps Engineer",
  description: "Portfolio of Mohammad Raihan — web development, cloud, automation, and DevOps projects.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen m-0 bg-background text-foreground antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
