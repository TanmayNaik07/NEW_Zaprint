import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Rubik_Dirt } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NavigationLoadingProvider } from "@/components/providers/navigation-loading-provider"
import { Toaster } from "sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const rubikDirt = Rubik_Dirt({ weight: "400", subsets: ["latin"], variable: "--font-rubik-dirt" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1128",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://zaprint.in"),
  title: {
    default: "Zaprint — Print Documents Online | Skip the Queue",
    template: "%s | Zaprint",
  },
  description:
    "Upload documents, choose print settings, pay online & pick up your prints when ready. Fast, affordable printing service near you. No more waiting in queues.",
  keywords: [
    "online printing service",
    "print documents online",
    "send print request online",
    "print documents near me",
    "printer shops near me",
    "thesis printing",
    "bulk printing services",
    "college printing services",
    "document printing",
    "print pickup service",
    "color printing service",
    "affordable printing near me",
  ],
  authors: [{ name: "Zaprint" }],
  creator: "Zaprint",
  publisher: "Zaprint",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zaprint.in",
    siteName: "Zaprint",
    title: "Zaprint — Print Documents Online | Skip the Queue",
    description:
      "Upload documents, choose print settings, pay online & pick up your prints when ready. Fast, affordable printing near you.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zaprint — Smart Online Printing Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaprint — Print Documents Online | Skip the Queue",
    description:
      "Upload documents, choose print settings, pay online & pick up your prints when ready.",
    images: ["/og-image.png"],
    creator: "@zaprint",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "https://zaprint.in",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${rubikDirt.variable} font-sans antialiased`}>
        <NavigationLoadingProvider>
          {children}
        </NavigationLoadingProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
