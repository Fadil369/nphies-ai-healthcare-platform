import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'

export default function NotFoundPage() {
  return (
    <StaticPageLayout
      title="404 - Page Not Found - NPHIES-AI Healthcare Platform"
      description="The page you are looking for cannot be found."
      navItems={[]}
      showProfileLinks={false}
    >
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <section className="max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <div className="text-7xl font-black text-transparent bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text">404</div>
          <h1 className="mt-4 text-3xl font-extrabold text-transparent bg-gradient-to-r from-white to-slate-200 bg-clip-text">
            Page Not Found
          </h1>
          <p className="mt-4 text-lg text-white/80">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold text-white">Try the following:</h2>
            <ul className="mt-4 space-y-2 text-white/80">
              <li>• Double-check the URL for typos</li>
              <li>
                • Return to the{' '}
                <Link className="text-blue-300 transition hover:text-blue-200" href="/">
                  homepage
                </Link>
              </li>
              <li>
                • Visit the{' '}
                <Link className="text-blue-300 transition hover:text-blue-200" href="/dashboard">
                  dashboard
                </Link>{' '}
                to continue your workflow
              </li>
              <li>• Contact BrainSAIT support if you believe this is an error</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link className="touch-target rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-semibold shadow-lg transition hover:from-blue-600 hover:to-blue-800" href="/dashboard">
              Go to Dashboard
            </Link>
            <Link className="touch-target rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 transition hover:bg-white/10" href="/contact">
              Contact Support
            </Link>
          </div>

          <div className="mt-10 border-t border-white/10 pt-4 text-sm text-white/60">
            Request ID: NPHIES-404 • Please reference this code when contacting support
          </div>
        </section>
      </div>
    </StaticPageLayout>
  )
}
