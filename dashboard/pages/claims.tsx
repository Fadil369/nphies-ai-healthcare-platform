import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

interface ClaimFormState {
  patientId: string
  providerId: string
  procedureCodes: string
  diagnosisCodes: string
  amount: string
  serviceDate: string
  description: string
}

const navItems = withActiveNav('/claims')

const initialState: ClaimFormState = {
  patientId: '',
  providerId: '',
  procedureCodes: '',
  diagnosisCodes: '',
  amount: '',
  serviceDate: '',
  description: ''
}

export default function ClaimsPage() {
  const [formState, setFormState] = useState(initialState)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const isSubmitDisabled = useMemo(
    () => !formState.patientId || !formState.providerId || !formState.procedureCodes || !formState.amount,
    [formState.patientId, formState.providerId, formState.procedureCodes, formState.amount]
  )

  const updateField = (field: keyof ClaimFormState, value: string) => {
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResultMessage('Claim submitted successfully. Track status under Recent Claims for updates.')
    setFormState(initialState)
  }

  return (
    <StaticPageLayout
      title="Claims Processing - NPHIES-AI Healthcare Platform"
      description="Submit and manage healthcare claims efficiently with the NPHIES-AI dashboard."
      navItems={navItems}
      showProfileLinks
    >
      <main className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Claims Processing</h1>
          <p className="text-gray-300">Submit and manage healthcare claims efficiently</p>
        </header>

        <section className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Submit New Claim</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Patient ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient ID"
                  required
                  value={formState.patientId}
                  onChange={(event) => updateField('patientId', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Provider ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter provider ID"
                  required
                  value={formState.providerId}
                  onChange={(event) => updateField('providerId', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Procedure Codes</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g. CPT1234, CPT5678"
                  required
                  value={formState.procedureCodes}
                  onChange={(event) => updateField('procedureCodes', event.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">Add comma-separated codes.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Diagnosis Codes</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g. Z00.0, I10"
                  value={formState.diagnosisCodes}
                  onChange={(event) => updateField('diagnosisCodes', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Amount (SAR)</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  placeholder="Enter amount"
                  required
                  type="number"
                  value={formState.amount}
                  onChange={(event) => updateField('amount', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Service Date</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={formState.serviceDate}
                  onChange={(event) => updateField('serviceDate', event.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Notes (optional)</label>
              <textarea
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter claim description"
                rows={3}
                value={formState.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                className="touch-target rounded-lg bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800/50"
                disabled={isSubmitDisabled}
                type="submit"
              >
                Submit Claim
              </button>
              <button
                className="touch-target rounded-lg bg-gray-600 px-6 py-2 transition-colors hover:bg-gray-700"
                type="button"
                onClick={() => {
                  setFormState(initialState)
                  setResultMessage('Draft saved locally. Complete required fields before submitting.')
                }}
              >
                Save Draft
              </button>
            </div>
          </form>

          {resultMessage && (
            <div className="mt-6 rounded-lg bg-blue-600/10 p-4 text-sm text-blue-200">
              {resultMessage}
            </div>
          )}
        </section>

        <section className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Recent Claims</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 text-left">
                  <th className="py-3">Claim ID</th>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3">#12345</td>
                  <td className="py-3">John Doe</td>
                  <td className="py-3">$1,250.00</td>
                  <td className="py-3"><span className="rounded bg-green-600 px-2 py-1 text-xs">Approved</span></td>
                  <td className="py-3">2024-01-15</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3">#12344</td>
                  <td className="py-3">Jane Smith</td>
                  <td className="py-3">$850.00</td>
                  <td className="py-3"><span className="rounded bg-yellow-600 px-2 py-1 text-xs">Pending</span></td>
                  <td className="py-3">2024-01-14</td>
                </tr>
                <tr>
                  <td className="py-3">#12343</td>
                  <td className="py-3">Bob Johnson</td>
                  <td className="py-3">$2,100.00</td>
                  <td className="py-3"><span className="rounded bg-red-600 px-2 py-1 text-xs">Rejected</span></td>
                  <td className="py-3">2024-01-13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
              ← Back to Dashboard
            </Link>
            <Link className="touch-target rounded-lg bg-green-600 px-4 py-2 transition-colors hover:bg-green-700" href="/eligibility">
              Check Eligibility
            </Link>
            <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700" href="/pre-authorization">
              Pre-Authorization
            </Link>
            <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/ai-assistant">
              AI Assistant
            </Link>
          </div>
        </section>
      </main>
    </StaticPageLayout>
  )
}
