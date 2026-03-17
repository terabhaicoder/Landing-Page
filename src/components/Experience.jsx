import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  {
    date: 'Jun 2025 — Present',
    title: 'Software Developer',
    company: 'August Innovate',
    description: 'Building workflow engines, document pipelines, and LLM-powered extraction systems. The kind of backend work where you process 200+ docs a day and serve enterprise clients like Blinkit and Zomato.',
  },
  {
    date: 'Jul 2021 — May 2025',
    title: 'B.Tech Computer Science',
    company: 'VIT Vellore',
    description: 'Four years of learning, building, and breaking things. Graduated with an 8.74 CGPA and an Air Force scholarship.',
  },
]

export default function Experience() {
  const expRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.timeline-item',
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
        }
      )
    }, expRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="experience" id="experience" ref={expRef}>
      <div className="section-header">
        <span className="section-number">04</span>
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">the journey so far</p>
      </div>

      <div className="timeline">
        {timeline.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <span className="timeline-date">{item.date}</span>
              <h3 className="timeline-title">{item.title}</h3>
              <span className="timeline-company">{item.company}</span>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
