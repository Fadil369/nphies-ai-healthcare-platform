import { FormEvent, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!username || !password) {
      setError('Please provide both username and password.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = new URLSearchParams()
      payload.set('username', username)
      payload.set('password', password)

      const response = await fetch('/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      })

      if (!response.ok) {
        throw new Error('Invalid credentials.')
      }

      const data = await response.json()
      if (!data?.access_token) {
        throw new Error('Unexpected response from server.')
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('nphies_ai_access_token', data.access_token)
      }

      await Router.replace('/dashboard')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StaticPageLayout
      title="Login - NPHIES-AI Healthcare Platform"
      description="Authenticate to access the NPHIES-AI healthcare platform."
      navItems={[]}
      showProfileLinks={false}
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 text-4xl">🏥</div>
            <h1 className="mb-2 text-3xl font-bold">NPHIES-AI</h1>
            <p className="text-gray-300">Healthcare Platform Login</p>
          </div>

          <section className="glass-effect rounded-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium">Email or Provider ID</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email or provider ID"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500" type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a className="text-blue-400 transition-colors hover:text-blue-300" href="#">
                  Forgot password?
                </a>
              </div>

              <button
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800/50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <a className="text-blue-400 transition-colors hover:text-blue-300" href="#">
                Contact Administrator
              </a>
            </div>
          </section>

          <section className="mt-8 text-center">
            <div className="glass-effect rounded-lg p-4 text-sm">
              <h3 className="mb-2 font-semibold">Demo Access</h3>
              <p className="mb-3 text-gray-400">Use these credentials for demonstration:</p>
              <p>
                <strong>Username:</strong> nphies_service
              </p>
              <p>
                <strong>Password:</strong> nphies-dev-password
              </p>
            </div>
          </section>

          <div className="mt-6 text-center text-sm">
            <Link className="text-gray-400 transition-colors hover:text-white" href="/">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
