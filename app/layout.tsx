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
    default: "Zaprint | Online Printing & Remote Print Management",
    template: "%s | Zaprint",
  },
  description:
    "Zaprint is your ultimate platform for online printing and remote print management. Upload documents, choose your nearest print shop, manage prints, and skip the queue.",
  keywords: [
    "Zaprint",
    "online printing",
    "remote printing",
    "manage prints",
    "print shops",
    "online printing service",
    "print documents online",
    "send print request online",
    "print documents near me",
    "printer shops near me",
    "thesis printing online",
    "bulk printing services",
    "college printing services",
    "document printing",
    "print pickup service",
    "bw printing online",
    "color printing service",
    "affordable printing near me",
    "skip the queue printing",
    "print pdf online",
    "cheap online printing",
    "cloud printing india"
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
    title: "Zaprint | Online Printing & Remote Print Management",
    description:
      "Zaprint is your ultimate platform for online printing and remote print management. Upload documents, choose your nearest print shop, manage prints, and skip the queue.",
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
    title: "Zaprint | Online Printing & Remote Print Management",
    description:
      "Zaprint is your ultimate platform for online printing and remote print management. Upload documents, choose your nearest print shop, manage prints, and skip the queue.",
    images: ["/og-image.png"],
    creator: "@zaprint",
  },
  icons: {
    icon: "/zaprint-favicon.png",
    shortcut: "/zaprint-favicon.png",
    apple: "/zaprint-favicon.png",
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
