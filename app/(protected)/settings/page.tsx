'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Lock, User, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // API call would go here
    setTimeout(() => {
      setSaving(false)
      alert('Settings saved successfully!')
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-green-100">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className="h-10"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="h-10"
              disabled
            />
            <p className="text-xs text-slate-500">Email cannot be changed</p>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Company Name</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your Company"
              className="h-10"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="h-10"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-10"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-blue-100">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="font-medium text-slate-900">Change Password</p>
            <p className="text-sm text-slate-600 mt-1">Update your password regularly for better security</p>
            <Button variant="outline" className="mt-4">
              Change Password
            </Button>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="font-medium text-slate-900">Two-Factor Authentication</p>
            <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
            <Button variant="outline" className="mt-4">
              Enable 2FA
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-purple-100">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Bid Notifications', description: 'Get notified when you receive new bids' },
            {
              label: 'Logistics Updates',
              description: 'Receive updates on your shipments',
            },
            {
              label: 'Payment Alerts',
              description: 'Get notified about payment status changes',
            },
            {
              label: 'Marketing Emails',
              description: 'Receive updates about new features and opportunities',
            },
          ].map((notification) => (
            <div key={notification.label} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{notification.label}</p>
                <p className="text-sm text-slate-600">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-600"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
