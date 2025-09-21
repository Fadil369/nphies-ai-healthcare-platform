import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

const serviceCards = [
  { icon: '🧠', title: 'Amazon Bedrock', description: 'Foundation models for medical analysis' },
  { icon: '🔬', title: 'SageMaker', description: 'ML predictions for healthcare' },
  { icon: '📄', title: 'Textract', description: 'Medical document processing' },
  { icon: '🩺', title: 'Comprehend Medical', description: 'Medical entity extraction' }
]

const analytics = [
  { label: 'Bedrock API Calls', value: '1,234', tone: 'text-blue-400' },
  { label: 'SageMaker Predictions', value: '856', tone: 'text-green-400' },
  { label: 'Documents Processed', value: '342', tone: 'text-purple-400' },
  { label: 'Medical Entities', value: '2,145', tone: 'text-yellow-400' }
]

const healthLakeStats = [
  { label: 'FHIR Resources', value: '15,678', tone: 'text-blue-400' },
  { label: 'Patient Records', value: '3,456', tone: 'text-green-400' },
  { label: 'Observations', value: '8,901', tone: 'text-purple-400' },
  { label: 'Sync Status', value: 'Up to date', tone: 'text-green-400' }
]

export default function HealthServicesPage() {
  return (
    <StaticPageLayout
      title="AWS Health Services - NPHIES-AI Healthcare Platform"
      description="Explore AWS AI and ML services powering the NPHIES-AI healthcare platform."
      navItems={withActiveNav('/health-services')}
      showProfileLinks={false}
    >
      <main className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AWS Health Services</h1>
          <p className="text-gray-300">Advanced AI and ML services for healthcare operations</p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {serviceCards.map((service) => (
            <div key={service.title} className="glass-effect rounded-xl p-6">
              <div className="mb-4 text-3xl" aria-hidden>
                {service.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
              <p className="mb-4 text-sm text-gray-400">{service.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Status</span>
                <span className="text-sm text-green-400">Active</span>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Service Analytics</h2>
            <div className="space-y-4 text-sm">
              {analytics.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className={item.tone}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">HealthLake Integration</h2>
            <div className="space-y-4 text-sm">
              {healthLakeStats.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className={item.tone}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">AI Service Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="touch-target rounded-lg bg-blue-600 px-6 py-3 transition-colors hover:bg-blue-700">
              Analyze Medical Text
            </button>
            <button className="touch-target rounded-lg bg-green-600 px-6 py-3 transition-colors hover:bg-green-700">
              Process Document
            </button>
            <button className="touch-target rounded-lg bg-purple-600 px-6 py-3 transition-colors hover:bg-purple-700">
              Generate Insights
            </button>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/ai-assistant">
            AI Assistant
          </Link>
          <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700" href="/ai-dashboard">
            AI Dashboard
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
