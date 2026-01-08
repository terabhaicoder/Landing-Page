import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const aboutRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-intro', {
        scrollTrigger: {
          trigger: '.about-content',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from('.about-body', {
        scrollTrigger: {
          trigger: '.about-content',
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      gsap.from('.stat', {
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      })
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
              I'm a software engineer based in <span className="highlight">Bangalore</span>, currently building backend systems and full-stack products at early-stage startups.
            </p>
            <p className="about-body">
              I'm drawn to problems that aren't obvious at first glance, the kind where you need to dig in, experiment, and iterate before things click. Working in startups has shaped how I build: move fast, take ownership, and ship things that actually work in production.
            </p>
            <p className="about-body">
              When I'm not shipping, I'm usually exploring new tech, building side projects, or going down rabbit holes around backend systems, data pipelines, and architecture.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
