"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Lock, Bell, Moon, Save, Loader2, CheckCircle } from "lucide-react"
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
  const [darkMode, setDarkMode] = useState(true)

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
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and notifications.</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-foreground text-lg font-semibold">Profile Details</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Full Name</Label>
            <Input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="h-11 bg-white/5 border-white/10 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Email</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="h-11 bg-white/5 border-white/10 text-foreground"
            />
          </div>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-foreground text-lg font-semibold">Change Password</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Current Password</Label>
            <Input
              type="password"
              placeholder="Enter current password"
              className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-foreground text-lg font-semibold">Notification Preferences</h2>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Email Notifications</p>
              <p className="text-muted-foreground text-sm">Receive order updates via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Print Ready Alerts</p>
              <p className="text-muted-foreground text-sm">Get notified when your print is ready</p>
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
              <p className="text-foreground font-medium">Marketing Emails</p>
              <p className="text-muted-foreground text-sm">Receive offers and product updates</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </motion.div>

      {/* Theme Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        <div className="flex items-center gap-2 mb-6">
          <Moon className="w-5 h-5 text-primary" />
          <h2 className="text-foreground text-lg font-semibold">Theme Preference</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground font-medium">Dark Mode</p>
            <p className="text-muted-foreground text-sm">Use dark theme (enabled by default)</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-primary" />
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 shadow-lg shadow-primary/25"
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
