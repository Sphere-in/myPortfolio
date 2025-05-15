import Footer from "../myComponents/Footer"
import Header from "../myComponents/Header"
export default function MainLayout({ children }) {
  return (
    <>
      <Header/>
      <main >
        {children}
      </main>
      <Footer/>
    </>
  )
}