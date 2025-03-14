import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SweetNotes",
  description: "Create beautiful handwritten notes with custom fonts and stickers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Caveat&family=Indie+Flower&family=Shadows+Into+Light&family=Pacifico&family=Homemade+Apple&family=Permanent+Marker&family=Amatic+SC&family=Satisfy&family=Kalam&family=Handlee&family=Patrick+Hand&family=Sriracha&family=Gochi+Hand&family=Covered+By+Your+Grace&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
          {children}
          <Analytics />
      </body>
    </html>
  )
}
