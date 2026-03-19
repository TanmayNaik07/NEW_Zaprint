import type { Metadata } from "next"
import Link from "next/link"
import { Printer } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — Zaprint",
  description:
    "Read Zaprint's privacy policy. Learn how we collect, use, and protect your personal information and documents when you use our online printing service.",
  alternates: {
    canonical: "https://zaprint.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Zaprint",
    description: "Learn how Zaprint handles your data and protects your privacy.",
    url: "https://zaprint.in/privacy",
  },
}

import { getSettingByKey } from "@/lib/supabase/settings"

const defaultSections = [
  {
    title: "1. Introduction",
    content: "Zaprint (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at zaprint.in (the \"Platform\"). By using Zaprint, you agree to the terms of this policy."
  },
  {
    title: "2. Information We Collect",
    content: "We collect information to provide and improve our printing services: Account Information, Documents, Payment Information, Usage Data, and Location Data."
  },
]

export default async function PrivacyPage() {
  const privacyData = await getSettingByKey("privacy", [])
  const sections = privacyData.length > 0 ? privacyData : defaultSections

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
            PRIVACY <span className="text-[#0a1128]/40">POLICY</span>
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

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">Contact Us</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="text-[#0a1128] font-semibold mt-2">
              Email: zaprint.official@gmail.com
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
