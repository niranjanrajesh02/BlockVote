import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Navbar from './components/navbar';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Block Vote',
  description: 'Cast your vote on the Blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* navbar with all pages */}
      <UserProvider>
        {/* <Navbar /> */}
        <body className={inter.className}>{children}</body>
      </UserProvider>
    </html>
  )
}
