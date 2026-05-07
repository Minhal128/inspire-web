import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Best Certified Home Inspectors Inspection Services USA',
  description: 'Our reliable home inspectors deliver accurate reports, and trusted service for buyers, sellers, and others.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased font-sans">
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  )
}
