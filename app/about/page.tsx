import type { Metadata } from "next"
import Link from "next/link"
import { Printer, ArrowRight, Users, MapPin, Shield, Zap, Clock, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About Zaprint — India's Smart Printing Platform",
  description:
    "Learn about Zaprint, the platform that connects you with nearby print shops. Upload documents, pay online, and pick up prints hassle-free. Our mission is to make printing effortless.",
  alternates: {
    canonical: "https://zaprint.in/about",
  },
  openGraph: {
    title: "About Zaprint — India's Smart Printing Platform",
    description:
      "Learn about Zaprint, the platform revolutionizing document printing in India.",
    url: "https://zaprint.in/about",
  },
}

import { getSettingByKey } from "@/lib/supabase/settings"

const defaultStats = [
  { label: "Documents Printed", value: "10,000+", icon: Printer },
  { label: "Partner Print Shops", value: "50+", icon: MapPin },
  { label: "Cities Covered", value: "10+", icon: Users },
  { label: "Avg. Print Time", value: "~5 min", icon: Clock },
]

const defaultValues = [
  {
    icon: Zap,
    title: "Speed First",
    description:
      "We believe your time is precious. That's why Zaprint is built around speed — from upload to pickup in minutes, not hours.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Every document is encrypted in transit and at rest. Your files are automatically deleted after printing. We never share your data.",
  },
  {
    icon: Heart,
    title: "User Obsession",
    description:
      "Every feature we build starts with a single question: does this make printing easier for our users? If not, we don't build it.",
  },
  {
    icon: MapPin,
    title: "Local Impact",
    description:
      "We partner with local print shops to bring them more customers and digital tools, helping small businesses thrive in the digital age.",
  },
]

export default async function AboutPage() {
  const aboutData = await getSettingByKey("about", {})
  
  const missionText = aboutData.mission || "We're on a mission to digitize India's printing ecosystem. Every day, millions of students, professionals, and businesses need documents printed — yet the experience has barely changed in decades. Long waits, miscommunication about settings, and wasted trips are still the norm."
  const storyText = aboutData.story || "Zaprint was born out of a simple frustration — waiting in long queues at print shops while deadlines loomed. We built a platform that lets you upload, pay, and pick up prints without ever standing in line."
  
  const stats = aboutData.stats?.length > 0 ? aboutData.stats.map((s: any) => ({
    ...s,
    icon: defaultStats.find(ds => ds.label === s.label)?.icon || Printer
  })) : defaultStats

  const values = aboutData.values?.length > 0 ? aboutData.values.map((v: any) => ({
    ...v,
    icon: defaultValues.find(dv => dv.title === v.title)?.icon || Zap
  })) : defaultValues

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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero */}
        <section className="pt-12 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-transparent border border-black/80 text-black px-4 py-1.5 rounded-full text-[10px] tracking-widest font-semibold uppercase mb-8">
            <span className="w-1.5 h-1.5 bg-black rounded-full" />
            OUR STORY
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0a1128] uppercase leading-none mb-6">
            MAKING PRINTING
            <br />
            <span className="text-[#0a1128]/40">EFFORTLESS</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            {storyText}
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat: any) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm text-center"
            >
              <stat.icon className="w-6 h-6 text-[#0a1128] mx-auto mb-3" strokeWidth={2.5} />
              <div className="text-3xl font-black text-[#0a1128] mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-[#5b637a]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="mb-20">
          <div className="bg-white p-10 md:p-14 rounded-[2rem] border border-black/5 shadow-sm">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a1128] tracking-tight uppercase mb-6">
              OUR <span className="text-[#0a1128]/40">MISSION</span>
            </h2>
            <div className="space-y-4">
              {missionText.split('\n\n').map((para: string, i: number) => (
                <p key={i} className="text-lg text-[#5b637a] font-medium leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1128] tracking-tight uppercase text-center mb-12">
            WHAT WE <span className="text-[#0a1128]/40">STAND FOR</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value: any) => (
              <div
                key={value.title}
                className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#0a1128]/10 rounded-2xl flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-[#0a1128]" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0a1128] mb-3">{value.title}</h3>
                <p className="text-[#5b637a] font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1128] tracking-tight uppercase mb-6">
            READY TO <span className="text-[#0a1128]/40">PRINT?</span>
          </h2>
          <p className="text-lg text-[#5b637a] font-medium mb-8 max-w-xl mx-auto">
            Join thousands of users who have already made the switch to smarter printing.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#0a1128] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  )
}
