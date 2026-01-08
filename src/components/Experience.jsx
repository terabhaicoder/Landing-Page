import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  {
    date: 'Jun 2025 — Present',
    title: 'Software Engineer',
    company: 'August Innovate',
    description: 'Architecting document processing pipelines for financial data using GCP and GenAI. Built a visual workflow editor with React Flow for configuring complex data flows.',
  },
]

export default function Experience() {
  const expRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.timeline-item', {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
      })
    }, expRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="experience" id="experience" ref={expRef}>
      <div className="section-header">
        <span className="section-number">04</span>
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">Where I've worked</p>
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
