import { Toaster } from "sonner"
// import { AuthProvider } from "../contexts/AuthContext"
import { AuthProvider } from "../contexts/AuthContexts"

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#001a1a] text-[#00FFB2]">
        {children}
        <Toaster />
      </div>
    </AuthProvider>
  )
}

