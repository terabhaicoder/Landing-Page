import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Matter from 'matter-js'

// Physics-enabled skill cards - split into left and right
const leftCards = [
  { label: 'React', color: '#61DAFB', bg: '#E1F5FE' },
  { label: 'Node.js', color: '#43A047', bg: '#E8F5E9' },
  { label: 'TypeScript', color: '#3178C6', bg: '#E3F2FD' },
  { label: 'Python', color: '#3776AB', bg: '#FFF8E1' },
  { label: 'AWS', color: '#FF9900', bg: '#FFF3E0' },
  { label: 'Docker', color: '#2496ED', bg: '#E3F2FD' },
]

const rightCards = [
  { label: 'PostgreSQL', color: '#336791', bg: '#E8EAF6' },
  { label: 'Redis', color: '#DC382D', bg: '#FFEBEE' },
  { label: 'GraphQL', color: '#E535AB', bg: '#FCE4EC' },
  { label: 'Next.js', color: '#000000', bg: '#F5F5F5' },
  { label: 'MongoDB', color: '#47A248', bg: '#E8F5E9' },
  { label: 'Kafka', color: '#231F20', bg: '#EFEBE9' },
]

function PhysicsCards({ cards, side }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [cardPositions, setCardPositions] = useState([])

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter

    const container = containerRef.current
    const width = container.offsetWidth
    const height = container.offsetHeight

    // Create engine with NO gravity - cards float!
    const engine = Engine.create({
      gravity: { x: 0, y: 0 }
    })

    // Create renderer (invisible - we render our own labels)
    const render = Render.create({
      element: container,
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    })

    // Create soft walls (cards bounce back gently)
    const wallThickness = 100
    const wallOptions = {
      isStatic: true,
      restitution: 0.5,
      friction: 0,
      render: { visible: false },
      collisionFilter: { category: 0x0001 }
    }
    const walls = [
      Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, wallOptions),
      Bodies.rectangle(width / 2, -wallThickness / 2, width + 200, wallThickness, wallOptions),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + 200, wallOptions),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + 200, wallOptions),
    ]

    // Create card bodies - each card gets unique collision category so they don't collide with each other
    const cardBodies = cards.map((card, i) => {
      const cardWidth = card.label.length * 9 + 40
      const cardHeight = 36

      // Single column layout - stack vertically with good spacing
      const totalCards = cards.length
      const verticalSpacing = (height - 100) / totalCards

      // Alternate left/right positioning for visual interest
      const xOffset = (i % 2 === 0) ? width * 0.3 : width * 0.7
      const x = xOffset + (Math.random() - 0.5) * 40
      const y = 60 + i * verticalSpacing + (Math.random() - 0.5) * 20

      // Each card has its own category (bit shifted) - only collides with walls (0x0001)
      const cardCategory = 0x0002 << i

      const body = Bodies.rectangle(x, y, cardWidth, cardHeight, {
        chamfer: { radius: 18 },
        restitution: 0.4,
        friction: 0,
        frictionAir: 0.05,
        render: {
          fillStyle: card.bg,
          strokeStyle: card.color,
          lineWidth: 2
        },
        label: card.label,
        cardIndex: i,
        // Only collide with walls, not other cards
        collisionFilter: {
          category: cardCategory,
          mask: 0x0001 // Only collide with walls
        }
      })

      // Gentle initial rotation
      Body.setAngle(body, (Math.random() - 0.5) * 0.2)

      return body
    })

    Composite.add(engine.world, [...walls, ...cardBodies])

    // Smooth mouse control
    const mouse = Mouse.create(canvasRef.current)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.2,
        render: { visible: false }
      },
      // Mouse can interact with all cards
      collisionFilter: {
        mask: 0xFFFFFFFF
      }
    })
    mouse.pixelRatio = window.devicePixelRatio
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    // Store home positions for each card
    const homePositions = cardBodies.map(body => ({
      x: body.position.x,
      y: body.position.y
    }))

    // Add gentle floating motion + home position pull
    let time = 0
    let animationId
    Events.on(engine, 'beforeUpdate', () => {
      time += 0.012
      cardBodies.forEach((body, i) => {
        // Only apply forces if not being dragged
        if (mouseConstraint.body !== body) {
          // Unique phase offset per card for organic movement
          const phase = i * 2.1 + (side === 'left' ? 0 : Math.PI)
          const floatX = Math.sin(time * 0.3 + phase) * 0.012
          const floatY = Math.cos(time * 0.25 + phase * 0.7) * 0.012

          // Gentle pull back toward home position
          const home = homePositions[i]
          const dx = home.x - body.position.x
          const dy = home.y - body.position.y
          const homeForceX = dx * 0.0003
          const homeForceY = dy * 0.0003

          Body.applyForce(body, body.position, {
            x: floatX + homeForceX,
            y: floatY + homeForceY
          })

          // Very gentle rotation drift
          const targetAngle = Math.sin(time * 0.2 + phase) * 0.1
          Body.setAngularVelocity(body, (targetAngle - body.angle) * 0.01)
        }
      })
    })

    // Update positions for React labels
    const updatePositions = () => {
      const positions = cardBodies.map(body => ({
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
        index: body.cardIndex
      }))
      setCardPositions(positions)
      animationId = requestAnimationFrame(updatePositions)
    }

    // Run
    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)
    updatePositions()

    return () => {
      cancelAnimationFrame(animationId)
      Render.stop(render)
      Runner.stop(runner)
      Events.off(engine, 'beforeUpdate')
      Engine.clear(engine)
    }
  }, [cards, side])

  return (
    <div ref={containerRef} className="physics-cards-container">
      <canvas ref={canvasRef} className="physics-canvas" />
      {cardPositions.map((pos, i) => (
        <div
          key={i}
          className="physics-label"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad) translate(-50%, -50%)`,
            '--label-color': cards[pos.index].color,
            '--label-bg': cards[pos.index].bg,
          }}
        >
          {cards[pos.index].label}
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo('.hero-header-left',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.2 }
    )
      .fromTo('.hero-header-center',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo('.hero-header-right',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo('.hero-photo-container',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2 },
        '-=0.4'
      )
      .fromTo('.photo-text-ring',
        { opacity: 0, rotate: -30 },
        { opacity: 1, rotate: 0, duration: 1 },
        '-=0.8'
      )
      .fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo('.physics-cards-container',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo('.hero-buttons a',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo('.hero-socials a',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
        '-=0.3'
      )

    // Continuous slow rotation of the text ring
    gsap.to('.photo-text-ring', {
      rotate: 360,
      duration: 60,
      repeat: -1,
      ease: 'none'
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section className="hero-light" id="hero" ref={heroRef}>
      {/* Header bar */}
      <div className="hero-header">
        <div className="hero-header-left">
          <span className="flag">🇮🇳</span>
          <span className="location-info">Bangalore, India</span>
        </div>
        <div className="hero-header-center">
          <span className="logo-name">Paarth Panthri</span>
        </div>
        <div className="hero-header-right">
          <span className="status-dot"></span>
          <span className="status-text">Available for work</span>
        </div>
      </div>

      {/* Main content - three column layout */}
      <div className="hero-main-new">
        {/* Left - Physics Cards */}
        <div className="hero-side hero-side--left">
          <PhysicsCards cards={leftCards} side="left" />
        </div>

        {/* Center - Photo and Info */}
        <div className="hero-center">
          <div className="hero-photo-container">
            {/* Rotating text ring */}
            <svg className="photo-text-ring" viewBox="0 0 300 300">
              <defs>
                <path
                  id="circlePath"
                  d="M 150, 150 m -120, 0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
                />
              </defs>
              <text className="ring-text">
                <textPath href="#circlePath">
                  WRITES CODE • SHIPS PRODUCTS • BREAKS THINGS • FIXES THEM •
                </textPath>
              </text>
            </svg>

            {/* Photo */}
            <div className="hero-photo">
              <img src="/paarth.png" alt="Paarth Panthri" />
            </div>
          </div>

          <h1 className="hero-title">I build things for the internet</h1>

          <p className="hero-subtitle">
            Developer at early-stage startups. I like shipping fast and figuring things out along the way.
          </p>

          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              Let's Work Together
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#work" className="btn-secondary">
              View My Work
            </a>
          </div>

          <div className="hero-socials">
            <a href="https://github.com/terabhaicoder" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/paarth-panthri-1b01b2317/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

          </div>
        </div>

        {/* Right - More Physics Cards */}
        <div className="hero-side hero-side--right">
          <PhysicsCards cards={rightCards} side="right" />
        </div>
      </div>

      {/* Worked With - Simple centered list */}
      <div className="hero-worked-with">
        <span className="worked-label">Worked with</span>
        <div className="worked-logos">
          <span className="worked-logo">Eventzity</span>
          <span className="worked-divider">/</span>
          <span className="worked-logo">ApplySurge</span>
          <span className="worked-divider">/</span>
          <span className="worked-logo">ProcessPay</span>
          <span className="worked-divider">/</span>
          <span className="worked-logo">Procesync</span>
        </div>
      </div>
    </section>
  )
}
