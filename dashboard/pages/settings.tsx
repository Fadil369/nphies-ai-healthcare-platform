import { useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

export default function SettingsPage() {
  const [autoSyncClaims, setAutoSyncClaims] = useState(true)
  const [realTimeEligibility, setRealTimeEligibility] = useState(true)
  const [responseLanguage, setResponseLanguage] = useState('English')
  const [medicalTerminology, setMedicalTerminology] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  return (
    <StaticPageLayout
      title="Settings - NPHIES-AI Healthcare Platform"
      description="Configure NPHIES integrations, AI preferences, and notification settings."
      navItems={withActiveNav('/settings')}
      showProfileLinks={false}
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-300">Configure your platform preferences and integrations</p>
        </header>

        <div className="space-y-6">
          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">NPHIES Configuration</h2>
            <div className="space-y-4">
              <ToggleRow
                description="Automatically sync claims with NPHIES"
                label="Auto-sync Claims"
                value={autoSyncClaims}
                onChange={setAutoSyncClaims}
              />
              <ToggleRow
                description="Check eligibility in real-time"
                label="Real-time Eligibility"
                value={realTimeEligibility}
                onChange={setRealTimeEligibility}
              />
            </div>
          </section>

          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">AI Assistant Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Response Language</label>
                <select
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responseLanguage}
                  onChange={(event) => setResponseLanguage(event.target.value)}
                >
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Both</option>
                </select>
              </div>
              <ToggleRow
                description="Use medical terminology in responses"
                label="Medical Terminology"
                value={medicalTerminology}
                onChange={setMedicalTerminology}
              />
            </div>
          </section>

          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            <div className="space-y-4">
              <ToggleRow
                description="Receive updates via email"
                label="Email Notifications"
                value={emailNotifications}
                onChange={setEmailNotifications}
              />
              <ToggleRow
                description="Urgent notifications via SMS"
                label="SMS Alerts"
                value={smsAlerts}
                onChange={setSmsAlerts}
              />
            </div>
          </section>

          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            <div className="space-y-4">
              <button className="touch-target w-full rounded-lg bg-blue-600 px-4 py-2 text-left transition-colors hover:bg-blue-700">
                Change Password
              </button>
              <button className="touch-target w-full rounded-lg bg-green-600 px-4 py-2 text-left transition-colors hover:bg-green-700">
                Enable Two-Factor Authentication
              </button>
              <button className="touch-target w-full rounded-lg bg-purple-600 px-4 py-2 text-left transition-colors hover:bg-purple-700">
                Download Activity Log
              </button>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="touch-target rounded-lg bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700" type="button">
              Save Settings
            </button>
            <Link className="touch-target rounded-lg bg-gray-600 px-6 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </StaticPageLayout>
  )
}

interface ToggleRowProps {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          checked={value}
          className="peer sr-only"
          type="checkbox"
          onChange={(event) => onChange(event.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-600 transition peer-checked:bg-blue-600">
          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  )
}
