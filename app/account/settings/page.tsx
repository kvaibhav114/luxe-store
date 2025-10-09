"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Bell, Shield, Globe, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotionalEmails, setPromotionalEmails] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("private")
  const [dataSharing, setDataSharing] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState("essential")

  // Account settings
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("America/New_York")

  if (!user) {
    redirect("/")
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation instructions.",
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
          </div>

          <div className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                  </div>
                  <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotional-emails">Promotional Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive offers and product updates</p>
                  </div>
                  <Switch id="promotional-emails" checked={promotionalEmails} onCheckedChange={setPromotionalEmails} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
                  </div>
                  <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow sharing anonymized data for analytics</p>
                  </div>
                  <Switch id="data-sharing" checked={dataSharing} onCheckedChange={setDataSharing} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookie-preferences">Cookie Preferences</Label>
                  <Select value={cookiePreferences} onValueChange={setCookiePreferences}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essential">Essential Only</SelectItem>
                      <SelectItem value="functional">Essential + Functional</SelectItem>
                      <SelectItem value="all">All Cookies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Localization Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Download Your Data</h4>
                    <p className="text-sm text-muted-foreground">Get a copy of all your account data</p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} size="lg">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
