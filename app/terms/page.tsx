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

export default function TermsPage() {
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
          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">1. Acceptance of Terms</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              By accessing or using Zaprint (&quot;the Platform&quot;), operated by Zaprint
              (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, you may not use the Platform. We
              reserve the right to modify these terms at any time, and your continued use constitutes
              acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">2. Description of Service</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Zaprint is an online platform that enables users to upload documents, select print
              specifications, pay online, and pick up printed documents from partner print shops.
              We act as an intermediary between users and independent print shop operators. Zaprint
              does not directly own or operate print shops.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>You must be at least 13 years old to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">4. Document Upload & Content</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              By uploading documents to Zaprint, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>You own or have the right to print the content you upload.</li>
              <li>Your content does not infringe on any third-party intellectual property rights.</li>
              <li>Your content does not contain illegal, harmful, or objectionable material.</li>
              <li>You grant us a limited license to process and transmit your documents solely for the purpose of fulfilling your print order.</li>
            </ul>
            <p className="text-[#5b637a] font-medium leading-relaxed mt-3">
              We reserve the right to refuse printing of any content that violates these terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">5. Pricing & Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>All prices displayed on the Platform are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>Prices may vary between print shops and are determined by the shop owners.</li>
              <li>Payment must be completed before a print order is processed.</li>
              <li>We use secure third-party payment processors and do not store your full payment details.</li>
              <li>Platform fees, if any, will be clearly displayed before you confirm your order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">6. Order Cancellation & Refunds</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              Our cancellation and refund policies are as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>You may cancel an order within 2 minutes of placing it for a full refund.</li>
              <li>Once printing has begun, cancellations may not be possible.</li>
              <li>If a print is defective or does not match your specifications, you may request a reprint or refund by contacting support within 24 hours of pickup.</li>
              <li>Refunds are processed within 5–7 business days to the original payment method.</li>
              <li>Zaprint reserves the right to refuse refunds for orders where the user provided incorrect specifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">7. Pickup & Collection</h2>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>You will receive a notification when your prints are ready for pickup.</li>
              <li>You may be required to present a verification code (OTP) at the shop to collect your prints.</li>
              <li>Prints will be held at the shop for 24 hours after the ready notification. After this period, uncollected prints may be disposed of.</li>
              <li>Zaprint is not responsible for prints that are not collected within the specified timeframe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">8. Print Shop Partners</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Print shops on Zaprint are independent operators. While we vet our partners for quality,
              Zaprint does not guarantee the performance of any individual print shop. Print quality,
              turnaround time, and availability may vary. We encourage users to rate their experiences
              to help us maintain high standards across our network.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">9. Intellectual Property</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              The Zaprint name, logo, website design, and all related content are the property of
              Zaprint and are protected by intellectual property laws. You may not use our branding,
              copy our website design, or reproduce our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">10. Limitation of Liability</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              Zaprint provides the Platform on an &quot;as-is&quot; basis. To the maximum extent
              permitted by law, we disclaim all warranties, express or implied. We are not liable for
              any indirect, incidental, or consequential damages arising from your use of the
              Platform. Our total liability for any claim shall not exceed the amount you paid for the
              specific order giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">11. Prohibited Activities</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#5b637a] font-medium leading-relaxed">
              <li>Use the Platform for any illegal purpose</li>
              <li>Upload copyrighted material you do not have rights to</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the Platform&apos;s operation or other users&apos; experience</li>
              <li>Use automated tools to scrape or access the Platform without permission</li>
              <li>Upload malicious files or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">12. Governing Law</h2>
            <p className="text-[#5b637a] font-medium leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India. Any
              disputes arising from these terms or your use of the Platform shall be subject to the
              exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a1128] mb-3">13. Contact</h2>
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
