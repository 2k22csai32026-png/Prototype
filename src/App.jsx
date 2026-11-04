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
import SpaceDodge from './SpaceDodge'
/* =================================
   PORTFOLIO DATA

   To add a new project:
   1. Put its images in /public/images/projects/
   2. Copy the PCP Media block and paste it after it
   3. Change the slug, text and image paths
================================= */

const projects = [
  {
    slug: 'pcp-media', // becomes /projects/pcp-media
    titleTop: 'PCP',
    titleBottom: 'MEDIA.',
    category: 'DIGITAL MARKETING AGENCY WEBSITE',

    summary:
      'A modern frontend website designed and developed for PCP Media, showcasing digital marketing services, creative work and brand identity through a premium visual experience.',

    pageSummary:
      'A modern frontend website designed and developed for a digital marketing agency, focused on presenting services, creative work and brand identity through a premium digital experience.',

    tags: ['WEB DESIGN', 'FRONTEND DEVELOPMENT', 'RESPONSIVE DESIGN'],

    // After converting to WebP (Step 4) change .png to .webp below
    cover: {
      src: '/images/projects/pcp-1.png',
      alt: 'PCP Media website project',
    },

    gallery: [
      { src: '/images/projects/pcp-2.png', alt: 'PCP Media project screenshot' },
      { src: '/images/projects/pcp-3.png', alt: 'PCP Media project screenshot' },
      { src: '/images/projects/pcp-4.png', alt: 'PCP Media project screenshot' },
      { src: '/images/projects/pcp-5.png', alt: 'PCP Media project screenshot' },
    ],

    overviewTop: 'A MODERN DIGITAL',
    overviewBottom: 'AGENCY EXPERIENCE.',
    highlights: [
      'Modern Website Design',
      'Responsive Frontend Development',
      'Digital Marketing Agency Interface',
      'Service & Portfolio Presentation',
      'Premium Visual Experience',
    ],

    ctaText:
      "Have an idea or business that needs a strong digital presence? Let's create something that makes an impact.",

    liveUrl: 'https://www.pcpmedia.in', // optional: add a link to show a "Live Site" button
  },
]

const MARQUEE_ITEMS = [
  'REACT',
  'RESPONSIVE',
  'FAST',
  'CLEAN CODE',
  'MODERN DESIGN',
  'BUILT TO LAUNCH',
]


/* =================================
   HOOKS & SMALL HELPERS
================================= */

/* Adds "is-visible" to any [data-reveal] element
   once it scrolls into view. Re-runs on every route. */
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

/* Cursor spotlight on service cards + magnetic buttons.
   Desktop mouse only — does nothing on touch screens. */
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
        /* spotlight */
        const card = target.closest ? target.closest('.service-card') : null

        if (card) {
          const rect = card.getBoundingClientRect()
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
          card.style.setProperty('--my', `${e.clientY - rect.top}px`)
        }

        /* magnetic buttons */
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
      document.documentElement.removeEventListener(
        'pointerleave',
        resetMagnets
      )
    }
  }, [])
}

/* Sets the browser tab title + description + share-card tags */
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

/* Thin progress line at the top of the screen */
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

/* Image with a soft blur-up while loading */
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

/* Scrolling keyword strip */
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
   HOME NAVBAR (mobile menu, sticky on mobile, logo replays intro)
================================= */

const NAV_ITEMS = [
  ['Home', '#home'],
  ['Services', '#services'],
  ['Work', '#work'],
  ['Pricing', '/pricing'],
  ['Contact', '#contact'],
]

function Navbar({ onLogoClick }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

          <a href="mailto:gaurav.official.018@gmail.com">
            gaurav.official.018@gmail.com
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
            Creating modern digital experiences from
            idea to interface.
          </p>
          <Link to="/play" className="footer-play">
            TAKE A BREAK: PLAY A GAME ↗
          </Link>
        </div>

        <div className="footer-connect">

          <p className="footer-kicker">HAVE A PROJECT IN MIND?</p>

          <h3>
            LET'S CREATE
            <br />
            <span>SOMETHING.</span>
          </h3>

          <div className="footer-contact-links">
            <a href="mailto:gaurav.official.018@gmail.com">
              gaurav.official.018@gmail.com ↗
            </a>

            <a href="tel:+918957549660">
              +91 89575 49660
            </a>
          </div>

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">

        <p>© 2026 PROTOTYPE</p>

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


/* =================================
   HOME PAGE
================================= */

function Home() {
  usePageMeta(
    'PROTOTYPE — Independent Digital Studio',
    'PROTOTYPE is an independent digital studio creating modern, responsive websites, landing pages and custom frontend experiences, from idea to interface.'
  )

  const [showIntro, setShowIntro] = useState(false)
  const [introRun, setIntroRun] = useState(0)
  const introTimer = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState('')

  const runIntro = () => {
    clearTimeout(introTimer.current)

    setIntroRun((n) => n + 1) // new key = animation restarts
    setShowIntro(true)

    introTimer.current = setTimeout(() => {
      setShowIntro(false)

      try {
        sessionStorage.setItem('prototypeIntroShown', 'true')
      } catch {
        /* ignore */
      }
    }, 3900)
  }

  const replayIntro = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    runIntro()
  }

  useEffect(() => {
    let introAlreadyShown = false

    try {
      introAlreadyShown = sessionStorage.getItem('prototypeIntroShown')
    } catch {
      /* storage unavailable — just show the intro */
    }

    if (!introAlreadyShown) runIntro()

    return () => clearTimeout(introTimer.current)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const subject = `New Project Enquiry from ${formData.name}`

    const body = `
Hello Gaurav,

You have received a new project enquiry through the PROTOTYPE website.

Name: ${formData.name}
Email: ${formData.email}
Company / Business: ${formData.company || 'Not provided'}

Project Details:
${formData.message}

Regards,
${formData.name}
    `.trim()

    const mailtoLink =
      `mailto:gaurav.official.018@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`

    setFormStatus('Opening your email application...')

    window.location.href = mailtoLink
  }

  return (
    <main className="prototype-app">

      {/* INTRO SCREEN */}
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

        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero-screen" id="home">

        <Navbar onLogoClick={replayIntro} />

        <div className="hero-content">

          <p className="availability">
            <span className="availability-dot" />
            AVAILABLE FOR NEW PROJECTS
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
            We create modern websites and digital experiences
            for ambitious businesses and individuals.
          </p>

          <a href="#contact" className="hero-button">
            Start a project <span>↗</span>
          </a>

        </div>

        <div className="hero-footer">
          <span>DESIGN. DEVELOP. DEPLOY.</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>

      </section>


      {/* SCROLLING STRIP */}
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
            PROTOTYPE creates modern, responsive digital experiences
            designed around your ideas, goals and brand.
          </p>

        </div>

        <div className="services-grid">

          <Link
            to="/services/business-websites"
            className="service-card"
            data-reveal="0"
          >
            <span className="service-number">
              01 / 03
            </span>

            <h3>Business Websites</h3>

            <p>
              Modern and responsive websites designed to give your
              business a strong digital presence.
            </p>

            <span className="service-arrow">↗</span>
          </Link>


          <Link
            to="/services/landing-pages"
            className="service-card"
            data-reveal="1"
          >
            <span className="service-number">
              02 / 03
            </span>

            <h3>Landing Pages</h3>

            <p>
              High-impact landing pages designed to clearly present
              your product, service or campaign and encourage visitors
              to take action.
            </p>

            <span className="service-arrow">↗</span>
          </Link>


          <Link
            to="/services/frontend-development"
            className="service-card"
            data-reveal="2"
          >
            <span className="service-number">
              03 / 03
            </span>

            <h3>Custom Frontend Development</h3>

            <p>
              Custom React interfaces and responsive frontend
              experiences built with clean code and attention
              to every detail.
            </p>

            <span className="service-arrow">↗</span>
          </Link>

        </div>

      </section>


      {/* PHILOSOPHY */}
      <div className="hero-side-note">

        <span>OUR PHILOSOPHY</span>

        <h2>
          BUILT TO MAKE
          <br />
          AN IMPACT.
        </h2>

      </div>


      {/* WORK SECTION */}
      <section className="work-section" id="work">

        <div className="work-heading" data-reveal>

          <p className="section-label">
            SELECTED WORK
          </p>

          <h2>
            PROJECTS WE'VE
            <br />
            <span>BUILT.</span>
          </h2>

          <p className="work-intro">
            A selection of digital experiences designed and developed
            around real businesses, brands and ideas.
          </p>

        </div>


        {/* One block per project — edit the projects array at the top to add more */}
        {projects.map((project, index) => (
          <Fragment key={project.slug}>

            <div className="featured-project">

              <div className="project-image" data-reveal>

                <ProjectImage
                  src={project.cover.src}
                  alt={project.cover.alt}
                />

                <div className="project-image-overlay">
                  <span>
                    {index === 0 ? 'FEATURED PROJECT' : 'PROJECT'}
                  </span>
                </div>

              </div>


              <div className="project-info" data-reveal="1">

                <div>

                  <p className="project-number">
                    {String(index + 1).padStart(2, '0')} / SELECTED WORK
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
                      View Project Details <span>→</span>
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-project-btn"
                      >
                        Live Site <span>↗</span>
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


      {/* CONTACT SECTION */}
      <section className="contact-section" id="contact">

        <div className="contact-heading" data-reveal>

          <p className="section-label">
            LET'S WORK TOGETHER
          </p>

          <h2>
            HAVE AN IDEA?
            <br />
            <span>LET'S BUILD IT.</span>
          </h2>

          <p className="contact-intro">
            Tell us about your project, business or idea.
            We'll get back to you as soon as possible.
          </p>

          <div className="contact-direct">

            <a href="mailto:gaurav.official.018@gmail.com">
              gaurav.official.018@gmail.com
            </a>

            <a href="tel:+918957549660">
              +91 89575 49660
            </a>

          </div>

        </div>


        <form
          className="contact-form"
          onSubmit={handleSubmit}
          data-reveal="1"
        >

          <div className="form-group">

            <label htmlFor="enquiry-name">YOUR NAME</label>

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


          <div className="form-group">

            <label htmlFor="enquiry-email">EMAIL ADDRESS</label>

            <input
              id="enquiry-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="enquiry-company">COMPANY / BUSINESS</label>

            <input
              id="enquiry-company"
              type="text"
              name="company"
              placeholder="Your company or business"
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label htmlFor="enquiry-message">TELL US ABOUT YOUR PROJECT</label>

            <textarea
              id="enquiry-message"
              name="message"
              placeholder="Describe your project or idea..."
              value={formData.message}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="contact-button"
          >
            SEND ENQUIRY <span>↗</span>
          </button>

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
   BUSINESS WEBSITES PAGE
================================= */

function BusinessWebsites() {
  usePageMeta(
    'Business Websites — PROTOTYPE',
    'Modern, responsive business websites that give your company a strong digital presence and communicate your brand with clarity.'
  )

  return (
    <main className="service-page">

      <ServiceNavbar />

      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          01 / 03 — DIGITAL PRESENCE
        </p>

        <h1 data-reveal="1">
          BUSINESS
          <br />
          <span>WEBSITES.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          We design and build modern, responsive websites that help
          businesses establish a strong digital presence and communicate
          their brand with clarity.
        </p>

        <a href="/#contact" className="service-cta" data-reveal="3">
          Start a project <span>↗</span>
        </a>

      </section>


      <section className="service-details">

        <div className="details-label">
          WHAT WE CREATE
        </div>

        <div className="details-content">

          <h2>
            A DIGITAL PRESENCE
            <br />
            BUILT FOR YOUR BUSINESS.
          </h2>

          <DetailList
            items={[
              [
                'Modern Website Design',
                'Clean, visually engaging website designs created around your brand, audience and business goals.',
              ],
              [
                'Responsive Development',
                'Websites designed to work smoothly across desktops, tablets and mobile devices.',
              ],
              [
                'Business & Corporate Websites',
                'Professional digital experiences that clearly communicate your services, values and brand identity.',
              ],
              [
                'Portfolio Websites',
                'Modern portfolio websites designed to showcase your work, projects and creative achievements.',
              ],
              [
                'Performance-Focused Frontend',
                'Fast, clean and responsive frontend experiences built with attention to usability and performance.',
              ],
            ]}
          />

        </div>

      </section>


      <section className="service-project-cta">

        <p className="service-eyebrow" data-reveal>
          HAVE A PROJECT IN MIND?
        </p>

        <h2 data-reveal="1">
          LET'S BUILD
          <br />
          <span>SOMETHING GREAT.</span>
        </h2>

        <p data-reveal="2">
          Tell us about your idea, business or project and let's create
          a digital experience that makes an impact.
        </p>

      </section>

      <Footer />

    </main>
  )
}


/* =================================
   LANDING PAGES
================================= */

function LandingPages() {
  usePageMeta(
    'Landing Pages — PROTOTYPE',
    'High-impact landing pages that present your product, service or campaign clearly and encourage visitors to take action.'
  )

  return (
    <main className="service-page">

      <ServiceNavbar />

      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          02 / 03 — FOCUSED EXPERIENCES
        </p>

        <h1 data-reveal="1">
          LANDING
          <br />
          <span>PAGES.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          High-impact landing pages designed to communicate your
          product, service or idea clearly and encourage visitors
          to take action.
        </p>

        <a href="/#contact" className="service-cta" data-reveal="3">
          Start a project <span>↗</span>
        </a>

      </section>


      <section className="service-details">

        <div className="details-label">
          WHAT WE CREATE
        </div>

        <div className="details-content">

          <h2>
            PAGES BUILT TO
            <br />
            <span>TURN VISITORS INTO ACTION.</span>
          </h2>

          <DetailList
            items={[
              [
                'Product Landing Pages',
                'Focused pages designed to clearly present your product, highlight its value and encourage visitors to take action.',
              ],
              [
                'Service Landing Pages',
                'Clear and engaging pages that explain your services and help potential clients understand exactly what you offer.',
              ],
              [
                'Campaign Pages',
                'High-impact pages created for marketing campaigns, promotions and launches with a strong focus on audience engagement.',
              ],
              [
                'Portfolio Landing Pages',
                'Visually engaging layouts designed to showcase your work, projects and creative identity in a professional way.',
              ],
              [
                'Conversion-Focused Layouts',
                'Strategic layouts designed to guide visitors toward meaningful actions such as contacting you, signing up or making an enquiry.',
              ],
            ]}
          />

        </div>

      </section>

      <Footer />

    </main>
  )
}


/* =================================
   FRONTEND DEVELOPMENT
================================= */

function FrontendDevelopment() {
  usePageMeta(
    'Custom Frontend Development — PROTOTYPE',
    'Custom React interfaces and responsive frontend experiences built with clean code and attention to every detail.'
  )

  return (
    <main className="service-page">

      <ServiceNavbar />

      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          03 / 03 — MODERN DEVELOPMENT
        </p>

        <h1 data-reveal="1">
          FRONTEND
          <br />
          <span>DEVELOPMENT.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          Modern, responsive and custom frontend interfaces built
          with clean code and attention to detail.
        </p>

        <a href="/#contact" className="service-cta" data-reveal="3">
          Start a project <span>↗</span>
        </a>

      </section>


      <section className="service-details">

        <div className="details-label">
          WHAT WE CREATE
        </div>

        <div className="details-content">

          <h2>
            CUSTOM INTERFACES.
            <br />
            <span>BUILT FOR THE WEB.</span>
          </h2>

          <DetailList
            items={[
              [
                'React Development',
                'Modern React-based interfaces built with reusable components, clean structure and smooth user experiences.',
              ],
              [
                'Responsive Frontend Interfaces',
                'Interfaces designed to work seamlessly across desktops, tablets and mobile devices.',
              ],
              [
                'Interactive UI Components',
                'Engaging interface elements and interactions that make your website feel modern, intuitive and polished.',
              ],
              [
                'Modern Website Development',
                'Custom frontend experiences developed with modern web technologies and careful attention to visual detail.',
              ],
              [
                'Performance-Focused Frontend',
                'Clean and efficient frontend development focused on fast loading, smooth performance and a reliable user experience.',
              ],
            ]}
          />

        </div>

      </section>

      <Footer />

    </main>
  )
}


/* =================================
   404 PAGE
================================= */

function NotFound() {
  usePageMeta(
    'Page not found — PROTOTYPE',
    "The page you're looking for doesn't exist or has moved."
  )

  return (
    <main className="service-page">

      <ServiceNavbar />

      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          404 — PAGE NOT FOUND
        </p>

        <h1 data-reveal="1">
          LOST IN
          <br />
          <span>SPACE.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          The page you're looking for doesn't exist or has moved.
          Let's get you back to somewhere familiar.
        </p>

        <Link to="/" className="service-cta" data-reveal="3">
          Back to home <span>↗</span>
        </Link>

      </section>

      <Footer />

    </main>
  )
}


/* =================================
   PROJECT DETAIL PAGE
   (one component for every project in the projects array)
================================= */

function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  usePageMeta(
    project
      ? `${project.titleTop} ${project.titleBottom.replace('.', '')} — Project | PROTOTYPE`
      : 'Page not found — PROTOTYPE',
    project
      ? project.pageSummary
      : "The page you're looking for doesn't exist or has moved."
  )

  if (!project) return <NotFound />

  const showcaseImages = [project.cover, ...project.gallery]

  return (
    <main className="service-page project-page">

      <ServiceNavbar to="/#work" label="← BACK TO WORK" />

      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          {String(projects.indexOf(project) + 1).padStart(2, '0')} / SELECTED WORK
        </p>

        <h1 data-reveal="1">
          {project.titleTop}
          <br />
          <span>{project.titleBottom}</span>
        </h1>

                <p className="service-page-description" data-reveal="2">
          {project.pageSummary}
        </p>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="service-cta"
            data-reveal="3"
          >
            View Live Site <span>↗</span>
          </a>
        )}

      </section>


      <section className="service-details">

        <div className="details-label">
          PROJECT OVERVIEW
        </div>

        <div className="details-content">

          <h2>
            {project.overviewTop}
            <br />
            <span>{project.overviewBottom}</span>
          </h2>

          <div className="details-list">
            {project.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

        </div>

      </section>


      <section className="project-showcase">

        <div className="work-heading" data-reveal>

          <p className="section-label">
            PROJECT SHOWCASE
          </p>

          <h2>
            INSIDE THE
            <br />
            <span>PROJECT.</span>
          </h2>

        </div>


        <div className="project-showcase-grid">
          {showcaseImages.map((image, i) => (
            <ProjectImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              data-reveal={i % 2}
            />
          ))}
        </div>

      </section>


      <section className="service-project-cta">

        <p className="service-eyebrow" data-reveal>
          HAVE A PROJECT IN MIND?
        </p>

        <h2 data-reveal="1">
          LET'S BUILD
          <br />
          <span>SOMETHING GREAT.</span>
        </h2>

        <p data-reveal="2">
          {project.ctaText}
        </p>

      </section>

      <Footer />

    </main>
  )
}

/* =================================
   PRICING PAGE
================================= */

const TIERS = [
  {
    key: 'liftoff',
    tier: 'Tier 1',
    name: 'LIFTOFF',
    title: 'Essential Starter',
    price: '₹5,000 – ₹6,500',
    delivery: '3–5 business days',
    bestFor:
      'New businesses that need a quick, professional first website.',
    features: [
      'One-page site, 4–5 sections: hero, about, offers, gallery, contact',
      'Loads fast on 4G / 5G phones',
      'WhatsApp chat, tap-to-call and email buttons',
      'Basic Google SEO set-up and a Google Maps embed',
    ],
    built: 'HTML5, CSS3, light JavaScript',
  },
  {
    key: 'orbit',
    tier: 'Tier 2',
    name: 'ORBIT',
    title: 'Dynamic Interactive',
    price: '₹7,000 – ₹8,500',
    delivery: '5–8 business days',
    bestFor:
      'Established local businesses: hotels, restaurants, studios showing client work.',
    features: [
      'Sliding galleries and category filters (e.g. Deluxe vs Executive)',
      'Tap a photo to view it full-screen',
      'Customer review slider',
      'Contact form that checks fields as you type',
      'Smooth animations, custom colours, mobile menu',
    ],
    built: 'React.js, Vite, modern CSS / Tailwind',
    featured: true,
  },
  {
    key: 'deepspace',
    tier: 'Tier 3',
    name: 'DEEP SPACE',
    title: 'Growth & Smart AI',
    price: '₹9,000 – ₹10,000',
    delivery: '8–12 business days',
    bestFor:
      'Businesses with many enquiries that want them handled automatically.',
    features: [
      'Booking requests with dates, guests and preferences',
      'Enquiries saved and emailed to you instantly',
      'AI assistant answers customer questions 24/7',
      'Filterable galleries and pop-up views',
      'Multi-section site with dynamic views',
    ],
    built: 'React.js, Flask / Node API, AI assistant',
  },
]

const COMPARE_ROWS = [
  ['Price', '₹5,000 – ₹6,500', '₹7,000 – ₹8,500', '₹9,000 – ₹10,000'],
  ['Ready in', '3 to 5 business days', '5 to 8 business days', '8 to 12 business days'],
  ['Best for', 'New launch, first website', 'Established local business', 'Growing, high enquiry volume'],
  ['Built with', 'HTML5, CSS3, simple JavaScript', 'React.js and Vite', 'React + backend API + AI'],
  ['Website layout', 'One landing page, 4–5 sections', 'Interactive, multi-section', 'Multi-section with dynamic views'],
  ['Photo gallery', 'Standard photo grid', 'Slider / carousel', 'Filterable, with pop-up views'],
  ['How customers reach you', 'WhatsApp and phone buttons', 'Validated contact form', 'Automated booking and lead system'],
  ['AI assistant', 'Not included', 'Optional extra, priced separately', 'Included, answers 24/7'],
]

const INCLUDED = [
  ['Hero & promise', 'A strong top banner that shows who you are, with clear buttons for customers to act.'],
  ['Photo gallery', 'Rooms, facilities, menus or finished work, shown beautifully.'],
  ['Services & prices', 'Service tiers, room types, amenities and rates that are easy to scan.'],
  ['Trust & reviews', 'Testimonials, guest reviews and badges that build confidence fast.'],
  ['Contact & map', 'Contact form, WhatsApp and phone buttons, and an embedded Google Map.'],
  ['Built to a standard', 'Every site meets strict standards for phone-friendliness, typography and speed.'],
]

const PROCESS = [
  ['Discovery', 'DAYS 1–2', 'We collect your brand colours, photos, service details and how you want customers to contact you.'],
  ['Layout preview', 'DAYS 3–4', 'We plan the layout and send you a private preview link so you can see it and give feedback.'],
  ['Build', 'DAYS 5–8', 'We code your site in HTML/CSS or React, adding the backend and AI if your package includes them.'],
  ['Test and handoff', 'FINAL DAYS', 'We test on many devices and hand over the complete code and files.'],
]

const NEEDS = [
  ['Brand look', 'Your logo and brand colours, if you have them.'],
  ['Photos', 'Pictures of rooms, food, premises or finished work.'],
  ['Service details', 'What you offer, plus your prices or rate cards.'],
  ['Contact preferences', 'WhatsApp, phone, email: how customers should reach you.'],
]

const PROMISES = [
  ['You own everything', 'All source code, assets and settings are yours once the project is signed off.'],
  ['You approve first', 'You review a private preview and approve it before the final handoff.'],
  ['Room to grow', 'Clean, modular code means new pages and features can be added later.'],
]

const NOT_INCLUDED = [
  ['Domain name and hosting', 'Bought and paid for by you, directly. This includes hosting for the Deep Space booking system.'],
  ['Domain and hosting set-up', 'Optional extra. We can do it for an additional fee.'],
  ['AI assistant on Orbit', 'Optional extra, priced separately. Included in Deep Space.'],
]

const GLOSSARY = [
  ['Responsive', 'Your site automatically fits phones, tablets and laptops.'],
  ['SEO', 'Small technical touches that help people find your business on Google.'],
  ['Landing page', 'One scrolling page that tells your whole story.'],
  ['Carousel', 'A gallery that slides sideways to show more photos.'],
  ['Lightbox', 'Tap a photo and it opens large, full-screen.'],
  ['Backend', 'The hidden part of a site that stores enquiries and emails you alerts. Used in the Deep Space package.'],
  ['AI assistant', 'A chat box that answers common customer questions by itself, day or night.'],
  ['Domain and hosting', 'Your domain is your web address (like yourbusiness.com). Hosting is the online space where your site lives. You pay for both directly. Setting them up for you is an optional extra.'],
]

function Pricing() {
  usePageMeta(
    'Pricing — PROTOTYPE',
    'Three clear website packages from ₹5,000 to ₹10,000 for hotels, restaurants, local services and creative studios. Plain prices, plain timelines.'
  )

  return (
    <main className="service-page pricing-page">

      <ServiceNavbar />

      {/* HERO */}
      <section className="service-hero">

        <p className="service-eyebrow" data-reveal>
          WEBSITE PRICING GUIDE — FY 2026-27
        </p>

        <h1 data-reveal="1">
          PICK A
          <br />
          <span>PACKAGE.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          Three clear website packages for hotels, restaurants, local
          services and creative studios. Plain prices, plain timelines,
          and a simple process from first hello to launch day.
        </p>

        <div className="pricing-stats" data-reveal="3">
          <div><strong>3</strong><span>PACKAGES TO CHOOSE FROM</span></div>
          <div><strong>₹5K – ₹10K</strong><span>PRICE RANGE</span></div>
          <div><strong>3 – 12</strong><span>BUSINESS DAYS TO DELIVER</span></div>
        </div>

        <a href="/#contact" className="service-cta" data-reveal="3">
          Book a project scoping chat <span>↗</span>
        </a>

      </section>


      {/* PACKAGES */}
      <section className="pricing-section" id="packages">

        <div className="work-heading" data-reveal>
          <p className="section-label">01 / PACKAGES</p>
          <h2>
            THREE WAYS
            <br />
            <span>TO START.</span>
          </h2>
          <p className="work-intro">
            Your website is a 24/7 storefront. It builds trust quickly and
            turns visitors into enquiries. Choose the stage your business
            is at, and we build to match.
          </p>
        </div>

        <div className="tier-grid">
          {TIERS.map((t, i) => (
            <article
              key={t.key}
              className={`tier-card ${t.featured ? 'is-featured' : ''}`}
              data-reveal={i}
            >
              {t.featured && <span className="tier-badge">MOST POPULAR</span>}

              <p className="tier-label">{t.tier}</p>
              <h3 className="tier-name">{t.name}</h3>
              <p className="tier-title">{t.title}</p>

              <p className="tier-price">{t.price}</p>

              <dl className="tier-meta">
                <div>
                  <dt>DELIVERY</dt>
                  <dd>{t.delivery}</dd>
                </div>
                <div>
                  <dt>BEST FOR</dt>
                  <dd>{t.bestFor}</dd>
                </div>
              </dl>

              <p className="tier-label">YOU GET</p>
              <ul className="tier-features">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <p className="tier-built">
                <span>BUILT WITH</span> {t.built}
              </p>

              <a href="/#contact" className="tier-cta">
                Choose {t.name} <span>↗</span>
              </a>
            </article>
          ))}
        </div>

        <p className="pricing-note" data-reveal>
          Prices don’t include a domain name or hosting. You buy these
          directly. Optional set-up help is available for an extra fee.
        </p>

        <div className="pricing-helper" data-reveal>
          <p className="section-label">NOT SURE WHICH ONE FITS?</p>
          <div className="helper-grid">
            <div><span>I’m just starting out</span><strong>Choose LIFTOFF</strong></div>
            <div><span>I’m established and want a polished, interactive site</span><strong>Choose ORBIT</strong></div>
            <div><span>I get many enquiries and want automation</span><strong>Choose DEEP SPACE</strong></div>
          </div>
        </div>

      </section>


      {/* COMPARE */}
      <section className="pricing-section" id="compare">

        <div className="work-heading" data-reveal>
          <p className="section-label">02 / COMPARE</p>
          <h2>
            SIDE
            <br />
            <span>BY SIDE.</span>
          </h2>
          <p className="work-intro">
            The same information in one table. Look across a row to see
            what changes as you move up.
          </p>
        </div>

        <div className="compare-scroll" data-reveal>
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                <th>LIFTOFF<small>Essential Starter</small></th>
                <th>ORBIT<small>Dynamic Interactive</small></th>
                <th>DEEP SPACE<small>Growth &amp; Smart AI</small></th>
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
            <p className="section-label">INCLUDED IN EVERY PACKAGE</p>
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
            <p className="section-label">NOT INCLUDED IN THE PRICE</p>
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


      {/* PROCESS */}
      <section className="pricing-section" id="process">

        <div className="work-heading" data-reveal>
          <p className="section-label">03 / PROCESS</p>
          <h2>
            FROM HELLO
            <br />
            <span>TO DONE.</span>
          </h2>
          <p className="work-intro">
            Four simple steps. You always know what is happening, and you
            approve the site before it is handed over.
          </p>
        </div>

        <div className="process-grid">
          {PROCESS.map(([title, days, text], i) => (
            <div className="process-step" key={title} data-reveal={i}>
              <span className="process-num">{i + 1}</span>
              <p className="process-days">{days}</p>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <p className="pricing-note" data-reveal>
          These day numbers show a larger build. Smaller packages finish
          sooner; each package’s delivery time is shown above.
        </p>

        <div className="pricing-two-col">

          <div data-reveal>
            <p className="section-label">WHAT WE NEED FROM YOU</p>
            <div className="details-list pricing-list">
              {NEEDS.map(([title, text], i) => (
                <div className="detail-item" key={title}>
                  <h3>0{i + 1} — {title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="1">
            <p className="section-label">HOW PAYMENT WORKS</p>
            <div className="payment-split">
              <div>
                <strong>50%</strong>
                <span>Advance, to start the project</span>
              </div>
              <div>
                <strong>50%</strong>
                <span>Balance, after you approve the preview</span>
              </div>
            </div>
            <p className="pricing-note pricing-note-left">
              You pay the balance after you have seen and approved the final
              preview, and before we hand over the finished site.
            </p>

            <p className="section-label" style={{ marginTop: 50 }}>
              OUR PROMISES
            </p>
            <div className="details-list pricing-list">
              {PROMISES.map(([title, text]) => (
                <div className="detail-item" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>


      {/* GLOSSARY */}
      <section className="pricing-section" id="good-to-know">

        <div className="work-heading" data-reveal>
          <p className="section-label">04 / GOOD TO KNOW</p>
          <h2>
            PLAIN-ENGLISH
            <br />
            <span>GUIDE.</span>
          </h2>
          <p className="work-intro">
            A few web terms you may hear from us, explained simply.
          </p>
        </div>

        <div className="glossary-grid">
          {GLOSSARY.map(([term, text], i) => (
            <div className="glossary-item" key={term} data-reveal={i % 2}>
              <h3>{term}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>

      </section>


      {/* CTA */}
      <section className="service-project-cta">

        <p className="service-eyebrow" data-reveal>
          READY WHEN YOU ARE
        </p>

        <h2 data-reveal="1">
          LET’S SCOPE
          <br />
          <span>YOUR PROJECT.</span>
        </h2>

        <p data-reveal="2">
          Schedule a short project scoping discussion. Tell us about your
          business and we will recommend the package that fits.
        </p>

        <div className="contact-actions" data-reveal="3">
          <a href="mailto:gaurav.official.018@gmail.com" className="email-button">
            gaurav.official.018@gmail.com <span>↗</span>
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
   PLAY PAGE (mini game)
================================= */

function Play() {
  usePageMeta(
    'Take a Break — PROTOTYPE',
    'A tiny space game from PROTOTYPE. Dodge the asteroids and beat your best score.'
  )

  return (
    <main className="service-page">

      <ServiceNavbar />

      <section className="service-hero game-hero">

        <p className="service-eyebrow" data-reveal>
          TAKE A BREAK
        </p>

        <h1 data-reveal="1">
          ASTEROID
          <br />
          <span>DODGE.</span>
        </h1>

        <p className="service-page-description" data-reveal="2">
          A tiny game built with the same care as our websites. How long
          can you survive?
        </p>

        <SpaceDodge />

      </section>

      <Footer />

    </main>
  )
}
/* =================================
   SCROLL HANDLING
   - new page → scroll to top
   - /#work style links → scroll to that section
================================= */
/* =================================
   FLOATING GAME BUTTON
================================= */

function GameLauncher() {
  const { pathname } = useLocation()

  if (pathname === '/play') return null

  return (
    <Link
      to="/play"
      className="game-launcher"
      title="Play a game"
      aria-label="Play a mini game"
    >
      <svg viewBox="0 0 64 40" width="30" height="19" aria-hidden="true">
        {/* controller body */}
        <path
          d="M16 4 H48 C57 4 62 14 62 26 C62 33 58 37 53 37 C48 37 46 33 43 30 H21 C18 33 16 37 11 37 C6 37 2 33 2 26 C2 14 7 4 16 4 Z"
          fill="#f2f2f2"
          stroke="#9c9c9c"
          strokeWidth="1.5"
        />
        {/* d-pad */}
        <rect x="12" y="15" width="12" height="4" rx="1" fill="#0a0a0a" />
        <rect x="16" y="11" width="4" height="12" rx="1" fill="#0a0a0a" />
        {/* buttons */}
        <circle cx="45" cy="13" r="2.8" fill="#0a0a0a" />
        <circle cx="52" cy="19" r="2.8" fill="#0a0a0a" />
        <circle className="game-led" cx="32" cy="14" r="2" fill="#4ade80" />
      </svg>
    </Link>
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


/* =================================
   APP ROUTES
================================= */

function App() {
  const { pathname } = useLocation()

  useScrollReveal()
  useCursorEffects()

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <ChatWidget />
      <GameLauncher />

      {/* key = pathname → quick fade on every page change */}
      <div className="page-fade" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/services/business-websites"
            element={<BusinessWebsites />}
          />

          <Route
            path="/services/landing-pages"
            element={<LandingPages />}
          />

          <Route
            path="/services/frontend-development"
            element={<FrontendDevelopment />}
          />

          <Route
            path="/projects/:slug"
            element={<ProjectPage />}
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/play" element={<Play />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App