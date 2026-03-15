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

export default function PrivacyPage() {
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
          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">1. Introduction</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Zaprint (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our website and services at zaprint.in (the &quot;Platform&quot;).
              By using Zaprint, you agree to the terms of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">2. Information We Collect</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              We collect information to provide and improve our printing services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li><strong>Account Information:</strong> Name, email address, phone number, and pincode when you create an account.</li>
              <li><strong>Documents:</strong> Files you upload for printing. These are stored temporarily and encrypted.</li>
              <li><strong>Payment Information:</strong> Payment details processed through our secure third-party payment providers. We do not store your full card details.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with the Platform, including pages visited, features used, and device information.</li>
              <li><strong>Location Data:</strong> Your city and pincode to help you find nearby print shops.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>To process and fulfill your print orders</li>
              <li>To connect you with nearby partner print shops</li>
              <li>To send order status notifications and pickup alerts</li>
              <li>To process payments securely</li>
              <li>To improve our platform and user experience</li>
              <li>To communicate important service updates</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">4. Document Security</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Your documents are encrypted during upload and storage using industry-standard AES-256
              encryption. Documents are only shared with the print shop you select for your order.
              All documents are automatically deleted from our servers within 24 hours after your
              print order is completed or cancelled. We never access, read, or analyze the content
              of your documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">5. Data Sharing</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              We do not sell your personal information. We share data only in the following cases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li><strong>Print Shops:</strong> Your document and order details are shared with the shop you select to fulfill your print order.</li>
              <li><strong>Payment Processors:</strong> Payment information is shared with our secure payment partners to process transactions.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
              <li><strong>Analytics:</strong> We use anonymized, aggregated data for analytics to improve our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">6. Cookies & Tracking</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              We use essential cookies to keep you logged in and maintain your session. We also use
              analytics cookies (such as Vercel Analytics) to understand how users interact with our
              Platform. You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">7. Your Rights</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>Access and download your personal data</li>
              <li>Update or correct your account information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request information about how your data is processed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">8. Data Retention</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              We retain your account data for as long as your account is active. Order history is
              retained for 12 months for your reference. Uploaded documents are deleted within 24
              hours of order completion. If you delete your account, all personal data is removed
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Zaprint is not intended for children under 13. We do not knowingly collect data from
              children. If you believe we have collected information from a child, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">10. Changes to This Policy</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes via email or a prominent notice on the Platform. Your continued use of Zaprint
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">11. Contact Us</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="text-[#0a1128] font-semibold mt-2">
              Email: privacy@zaprint.in
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
