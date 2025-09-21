import { useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

interface NotificationItem {
  id: string
  title: string
  message: string
  icon: string
  tone: string
  timeAgo: string
  isNew?: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Claim Approved',
    message: 'Claim #12345 for patient John Doe has been approved by the insurance provider.',
    icon: '✅',
    tone: 'border-green-500 text-green-400',
    timeAgo: '2 minutes ago',
    isNew: true
  },
  {
    id: 'notif-2',
    title: 'Eligibility Check Complete',
    message: 'Eligibility verification completed for patient Jane Smith. Coverage is active.',
    icon: 'ℹ️',
    tone: 'border-blue-500 text-blue-400',
    timeAgo: '15 minutes ago'
  },
  {
    id: 'notif-3',
    title: 'AI Analysis Ready',
    message: 'AI analysis for medical document processing has been completed. View insights now.',
    icon: '🤖',
    tone: 'border-purple-500 text-purple-400',
    timeAgo: '1 hour ago'
  },
  {
    id: 'notif-4',
    title: 'Pre-Authorization Pending',
    message: 'Pre-authorization request #PA002 is still pending review. Expected response in 24 hours.',
    icon: '⚠️',
    tone: 'border-yellow-500 text-yellow-400',
    timeAgo: '3 hours ago'
  },
  {
    id: 'notif-5',
    title: 'Claim Rejected',
    message: 'Claim #12343 has been rejected. Reason: Insufficient documentation. Please review and resubmit.',
    icon: '❌',
    tone: 'border-red-500 text-red-400',
    timeAgo: '5 hours ago'
  },
  {
    id: 'notif-6',
    title: 'System Update',
    message: 'NPHIES-AI platform has been updated to version 3.1.0 with enhanced security features.',
    icon: '🔄',
    tone: 'border-gray-500 text-gray-400',
    timeAgo: '1 day ago'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, isNew: false })))
  }

  const dismissNotification = (id: string) => {
    setNotifications((items) => items.filter((item) => item.id !== id))
  }

  return (
    <StaticPageLayout
      title="Notifications - NPHIES-AI Healthcare Platform"
      description="Stay updated with the latest NPHIES-AI healthcare platform notifications."
      navItems={withActiveNav('/notifications')}
      showProfileLinks={false}
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-300">Stay updated with your healthcare operations</p>
          </div>
          <button
            className="touch-target rounded-lg bg-blue-600 px-4 py-2 text-sm transition-colors hover:bg-blue-700"
            type="button"
            onClick={markAllRead}
          >
            Mark All Read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const [borderTone, iconTone] = notification.tone.split(' ')
            return (
              <div
                key={notification.id}
                className={`glass-effect rounded-xl border-l-4 p-6 ${borderTone}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={iconTone}>{notification.icon}</span>
                      <h3 className="font-semibold">{notification.title}</h3>
                      {notification.isNew && (
                        <span className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400">New</span>
                      )}
                    </div>
                    <p className="mb-2 text-gray-300">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.timeAgo}</p>
                  </div>
                  <button
                    aria-label="Dismiss notification"
                    className="touch-target text-gray-400 transition-colors hover:text-white"
                    type="button"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button className="touch-target rounded-lg bg-gray-600 px-6 py-2 transition-colors hover:bg-gray-700" type="button">
            Load More Notifications
          </button>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700" href="/settings">
            Notification Settings
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
