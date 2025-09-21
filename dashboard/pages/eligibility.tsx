import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

export default function EligibilityPage() {
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowResults(true)
  }

  return (
    <StaticPageLayout
      title="Eligibility Check - NPHIES-AI Healthcare Platform"
      description="Verify patient insurance coverage and benefits via the NPHIES-AI dashboard."
      navItems={withActiveNav('/eligibility')}
      showProfileLinks={false}
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Eligibility Verification</h1>
          <p className="text-gray-300">Check patient insurance coverage and benefits</p>
        </header>

        <section className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Patient Information</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Patient ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Insurance Number</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter insurance number"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Date of Birth</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Service Date</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                />
              </div>
            </div>
            <button className="touch-target rounded-lg bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700" type="submit">
              Check Eligibility
            </button>
          </form>
        </section>

        {showResults && (
          <section className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Eligibility Results</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-green-600/30 bg-green-600/20 p-4">
                <h3 className="mb-2 font-semibold text-green-400">Coverage Status</h3>
                <p className="text-2xl font-bold text-green-400">Active</p>
              </div>
              <div className="rounded-lg border border-blue-600/30 bg-blue-600/20 p-4">
                <h3 className="mb-2 font-semibold text-blue-400">Plan Type</h3>
                <p className="text-lg font-medium">Premium Health</p>
              </div>
              <div className="rounded-lg border border-purple-600/30 bg-purple-600/20 p-4">
                <h3 className="mb-2 font-semibold text-purple-400">Copay</h3>
                <p className="text-lg font-medium">SAR 50</p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700" href="/pre-authorization">
            Request Pre-Auth
          </Link>
          <Link className="touch-target rounded-lg bg-green-600 px-4 py-2 transition-colors hover:bg-green-700" href="/claims">
            Submit Claim
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
