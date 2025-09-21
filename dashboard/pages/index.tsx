import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface MobilePreviewSheetProps {
  isOpen: boolean
  onClose: () => void
}

function MobilePreviewSheet({ isOpen, onClose }: MobilePreviewSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const defaultFocusRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'Tab') {
        const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (!focusable || focusable.length === 0) {
          event.preventDefault()
          return
        }

        const focusableArray = Array.from(focusable)
        const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement)
        const nextIndex = currentIndex + (event.shiftKey ? -1 : 1)

        if (nextIndex >= focusableArray.length) {
          focusableArray[0].focus()
          event.preventDefault()
        } else if (nextIndex < 0) {
          focusableArray[focusableArray.length - 1].focus()
          event.preventDefault()
        }
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    document.addEventListener('keydown', handleKeyDown)

    const focusTarget = defaultFocusRef.current ?? sheetRef.current?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
    focusTarget?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-6"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-slate-900 text-white shadow-2xl"
        ref={sheetRef}
      >
        <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-white/20" />
        <div className="p-6">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest text-cyan-300">Mobile Preview</p>
            <h2 className="text-2xl font-semibold">NPHIES-AI Assistant</h2>
            <p className="mt-2 text-sm text-slate-300">
              Experience the streamlined mobile workflow designed for on-the-go healthcare professionals.
            </p>
          </div>

          <div className="mb-6 grid gap-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">AI-generated claim summary ready for submission.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Eligibility check completed in 0.8 seconds.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Secure chat with BrainSAIT agents in real time.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
              href="/mobile"
            >
              Open in Expo
            </a>
            <button
              ref={defaultFocusRef}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              type="button"
              onClick={onClose}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <>
      <Head>
        <title>🏥 NPHIES-AI Healthcare Platform</title>
        <meta
          name="description"
          content="Healthcare AI platform with comprehensive NPHIES integration, AI automation, and intelligent workflows."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MobilePreviewSheet isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />

      <div className="gradient-bg min-h-screen font-sans text-white">
        <nav className="glass-effect fixed top-0 z-50 w-full">
          <div className="container mx-auto max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  <span className="text-xl" role="img" aria-label="Hospital">
                    🏥
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                    NPHIES-AI
                  </h1>
                  <p className="font-mono text-xs text-gray-400">Healthcare Intelligence v3.0</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  className="touch-target text-gray-300 transition hover:text-white"
                  href="/login"
                >
                  Sign In
                </Link>
                <Link
                  className="touch-target rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 font-semibold transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:from-primary-600 hover:to-primary-700"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-32">
          <section className="text-center">
            <div className="mb-8 inline-flex animate-[float_6s_ease-in-out_infinite]">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                <span className="text-4xl" role="img" aria-label="Rocket">
                  🚀
                </span>
              </div>
            </div>

            <h2 className="text-5xl font-bold md:text-7xl">
              <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
                Advanced Healthcare
              </span>
              <span className="block text-transparent bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text">
                AI Platform
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-gray-300">
              Empowering healthcare providers with cutting-edge AI technology, seamless NPHIES integration,
              and intelligent automation for superior patient care and operational excellence.
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:from-primary-600 hover:to-primary-700"
                href="/dashboard"
              >
                Launch Platform
              </Link>
              <Link
                className="rounded-xl px-8 py-4 text-lg font-semibold transition-all glass-effect hover:bg-white/10"
                href="/ai-assistant"
              >
                Try AI Assistant
              </Link>
              <button
                className="touch-target rounded-lg bg-gray-700 px-4 py-3 text-sm transition hover:bg-gray-600"
                type="button"
                onClick={() => setIsPreviewOpen(true)}
              >
                Open Mobile Preview
              </button>
            </div>
          </section>

          <section className="space-y-12">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                Powered by AWS AI Services
              </h3>
              <p className="mt-3 text-lg text-gray-400">8 integrated AI services for comprehensive healthcare intelligence</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: '🧠', title: 'Amazon Bedrock', description: 'Foundation models for advanced healthcare analysis' },
                { icon: '🎯', title: 'SageMaker', description: 'Custom ML models for healthcare predictions' },
                { icon: '📄', title: 'Textract', description: 'Medical document processing and OCR' },
                { icon: '🔍', title: 'Kendra', description: 'Intelligent healthcare knowledge search' }
              ].map((service) => (
                <div
                  key={service.title}
                  className="group rounded-2xl p-6 transition-all glass-effect hover:bg-white/10"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 transition-transform group-hover:scale-110">
                    <span className="text-xl" role="img" aria-hidden="true">
                      {service.icon}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold">{service.title}</h4>
                  <p className="mt-2 text-sm text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="rounded-3xl p-12 glass-effect">
              <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
                {[
                  { value: '98.5%', label: 'Success Rate', gradient: 'from-primary-400 to-primary-600' },
                  { value: '0.8s', label: 'Response Time', gradient: 'from-green-400 to-green-600' },
                  { value: '8', label: 'AI Services', gradient: 'from-purple-400 to-purple-600' },
                  { value: '24/7', label: 'Availability', gradient: 'from-orange-400 to-orange-600' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className={`mb-2 text-4xl font-bold text-transparent bg-gradient-to-r ${stat.gradient} bg-clip-text`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="text-center">
            <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Ready to Transform Healthcare?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Join leading providers that trust BrainSAIT to power their NPHIES compliance, automate workflows, and
              deliver AI-assisted patient experiences.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold shadow-[0_0_30px_rgba(14,165,233,0.3)] transition hover:from-primary-600 hover:to-primary-700"
                href="/contact"
              >
                Schedule a Demo
              </Link>
              <Link
                className="rounded-xl px-8 py-4 text-lg font-semibold transition glass-effect hover:bg-white/10"
                href="/docs/platform-overview"
              >
                View Documentation
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-400">
          <p>BrainSAIT Healthcare Technology © 2024</p>
          <p className="mt-1">HIPAA Compliant • NPHIES Integrated • Free Tier Optimized</p>
        </footer>
      </div>
    </>
  )
}
