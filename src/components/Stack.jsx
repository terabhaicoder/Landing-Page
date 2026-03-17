import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Stack() {
  const techs = ['Python', 'TypeScript', 'React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'LangChain', 'Next.js', 'MongoDB']
  const stackRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Base animation - slow smooth scroll
      const tl = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 45,
        repeat: -1,
      })

      // Velocity connection
      ScrollTrigger.create({
        trigger: stackRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          const timeScale = 1 + Math.abs(velocity / 50) // Speed up based on velocity

          gsap.to(tl, {
            timeScale: timeScale,
            duration: 0.5,
            overwrite: true,
            onComplete: () => {
              gsap.to(tl, { timeScale: 1, duration: 1 }) // Return to normal speed
            }
          })
        }
      })
    }, stackRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="stack" id="stack" ref={stackRef}>
      <div className="section-header">
        <span className="section-number">05</span>
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-subtitle">Tools I work with</p>
      </div>

      <div className="stack-marquee">
        <div className="marquee-track" ref={trackRef}>
          {[...techs, ...techs, ...techs, ...techs].map((tech, index) => (
            <span key={index}>
              <span className="marquee-item">{tech}</span>
              <span className="marquee-divider">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
