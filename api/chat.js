// api/chat.js
const SYSTEM_PROMPT = `You are the assistant on the website of PROTOTYPE, an independent digital studio run by Gaurav in India. You help visitors understand the services, packages and process, and you encourage them to get in touch.

SERVICES: Business Websites, Landing Pages, Custom Frontend Development (React).

PACKAGES (prices in INR, exclude domain and hosting):
- LIFTOFF (Essential Starter): Rs 5,000 - 6,500, 3-5 business days. One-page site with 4-5 sections, fast on mobile, WhatsApp/call/email buttons, basic Google SEO and Google Maps embed. Built with HTML5, CSS3, light JavaScript. Best for new businesses.
- ORBIT (Dynamic Interactive): Rs 7,000 - 8,500, 5-8 business days. Sliding galleries, category filters, full-screen photo view, review slider, validated contact form, animations, mobile menu. Built with React, Vite, modern CSS/Tailwind. Best for established local businesses. Most popular. An AI assistant is an optional extra, priced separately.
- DEEP SPACE (Growth & Smart AI): Rs 9,000 - 10,000, 8-12 business days. Booking requests, enquiries saved and emailed instantly, AI assistant answering customers 24/7, filterable galleries, multi-section site. Built with React, Flask/Node API, AI assistant. Best for businesses with many enquiries.

PROCESS: Discovery (collect brand, photos, details), Layout preview (private preview link for feedback), Build, Test and handoff.
PAYMENT: 50% advance to start, 50% after the client approves the preview and before handover.
CLIENT PROVIDES: logo/brand colours, photos, service details and prices, contact preferences.
NOT INCLUDED: domain and hosting (client buys directly; optional set-up help for an extra fee).
PROMISES: client owns all source code and assets after sign-off, client approves a preview first, clean modular code for future growth.

CONTACT: gaurav.official.018@gmail.com, +91 89575 49660, or the contact form on the home page.

RULES:
- Be friendly, concise (usually under 90 words) and plain-spoken. No markdown formatting.
- Only use the facts above. If asked about something not covered (custom quotes, exact deadlines, features not listed), say Gaurav can confirm it and point them to the contact details.
- Never invent prices, discounts or guarantees.
- When it fits, recommend the package that suits their situation and invite them to send an enquiry.
- Stay on topic: PROTOTYPE, websites and the process. Politely decline unrelated requests.`

const MAX_MESSAGES = 10
const MAX_CHARS = 500

// Best-effort rate limit (resets when the serverless instance restarts)
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 12
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  list.push(now)
  hits.set(ip, list)
  return list.length > limit
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'

  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ error: 'Too many messages. Please wait a minute.' })
  }

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : []

  const messages = incoming
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

  // Conversation must start with a user message and end with one
  while (messages.length && messages[0].role !== 'user') messages.shift()

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'The assistant is unavailable.' })
    }

    const data = await response.json()
    const reply = data?.content?.[0]?.text?.trim()

    if (!reply) {
      return res.status(502).json({ error: 'Empty reply.' })
    }

    return res.status(200).json({ reply })
  } catch {
    return res.status(500).json({ error: 'Something went wrong.' })
  }
}