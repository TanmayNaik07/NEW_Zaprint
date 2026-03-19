import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log In to Zaprint",
  description: "Sign in to your Zaprint account to manage print orders, track status, and find print shops near you.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
