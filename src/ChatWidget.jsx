import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* =================================
   CHATBOT KNOWLEDGE
   To add an answer, copy one block, change the
   keywords and the answer. Higher weight wins ties.
================================= */

const TOPICS = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'hii', 'namaste', 'yo'],
    answer:
      'Hi! I can help with packages, pricing, delivery time, payment and how we work. What would you like to know?',
  },
  {
    id: 'services',
    weight: 1,
    keywords: ['service', 'services', 'offer', 'do you do', 'what do you', 'build'],
    answer:
      'PROTOTYPE builds three things: Business Websites, Landing Pages and Custom Frontend Development with React. All are responsive and built to launch.',
    suggestions: ['Packages & pricing', 'How long does it take?', 'Contact Gaurav'],
  },
  {
    id: 'packages',
    weight: 1,
    keywords: ['package', 'packages', 'plan', 'plans', 'tier', 'tiers', 'options'],
    answer:
      'There are three packages:\n\nLIFTOFF: ₹5,000 – ₹6,500 (one-page starter site)\nORBIT: ₹7,000 – ₹8,500 (interactive, most popular)\nDEEP SPACE: ₹9,000 – ₹10,000 (bookings + AI assistant)\n\nAsk me about any of them, or I can help you pick.',
    link: { label: 'See full pricing', href: '/pricing' },
    suggestions: ['Tell me about LIFTOFF', 'Tell me about ORBIT', 'Tell me about DEEP SPACE', 'Which one should I choose?'],
  },
  {
    id: 'liftoff',
    weight: 3,
    keywords: ['liftoff', 'lift off', 'starter', 'essential', 'cheapest', 'basic'],
    answer:
      'LIFTOFF (₹5,000 – ₹6,500, ready in 3–5 business days) is a one-page site with 4–5 sections: hero, about, offers, gallery and contact. It loads fast on mobile and includes WhatsApp, call and email buttons, basic Google SEO and a Google Maps embed. Best for new businesses.',
    link: { label: 'Choose LIFTOFF', href: '/#contact' },
    suggestions: ['Tell me about ORBIT', 'How does payment work?'],
  },
  {
    id: 'orbit',
    weight: 3,
    keywords: ['orbit', 'interactive', 'dynamic', 'popular'],
    answer:
      'ORBIT (₹7,000 – ₹8,500, ready in 5–8 business days) is our most popular package. It adds sliding galleries, category filters, full-screen photo view, a review slider, a validated contact form and smooth animations, built with React. Best for established local businesses like hotels, restaurants and studios.',
    link: { label: 'Choose ORBIT', href: '/#contact' },
    suggestions: ['Tell me about DEEP SPACE', 'How does payment work?'],
  },
  {
    id: 'deepspace',
    weight: 3,
    keywords: ['deep space', 'deepspace', 'growth', 'booking', 'bookings', 'automation', 'automate'],
    answer:
      'DEEP SPACE (₹9,000 – ₹10,000, ready in 8–12 business days) includes booking requests with dates and guests, enquiries saved and emailed to you instantly, and an AI assistant that answers customers 24/7. Best for businesses with many enquiries.',
    link: { label: 'Choose DEEP SPACE', href: '/#contact' },
    suggestions: ['Tell me about LIFTOFF', 'Does hosting cost extra?'],
  },
  {
    id: 'recommend',
    weight: 2,
    keywords: ['which', 'choose', 'recommend', 'suggest', 'best for', 'suit', 'confused', 'not sure'],
    answer:
      'Quick guide:\n\n• Just starting out? Choose LIFTOFF.\n• Established and want a polished, interactive site? Choose ORBIT.\n• Lots of enquiries and want automation? Choose DEEP SPACE.\n\nTell me your business type and I can narrow it down, or send Gaurav a short enquiry.',
    link: { label: 'Send an enquiry', href: '/#contact' },
    suggestions: ['Packages & pricing', 'Contact Gaurav'],
  },
  {
    id: 'price',
    weight: 2,
    keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'rate', 'rates', 'budget', 'charge', 'fee', 'fees', 'rupee', 'rs', 'inr', 'cheap', 'afford'],
    answer:
      'Packages start at ₹5,000 (LIFTOFF) and go up to ₹10,000 (DEEP SPACE). ORBIT is ₹7,000 – ₹8,500. Prices do not include a domain name or hosting.',
    link: { label: 'See full pricing', href: '/pricing' },
    suggestions: ['How does payment work?', 'Does hosting cost extra?', 'Which one should I choose?'],
  },
  {
    id: 'time',
    weight: 2,
    keywords: ['time', 'long', 'days', 'delivery', 'deliver', 'deadline', 'fast', 'quick', 'when', 'duration', 'timeline', 'ready', 'urgent'],
    answer:
      'Delivery depends on the package:\n\nLIFTOFF: 3–5 business days\nORBIT: 5–8 business days\nDEEP SPACE: 8–12 business days\n\nFor an urgent deadline, message Gaurav and he can confirm.',
    suggestions: ['What is the process?', 'Contact Gaurav'],
  },
  {
    id: 'payment',
    weight: 2,
    keywords: ['payment', 'pay', 'advance', 'upfront', 'installment', 'balance', 'refund', 'invoice'],
    answer:
      'Payment is split 50/50. You pay 50% in advance to start the project, and the remaining 50% after you have seen and approved the preview, before the finished site is handed over.',
    suggestions: ['What is the process?', 'What do you need from me?'],
  },
  {
    id: 'process',
    weight: 2,
    keywords: ['process', 'steps', 'step', 'workflow', 'how do you work', 'how does it work', 'procedure', 'stages'],
    answer:
      'Four simple steps:\n\n1. Discovery: we collect your brand, photos and details.\n2. Layout preview: you get a private preview link and give feedback.\n3. Build: we code your site.\n4. Test and handoff: we test on many devices and hand over everything.\n\nYou approve the preview before the final handoff.',
    suggestions: ['What do you need from me?', 'How does payment work?'],
  },
  {
    id: 'needs',
    weight: 2,
    keywords: ['need from me', 'require', 'requirements', 'provide', 'bring', 'prepare', 'ready with', 'material', 'materials', 'logo', 'photos'],
    answer:
      'To get started we need: your logo and brand colours (if you have them), photos of your rooms, food, premises or work, your service details and prices, and how you want customers to contact you (WhatsApp, phone or email).',
    suggestions: ['What is the process?', 'Contact Gaurav'],
  },
  {
    id: 'hosting',
    weight: 2,
    keywords: ['domain', 'hosting', 'host', 'server', 'included', 'include', 'extra', 'additional', 'hidden'],
    answer:
      'The package price does not include a domain name or hosting. You buy these directly. Setting them up for you is an optional extra for an additional fee. The AI assistant is also an optional extra on ORBIT, and included in DEEP SPACE.',
    suggestions: ['Packages & pricing', 'Contact Gaurav'],
  },
  {
    id: 'ownership',
    weight: 2,
    keywords: ['own', 'ownership', 'source code', 'code', 'copyright', 'rights', 'files', 'handover', 'handoff'],
    answer:
      'You own everything. All source code, assets and settings are yours once the project is signed off, and the code is clean and modular so new pages and features can be added later.',
    suggestions: ['What is the process?', 'Contact Gaurav'],
  },
  {
    id: 'ai',
    weight: 2,
    keywords: ['ai', 'chatbot', 'assistant', 'artificial', 'bot', 'gpt'],
    answer:
      'DEEP SPACE includes an AI assistant that answers customer questions day and night. On ORBIT it is an optional extra, priced separately. LIFTOFF does not include it.',
    suggestions: ['Tell me about DEEP SPACE', 'Packages & pricing'],
  },
  {
    id: 'work',
    weight: 2,
    keywords: ['portfolio', 'work', 'projects', 'project', 'example', 'examples', 'previous', 'sample', 'samples', 'pcp'],
    answer:
      'You can see our selected work on the home page, including a digital marketing agency website for PCP Media.',
    link: { label: 'View our work', href: '/#work' },
    suggestions: ['Packages & pricing', 'Contact Gaurav'],
  },
  {
    id: 'contact',
    weight: 2,
    keywords: ['contact', 'email', 'mail', 'phone', 'call', 'whatsapp', 'number', 'reach', 'talk', 'speak', 'gaurav', 'enquiry', 'inquiry', 'hire', 'start', 'quote'],
    answer:
      'You can reach Gaurav at gaurav.official.018@gmail.com or +91 89575 49660, or use the enquiry form on the home page.',
    link: { label: 'Open enquiry form', href: '/#contact' },
    suggestions: ['Packages & pricing', 'How long does it take?'],
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank', 'thankyou', 'thx', 'great', 'awesome', 'nice', 'cool', 'ok', 'okay'],
    answer: 'You are welcome! Anything else I can help with?',
    suggestions: ['Packages & pricing', 'Contact Gaurav'],
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'later'],
    answer: 'Goodbye! If you have a project in mind, Gaurav would love to hear from you.',
    link: { label: 'Start a project', href: '/#contact' },
  },
]

const FALLBACK = {
  answer:
    "I'm a small assistant, so I may not have an answer for that one. Gaurav can help directly at gaurav.official.018@gmail.com or +91 89575 49660.",
  link: { label: 'Open enquiry form', href: '/#contact' },
  suggestions: ['Packages & pricing', 'How long does it take?', 'Contact Gaurav'],
}

const DEFAULT_SUGGESTIONS = [
  'Packages & pricing',
  'How long does it take?',
  'How does payment work?',
  'Contact Gaurav',
]

/* Chips that should jump straight to a topic */
const SHORTCUTS = {
  'packages & pricing': 'packages',
  'tell me about liftoff': 'liftoff',
  'tell me about orbit': 'orbit',
  'tell me about deep space': 'deepspace',
  'contact gaurav': 'contact',
  'how long does it take?': 'time',
  'how does payment work?': 'payment',
  'what is the process?': 'process',
  'what do you need from me?': 'needs',
  'does hosting cost extra?': 'hosting',
  'which one should i choose?': 'recommend',
}

const GREETING =
  "Hi, I'm the PROTOTYPE assistant. Ask me about packages, pricing or how we work."

/* =================================
   MATCHING LOGIC
================================= */

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matches(words, padded, keyword) {
  if (keyword.includes(' ')) return padded.includes(` ${keyword} `)

  // short keywords must match a whole word ("hi" should not match "history")
  if (keyword.length <= 3) return words.includes(keyword)

  return words.some((w) => w.startsWith(keyword))
}

function findAnswer(input) {
  const clean = normalize(input)
  const key = input.trim().toLowerCase()

  if (SHORTCUTS[key]) {
    return TOPICS.find((t) => t.id === SHORTCUTS[key])
  }

  const words = clean.split(' ')
  const padded = ` ${clean} `

  let best = null
  let bestScore = 0

  for (const topic of TOPICS) {
    let hits = 0

    for (const kw of topic.keywords) {
      if (matches(words, padded, kw)) hits += 1
    }

    const score = hits * (topic.weight || 1)

    if (score > bestScore) {
      best = topic
      bestScore = score
    }
  }

  return best || FALLBACK
}

/* =================================
   COMPONENT
================================= */

function BotLink({ link, onNavigate }) {
  if (!link) return null

  if (link.href.startsWith('/#')) {
    return (
      <a className="chat-link" href={link.href} onClick={onNavigate}>
        {link.label} ↗
      </a>
    )
  }

  return (
    <Link className="chat-link" to={link.href} onClick={onNavigate}>
      {link.label} ↗
    </Link>
  )
}
function AstronautIcon() {
  return (
    <svg
      className="astro-icon"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
    >
      {/* antenna */}
      <line x1="32" y1="6" x2="32" y2="1" stroke="#9c9c9c" strokeWidth="2" strokeLinecap="round" />
      <circle className="astro-led" cx="32" cy="3" r="2.5" fill="#4ade80" />

      {/* ear pieces */}
      <rect x="1" y="26" width="7" height="14" rx="3" fill="#bdbdbd" />
      <rect x="56" y="26" width="7" height="14" rx="3" fill="#bdbdbd" />

      {/* helmet */}
      <circle cx="32" cy="34" r="27" fill="#f2f2f2" stroke="#9c9c9c" strokeWidth="1.5" />

      {/* visor */}
      <ellipse cx="32" cy="35" rx="20" ry="17" fill="#0a0a0a" stroke="#8f8f8f" strokeWidth="1.5" />

      {/* face inside visor */}
      <circle className="astro-eye" cx="25" cy="33" r="2.6" fill="#e8e8e8" />
      <circle className="astro-eye" cx="39" cy="33" r="2.6" fill="#e8e8e8" />
      <path d="M26 41 Q32 46 38 41" fill="none" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round" />

      {/* visor shine */}
      <path d="M18 28 Q20 20 29 19" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // { role, content, link }
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing, open])

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = (text) => {
    const content = text.trim()
    if (!content || typing) return

    setMessages((prev) => [...prev, { role: 'user', content }])
    setInput('')
    setTyping(true)

    const reply = findAnswer(content)

    timer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply.answer, link: reply.link },
      ])
      setSuggestions(reply.suggestions || DEFAULT_SUGGESTIONS)
      setTyping(false)
    }, 600)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="chat-widget">
      {open && (
        <div
          className="chat-panel"
          role="dialog"
          aria-label="PROTOTYPE assistant"
        >
          <div className="chat-header">
            <div>
              <p className="chat-title">PROTOTYPE ASSISTANT</p>
              <p className="chat-status">
                <span className="chat-dot" /> ONLINE
              </p>
            </div>

            <button
              type="button"
              className="chat-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages" ref={listRef} aria-live="polite">
            <div className="chat-msg is-bot">{GREETING}</div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-msg ${m.role === 'user' ? 'is-user' : 'is-bot'}`}
              >
                {m.content}
                {m.link && (
                  <BotLink link={m.link} onNavigate={() => setOpen(false)} />
                )}
              </div>
            ))}

            {typing && (
              <div className="chat-msg is-bot chat-typing" aria-label="Typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {!typing && (
              <div className="chat-suggestions">
                {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages, pricing..."
              maxLength={200}
              aria-label="Your message"
            />

            <button type="submit" disabled={typing || !input.trim()}>
              SEND ↗
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        title="Ask us"
        className={`chat-launcher ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <span className="chat-launcher-x">✕</span> : <AstronautIcon />}
      </button>
    </div>
  )
}

export default ChatWidget