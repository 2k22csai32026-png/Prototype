import { useEffect, useRef, useState } from 'react'

const W = 360
const H = 540

function readBest() {
  try {
    return Number(localStorage.getItem('prototypeBest')) || 0
  } catch {
    return 0
  }
}

function saveBest(n) {
  try {
    localStorage.setItem('prototypeBest', String(n))
  } catch {
    /* ignore */
  }
}

function SpaceDodge() {
  const canvasRef = useRef(null)
  const startRef = useRef(() => {})
  const statusRef = useRef('ready')
  const bestRef = useRef(readBest())

  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(bestRef.current)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      s: Math.random() * 1.5 + 0.5,
    }))

    const ship = { x: W / 2, y: H - 60, r: 14 }
    const keys = { left: false, right: false }
    let rocks = []
    let targetX = W / 2
    let t = 0
    let frame = 0

    startRef.current = () => {
      rocks = []
      t = 0
      ship.x = W / 2
      targetX = W / 2
      statusRef.current = 'playing'
      setStatus('playing')
    }

    const endGame = () => {
      const final = Math.floor(t / 6)

      statusRef.current = 'over'
      setScore(final)
      setStatus('over')

      if (final > bestRef.current) {
        bestRef.current = final
        saveBest(final)
        setBest(final)
      }
    }

    const drawRock = (k) => {
      ctx.save()
      ctx.translate(k.x, k.y)
      ctx.rotate(k.rot)
      ctx.beginPath()

      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const rr = k.r * (0.82 + 0.18 * Math.sin(i * 2.3 + k.seed))
        const px = Math.cos(a) * rr
        const py = Math.sin(a) * rr

        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }

      ctx.closePath()
      ctx.fillStyle = '#242424'
      ctx.fill()
      ctx.strokeStyle = '#8f8f8f'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
    }

    const drawShip = (playing) => {
      ctx.save()
      ctx.translate(ship.x, ship.y)

      if (playing) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.4})`
        ctx.beginPath()
        ctx.moveTo(-5, 10)
        ctx.lineTo(0, 20 + Math.random() * 8)
        ctx.lineTo(5, 10)
        ctx.closePath()
        ctx.fill()
      }

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(0, -16)
      ctx.lineTo(12, 14)
      ctx.lineTo(0, 8)
      ctx.lineTo(-12, 14)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      frame = requestAnimationFrame(loop)

      const playing = statusRef.current === 'playing'

      /* background + stars */
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#ffffff'

      for (const s of stars) {
        s.y += s.s * (playing ? 1.2 : 0.3)

        if (s.y > H) {
          s.y = 0
          s.x = Math.random() * W
        }

        ctx.globalAlpha = 0.35 + s.s * 0.25
        ctx.fillRect(s.x, s.y, s.s, s.s)
      }

      ctx.globalAlpha = 1

      if (playing) {
        t += 1

        if (keys.left) targetX -= 6
        if (keys.right) targetX += 6

        targetX = Math.max(ship.r, Math.min(W - ship.r, targetX))
        ship.x += (targetX - ship.x) * 0.25

        const speed = 2 + t / 600
        const gap = Math.max(14, 42 - Math.floor(t / 120))

        if (t % gap === 0) {
          const r = 10 + Math.random() * 16

          rocks.push({
            x: r + Math.random() * (W - 2 * r),
            y: -r,
            r,
            v: speed + Math.random() * 1.5,
            rot: Math.random() * 6,
            seed: Math.random() * 10,
          })
        }

        for (const k of rocks) {
          k.y += k.v
          k.rot += 0.02
        }

        rocks = rocks.filter((k) => k.y < H + 40)

        for (const k of rocks) {
          const dist = Math.hypot(k.x - ship.x, k.y - ship.y)

          if (dist < k.r + ship.r - 5) {
            endGame()
            break
          }
        }
      }

      rocks.forEach(drawRock)

      if (statusRef.current !== 'over') drawShip(playing)

      /* score */
      ctx.fillStyle = '#9c9c9c'
      ctx.font = '12px Arial, sans-serif'
      ctx.fillText(`SCORE ${Math.floor(t / 6)}`, 16, 28)
    }

    loop()

    /* controls */
    const moveTo = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) * W) / rect.width
    }

    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true

      if (statusRef.current === 'playing') {
        if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        startRef.current()
      }
    }

    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false
    }

    canvas.addEventListener('pointermove', moveTo)
    canvas.addEventListener('pointerdown', moveTo)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('pointermove', moveTo)
      canvas.removeEventListener('pointerdown', moveTo)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div className="game-wrap">
      <div className="game-frame">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          style={{ aspectRatio: `${W} / ${H}` }}
          aria-label="Asteroid Dodge game"
        />

        {status !== 'playing' && (
          <div className="game-overlay">
            <p className="game-kicker">
              {status === 'over' ? 'GAME OVER' : 'MINI GAME'}
            </p>

            <h3>{status === 'over' ? `SCORE ${score}` : 'ASTEROID DODGE'}</h3>

            <p className="game-hint">
              Move your mouse or finger, or use the ← → keys. Dodge the
              asteroids for as long as you can.
            </p>

            <button
              type="button"
              className="game-btn"
              onClick={() => startRef.current()}
            >
              {status === 'over' ? 'PLAY AGAIN' : 'START'} <span>↗</span>
            </button>

            <p className="game-best">BEST {best}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpaceDodge