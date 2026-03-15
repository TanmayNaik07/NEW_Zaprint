"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Shield, Save, Plus, Trash2, Mail, Info, FileText, LayoutDashboard, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const DEFAULTS = {
  about: {
    story: "Zaprint was born out of a simple frustration — waiting in long queues at print shops while deadlines loomed. We built a platform that lets you upload, pay, and pick up prints without ever standing in line.",
    mission: "We're on a mission to digitize India's printing ecosystem. Every day, millions of students, professionals, and businesses need documents printed — yet the experience has barely changed in decades. Long waits, miscommunication about settings, and wasted trips are still the norm.\n\nZaprint changes that. We connect users with nearby print shops through a simple digital workflow: upload your document, choose your print settings, pay online, and get a real-time notification when your prints are ready for pickup.",
    stats: [
      { label: "Documents Printed", value: "10,000+" },
      { label: "Partner Print Shops", value: "50+" },
      { label: "Cities Covered", value: "10+" },
      { label: "Avg. Print Time", value: "~5 min" },
    ],
    values: [
      { title: "Speed First", description: "We believe your time is precious. That's why Zaprint is built around speed — from upload to pickup in minutes, not hours." },
      { title: "Trust & Security", description: "Every document is encrypted in transit and at rest. Your files are automatically deleted after printing. We never share your data." },
    ]
  },
  contact: {
    support_email: "support@zaprint.in",
    partner_email: "partners@zaprint.in",
    feedback_email: "feedback@zaprint.in",
    additional_emails: ["zaprint.official@gmail.com"],
    faqs: [
      { question: "How long do you take to respond?", answer: "We typically respond to emails within 24 hours on business days." },
      { question: "I have an issue with my print order", answer: "Please email us at support@zaprint.in with your order number and a description of the issue. We'll resolve it as quickly as possible." }
    ]
  },
  terms: [
    { title: "1. Acceptance of Terms", content: "By accessing or using Zaprint (\"the Platform\"), operated by Zaprint (\"we,\" \"our,\" or \"us\"), you agree to be bound by these Terms of Service." },
    { title: "2. Description of Service", content: "Zaprint is an online platform that enables users to upload documents, select print specifications, pay online, and pick up printed documents from partner print shops." }
  ],
  privacy: [
    { title: "1. Introduction", content: "Zaprint (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy." },
    { title: "2. Information We Collect", content: "We collect information to provide and improve our printing services." }
  ]
}

export default function ContentManagerPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>(DEFAULTS)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.settings) {
        // Merge with defaults but prefer DB data
        setSettings({
          about: { ...DEFAULTS.about, ...(data.settings.about || {}) },
          contact: { ...DEFAULTS.contact, ...(data.settings.contact || {}) },
          terms: data.settings.terms?.length ? data.settings.terms : DEFAULTS.terms,
          privacy: data.settings.privacy?.length ? data.settings.privacy : DEFAULTS.privacy,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (key: string, value: any) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      })
      if (response.ok) {
        toast.success(`${key.replace("_", " ")} updated successfully`)
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving setting:", error)
      toast.error(`Failed to update ${key}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a1128]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
          <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full animate-pulse" />
          Content Management
        </div>
        <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
          SITE <span className="text-[#0a1128]/40">CONTENT</span>
        </h1>
        <p className="text-[#5b637a] font-medium text-lg max-w-2xl">
          Manage dynamic content for your public pages. Changes reflect instantly without redeploying.
        </p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-black/5 p-1 h-auto mb-8 rounded-2xl shadow-sm">
          <TabsTrigger value="about" className="data-[state=active]:bg-[#0a1128] data-[state=active]:text-white gap-2 py-3 px-6 rounded-xl transition-all font-bold text-sm tracking-tight uppercase">
            <Info className="w-4 h-4" /> About Us
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-[#0a1128] data-[state=active]:text-white gap-2 py-3 px-6 rounded-xl transition-all font-bold text-sm tracking-tight uppercase">
            <Mail className="w-4 h-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="terms" className="data-[state=active]:bg-[#0a1128] data-[state=active]:text-white gap-2 py-3 px-6 rounded-xl transition-all font-bold text-sm tracking-tight uppercase">
            <FileText className="w-4 h-4" /> Terms
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-[#0a1128] data-[state=active]:text-white gap-2 py-3 px-6 rounded-xl transition-all font-bold text-sm tracking-tight uppercase">
            <Shield className="w-4 h-4" /> Privacy
          </TabsTrigger>
        </TabsList>

        {/* About Section */}
        <TabsContent value="about" className="mt-0">
          <Card className="border-black/5 shadow-xl bg-white/80 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-[#0a1128]/5 border-b border-black/5 p-8">
              <CardTitle className="text-2xl font-black text-[#0a1128] uppercase tracking-tight">About Page Content</CardTitle>
              <CardDescription className="text-[#5b637a] font-medium">Update your story, mission, and company values.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-black text-[#0a1128]/60">Our Story</label>
                <Textarea 
                  value={settings.about?.story} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, about: {...settings.about, story: e.target.value}})}
                  className="min-h-[120px] rounded-2xl border-black/10 focus:border-[#0a1128] bg-white text-[#0a1128] font-medium leading-relaxed"
                  placeholder="Tell your story..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-black text-[#0a1128]/60">Our Mission</label>
                <Textarea 
                  value={settings.about?.mission} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, about: {...settings.about, mission: e.target.value}})}
                  className="min-h-[150px] rounded-2xl border-black/10 focus:border-[#0a1128] bg-white text-[#0a1128] font-medium leading-relaxed"
                  placeholder="What is your mission?"
                />
              </div>
              
              {/* Values Management */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest font-black text-[#0a1128]/60">Core Values</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.about?.values?.map((v: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl border border-black/5 bg-white/50 space-y-2 relative group">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newValues = settings.about.values.filter((_: any, idx: number) => idx !== i);
                          setSettings({...settings, about: {...settings.about, values: newValues}});
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <Input 
                        value={v.title} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newValues = [...settings.about.values];
                          newValues[i].title = e.target.value;
                          setSettings({...settings, about: {...settings.about, values: newValues}});
                        }}
                        className="font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-[#0a1128]"
                        placeholder="Value Title"
                      />
                      <Textarea 
                        value={v.description} 
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newValues = [...settings.about.values];
                          newValues[i].description = e.target.value;
                          setSettings({...settings, about: {...settings.about, values: newValues}});
                        }}
                        className="text-sm border-none bg-transparent p-0 min-h-[60px] focus-visible:ring-0 text-[#5b637a]"
                        placeholder="Description..."
                      />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newValues = [...(settings.about.values || []), { title: "", description: "" }];
                    setSettings({...settings, about: {...settings.about, values: newValues}});
                  }}
                  className="w-full border-dashed rounded-2xl hover:bg-[#0a1128]/5"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Value
                </Button>
              </div>

              <Button 
                onClick={() => saveSetting("about", settings.about)} 
                disabled={saving}
                className="w-full bg-[#0a1128] hover:bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-tight"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                Save Changes to About Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-black/5 shadow-xl bg-white/80 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-[#0a1128]/5 border-b border-black/5 p-8">
                <CardTitle className="text-2xl font-black text-[#0a1128] uppercase tracking-tight">Email Addresses</CardTitle>
                <CardDescription className="text-[#5b637a] font-medium text-sm">Manage emails shown on the contact page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#0a1128]/60 px-1">Support Email</label>
                  <Input 
                    value={settings.contact?.support_email} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact: {...settings.contact, support_email: e.target.value}})}
                    className="rounded-xl border-black/10 h-12 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#0a1128]/60 px-1">Partner Email</label>
                  <Input 
                    value={settings.contact?.partner_email} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact: {...settings.contact, partner_email: e.target.value}})}
                    className="rounded-xl border-black/10 h-12 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#0a1128]/60 px-1">Secondary Contact Emails</label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {settings.contact?.additional_emails?.map((email: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={email} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newEmails = [...settings.contact.additional_emails];
                            newEmails[index] = e.target.value;
                            setSettings({...settings, contact: {...settings.contact, additional_emails: newEmails}});
                          }}
                          className="rounded-xl border-black/10 bg-white/50"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            const newEmails = settings.contact.additional_emails.filter((_: any, i: number) => i !== index);
                            setSettings({...settings, contact: {...settings.contact, additional_emails: newEmails}});
                          }}
                          className="rounded-xl hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newEmails = [...(settings.contact.additional_emails || []), ""];
                      setSettings({...settings, contact: {...settings.contact, additional_emails: newEmails}});
                    }}
                    className="w-full rounded-xl border-dashed h-12 font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Email
                  </Button>
                </div>
                <Button 
                  onClick={() => saveSetting("contact", settings.contact)} 
                  disabled={saving}
                  className="w-full bg-[#0a1128] hover:bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-tight mt-4"
                >
                  <Save className="w-5 h-5 mr-2" /> Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-black/5 shadow-xl bg-white/80 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-[#0a1128]/5 border-b border-black/5 p-8">
                <CardTitle className="text-2xl font-black text-[#0a1128] uppercase tracking-tight">Quick Answers</CardTitle>
                <CardDescription className="text-[#5b637a] font-medium text-sm">Common questions shown on the contact page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-8">
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {settings.contact?.faqs?.map((faq: any, index: number) => (
                    <div key={index} className="p-5 bg-[#0a1128]/5 rounded-[1.5rem] relative group border border-transparent hover:border-[#0a1128]/10 transition-all">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-xl"
                        onClick={() => {
                          const newFaqs = settings.contact.faqs.filter((_: any, i: number) => i !== index);
                          setSettings({...settings, contact: {...settings.contact, faqs: newFaqs}});
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Question Title" 
                          value={faq.question} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newFaqs = [...settings.contact.faqs];
                            newFaqs[index].question = e.target.value;
                            setSettings({...settings, contact: {...settings.contact, faqs: newFaqs}});
                          }}
                          className="font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-[#0a1128] text-lg uppercase tracking-tight placeholder:text-[#0a1128]/30 pr-8"
                        />
                        <Textarea 
                          placeholder="Detailed Answer..." 
                          value={faq.answer} 
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const newFaqs = [...settings.contact.faqs];
                            newFaqs[index].answer = e.target.value;
                            setSettings({...settings, contact: {...settings.contact, faqs: newFaqs}});
                          }}
                          className="bg-transparent border-none p-0 min-h-[80px] focus-visible:ring-0 text-[#5b637a] font-medium text-sm leading-relaxed custom-scrollbar"
                        />
                      </div>
                    </div>
                  ))}
                  {settings.contact?.faqs?.length === 0 && (
                    <div className="text-center py-12 bg-black/5 rounded-[1.5rem] border border-dashed border-black/10">
                      <p className="text-sm font-bold text-[#5b637a]">No FAQs added yet.</p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newFaqs = [...(settings.contact.faqs || []), { question: "", answer: "" }];
                    setSettings({...settings, contact: {...settings.contact, faqs: newFaqs}});
                  }}
                  className="w-full rounded-2xl h-14 border-dashed border-2 hover:bg-[#0a1128]/5"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add FAQ Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Legal Sections (Terms & Privacy) */}
        {["terms", "privacy"].map((key) => (
          <TabsContent key={key} value={key} className="mt-0">
            <Card className="border-black/5 shadow-2xl bg-white/80 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-[#0a1128]/5 border-b border-black/5 p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-[#0a1128] uppercase tracking-tight">{key} Points</CardTitle>
                  <CardDescription className="text-[#5b637a] font-medium">Manage each section of your legal {key}.</CardDescription>
                </div>
                <Button 
                  onClick={() => saveSetting(key, settings[key])} 
                  disabled={saving}
                  className="bg-[#0a1128] hover:bg-black text-white px-8 h-12 rounded-xl font-bold uppercase tracking-tight shadow-lg shadow-[#0a1128]/20"
                >
                  <Save className="w-4 h-4 mr-2" /> Save {key}
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {settings[key]?.map((section: any, index: number) => (
                    <div key={index} className="p-8 border border-black/5 rounded-[2rem] relative group bg-white shadow-sm hover:shadow-md transition-all">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-500 rounded-xl"
                        onClick={() => {
                          const newSections = settings[key].filter((_: any, i: number) => i !== index);
                          setSettings({...settings, [key]: newSections});
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0a1128]/40">Section Heading</label>
                          <Input 
                            value={section.title} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newSections = [...settings[key]];
                              newSections[index].title = e.target.value;
                              setSettings({...settings, [key]: newSections});
                            }}
                            className="font-black text-lg border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-[#0a1128] placeholder:text-[#0a1128]/20"
                            placeholder="e.g. 1. Acceptance of Terms"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0a1128]/40">Section Content</label>
                          <Textarea 
                            value={section.content} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                              const newSections = [...settings[key]];
                              newSections[index].content = e.target.value;
                              setSettings({...settings, [key]: newSections});
                            }}
                            className="min-h-[120px] bg-transparent border-none p-0 focus-visible:ring-0 text-[#5b637a] font-medium leading-relaxed custom-scrollbar opacity-80"
                            placeholder="Write the policy text here..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {settings[key]?.length === 0 && (
                    <div className="text-center py-20 bg-black/5 rounded-[2rem] border-2 border-dashed border-black/10">
                      <p className="text-[#5b637a] font-bold">No sections added yet.</p>
                      <p className="text-xs text-[#5b637a]/60 mt-1">Add a section to get started.</p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newSections = [...(settings[key] || []), { title: "", content: "" }];
                    setSettings({...settings, [key]: newSections});
                  }}
                  className="w-full border-dashed border-2 rounded-2xl h-16 hover:bg-[#0a1128]/5 transition-all group"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Add New Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
