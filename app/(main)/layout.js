import Navbar from "../myComponents/Navbar"
import Footer from "../myComponents/Footer"
import Header from "../myComponents/Header"

export default function MainLayout({ children }) {
  return (
    <>
      {/* <Navbar /> */}
      <Header/>
      <main >{children}</main>
      <Footer/>
    </>
  )
}