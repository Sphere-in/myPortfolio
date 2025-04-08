import Navbar from "../myComponents/Navbar"
import Footer from "../myComponents/Footer"
import Header from "../myComponents/Header"
import { Toaster } from "sonner"
export default function MainLayout({ children }) {
  return (
    <>
      {/* <Navbar /> */}
      <Header/>
      <main >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </main>
      <Footer/>
    </>
  )
}