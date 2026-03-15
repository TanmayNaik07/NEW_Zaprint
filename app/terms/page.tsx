import type { Metadata } from "next"
import Link from "next/link"
import { Printer } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — Zaprint",
  description:
    "Read Zaprint's terms of service. Understand your rights and responsibilities when using our online document printing platform.",
  alternates: {
    canonical: "https://zaprint.in/terms",
  },
  openGraph: {
    title: "Terms of Service — Zaprint",
    description: "Terms and conditions for using Zaprint's online printing services.",
    url: "https://zaprint.in/terms",
  },
}

import { getSettingByKey } from "@/lib/supabase/settings"

const defaultSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Zaprint (\"the Platform\"), operated by Zaprint (\"we,\" \"our,\" or \"us\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes."
  },
  {
    title: "2. Description of Service",
    content: "Zaprint is an online platform that enables users to upload documents, select print specifications, pay online, and pick up printed documents from partner print shops. We act as an intermediary between users and independent print shop operators. Zaprint does not directly own or operate print shops."
  },
  // ... adding more as defaults just in case
]

export default async function TermsPage() {
  const termsData = await getSettingByKey("terms", [])
  const sections = termsData.length > 0 ? termsData : defaultSections

  return (
    <div className="min-h-screen bg-[#f7f6f4] relative overflow-hidden">
      {/* Paper texture background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: "url('/images/paper-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          mixBlendMode: "multiply",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="bg-[#0a1128] text-white p-2 rounded-xl">
            <Printer className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-[#0a1128]">Zaprint</span>
        </Link>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <section className="pt-12 pb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0a1128] uppercase leading-none mb-4">
            TERMS OF <span className="text-[#0a1128]/40">SERVICE</span>
          </h1>
          <p className="text-sm text-[#5b637a] font-medium">
            Last updated: March 15, 2026
          </p>
        </section>

        <article className="bg-white p-8 md:p-12 rounded-[2rem] border border-black/5 shadow-sm space-y-8">
          {sections.map((section: any, idx: number) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-[#0a1128] mb-3">{section.title}</h2>
              <div className="text-[#5b637a] font-medium leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </section>
          ))}
          
          {/* Contact section is usually custom or last */}
          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">Contact</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-[#0a1128] font-semibold mt-2">
              Email: legal@zaprint.in
            </p>
          </section>
        </article>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#5b637a] hover:text-[#0a1128] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
