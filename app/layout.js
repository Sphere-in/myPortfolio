import { AuthProvider } from "./contexts/AuthContexts"
import "./globals.css"
// import FontLoader from "./components/FontLoader"

export const metadata = {
  title: "IaMRaihan",
  description: "This is my Portfolio ",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <FontLoader /> */}
      <body className="text-white h-screen m-0 p-0 bg-black" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )}