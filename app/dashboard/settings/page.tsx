"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Lock, Bell, Save, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    printReady: true,
    marketing: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[#0a1128] text-2xl md:text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-[#5b637a]">Manage your account preferences and notifications.</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-sm shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#0a1128]" />
          <h2 className="text-[#0a1128] text-lg font-semibold">Profile Details</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[#0a1128] text-sm font-medium">Full Name</Label>
            <Input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="h-11 bg-white/80 border-black/10 text-[#0a1128]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#0a1128] text-sm font-medium">Email</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="h-11 bg-white/80 border-black/10 text-[#0a1128]"
            />
          </div>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-sm shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#0a1128]" />
          <h2 className="text-[#0a1128] text-lg font-semibold">Change Password</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[#0a1128] text-sm font-medium">Current Password</Label>
            <Input
              type="password"
              placeholder="Enter current password"
              className="h-11 bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#0a1128] text-sm font-medium">New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="h-11 bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#0a1128] text-sm font-medium">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="h-11 bg-white/80 border-black/10 text-[#0a1128] placeholder:text-[#5b637a]"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-sm shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-[#0a1128]" />
          <h2 className="text-[#0a1128] text-lg font-semibold">Notification Preferences</h2>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0a1128] font-medium">Email Notifications</p>
              <p className="text-[#5b637a] text-sm">Receive order updates via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="h-px bg-black/5" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0a1128] font-medium">Print Ready Alerts</p>
              <p className="text-[#5b637a] text-sm">Get notified when your print is ready</p>
            </div>
            <Switch
              checked={notifications.printReady}
              onCheckedChange={(checked) => setNotifications({ ...notifications, printReady: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0a1128] font-medium">Marketing Emails</p>
              <p className="text-[#5b637a] text-sm">Receive offers and product updates</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </motion.div>



      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex items-center justify-end gap-4"
      >
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-green-500"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Settings saved!</span>
          </motion.div>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0a1128] text-white hover:bg-black rounded-xl px-6 shadow-lg shadow-[#0a1128]/15"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
