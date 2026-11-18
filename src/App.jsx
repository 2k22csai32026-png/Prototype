import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  Routes,
  Route,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom'
import './App.css'
import ChatWidget from './ChatWidget'
import { sound } from './utils/soundEngine'
import ScopeCalculator from './components/ScopeCalculator'
import PerformanceBadge from './components/PerformanceBadge'
import { useTilt } from './hooks/useTilt'
import InteractivePricingEstimator from './components/InteractivePricingEstimator'
import InstantPrototypeGenerator from './components/InstantPrototypeGenerator';

/* =================================
   PORTFOLIO DATA
================================= */

const projects = [
  {
    slug: 'pcp-media',
    titleTop: 'PCP',
    titleBottom: 'MEDIA.',
    category: 'DIGITAL MARKETING AGENCY WEBSITE',
    summary:
      'A high-performance frontend website designed and engineered for PCP Media, highlighting services, creative campaign work, and brand authority through an editorial digital experience.',
    pageSummary:
      'A bespoke agency web interface developed to elevate digital marketing service tiers, showcase high-converting client case studies, and generate inbound B2B client enquiries.',
    tags: ['WEB DESIGN', 'REACT', 'RESPONSIVE UI', 'CLIENT PRODUCTION'],
    cover: {
      src: '/images/projects/pcp-1.png',
      alt: 'PCP Media agency website interface',
    },
    gallery: [
      { src: '/images/projects/pcp-2.png', alt: 'PCP Media services section' },
      { src: '/images/projects/pcp-3.png', alt: 'PCP Media portfolio grid' },
      { src: '/images/projects/pcp-4.png', alt: 'PCP Media brand storytelling' },
      { src: '/images/projects/pcp-5.png', alt: 'PCP Media responsive mobile view' },
    ],
    overviewTop: 'BESPOKE DIGITAL',
    overviewBottom: 'AGENCY PLATFORM.',
    highlights: [
      'Engineered with Fast-Loading Semantic Architecture',
      'High-Conversion Service & Case Study Showcase',
      'Dynamic Responsive Adaptation Across All Breakpoints',
      'Optimized Visual Flow and Lead-Generation CTAs',
      'Seamless Brand Expression with High Visual Polish',
    ],
    ctaText:
      "Need a modern, commanding digital identity for your agency or service business? Let's build an interface that earns immediate credibility.",
    liveUrl: 'https://www.pcpmedia.in',
  },
  {
    slug: 'landmark',
    demo: true,
    titleTop: 'THE',
    titleBottom: 'LANDMARK.',
    category: 'FINE DINING & WELLNESS CLUB (DEMO CONCEPT)',
    summary:
      'A dark luxury hospitality showcase featuring categorized woodfired menu cards, wellness club suite discovery, table reservation simulation, and private event lead capture.',
    pageSummary:
      'A quiet-luxury digital concept crafted for fine dining establishments and boutique wellness clubs, built to drive covers, private dining buyouts, and high-value club memberships.',
    tags: ['REACT', 'VITE', 'TAILWIND CSS', 'ZERO BACKEND', 'DEMO CONCEPT'],
    cover: {
      src: '/images/projects/landmark-1.png',
      alt: 'The Landmark restaurant hero section',
    },
    gallery: [
      { src: '/images/projects/landmark-3.png', alt: 'The Landmark Wellness Club suites' },
      { src: '/images/projects/landmark-2.png', alt: 'The Landmark seasonal menu showcase' },
      { src: '/images/projects/landmark-4.png', alt: 'The Landmark private event enquiry concierge' },
      { src: '/images/projects/landmark-5.png', alt: 'The Landmark table reservation modal flow' },
    ],
    overviewTop: 'AN ICONIC HOSPITALITY',
    overviewBottom: '& WELLNESS DESTINATION.',
    highlights: [
      'Quiet Luxury Aesthetic with Editorial Typography Hierarchy',
      'Filterable Woodfired Culinary Menu with Dynamic Card Elements',
      'Dual Experience Architecture: Dining & Wellness Suites',
      'Zero-Latency Reservation & Booking Modal Simulator',
      'Private Dining & Corporate Venue Lead Intake',
    ],
    ctaText:
      "Running a bistro, resort, fine dining lounge or private club? Let's build a digital experience that converts discerning guests into booked reservations.",
    liveUrl: 'https://landmark-demo.pages.dev',
  },
  {
    slug: 'apex-academy',
    demo: true,
    titleTop: 'APEX',
    titleBottom: 'ACADEMY.',
    category: 'EDUCATION & COACHING WEBSITE (DEMO CONCEPT)',
    summary:
      'A structured, high-trust digital portal for competitive exam coaching institutes, articulating course curricula, faculty credentials, ranker results, and admission flows.',
    pageSummary:
      'A purpose-built web architecture for coaching academies and educational institutions, engineered to inspire trust in parents and prospective students through verified results and clear course paths.',
    tags: ['REACT', 'RESPONSIVE', 'CLEAN ARCHITECTURE', 'DEMO CONCEPT'],
    cover: { src: '/images/projects/apex-1.png', alt: 'Apex Academy hero banner' },
    gallery: [
      { src: '/images/projects/apex-2.png', alt: 'Apex Academy track record and statistics' },
      { src: '/images/projects/apex-3.png', alt: 'Apex Academy faculty profiles' },
      { src: '/images/projects/apex-4.png', alt: 'Apex Academy admission enquiry flow' },
      { src: '/images/projects/apex-5.png', alt: 'Apex Academy call-to-action block' },
    ],
    overviewTop: 'A PURPOSE-BUILT',
    overviewBottom: 'ACADEMIC SHOWCASE.',
    highlights: [
      'Trust-First Visual Layout with Clear Verification Metrics',
      'Comprehensive Program, Batch, and Faculty Directories',
      'Direct Admission & Counseling Intake Modules',
      'Ultra-Fast Loading Times across Mobile Handsets',
      'Accessible, Professional Contrast and Typography',
    ],
    ctaText:
      "Directing a school, training institute or academy? We develop modern websites that establish academic prestige and drive steady enrolments.",
  },
  {
    slug: 'abc-portal',
    demo: true,
    titleTop: 'ABC',
    titleBottom: 'PORTAL.',
    category: 'CAMPUS ERP & ACADEMIC MANAGEMENT (DEMO CONCEPT)',
    summary:
      'A dense, dark-themed campus dashboard featuring real-time attendance quota tracking, biometric gate-pass syncing, master timetable matrices, and professor evaluation portals.',
    pageSummary:
      'An enterprise academic portal and student information dashboard designed for engineering colleges and universities. Models automated 75% attendance quota simulation, timetable dispatch, and professor grading consoles.',
    tags: ['REACT', 'DASHBOARD UI', 'CAMPUS ERP', 'EDTECH', 'DEMO CONCEPT'],
    cover: {
      src: '/images/projects/abc-1.png',
      alt: 'ABC Portal student academic dashboard overview',
    },
    gallery: [
      { src: '/images/projects/abc-2.png', alt: 'Faculty attendance and assessment terminal' },
      { src: '/images/projects/abc-3.png', alt: 'Weekly schedule timetable matrix' },
      { src: '/images/projects/abc-4.png', alt: 'Interactive 75% attendance quota and safe bunk predictor' },
      { src: '/images/projects/abc-5.png', alt: 'Continuous internal evaluation ledger' },
      { src: '/images/projects/abc-6.png', alt: 'Campus digital gate pass with QR clearance' },
    ],
    overviewTop: 'NEXT-GENERATION',
    overviewBottom: 'CAMPUS INTELLIGENCE.',
    highlights: [
      'Real-Time Quota Monitor with 75% Safe Bunk Prediction Algorithm',
      'Dual-Role Workflow: Student Dashboard & Faculty Grading Console',
      'Dynamic Digital QR Gate Pass & Verification Architecture',
      'High-Density Semester Timetable with Live Slot Indicators',
      'Continuous Assessment & Exam Clearance Ledger',
    ],
    ctaText:
      "Looking to digitize internal workflows for a college or private department? Let's design a high-density, lightning-fast application.",
    liveUrl: '',
  },
]

const MARQUEE_ITEMS = [
  'REACT + VITE',
  'ZERO BLOAT CODE',
  'SUB-SECOND LOAD TIMES',
  'BESPOKE INTERFACES',
  'MOBILE FIRST ARCHITECTURE',
  'BUILT TO CONVERT',
]

const TEMPLATES = [
  {
    slug: 'landmark',
    industry: 'FINE DINING & HOSPITALITY',
    name: 'The Landmark',
    text: 'Quiet luxury menu presentation, wellness club suites, instant table booking modal, and private buyout lead concierge.',
    img: '/images/projects/landmark-1.png',
    tags: ['LUXURY EDITORIAL', 'RESERVATIONS', 'HOSPITALITY'],
  },
  {
    slug: 'apex-academy',
    industry: 'EDTECH & COACHING',
    name: 'Apex Academy',
    text: 'Curriculum directories, faculty showcases, verified results counter, and streamlined parent admission enquiries.',
    img: '/images/projects/apex-1.png',
    tags: ['HIGH-TRUST LIGHT', 'ENQUIRY FUNNEL', 'FACULTY PROFILES'],
  },
  {
    slug: 'abc-portal',
    industry: 'ENTERPRISE & ACADEMIC ERP',
    name: 'ABC Academic Portal',
    text: 'Real-time attendance quota monitor, timetable dispatch, internal marks ledger, and faculty grading console.',
    img: '/images/projects/abc-1.png',
    tags: ['ERP DASHBOARD', 'DATA DENSE', 'ACADEMIC MATRIX'],
  },
  {
    soon: true,
    industry: 'PORTFOLIO & ARCHITECTURE STUDIO',
    name: 'Atelier Concept',
    text: 'A minimalist horizontal showcase for architects, industrial designers, and visual production studios.',
    tags: ['MINIMALIST', 'CASE STUDIES', 'COMING SOON'],
  },
]

/* =================================
   HOOKS & SMALL HELPERS
================================= */

function useScrollReveal() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const items = Array.from(
      document.querySelectorAll('[data-reveal]:not(.is-visible)')
    )

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    )

    items.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])
}

function useCursorEffects() {
  useEffect(() => {
    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    if (!canHover) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const MAGNETS =
      '.hero-button, .service-cta, .contact-button, .project-details-btn, .live-project-btn'

    let frame = 0

    const resetMagnets = () => {
      document.querySelectorAll(MAGNETS).forEach((el) => {
        el.style.translate = ''
      })
    }

    const onMove = (e) => {
      const target = e.target

      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const card = target.closest ? target.closest('.service-card') : null

        if (card) {
          const rect = card.getBoundingClientRect()
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
          card.style.setProperty('--my', `${e.clientY - rect.top}px`)
        }

        if (reduceMotion) return

        document.querySelectorAll(MAGNETS).forEach((el) => {
          const r = el.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)

          const near =
            Math.abs(dx) < r.width / 2 + 40 &&
            Math.abs(dy) < r.height / 2 + 40

          const next = near ? `${dx * 0.2}px ${dy * 0.3}px` : ''

          if (el.style.translate !== next) el.style.translate = next
        })
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', resetMagnets)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', resetMagnets)
    }
  }, [])
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }

  el.setAttribute('content', value)
}

function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title

    const url = window.location.href
    const image = `${window.location.origin}/og-image.png`

    setMeta('name', 'description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'PROTOTYPE')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
  }, [title, description])
}

function ScrollProgress() {
  const { pathname } = useLocation()
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      const progress = max > 0 ? root.scrollTop / max : 0

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`
      }

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  )
}

function ProjectImage({ src, alt, className = '', ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`project-img ${loaded ? 'is-loaded' : 'is-loading'} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      {...rest}
    />
  )
}

function ServiceNavbar({ to = '/', label = '← BACK TO HOME' }) {
  return (
    <nav className="service-navbar">
      <Link to="/" className="service-brand">
        PROTOTYPE<span>®</span>
      </Link>

      <Link to={to} className="back-home">
        {label}
      </Link>
    </nav>
  )
}

function DetailList({ items }) {
  return (
    <div className="details-list">
      {items.map(([title, text], i) => (
        <div
          className="detail-item"
          key={title}
          data-reveal={Math.min(i, 4)}
        >
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  )
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {MARQUEE_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* =================================
   HOME NAVBAR
================================= */

const NAV_ITEMS = [
  ['Home', '#home'],
  ['Services', '#services'],
  ['Work', '#work'],
  ['Templates', '#templates'],
  ['Pricing', '/pricing'],
  ['Contact', '#contact'],
]

function Navbar({ onLogoClick }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [audioActive, setAudioActive] = useState(false)

  const toggleAudio = () => {
    const state = sound.toggle()
    setAudioActive(state)
  }

  const closeMenu = () => {
    document.body.classList.remove('menu-open')
    setOpen(false)
  }

  const handleLogo = () => {
    closeMenu()
    onLogoClick()
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div
        className="brand-name"
        role="button"
        tabIndex={0}
        title="Replay intro"
        onClick={handleLogo}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleLogo()
          }
        }}
      >
        PROTOTYPE<span>®</span>
      </div>

      <button
        type="button"
        className={`audio-toggle-btn ${audioActive ? 'is-active' : ''}`}
        onClick={toggleAudio}
        title="Toggle Interface Sound FX"
      >
        <span className="audio-dot" />
        SOUND FX: {audioActive ? 'ON' : 'OFF'}
      </button>

      <button
        type="button"
        className={`menu-toggle ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="primary-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="primary-menu"
        className={`nav-links ${open ? 'is-open' : ''}`}
      >
        {NAV_ITEMS.map(([label, href], i) =>
          href.startsWith('/') ? (
            <Link
              key={href}
              to={href}
              style={{ '--i': i }}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ) : (
            <a
              key={href}
              href={href}
              style={{ '--i': i }}
              onClick={closeMenu}
            >
              {label}
            </a>
          )
        )}

        <div className="menu-footer">
          <p>HAVE A PROJECT IN MIND?</p>
          <a href="mailto:prototype.tech.webdev@gmail.com">
            prototype.tech.webdev@gmail.com
          </a>
          <a href="tel:+918957549660">
            +91 89575 49660
          </a>
        </div>
      </div>
    </nav>
  )
}

/* =================================
   FOOTER
================================= */

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main" data-reveal>
        <div className="footer-brand">
          <p className="footer-kicker">INDEPENDENT DIGITAL STUDIO</p>
          <div className="footer-logo">
            PROTOTYPE<span>®</span>
          </div>
          <p className="footer-tagline">
            Engineering bespoke web experiences, interactive applications, and performance-driven interfaces from idea to deployment.
          </p>
        </div>

        <div className="footer-connect">
          <p className="footer-kicker">PROJECT ENQUIRIES & PARTNERSHIPS</p>
          <h3>
            LET'S CREATE
            <br />
            <span>SOMETHING REMARKABLE.</span>
          </h3>

          <div className="footer-contact-links">
            <a href="mailto:prototype.tech.webdev@gmail.com">
              prototype.tech.webdev@gmail.com ↗
            </a>
            <a href="tel:+918957549660">
              +91 89575 49660
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2027 PROTOTYPE STUDIO. ALL RIGHTS RESERVED.</p>
        <p className="footer-credit">
          DESIGNED & DEVELOPED BY <span>GAURAV</span>
        </p>
        <p className="footer-signature">
          FROM IDEA TO INTERFACE.
        </p>
      </div>
    </footer>
  )
}

const ENQUIRY_SERVICES = [
  'Business Website',
  'Landing Page',
  'Frontend Development',
  'Custom Web App / Portal',
]

const ENQUIRY_PLANS = ['LIFTOFF', 'ORBIT', 'DEEP SPACE', 'Custom Consultation']

function TiltCard({ children, className, ...rest }) {
  const tiltRef = useTilt(10)
  return (
    <div ref={tiltRef} className={className} {...rest}>
      {children}
    </div>
  )
}

/* =================================
   HOME PAGE
================================= */

function Home() {
  usePageMeta(
    'PROTOTYPE — Independent Digital Studio',
    'PROTOTYPE creates modern, responsive websites, landing pages and bespoke frontend experiences with exceptional speed and precision.'
  )

  // Item 2: Initialize intro state safely from sessionStorage to prevent re-triggering & remove text flashing delay
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('prototypeIntroShown');
    } catch {
      return true;
    }
  });

  const [introRun, setIntroRun] = useState(0)
  const introTimer = useRef(null)

  const handleApplyScope = ({ service, plan, note }) => {
    setFormData((prev) => ({
      ...prev,
      service: service || prev.service,
      plan: plan || prev.plan,
      message: prev.message ? `${prev.message}\n\n[Scope Estimate]: ${note}` : `[Scope Estimate]: ${note}`
    }))
  }

  const handleSkipIntro = () => {
    setShowIntro(false)
    try {
      sessionStorage.setItem('prototypeIntroShown', 'true')
    } catch {}
  }

  const runIntro = () => {
    clearTimeout(introTimer.current)
    setIntroRun((n) => n + 1)
    setShowIntro(true)

    introTimer.current = setTimeout(() => {
      setShowIntro(false)
      try {
        sessionStorage.setItem('prototypeIntroShown', 'true')
      } catch {}
    }, 3900)
  }

  const replayIntro = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    runIntro()
  }

  useEffect(() => {
    // Check for prefers-reduced-motion to auto-skip intro
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches && showIntro) {
      handleSkipIntro()
      return
    }

    let introAlreadyShown = false
    try {
      introAlreadyShown = sessionStorage.getItem('prototypeIntroShown')
    } catch {}

    if (!introAlreadyShown) runIntro()

    return () => clearTimeout(introTimer.current)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    plan: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requiredFilled = [formData.name, formData.email, formData.message]
    .filter((v) => v.trim()).length

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const pickChip = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Honeypot spam check
    const botcheckField = e.target.elements.botcheck?.value;
    if (botcheckField) {
      setFormStatus('Enquiry transmitted successfully. We will respond within 24 hours.');
      return;
    }

    sound.playTransmission()
    setIsSubmitting(true)
    setFormStatus('Transmitting enquiry...')

    // 2. Build FormData directly from the form and append required keys
    const data = new FormData(e.target);
    data.append("access_key", "0720abdd-5fb9-4159-8184-7b610ce7109f");
    data.append("subject", `New Project Enquiry from ${formData.name.trim()}`);
    data.append("from_name", "PROTOTYPE Studio");
    data.append("phone", formData.phone ? formData.phone.trim() : "Not provided");
    data.append("company", formData.company.trim() || "Not provided");
    data.append("service", formData.service || "Not selected");
    data.append("plan", formData.plan || "Not selected");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('Enquiry transmitted successfully. We will respond within 24 hours.');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          plan: '',
          message: '',
        });
        e.target.reset();
      } else {
        setFormStatus(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormStatus('Unable to connect. You can reach us directly at prototype.tech.webdev@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="prototype-app">
      {/* INTRO SCREEN with active skip button */}
      {showIntro && (
        <div className="intro-screen" key={introRun}>
          <div className="space-particles">
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                className={`particle particle-${i + 1}`}
              />
            ))}
          </div>

          <div className="planet-system">
            <div className="planet" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
          </div>

          <div className="hologram">
            <div className="intro-monogram">P</div>
            <div className="scan-line" />
          </div>

          <div className="intro-wordmark">
            PROTOTYPE
          </div>

          <div className="intro-caption">
            FROM IDEA TO INTERFACE
          </div>

          <button className="intro-skip-btn" onClick={handleSkipIntro}>
            SKIP INTRO ↗
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero-screen" id="home">
        <Navbar onLogoClick={replayIntro} />

        <div className="hero-content">
          <p className="availability">
            <span className="availability-dot" />
            ACCEPTING NEW CLIENT COMMISSIONS — Q1 2027
          </p>

          <p className="eyebrow">
            INDEPENDENT DIGITAL STUDIO
          </p>

          <h1>
            FROM IDEA
            <br />
            TO <span>INTERFACE.</span>
          </h1>

          <p className="hero-description">
            We architect and build precision-engineered websites and high-impact digital experiences for forward-thinking brands and founders.
          </p>

          <a href="#contact" className="hero-button">
            Start a project <span>↗</span>
          </a>

          {/* Item 5 fix: hero side note placed inside hero-screen container */}
          {/* <div className="hero-side-note">
            <span>OUR PHILOSOPHY</span>
            <h2>
              SPEED. PRECISION.
              <br />
              DISTINCTION.
            </h2>
          </div> */}
        </div>

        <div className="hero-footer">
          <span>DESIGN. DEVELOP. DEPLOY.</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* PERFORMANCE SCORECARD */}
      <PerformanceBadge />

      {/* SCROLLING MARQUEE */}
      <Marquee />

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="services-heading" data-reveal>
          <p className="section-label">
            WHAT WE DO
          </p>

          <h2>
            DIGITAL SOLUTIONS.
            <br />
            <span>BUILT WITH PURPOSE.</span>
          </h2>

          <p className="services-intro">
            PROTOTYPE blends clean component architecture with striking visual design to deliver websites that look exceptional and drive measurable action.
          </p>
        </div>

        <div className="services-grid">
          <TiltCard className="service-card" data-reveal="0">
            <Link to="/services/business-websites">
              <span className="service-number">01 / 03</span>
              <h3>Business Websites</h3>
              <p>
                Authoritative, high-performance websites engineered to establish strong brand presence and communicate services with clarity.
              </p>
              <span className="service-arrow">↗</span>
            </Link>
          </TiltCard>

          <TiltCard className="service-card" data-reveal="1">
            <Link to="/services/landing-pages">
              <span className="service-number">02 / 03</span>
              <h3>Landing Pages</h3>
              <p>
                Conversion-focused single-page experiences built to present offers clearly and turn visitors into qualified leads.
              </p>
              <span className="service-arrow">↗</span>
            </Link>
          </TiltCard>

          <TiltCard className="service-card" data-reveal="2">
            <Link to="/services/frontend-development">
              <span className="service-number">03 / 03</span>
              <h3>Custom Frontend</h3>
              <p>
                Tailored React web applications and modular interfaces with smooth interactions, clean code, and zero runtime bloat.
              </p>
              <span className="service-arrow">↗</span>
            </Link>
          </TiltCard>
        </div>
      </section>

      {/* WORK SECTION */}
      <section className="work-section" id="work">
        <div className="work-heading" data-reveal>
          <p className="section-label">
            SELECTED WORK
          </p>

          <h2>
            PROVEN CLIENT
            <br />
            <span>PRODUCTION.</span>
          </h2>

          <p className="work-intro">
            A showcase of digital products and client websites designed and shipped with rigorous attention to detail.
          </p>
        </div>

        {projects.filter((p) => !p.demo).map((project, index) => (
          <Fragment key={project.slug}>
            <div className="featured-project">
              <div className="project-image" data-reveal>
                <ProjectImage
                  src={project.cover.src}
                  alt={project.cover.alt}
                />
                <div className="project-image-overlay">
                  <span>
                    {index === 0 ? 'FEATURED CLIENT RELEASE' : 'CLIENT RELEASE'}
                  </span>
                </div>
              </div>

              <div className="project-info" data-reveal="1">
                <div>
                  <p className="project-number">
                    {String(index + 1).padStart(2, '0')} / LIVE CASE STUDY
                  </p>
                  <h3>
                    {project.titleTop}
                    <br />
                    <span>{project.titleBottom}</span>
                  </h3>
                </div>

                <div className="project-details">
                  <p className="project-category">
                    {project.category}
                  </p>
                  <p className="project-description">
                    {project.summary}
                  </p>

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="project-details-btn"
                    >
                      View Case Study <span>→</span>
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-project-btn"
                      >
                        Live Website <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {project.gallery.length > 0 && (
              <div className="project-gallery">
                {project.gallery.map((image, i) => (
                  <ProjectImage
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    data-reveal={i % 2}
                  />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </section>

      {/* TEMPLATES SECTION */}
      <section className="templates-section" id="templates">
        <div className="work-heading" data-reveal>
          <p className="section-label">DEMO SHOWCASES</p>
          <h2>
            INDUSTRY-SPECIFIC
            <br />
            <span>STARTING POINTS.</span>
          </h2>
          <p className="work-intro">
            Full-featured concept websites illustrating industry workflows. Select a foundation and we customize every layout and component to your brand.
          </p>
        </div>

        <div className="template-grid">
          {TEMPLATES.map((t, i) => {
            const body = (
              <>
                <div className="template-thumb">
                  {t.soon ? (
                    <div className="template-soon-placeholder">
                      <span className="template-soon">UPCOMING ARCHITECTURE</span>
                    </div>
                  ) : (
                    <ProjectImage src={t.img} alt={`${t.name} template preview`} />
                  )}
                </div>
                <div className="template-body">
                  <p className="template-industry">{t.industry}</p>
                  <h3>{t.name}</h3>
                  <p className="template-text">{t.text}</p>
                  {t.tags && (
                    <div className="project-tags">
                      {t.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                  {!t.soon && (
                    <span className="template-link">
                      Explore Concept <span>↗</span>
                    </span>
                  )}
                </div>
              </>
            )

            return t.soon ? (
              <div className="template-card is-soon" key={t.name} data-reveal={i}>
                {body}
              </div>
            ) : (
              <Link
                to={`/projects/${t.slug}`}
                className="template-card"
                key={t.slug}
                data-reveal={i}
              >
                {body}
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY PROTOTYPE SECTION */}
      <section className="trust-section">
        <div className="trust-heading">
          <p className="section-label">THE STUDIO STANDARD</p>
          <h2>
            BUILT FOR SCALE
            <br />
            <span>AND PERFORMANCE.</span>
          </h2>
          <p className="trust-intro">
            We avoid generic page builders. Every line of code is structured for sub-second speeds, flawless responsive behavior, and clear user conversions.
          </p>
        </div>

        <div className="trust-grid">
          <div className="trust-card">
            <div className="card-top">
              <span>01</span>
              <div className="card-line" />
            </div>
            <div className="trust-icon">◇</div>
            <h3>BESPOKE DESIGN</h3>
            <p>
              Custom visual identity crafted around your specific brand aesthetic rather than recycled templates.
            </p>
          </div>

          <div className="trust-card">
            <div className="card-top">
              <span>02</span>
              <div className="card-line" />
            </div>
            <div className="trust-icon">▣</div>
            <h3>FLUID RESPONSIVE</h3>
            <p>
              Engineered and tested rigorously across smartphones, tablets, high-res monitors, and foldables.
            </p>
          </div>

          <div className="trust-card">
            <div className="card-top">
              <span>03</span>
              <div className="card-line" />
            </div>
            <div className="trust-icon">◌</div>
            <h3>RAPID DELIVERY</h3>
            <p>
              Transparent sprint stages with working preview links and direct founder-level communication.
            </p>
          </div>

          <div className="trust-card">
            <div className="card-top">
              <span>04</span>
              <div className="card-line" />
            </div>
            <div className="trust-icon">{'</>'}</div>
            <h3>CLEAN STACK</h3>
            <p>
              Built with React, Vite, and modern CSS for instant loading, top-tier SEO, and low maintenance overhead.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="faq-heading" data-reveal>
          <p className="section-label">FREQUENTLY ASKED</p>
          <h2>
            CLARITY
            <br />
            <span>UP FRONT.</span>
          </h2>
        </div>

        <div className="faq-list">
          <details className="faq-item" data-reveal="0">
            <summary>
              <span>How are project budgets determined?</span>
              <b>+</b>
            </summary>
            <div className="faq-answer">
              <div>
                <p>
                  Every engagement is scoped with fixed, genuine pricing based on page volume, interactive features, and integration needs. You receive a complete scope document before any work begins.
                </p>
              </div>
            </div>
          </details>

          <details className="faq-item" data-reveal="1">
            <summary>
              <span>What is the standard turnaround timeline?</span>
              <b>+</b>
            </summary>
            <div className="faq-answer">
              <div>
                <p>
                  Focused landing pages and starter websites are delivered within 3–5 business days. Complex multi-page portals and interactive web apps generally deploy within 8–12 business days.
                </p>
              </div>
            </div>
          </details>

          <details className="faq-item" data-reveal="2">
            <summary>
              <span>Do I retain full ownership of the codebase?</span>
              <b>+</b>
            </summary>
            <div className="faq-answer">
              <div>
                <p>
                  Yes, 100%. Upon final project sign-off and balance completion, complete intellectual property, repository access, and production build files are transferred directly to you.
                </p>
              </div>
            </div>
          </details>

          <details className="faq-item" data-reveal="3">
            <summary>
              <span>How do domain and hosting arrangements work?</span>
              <b>+</b>
            </summary>
            <div className="faq-answer">
              <div>
                <p>
                  You retain direct ownership of your domain and hosting accounts for long-term independence. We configure the DNS, SSL, and hosting pipelines (such as Cloudflare Pages or Netlify) at no extra complication.
                </p>
              </div>
            </div>
          </details>
      </div>
      </section>

      {/* SCOPE CALCULATOR */}
      <section className="scope-calculator-section">
        <ScopeCalculator onApplyConfig={handleApplyScope} />
      </section>

      {/* INSTANT PROTOTYPE GENERATOR SECTION */}
      <section className="py-16 px-4 bg-[#06080c] border-t border-[#172033]">
        <div className="max-w-6xl mx-auto">
          <InstantPrototypeGenerator />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-heading" data-reveal>
          <p className="section-label">
            INITIATE ENGAGEMENT
          </p>

          <h2>
            HAVE A PROJECT?
            <br />
            <span>LET'S BUILD IT.</span>
          </h2>

          <p className="contact-intro">
            Tell us about your brand goals, target timeline, or desired deliverables. We review every brief and reply within 24 hours.
          </p>

          <div className="contact-direct">
            <a href="mailto:prototype.tech.webdev@gmail.com">
              prototype.tech.webdev@gmail.com
            </a>
            <a href="tel:+918957549660">
              +91 89575 49660
            </a>
          </div>
        </div>

        <form
          className="enquiry-card"
          onSubmit={handleSubmit}
          data-reveal="1"
        >
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

          <div className="enquiry-top">
            <span className="enquiry-status">
              <i /> DIRECT STUDIO INTAKE
            </span>
            <span className="enquiry-code">PRJ—{new Date().getFullYear()}</span>
          </div>

          <div className="enquiry-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${requiredFilled / 4})` }} />
          </div>

          <div className="enquiry-row">
            <div className="enquiry-field">
              <label htmlFor="enquiry-name"><b>01</b> YOUR NAME</label>
              <input
                id="enquiry-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="enquiry-field">
              <label htmlFor="enquiry-email"><b>02</b> EMAIL ADDRESS</label>
              <input
                id="enquiry-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="enquiry-row">
            <div className="enquiry-field">
              <label htmlFor="enquiry-phone"><b>03</b> PHONE NUMBER <em>optional</em></label>
              <input
                id="enquiry-phone"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="enquiry-field">
              <label htmlFor="enquiry-company"><b>04</b> COMPANY / BRAND <em>optional</em></label>
              <input
                id="enquiry-company"
                type="text"
                name="company"
                placeholder="Your organization or project name"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="enquiry-chips">
            <p><b>05</b> SERVICE DISCIPLINE <em>optional</em></p>
            <div>
              {ENQUIRY_SERVICES.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`chip ${formData.service === s ? 'is-active' : ''}`}
                  aria-pressed={formData.service === s}
                  onClick={() => pickChip('service', s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="enquiry-chips">
            <p><b>06</b> ESTIMATED TIER <em>optional</em></p>
            <div>
              {ENQUIRY_PLANS.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`chip ${formData.plan === p ? 'is-active' : ''}`}
                  aria-pressed={formData.plan === p}
                  onClick={() => pickChip('plan', p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="enquiry-field">
            <label htmlFor="enquiry-message"><b>07</b> PROJECT SUMMARY & GOALS</label>
            <textarea
              id="enquiry-message"
              name="message"
              placeholder="Briefly describe what you're building, target launch dates, or key features needed..."
              maxLength={600}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <small className="enquiry-count">{formData.message.length} / 600</small>
          </div>

          <div className="enquiry-send">
            <button
              type="submit"
              className="contact-button"
              disabled={isSubmitting}
              style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
            >
              {isSubmitting ? 'TRANSMITTING BRIEF...' : 'SEND PROJECT BRIEF'} <span>↗</span>
            </button>
            <p className="enquiry-note">GUARANTEED RESPONSE WITHIN 24 HOURS</p>
          </div>

          {formStatus && (
            <p className="form-status" role="status">
              {formStatus}
            </p>
          )}
        </form>
      </section>

      <Footer />
    </main>
  )
}

/* =================================
   PRICING PAGE (Truth & Tier Name Fixed)
================================= */

const TIERS = [
  {
    key: 'liftoff',
    tier: 'Tier 1',
    name: 'LIFTOFF',
    title: 'Essential Starter',
    days: '3–5',
    speed: 92,
    bestFor:
      'Founders and micro-businesses seeking a fast, professional first digital footprint.',
    features: [
      'High-conversion one-page site (4–5 key sections)',
      'Sub-second load times optimized for mobile browsers',
      'Direct WhatsApp, click-to-call, and email buttons',
      'Essential Google SEO setup and interactive Map integration',
    ],
    built: 'HTML5, Modern CSS, Lightweight JavaScript',
  },
  {
    key: 'orbit',
    tier: 'Tier 2',
    name: 'ORBIT',
    title: 'Dynamic Interactive',
    days: '5–8',
    speed: 72,
    bestFor:
      'Established businesses, hospitality venues, and agencies needing refined brand authority.',
    features: [
      'Interactive sliding galleries and category filters',
      'Fullscreen lightbox media inspection',
      'Client testimonials and interactive review carousels',
      'Client-side form field validation with smooth micro-interactions',
      'Custom theme styling matching your visual identity',
    ],
    built: 'React.js, Vite, Modern CSS',
    featured: true,
  },
  {
    key: 'deepspace',
    tier: 'Tier 3',
    name: 'DEEP SPACE',
    title: 'Advanced Features', // Standardized to match proposal PDF
    days: '8–12',
    speed: 52,
    bestFor:
      'High-volume enterprises and businesses requiring larger multi-page architecture and custom tools.',
    features: [
      'Larger multi-page website architecture',
      'Custom interactive calculators and specialized tools',
      'Enquiry and request forms with instant email alerts',
      'Full client ownership guidance for domain and hosting setup',
    ],
    built: 'React.js, Vite, Modern Component Architecture',
  },
]

const COMPARE_ROWS = [
  ['Pricing', 'Fixed project quotation', 'Fixed project quotation', 'Fixed project quotation'],
  ['Delivery Timeline', '3 to 5 business days', '5 to 8 business days', '8 to 12 business days'],
  ['Best For', 'New launches & single services', 'Established businesses & studios', 'Multi-page architecture & tools'],
  ['Technology Stack', 'HTML5, Modern CSS, Light JS', 'React.js + Vite', 'React.js + Vite (Advanced)'],
  ['Site Architecture', 'Focused single page (4-5 sections)', 'Multi-section interactive experience', 'Larger multi-page website'],
  ['Media Presentation', 'Responsive image grid', 'Interactive carousel & lightbox', 'Filterable galleries with modal detail'],
  ['Lead Capture', 'Direct WhatsApp & tap-to-call', 'Validated instant contact form', 'Forms with instant email alerts'],
]

const INCLUDED = [
  ['Hero & Brand Positioning', 'High-impact above-the-fold statement with clear primary calls to action.'],
  ['Portfolio & Showcase', 'Visual grids or sliders engineered to highlight facilities, dishes, or project work.'],
  ['Service Breakdowns', 'Transparent rate cards, service packages, and value propositions easy to scan.'],
  ['Trust Proofpoints', 'Customer testimonials, accreditation badges, and client satisfaction signals.'],
  ['Direct Inbound Channels', 'One-tap communication hooks (WhatsApp, phone, validated lead forms).'],
  ['Rigorous Standards', 'Tested across multiple viewports for zero layout shifts and high Lighthouse metrics.'],
]

const NOT_INCLUDED = [
  ['Domain & Cloud Hosting', 'Purchased directly by you to ensure complete client ownership and autonomy.'],
  ['Third-Party API Fees', 'Paid directly to respective providers (e.g., custom SMS gateways or external tooling).'],
]

function Pricing() {
  usePageMeta(
    'Transparent Pricing Packages — PROTOTYPE',
    'Clear, fixed website packages for businesses, studios, and founders. Lightning-fast turnaround and genuine pricing.'
  )

  return (
    <main className="service-page pricing-page">
      <ServiceNavbar />

      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>
          PACKAGES & DELIVERABLES — 2027
        </p>

        <h1 data-reveal="1">
          PREDICTABLE
          <br />
          <span>PACKAGES.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          Three clearly defined website tiers designed around specific stages of business growth. Fixed scopes, transparent timelines, and zero surprise fees.
        </p>

        <div className="pricing-stats" data-reveal="3">
          <div><strong>3</strong><span>STRUCTURED TIERS</span></div>
          <div><strong>100%</strong><span>FIXED QUOTES</span></div>
          <div><strong>3 – 12</strong><span>DAYS TO LAUNCH</span></div>
        </div>

        <Link to="/#contact" className="service-cta" data-reveal="3">
          Get your genuine quote <span>↗</span>
        </Link>
      </section>

      <section className="pricing-section" id="packages">
        <div className="work-heading" data-reveal>
          <p className="section-label">01 / CHOOSE YOUR TIER</p>
          <h2>
            CHOOSE YOUR
            <br />
            <span>STARTING POINT.</span>
          </h2>
          <p className="work-intro">
            Select the tier that fits your operational needs today. Every package is written cleanly so you can easily extend functionality tomorrow.
          </p>
        </div>

        <InteractivePricingEstimator />

        <div className="tier-grid">
          {TIERS.map((t, i) => (
            <article
              key={t.key}
              className={`tier-card ${t.featured ? 'is-featured' : ''}`}
              data-reveal={i}
            >
              {t.featured && <span className="tier-badge">RECOMMENDED</span>}

              <p className="tier-label">{t.tier}</p>
              <h3 className="tier-name">{t.name}</h3>
              <p className="tier-title">{t.title}</p>

              <div className="tier-launch">
                <div className="launch-top">
                  <span>ESTIMATED DELIVERY</span>
                  <strong>{t.days} BUSINESS DAYS</strong>
                </div>
                <div className="launch-track">
                  <span style={{ '--fill': `${t.speed}%` }} />
                </div>
              </div>

              <dl className="tier-meta">
                <div>
                  <dt>BEST FOR</dt>
                  <dd>{t.bestFor}</dd>
                </div>
              </dl>

              <p className="tier-label">INCLUDED CAPABILITIES</p>
              <ul className="tier-features">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <p className="tier-built">
                <span>TECH STACK:</span> {t.built}
              </p>

              <Link to="/#contact" className="tier-cta">
                Select {t.name} <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="compare">
        <div className="work-heading" data-reveal>
          <p className="section-label">02 / COMPARISON</p>
          <h2>
            SPECIFICATION
            <br />
            <span>BREAKDOWN.</span>
          </h2>
        </div>

        <div className="compare-scroll" data-reveal>
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                <th>LIFTOFF<small>Starter Tier</small></th>
                <th>ORBIT<small>Interactive Tier</small></th>
                <th>DEEP SPACE<small>Advanced Tier</small></th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(([label, a, b, c]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pricing-two-col">
          <div data-reveal>
            <p className="section-label">INCLUDED AS STANDARD</p>
            <div className="details-list pricing-list">
              {INCLUDED.map(([title, text]) => (
                <div className="detail-item" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="1">
            <p className="section-label">TRANSPARENT BOUNDARIES</p>
            <div className="details-list pricing-list">
              {NOT_INCLUDED.map(([title, text]) => (
                <div className="detail-item" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="service-project-cta">
        <p className="service-eyebrow" data-reveal>
          READY TO MOVE FORWARD?
        </p>

        <h2 data-reveal="1">
          LET'S SCOPE
          <br />
          <span>YOUR PROJECT.</span>
        </h2>

        <p data-reveal="2">
          Tell us about your venture and current goals. We will provide an exact, itemized scope breakdown.
        </p>

        <div className="contact-actions" data-reveal="3">
          <a href="mailto:prototype.tech.webdev@gmail.com" className="email-button">
            prototype.tech.webdev@gmail.com <span>↗</span>
          </a>
          <a href="tel:+918957549660" className="phone-link">
            +91 89575 49660
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/* =================================
   SERVICE PAGES
================================= */

function BusinessWebsites() {
  usePageMeta(
    'Business Websites — PROTOTYPE',
    'Modern, responsive business websites that establish market credibility and communicate your services clearly.'
  )
  return (
    <main className="service-page">
      <ServiceNavbar />
      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>01 / 03 — COMMERCIAL WEB PRESENCE</p>
        <h1 data-reveal="1">BUSINESS<br /><span>WEBSITES.</span></h1>
        <p className="service-page-description" data-reveal="2">
          We design and build bespoke, responsive web platforms that help growing businesses stand out, establish authority, and communicate value with crisp visual hierarchy.
        </p>
        <Link to="/#contact" className="service-cta" data-reveal="3">Start a project <span>↗</span></Link>
      </section>
      <section className="service-details">
        <div className="details-label">CORE CAPABILITIES</div>
        <div className="details-content">
          <h2>DIGITAL FOUNDATIONS<br /><span>ENGINEERED TO CONVERT.</span></h2>
          <DetailList items={[
            ['Editorial Visual Design', 'Clean typography, dark or light luxury palettes, and clear information flow structured around your audience.'],
            ['Responsive Precision', 'Pixel-perfect layout behavior across mobile devices, high-DPI tablets, laptops, and ultra-wide screens.'],
            ['Lead Generation Flow', 'Strategically positioned call-to-actions, enquiry modules, and interactive quotation calculators.'],
            ['Zero-Bloat Performance', 'Static build optimizations, modern asset compression, and clean DOM structures ensuring 95+ PageSpeed scores.'],
          ]} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

function LandingPages() {
  usePageMeta(
    'Landing Pages — PROTOTYPE',
    'High-impact landing pages engineered to present offers clearly and turn visitors into active clients.'
  )
  return (
    <main className="service-page">
      <ServiceNavbar />
      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>02 / 03 — FOCUSED CONVERSION</p>
        <h1 data-reveal="1">LANDING<br /><span>PAGES.</span></h1>
        <p className="service-page-description" data-reveal="2">
          Single-purpose, high-converting digital landing pages designed to showcase new product launches, digital services, or targeted marketing campaigns without distraction.
        </p>
        <Link to="/#contact" className="service-cta" data-reveal="3">Start a project <span>↗</span></Link>
      </section>
      <section className="service-details">
        <div className="details-label">WHAT WE DELIVER</div>
        <div className="details-content">
          <h2>PAGES CRAFTED TO<br /><span>DRIVE DEFINITIVE ACTION.</span></h2>
          <DetailList items={[
            ['Product Launch Pages', 'Compelling hero sections, feature grids, interactive benefit toggles, and instant order or demo funnels.'],
            ['Service & Lead Funnels', 'Distraction-free layouts that clearly articulate your value proposition and minimize friction in enquiry submissions.'],
            ['Ad-Campaign Optimized', 'Engineered with rapid sub-second initial load speeds to ensure minimal bounce rates from social and search ads.'],
          ]} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

function FrontendDevelopment() {
  usePageMeta(
    'Custom Frontend Development — PROTOTYPE',
    'Custom React interfaces and responsive frontend applications built with clean code and modern component architecture.'
  )
  return (
    <main className="service-page">
      <ServiceNavbar />
      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>03 / 03 — INTERFACE ENGINEERING</p>
        <h1 data-reveal="1">FRONTEND<br /><span>DEVELOPMENT.</span></h1>
        <p className="service-page-description" data-reveal="2">
          Modular, responsive, and maintainable React web applications crafted with modern build tooling, clean component hierarchies, and micro-interactions.
        </p>
        <Link to="/#contact" className="service-cta" data-reveal="3">Start a project <span>↗</span></Link>
      </section>
      <section className="service-details">
        <div className="details-label">TECHNICAL CAPABILITIES</div>
        <div className="details-content">
          <h2>MODERN CODEBASES.<br /><span>BUILT FOR EXTENSIBILITY.</span></h2>
          <DetailList items={[
            ['Modern React Architecture', 'Engineered using Vite, modular component patterns, hooks, and clean state handling.'],
            ['Interactive Dashboards', 'Data visualization, live timetable matrices, interactive calculators, and attendance tracking consoles.'],
            ['API Integration Ready', 'Effortless connection with RESTful APIs, cloud databases, and headless CMS platforms like Sanity or Contentful.'],
          ]} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

function NotFound() {
  usePageMeta('Page Not Found — PROTOTYPE', "The requested page does not exist.")
  return (
    <main className="service-page">
      <ServiceNavbar />
      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>404 — ERROR</p>
        <h1 data-reveal="1">PAGE NOT<br /><span>FOUND.</span></h1>
        <p className="service-page-description" data-reveal="2">The requested URL does not exist or has been relocated.</p>
        <Link to="/" className="service-cta" data-reveal="3">Back to home <span>↗</span></Link>
      </section>
      <Footer />
    </main>
  )
}

function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  usePageMeta(
    project ? `${project.titleTop} ${project.titleBottom.replace('.', '')} — Case Study | PROTOTYPE` : 'Page Not Found — PROTOTYPE',
    project ? project.pageSummary : "The requested project case study could not be found."
  )

  if (!project) return <NotFound />
  const showcaseImages = [project.cover, ...project.gallery]

  return (
    <main className="service-page project-page">
      <ServiceNavbar
        to={project.demo ? '/#templates' : '/#work'}
        label={project.demo ? '← BACK TO TEMPLATES' : '← BACK TO SELECTED WORK'}
      />
      <section className="service-hero">
        <p className="service-eyebrow" data-reveal>
          {String(projects.indexOf(project) + 1).padStart(2, '0')} / {project.demo ? 'DEMO SHOWCASE' : 'PRODUCTION RELEASE'}
        </p>
        <h1 data-reveal="1">{project.titleTop}<br /><span>{project.titleBottom}</span></h1>
        <p className="service-page-description" data-reveal="2">{project.pageSummary}</p>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="service-cta" data-reveal="3">
            Launch Live Demo <span>↗</span>
          </a>
        )}
      </section>
      <section className="service-details">
        <div className="details-label">ARCHITECTURE & HIGHLIGHTS</div>
        <div className="details-content">
          <h2>{project.overviewTop}<br /><span>{project.overviewBottom}</span></h2>
          <div className="details-list">
            {project.highlights.map((item) => (<span key={item}>{item}</span>))}
          </div>
        </div>
      </section>
      <section className="project-showcase">
        <div className="work-heading" data-reveal>
          <p className="section-label">INTERFACE INTERNALS</p>
          <h2>SCREENSHOT<br /><span>BREAKDOWN.</span></h2>
        </div>
        <div className="project-showcase-grid">
          {showcaseImages.map((image, i) => (
            <ProjectImage key={image.src} src={image.src} alt={image.alt} data-reveal={i % 2} />
          ))}
        </div>
      </section>
      <section className="service-project-cta">
        <p className="service-eyebrow" data-reveal>COMMISSION SIMILAR WORK</p>
        <h2 data-reveal="1">LET'S BUILD<br /><span>YOUR PLATFORM.</span></h2>
        <p data-reveal="2">{project.ctaText}</p>
        <Link to="/#contact" className="service-cta" data-reveal="3">Get in touch <span>↗</span></Link>
      </section>
      <Footer />
    </main>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView())
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function App() {
  const { pathname } = useLocation()
  useScrollReveal()
  useCursorEffects()

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <ChatWidget />
      <div className="page-fade" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/business-websites" element={<BusinessWebsites />} />
          <Route path="/services/landing-pages" element={<LandingPages />} />
          <Route path="/services/frontend-development" element={<FrontendDevelopment />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}
export default App