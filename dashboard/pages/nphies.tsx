import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'
import Link from 'next/link'

export default function NphiesPage() {
  return (
    <StaticPageLayout
      title="NPHIES Integration - NPHIES-AI Healthcare Platform"
      description="Monitor and actionize your connections to the Saudi National Platform for Health Information Exchange."
      navItems={withActiveNav('/nphies')}
      showProfileLinks={false}
    >
      <main className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">NPHIES Integration</h1>
          <p className="text-gray-300">Saudi National Platform for Health Information Exchange</p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="mb-4 text-lg font-semibold">🔗 Connection Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>API Status</span><span className="text-green-400">Connected</span></div>
              <div className="flex justify-between"><span>Last Sync</span><span className="text-gray-300">2 min ago</span></div>
              <div className="flex justify-between"><span>Response Time</span><span className="text-blue-400">120ms</span></div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h3 className="mb-4 text-lg font-semibold">📊 Today&apos;s Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Claims Submitted</span><span className="text-green-400">45</span></div>
              <div className="flex justify-between"><span>Eligibility Checks</span><span className="text-blue-400">128</span></div>
              <div className="flex justify-between"><span>Pre-Auths</span><span className="text-purple-400">12</span></div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h3 className="mb-4 text-lg font-semibold">⚡ Quick Actions</h3>
            <div className="space-y-3 text-sm">
              <Link className="block rounded-lg bg-green-600 px-4 py-2 text-center transition-colors hover:bg-green-700" href="/eligibility">
                Check Eligibility
              </Link>
              <Link className="block rounded-lg bg-purple-600 px-4 py-2 text-center transition-colors hover:bg-purple-700" href="/pre-authorization">
                Request Pre-Auth
              </Link>
              <Link className="block rounded-lg bg-blue-600 px-4 py-2 text-center transition-colors hover:bg-blue-700" href="/claims">
                Submit Claim
              </Link>
            </div>
          </div>
        </section>

        <section className="glass-effect rounded-xl p-6">
          <h2 className="mb-6 text-xl font-semibold">NPHIES Services</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🏥', title: 'Provider Registry', description: 'Manage provider information' },
              { icon: '👤', title: 'Patient Registry', description: 'Patient data management' },
              { icon: '💊', title: 'Medication', description: 'Drug formulary access' },
              { icon: '📋', title: 'Terminology', description: 'Medical coding standards' }
            ].map((service) => (
              <div
                key={service.title}
                className="cursor-pointer rounded-lg bg-white/5 p-4 text-center transition-colors hover:bg-white/10"
              >
                <div className="mb-2 text-3xl" aria-hidden>
                  {service.icon}
                </div>
                <h3 className="font-medium">{service.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </StaticPageLayout>
  )
}
