import { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface NavItem {
  href: string
  label: string
  active?: boolean
}

interface StaticPageLayoutProps {
  title: string
  description: string
  navItems: NavItem[]
  children: ReactNode
  showProfileLinks?: boolean
  gradient?: 'slate' | 'light'
}

export function StaticPageLayout({
  title,
  description,
  navItems,
  children,
  showProfileLinks = false,
  gradient = 'slate'
}: StaticPageLayoutProps) {
  const gradientClass = gradient === 'slate'
    ? 'gradient-bg-slate text-white'
    : 'gradient-bg-light text-slate-900'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen font-sans ${gradientClass}`}>
        <nav className="glass-effect border-b border-white/10">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold">🏥 NPHIES-AI</div>
              <div className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    className={`text-sm transition-colors ${
                      item.active ? 'text-blue-400 font-medium' : 'text-gray-300 hover:text-white'
                    }`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {showProfileLinks && (
              <div className="flex items-center gap-4 text-sm">
                <Link className="touch-target text-gray-300 transition hover:text-white" href="/profile">
                  Profile
                </Link>
                <Link className="touch-target text-gray-300 transition hover:text-white" href="/settings">
                  Settings
                </Link>
              </div>
            )}
          </div>
        </nav>

        {children}
      </div>

    </>
  )
}
