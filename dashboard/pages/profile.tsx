import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

interface ProfileFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const initialProfile: ProfileFormState = {
  firstName: 'Ahmed',
  lastName: 'Al-Rashid',
  email: 'ahmed.alrashid@hospital.sa',
  phone: '+966 50 123 4567'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const updateField = (field: keyof ProfileFormState, value: string) => {
    setProfile((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // simulate update by briefly toggling sheet
    setIsSheetOpen(false)
  }

  return (
    <StaticPageLayout
      title="Profile - NPHIES-AI Healthcare Platform"
      description="Manage your NPHIES-AI profile and preferences."
      navItems={withActiveNav('/profile')}
      showProfileLinks={false}
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="glass-effect rounded-xl p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl">
                👤
              </div>
              <h2 className="text-xl font-semibold">Dr. Ahmed Al-Rashid</h2>
              <p className="text-gray-400">Healthcare Provider</p>
              <div className="mt-4">
                <button
                  className="touch-target rounded-md bg-indigo-600 px-3 py-2"
                  type="button"
                  onClick={() => setIsSheetOpen(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Provider ID</dt>
                <dd>HP001234</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">License</dt>
                <dd>ML-2024-001</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Specialty</dt>
                <dd>Internal Medicine</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Status</dt>
                <dd className="text-green-400">Active</dd>
              </div>
            </dl>
          </section>

          <div className="space-y-6 lg:col-span-2">
            <section className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">First Name</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.firstName}
                      onChange={(event) => updateField('firstName', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Last Name</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.lastName}
                      onChange={(event) => updateField('lastName', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Phone</label>
                  <input
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="tel"
                    value={profile.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                  />
                </div>
                <button className="touch-target rounded-lg bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700" type="button">
                  Update Profile
                </button>
              </form>
            </section>

            <section className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { value: '156', label: 'Claims Submitted', tone: 'text-blue-400' },
                  { value: '89', label: 'Pre-Auths', tone: 'text-green-400' },
                  { value: '234', label: 'Eligibility Checks', tone: 'text-purple-400' },
                  { value: '45', label: 'AI Consultations', tone: 'text-yellow-400' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={`text-2xl font-bold ${item.tone}`}>{item.value}</div>
                    <div className="text-sm text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/settings">
            Settings
          </Link>
          <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700" href="/notifications">
            Notifications
          </Link>
        </div>
      </main>

      {isSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsSheetOpen(false)
            }
          }}
        >
          <div className="w-full max-w-lg rounded-t-3xl bg-slate-900 text-white shadow-2xl">
            <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-white/20" />
            <form className="p-6" onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <div className="mt-4 space-y-4">
                <label className="block text-sm">
                  Name
                  <input
                    className="mt-2 w-full rounded border border-white/10 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={`${profile.firstName} ${profile.lastName}`}
                    onChange={(event) => {
                      const [first, ...rest] = event.target.value.split(' ')
                      updateField('firstName', first)
                      updateField('lastName', rest.join(' '))
                    }}
                  />
                </label>
                <label className="block text-sm">
                  Email
                  <input
                    className="mt-2 w-full rounded border border-white/10 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  Phone
                  <input
                    className="mt-2 w-full rounded border border-white/10 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="tel"
                    value={profile.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="touch-target rounded-md bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Cancel
                </button>
                <button className="touch-target rounded-md bg-blue-600 px-4 py-2 text-sm transition hover:bg-blue-700" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaticPageLayout>
  )
}
