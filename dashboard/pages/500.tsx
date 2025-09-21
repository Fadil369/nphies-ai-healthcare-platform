import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'

const statusChecks = [
  { label: 'API Gateway', value: 'Checking…', tone: 'bg-blue-500/20 text-blue-300' },
  { label: 'FastAPI Service', value: 'Operational', tone: 'bg-emerald-500/20 text-emerald-300' },
  { label: 'NPHIES Sync', value: 'Delayed', tone: 'bg-red-500/20 text-red-300' }
]

const diagnosticDetails = [
  'Stack: brainsait-nphies-fargate-prod',
  'Trace Id: f6ad72b1-3c1d-4aef-9b15-2781f4d5e901',
  'Region: us-east-1',
  'Timestamp: 2024-01-19T21:14:08Z'
]

export default function ServerErrorPage() {
  return (
    <StaticPageLayout
      title="500 - Server Error - NPHIES-AI Healthcare Platform"
      description="An unexpected error occurred while processing your request."
      navItems={[]}
      showProfileLinks={false}
    >
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <section className="max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <div className="text-7xl font-black text-transparent bg-gradient-to-br from-red-400 to-red-600 bg-clip-text">500</div>
          <h1 className="mt-4 text-3xl font-extrabold text-transparent bg-gradient-to-r from-white to-slate-200 bg-clip-text">
            Something went wrong
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Our platform encountered an unexpected error. Our engineering team has been notified and is investigating the issue.
          </p>

          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-left text-sm font-mono text-white/80">
            <h2 className="text-base font-semibold text-red-200">Diagnostic snapshot</h2>
            <ul className="mt-3 space-y-1">
              {diagnosticDetails.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold text-white">Service status</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {statusChecks.map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <span className="text-white/80">{item.label}</span>
                  <span className={`rounded-md px-3 py-1 font-medium ${item.tone}`}>
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link className="touch-target rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-semibold shadow-lg transition hover:from-blue-600 hover:to-blue-800" href="/dashboard">
              Return to Dashboard
            </Link>
            <Link className="touch-target rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 transition hover:bg-white/10" href="/status">
              View Status Page
            </Link>
            <Link className="touch-target rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 transition hover:bg-white/10" href="mailto:support@brainsait.ai">
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  )
}
