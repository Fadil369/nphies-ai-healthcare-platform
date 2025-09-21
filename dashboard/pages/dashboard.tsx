import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface StatCard {
  id: string
  label: string
  value: string
  accent?: string
  description?: string
}

interface QuickAction {
  id: string
  label: string
  href: string
  accent: string
}

interface ActivityItem {
  id: string
  message: string
  indicator: string
  tone: string
}

interface HealthItem {
  id: string
  label: string
  status: string
  tone: string
}

const statCards: StatCard[] = [
  { id: 'claims', label: 'Total Claims', value: '1,234', accent: 'text-blue-400', description: 'Submitted this quarter' },
  { id: 'system-status', label: 'System Status', value: 'Healthy', accent: 'text-green-400', description: 'Realtime API monitoring' },
  { id: 'ai-insights', label: 'AI Insights', value: 'Loading…', accent: 'text-purple-400', description: 'Next analysis pending' },
  { id: 'active-users', label: 'Active Users', value: '456', accent: 'text-yellow-400', description: 'Authenticated staff' }
]

const quickActions: QuickAction[] = [
  { id: 'claims', label: 'Submit New Claim', href: '/claims', accent: 'from-blue-600 to-blue-700' },
  { id: 'eligibility', label: 'Check Eligibility', href: '/eligibility', accent: 'from-green-600 to-green-700' },
  { id: 'pre-auth', label: 'Request Pre-Auth', href: '/pre-authorization', accent: 'from-purple-600 to-purple-700' }
]

const recentActivity: ActivityItem[] = [
  { id: 'activity-1', message: 'Claim #12345 processed', indicator: '✓', tone: 'text-green-400' },
  { id: 'activity-2', message: 'Eligibility check completed', indicator: 'ℹ', tone: 'text-blue-400' },
  { id: 'activity-3', message: 'AI analysis generated', indicator: '🤖', tone: 'text-purple-400' }
]

const systemHealth: HealthItem[] = [
  { id: 'api', label: 'API Status', status: 'Online', tone: 'text-green-400' },
  { id: 'database', label: 'Database', status: 'Connected', tone: 'text-green-400' },
  { id: 'ai', label: 'AI Services', status: 'Active', tone: 'text-green-400' }
]

const navigationLinks = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'nphies', label: 'NPHIES', href: '/nphies' },
  { id: 'claims', label: 'Claims', href: '/claims' },
  { id: 'assistant', label: 'AI Assistant', href: '/ai-assistant' },
  { id: 'health-services', label: 'Health Services', href: '/health-services' }
]

const primaryNavigation = [
  { id: 'nav-home', label: 'Home', href: '/' },
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', active: true },
  { id: 'nav-nphies', label: 'NPHIES', href: '/nphies' },
  { id: 'nav-claims', label: 'Claims', href: '/claims' },
  { id: 'nav-assistant', label: 'AI Assistant', href: '/ai-assistant' }
]

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const padded = [hrs, mins, secs].map((unit) => unit.toString().padStart(2, '0'))
  return `${padded[0]}:${padded[1]}:${padded[2]}`
}

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [uptimeSeconds, setUptimeSeconds] = useState(0)
  const [aiStatus, setAiStatus] = useState('Loading…')

  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds((previous) => previous + 5)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setAiStatus('Operational'), 1500)
    return () => clearTimeout(timeout)
  }, [])

  const uptimeLabel = useMemo(() => formatDuration(uptimeSeconds), [uptimeSeconds])

  const statsWithLiveData = statCards.map((card) => {
    if (card.id === 'system-status') {
      return { ...card, description: `Uptime: ${uptimeLabel}`, value: 'Healthy' }
    }

    if (card.id === 'ai-insights') {
      return { ...card, value: aiStatus }
    }

    return card
  })

  return (
    <>
      <Head>
        <title>Dashboard - NPHIES-AI Healthcare Platform</title>
        <meta
          name="description"
          content="Operational dashboard for the NPHIES-AI healthcare platform with real-time insights and quick actions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`${isDarkMode ? 'dashboard-gradient-dark text-white' : 'dashboard-gradient-light text-slate-900'} min-h-screen font-sans transition-colors`}>
        <nav className="glass-effect border-b border-white/10">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold">🏥 NPHIES-AI</span>
              <div className="hidden gap-6 md:flex">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.id}
                    className={`text-sm transition-colors ${item.active ? 'text-blue-400 font-medium' : 'text-gray-300 hover:text-white'}`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link className="touch-target text-gray-300 transition hover:text-white" href="/profile">
                Profile
              </Link>
              <Link className="touch-target text-gray-300 transition hover:text-white" href="/settings">
                Settings
              </Link>
              <button
                aria-label="Toggle theme"
                className="touch-target text-lg"
                type="button"
                onClick={() => setIsDarkMode((previous) => !previous)}
              >
                {isDarkMode ? '🌓' : '☀️'}
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12">
          <header className="mb-10">
            <h1 className="text-3xl font-bold">Healthcare Dashboard</h1>
            <p className="mt-2 text-gray-300">Monitor your healthcare operations and AI insights</p>
          </header>

          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsWithLiveData.map((card) => (
              <div key={card.id} className="glass-effect rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.accent ?? ''}`}>{card.value}</p>
                    {card.description && <p className="mt-1 text-xs text-gray-400">{card.description}</p>}
                  </div>
                  <span aria-hidden className="text-2xl">
                    {card.id === 'claims' && '📊'}
                    {card.id === 'system-status' && '✅'}
                    {card.id === 'ai-insights' && '🤖'}
                    {card.id === 'active-users' && '👥'}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="glass-effect rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    className={`block rounded-lg bg-gradient-to-r ${action.accent} px-4 py-2 text-sm font-medium transition hover:opacity-90`}
                    href={action.href}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
              <div className="space-y-3 text-sm">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.message}</span>
                    <span className={item.tone}>{item.indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">System Health</h2>
              <div className="space-y-3">
                {systemHealth.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={item.tone}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="glass-effect rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">Navigation Test</h2>
            <p className="mb-4 text-gray-400">Test the enhanced navigation system:</p>
            <div className="flex flex-wrap gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  className="touch-target rounded-lg bg-gray-600 px-4 py-2 text-sm transition hover:bg-gray-700"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
