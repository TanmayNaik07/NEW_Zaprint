import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up Free — ZaPrint Online Printing",
  description: "Create your free ZaPrint account. Upload documents, choose print settings, pay online, and pick up from nearby shops. Start in 30 seconds.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
