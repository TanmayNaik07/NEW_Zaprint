import { MindfoldNavbar } from "@/components/mindfold-navbar"
import { MindfoldHero } from "@/components/mindfold-hero"
import { MindfoldScrollAnimation } from "@/components/mindfold-scroll-animation"
import { MindfoldFeatures } from "@/components/mindfold-features"
import { MindfoldHowItWorks } from "@/components/mindfold-how-it-works"
import { MindfoldReviews } from "@/components/mindfold-reviews"
import { MindfoldPricing } from "@/components/mindfold-pricing"
import { MindfoldFooter } from "@/components/mindfold-footer"
import Script from "next/script"

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zaprint",
  url: "https://zaprint.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://zaprint.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "About Us",
      "url": "https://zaprint.in/about"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "Terms of Service",
      "url": "https://zaprint.in/terms"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Sign In / Login",
      "url": "https://zaprint.in/login"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "Sign Up",
      "url": "https://zaprint.in/signup"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Privacy Policy",
      "url": "https://zaprint.in/privacy"
    }
  ]
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zaprint",
  url: "https://zaprint.in",
  logo: "https://zaprint.in/Zaprint_Logo.png",
  description:
    "India's smart document printing platform. Upload, pay, and pick up prints from nearby shops.",
  sameAs: [
    "https://twitter.com/zaprint",
    "https://instagram.com/zaprint",
    "https://linkedin.com/company/zaprint",
  ],
}

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Zaprint",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "Upload documents, choose print settings, pay online & pick up your prints when ready. Fast, affordable printing service.",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Zaprint work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your document, choose print settings (color, paper size, copies), pay online, and pick up your prints when they are ready. No waiting in queues.",
      },
    },
    {
      "@type": "Question",
      name: "What file formats does Zaprint support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zaprint supports PDF, DOCX, and PPT/PPTX files. We recommend PDF for the best formatting accuracy.",
      },
    },
    {
      "@type": "Question",
      name: "How much does printing cost on Zaprint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Black and white printing starts at ₹2 per page, and color printing starts at ₹5 per page. Bulk plans offer additional discounts.",
      },
    },
    {
      "@type": "Question",
      name: "Can I find printing shops near me on Zaprint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Zaprint connects you with partner print shops in your area. Simply enter your location or pincode to find the nearest shops.",
      },
    },
    {
      "@type": "Question",
      name: "Is my document data secure on Zaprint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. All documents are encrypted during upload and transmission. Files are securely deleted after printing is complete.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take for my prints to be ready?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most print jobs are ready within 5-15 minutes depending on the number of pages and current queue. You receive real-time notifications when your prints are ready for pickup.",
      },
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f4] relative overflow-hidden">
      {/* Paper texture background overlay */}
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

      {/* Fixed Navbar */}
      <MindfoldNavbar />

      {/* Hero Section */}
      <MindfoldHero />

      {/* Scroll Animation Section */}
      <MindfoldScrollAnimation />

      {/* Features Section */}
      <MindfoldFeatures />

      {/* How It Works Section */}
      <MindfoldHowItWorks />

      {/* Reviews / Testimonials Section */}
      <MindfoldReviews />

      {/* Pricing Section */}
      <MindfoldPricing />

      {/* Footer */}
      <MindfoldFooter />

      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-site-navigation"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <Script
        id="schema-software-application"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
