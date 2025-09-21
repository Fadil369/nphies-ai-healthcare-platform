import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

const analyticsCards = [
  { icon: '🧠', metric: '94%', label: 'Accuracy', title: 'AI Predictions', subtitle: 'Claim approval predictions', tone: 'text-blue-400' },
  { icon: '📊', metric: '1,234', label: 'Processed', title: 'Documents', subtitle: 'AI document analysis', tone: 'text-green-400' },
  { icon: '⚡', metric: '2.3s', label: 'Avg Time', title: 'Response Time', subtitle: 'AI processing speed', tone: 'text-purple-400' },
  { icon: '💡', metric: '89', label: 'Generated', title: 'Insights', subtitle: 'AI-generated insights', tone: 'text-yellow-400' }
]

const performanceMetrics = [
  { label: 'Claim Approval Prediction', value: 94, tone: 'bg-green-400 text-green-400' },
  { label: 'Medical Entity Recognition', value: 91, tone: 'bg-blue-400 text-blue-400' },
  { label: 'Document Classification', value: 88, tone: 'bg-purple-400 text-purple-400' }
]

const activityFeed = [
  { label: 'Processed medical document for Patient #12345', time: '2 minutes ago', tone: 'bg-green-400' },
  { label: 'Generated claim approval prediction', time: '5 minutes ago', tone: 'bg-blue-400' },
  { label: 'Extracted medical entities from report', time: '8 minutes ago', tone: 'bg-purple-400' },
  { label: 'Completed sentiment analysis', time: '12 minutes ago', tone: 'bg-yellow-400' }
]

const controlButtons = [
  { label: '🔍 Analyze Document', color: 'bg-blue-600 hover:bg-blue-700' },
  { label: '🤖 Generate Prediction', color: 'bg-green-600 hover:bg-green-700' },
  { label: '📊 Create Insights', color: 'bg-purple-600 hover:bg-purple-700' },
  { label: '🩺 Medical NLP', color: 'bg-yellow-600 hover:bg-yellow-700' },
  { label: '🔄 Retrain Models', color: 'bg-red-600 hover:bg-red-700' },
  { label: '📈 View Analytics', color: 'bg-gray-600 hover:bg-gray-700' }
]

export default function AIDashboardPage() {
  return (
    <StaticPageLayout
      title="AI Dashboard - NPHIES-AI Healthcare Platform"
      description="Review AI performance metrics, activity, and controls for the NPHIES-AI platform."
      navItems={withActiveNav('/ai-dashboard')}
      showProfileLinks={false}
    >
      <main className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Intelligence Dashboard</h1>
          <p className="text-gray-300">Advanced analytics and insights powered by AWS AI services</p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {analyticsCards.map((card) => (
            <div key={card.title} className="glass-effect rounded-xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-3xl" aria-hidden>
                  {card.icon}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${card.tone}`}>{card.metric}</div>
                  <div className="text-sm text-gray-400">{card.label}</div>
                </div>
              </div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-400">{card.subtitle}</p>
            </div>
          ))}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">AI Model Performance</h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="mb-2 flex justify-between">
                    <span>{metric.label}</span>
                    <span className={metric.tone.split(' ')[1]}>{metric.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-700">
                    <div className={`h-2 rounded-full ${metric.tone.split(' ')[0]}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Recent AI Activities</h2>
            <div className="space-y-4">
              {activityFeed.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.tone}`} />
                  <div className="flex-1 text-sm">
                    <p>{item.label}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">AI Service Controls</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {controlButtons.map((button) => (
              <button key={button.label} className={`touch-target rounded-lg px-6 py-3 transition-colors ${button.color}`}>
                {button.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/ai-assistant">
            AI Assistant
          </Link>
          <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700" href="/health-services">
            Health Services
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
