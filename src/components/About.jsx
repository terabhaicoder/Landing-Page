import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const aboutRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-intro',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: '.about-content', start: 'top 95%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        }
      )

      gsap.fromTo('.about-body',
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: '.about-content', start: 'top 90%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        }
      )

      gsap.fromTo('.stat',
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: '.about-stats', start: 'top 95%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        }
      )
    }, aboutRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={aboutRef}>
      <div className="about-container">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">About</h2>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              I'm a 22-year-old software engineer who graduated from <span className="highlight">VIT Vellore</span> and moved straight to <span className="highlight">Bangalore</span> to build things at startups.
            </p>
            <p className="about-body">
              I love backend systems. The messier the problem, the more fun it is. APIs, event pipelines, data extraction, automation, that's my happy place. I ship fast, break things occasionally, and fix them before anyone notices.
            </p>
            <p className="about-body">
              Outside of work, I'm always building something on the side. ApplySurge, Eventzity... if there's a problem that annoys me enough, there's probably a repo for it somewhere.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">4+</span>
              <span className="stat-label">Products in Production</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Tabs Open</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Days Without Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
