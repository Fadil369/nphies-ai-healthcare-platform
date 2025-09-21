export interface NavLink {
  href: string
  label: string
  active?: boolean
}

export const baseNavItems: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/nphies', label: 'NPHIES' },
  { href: '/claims', label: 'Claims' },
  { href: '/ai-assistant', label: 'AI Assistant' },
  { href: '/health-services', label: 'Health Services' },
  { href: '/pre-authorization', label: 'Pre-Auth' },
  { href: '/eligibility', label: 'Eligibility' },
  { href: '/ai-dashboard', label: 'AI Dashboard' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
  { href: '/login', label: 'Login' }
]

export function withActiveNav(activeHref: string) {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.href === activeHref
  }))
}
