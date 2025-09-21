import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { StaticPageLayout } from '../page-layout'
import { withActiveNav } from '../nav-items'

interface Message {
  id: string
  sender: 'ai' | 'user'
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    sender: 'ai',
    content:
      "Hello! I'm your AI healthcare assistant. I can help you with:\n\n• Claims processing guidance\n• NPHIES integration support\n• Medical coding assistance\n• Eligibility verification\n• Healthcare analytics insights",
    timestamp: 'Just now'
  }
]

function createTimestamp() {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date())
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim()) {
      return
    }

    const timestamp = createTimestamp()
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp
    }

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      content: 'Thanks for your question. A BrainSAIT healthcare agent will review and respond shortly.',
      timestamp
    }

    setMessages((previous) => [...previous, userMessage, aiMessage])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(inputValue)
    setInputValue('')
  }

  const handleQuickMessage = (preset: string) => {
    setInputValue('')
    sendMessage(preset)
  }

  return (
    <StaticPageLayout
      title="AI Assistant - NPHIES-AI Healthcare Platform"
      description="Chat with the BrainSAIT AI healthcare assistant for guidance across NPHIES workflows."
      navItems={withActiveNav('/ai-assistant')}
      showProfileLinks
    >
      <main className="container mx-auto flex h-screen max-w-4xl flex-col px-6 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Healthcare Assistant</h1>
          <p className="text-gray-300">Get intelligent insights and support for your healthcare operations</p>
        </header>

        <section className="glass-effect flex flex-1 flex-col rounded-xl">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`message-content max-w-[70%] rounded-lg p-4 text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={index > 0 && line.startsWith('•') ? 'pl-2' : ''}>
                      {line}
                    </p>
                  ))}
                  <span className="mt-2 block text-xs text-blue-200">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-6">
            <form className="flex flex-wrap gap-4 sm:flex-nowrap" onSubmit={handleSubmit}>
              <input
                autoComplete="off"
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask me anything about healthcare operations..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <button
                className="touch-target rounded-lg bg-blue-600 px-6 py-3 font-medium transition-colors hover:bg-blue-700"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: '📋', label: 'Submit Claim', preset: 'How do I submit a claim?' },
            { icon: '✅', label: 'Check Eligibility', preset: 'Check eligibility status' },
            { icon: '🔍', label: 'Medical Codes', preset: 'Explain medical codes' },
            { icon: '📊', label: 'System Status', preset: 'Show system status' }
          ].map((action) => (
            <button
              key={action.label}
              className="touch-target glass-effect rounded-lg p-4 text-center transition-colors hover:bg-white/10"
              type="button"
              onClick={() => handleQuickMessage(action.preset)}
            >
              <div className="mb-2 text-2xl" aria-hidden>
                {action.icon}
              </div>
              <div className="text-sm">{action.label}</div>
            </button>
          ))}
        </section>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link className="touch-target rounded-lg bg-gray-600 px-4 py-2 text-sm transition-colors hover:bg-gray-700" href="/dashboard">
            ← Dashboard
          </Link>
          <Link className="touch-target rounded-lg bg-green-600 px-4 py-2 text-sm transition-colors hover:bg-green-700" href="/claims">
            Process Claims
          </Link>
          <Link className="touch-target rounded-lg bg-purple-600 px-4 py-2 text-sm transition-colors hover:bg-purple-700" href="/health-services">
            Health Services
          </Link>
        </div>
      </main>
    </StaticPageLayout>
  )
}
