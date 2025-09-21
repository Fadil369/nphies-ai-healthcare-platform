import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

interface PreAuthFormState {
  patientId: string
  providerId: string
  procedureCode: string
  estimatedCost: string
  serviceDate: string
  priority: string
  justification: string
}

const initialState: PreAuthFormState = {
  patientId: '',
  providerId: '',
  procedureCode: '',
  estimatedCost: '',
  serviceDate: '',
  priority: 'routine',
  justification: ''
}

export default function PreAuthorizationPage() {
  const [formState, setFormState] = useState(initialState)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleChange = (field: keyof PreAuthFormState, value: string) => {
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage('Pre-authorization request submitted. You will receive an update within 24 hours.')
    setFormState(initialState)
  }

  return (
    <StaticPageLayout
      title="Pre-Authorization - NPHIES-AI Healthcare Platform"
      description="Request pre-authorization for medical procedures through the NPHIES-AI dashboard."
      navItems={withActiveNav('/pre-authorization')}
      showProfileLinks={false}
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pre-Authorization Request</h1>
          <p className="text-gray-300">Request approval for medical procedures and treatments</p>
        </header>

        <section className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Authorization Details</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Patient ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient ID"
                  value={formState.patientId}
                  onChange={(event) => handleChange('patientId', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Provider ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter provider ID"
                  value={formState.providerId}
                  onChange={(event) => handleChange('providerId', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Procedure Code</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter procedure code"
                  value={formState.procedureCode}
                  onChange={(event) => handleChange('procedureCode', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Estimated Cost</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  placeholder="Enter estimated cost"
                  type="number"
                  value={formState.estimatedCost}
                  onChange={(event) => handleChange('estimatedCost', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Service Date</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={formState.serviceDate}
                  onChange={(event) => handleChange('serviceDate', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Priority</label>
                <select
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formState.priority}
                  onChange={(event) => handleChange('priority', event.target.value)}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Clinical Justification</label>
              <textarea
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter clinical justification for the procedure"
                rows={4}
                value={formState.justification}
                onChange={(event) => handleChange('justification', event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="touch-target rounded-lg bg-purple-600 px-6 py-2 transition-colors hover:bg-purple-700" type="submit">
                Submit Request
              </button>
              <button
                className="touch-target rounded-lg bg-gray-600 px-6 py-2 transition-colors hover:bg-gray-700"
                type="button"
                onClick={() => {
                  setStatusMessage('Draft saved. Complete required information before submitting.')
                  setFormState(initialState)
                }}
              >
                Save Draft
              </button>
            </div>
          </form>

          {statusMessage && (
            <div className="mt-6 rounded-lg bg-purple-600/10 p-4 text-sm text-purple-200">
              {statusMessage}
            </div>
          )}
        </section>

        <section className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Recent Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 text-left">
                  <th className="py-3">Request ID</th>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Procedure</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3">#PA001</td>
                  <td className="py-3">John Doe</td>
                  <td className="py-3">MRI Scan</td>
                  <td className="py-3"><span className="rounded bg-green-600 px-2 py-1 text-xs">Approved</span></td>
                  <td className="py-3">2024-01-15</td>
                </tr>
                <tr>
                  <td className="py-3">#PA002</td>
                  <td className="py-3">Jane Smith</td>
                  <td className="py-3">Surgery</td>
                  <td className="py-3"><span className="rounded bg-yellow-600 px-2 py-1 text-xs">Pending</span></td>
                  <td className="py-3">2024-01-14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-green-600 px-4 py-2 transition-colors hover:bg-green-700" href="/eligibility">
            Check Eligibility
          </Link>
          <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/claims">
            Submit Claim
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
