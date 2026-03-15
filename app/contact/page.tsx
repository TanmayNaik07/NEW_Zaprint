import type { Metadata } from "next"
import Link from "next/link"
import { Printer, Mail, MessageSquare, MapPin, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact ZaPrint — Get Help With Printing",
  description:
    "Get in touch with the ZaPrint team. Whether you have questions about our printing service, need support with an order, or want to partner with us, we're here to help.",
  alternates: {
    canonical: "https://zaprint.in/contact",
  },
  openGraph: {
    title: "Contact ZaPrint — Get Help With Printing",
    description:
      "Have questions about ZaPrint? Contact our team for support, partnership inquiries, or feedback.",
    url: "https://zaprint.in/contact",
  },
}

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general inquiries and support",
    detail: "support@zaprint.in",
    action: "mailto:support@zaprint.in",
    actionLabel: "Send Email",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    detail: "Available Mon–Sat, 9 AM – 9 PM IST",
    action: null,
    actionLabel: "Coming Soon",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    detail: "India",
    action: null,
    actionLabel: null,
  },
]

const faqs = [
  {
    question: "How long do you take to respond?",
    answer: "We typically respond to emails within 24 hours on business days.",
  },
  {
    question: "I have an issue with my print order",
    answer:
      "Please email us at support@zaprint.in with your order number and a description of the issue. We'll resolve it as quickly as possible.",
  },
  {
    question: "I want to partner my print shop with ZaPrint",
    answer:
      'We\'d love to have you! Email us at partners@zaprint.in with your shop name, location, and services offered. Our team will get back to you within 48 hours.',
  },
  {
    question: "Can I request a feature?",
    answer:
      "Absolutely! We love hearing from users. Send feature requests to feedback@zaprint.in and we'll review them with our product team.",
  },
]

export default function ContactPage() {
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
          <span className="text-base font-bold text-[#0a1128]">ZaPrint</span>
        </Link>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero */}
        <section className="pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-transparent border border-black/80 text-black px-4 py-1.5 rounded-full text-[10px] tracking-widest font-semibold uppercase mb-8">
            <span className="w-1.5 h-1.5 bg-black rounded-full" />
            GET IN TOUCH
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0a1128] uppercase leading-none mb-6">
            CONTACT
            <br />
            <span className="text-[#0a1128]/40">ZAPRINT</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or want to partner with us? We&apos;d love to hear from you.
            Our team is here to help.
          </p>
        </section>

        {/* Contact Methods */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactMethods.map((method) => (
            <div
              key={method.title}
              className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-[#0a1128]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <method.icon className="w-7 h-7 text-[#0a1128]" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-[#0a1128] mb-2">{method.title}</h2>
              <p className="text-sm text-[#5b637a] font-medium mb-3">{method.description}</p>
              <p className="text-[#0a1128] font-semibold text-sm mb-4">{method.detail}</p>
              {method.action ? (
                <a
                  href={method.action}
                  className="inline-flex items-center gap-2 bg-[#0a1128] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
                >
                  {method.actionLabel}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : method.actionLabel ? (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-[#5b637a] px-6 py-2.5 rounded-full text-sm font-semibold">
                  {method.actionLabel}
                </span>
              ) : null}
            </div>
          ))}
        </section>

        {/* Quick Support FAQ */}
        <section className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1128] tracking-tight uppercase text-center mb-12">
            QUICK <span className="text-[#0a1128]/40">ANSWERS</span>
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm"
              >
                <h3 className="text-lg font-bold text-[#0a1128] mb-2">{faq.question}</h3>
                <p className="text-[#5b637a] font-medium leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="bg-white p-10 md:p-14 rounded-[2rem] border border-black/5 shadow-sm text-center">
          <h2 className="text-3xl font-black text-[#0a1128] tracking-tight uppercase mb-4">
            OWN A <span className="text-[#0a1128]/40">PRINT SHOP?</span>
          </h2>
          <p className="text-lg text-[#5b637a] font-medium mb-8 max-w-xl mx-auto">
            Partner with ZaPrint to receive digital orders, grow your customer base, and modernize your shop with our free desktop application.
          </p>
          <a
            href="mailto:partners@zaprint.in"
            className="inline-flex items-center gap-2 bg-[#0a1128] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
          >
            Become a Partner
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* Response time note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#5b637a] font-medium">
          <Clock className="w-4 h-4" />
          <span>Typical response time: within 24 hours</span>
        </div>
      </main>
    </div>
  )
}
