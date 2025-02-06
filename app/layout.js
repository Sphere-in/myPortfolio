import localFont from "next/font/local";
// import { AuthProvider } from './contexts/AuthContext'
import { AuthProvider } from "./contexts/AuthContexts";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "IaMRaihan",
  description: "This is my Portfolio ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  text-white  h-screen m-0 p-0 bg-black`}
        // style={{
        //   backgroundImage: "url('/back2.png')",
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backgroundRepeat: 'no-repeat',
        //   backgroundAttachment: 'fixed', // This ensures the background stays fixed when scrolling
        //   minHeight: '100vh',
        //   width: '100%',
        // }}
      >
   
        <AuthProvider>{children}</AuthProvider>

      </body>
    </html>
  );
}

