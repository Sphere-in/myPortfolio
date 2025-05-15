import { AuthProvider } from "../contexts/AuthContext"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "IaMRaihan",
  description: "This is my Portfolio ",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-white h-screen m-0 p-0 bg-black" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  )
}