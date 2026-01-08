import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    name: 'Procesync',
    domain: 'procesync.ai',
    image: '/procesync.png',
    description: 'Keeps your data in sync across tools. Works in the background.',
    link: 'https://procesync.ai'
  },
  {
    id: 2,
    name: 'ProcessPay',
    domain: 'processpay.ai',
    image: '/processpay.png',
    description: 'Payment infrastructure for startups. Handles the boring stuff so you don\'t have to.',
    link: 'https://processpay.ai'
  },
  {
    id: 3,
    name: 'Eventzity',
    domain: 'eventzity.com',
    image: '/eventzity.png',
    description: 'AI-powered event planning platform. Find venues, vendors, and make events happen.',
    link: 'https://eventzity.com/'
  },
  {
    id: 4,
    name: 'Sorting Visualizer',
    domain: 'sorting-visualizer-tan-tau.vercel.app',
    image: '/sorting-visualizer.png',
    description: 'Interactive visualization of sorting algorithms. Watch them in action.',
    link: 'https://sorting-visualizer-tan-tau.vercel.app/'
  },
]

export default function Work() {
  const workRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.work-header', {
        scrollTrigger: {
          trigger: '.work-header',
          start: 'top 88%',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      })

      // Staggered card reveal
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }, workRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="work-section" id="work" ref={workRef}>
      <div className="work-container">
        <div className="work-header">
          <span className="work-label">01</span>
          <h2 className="work-title">Selected Work</h2>
          <p className="work-subtitle">Projects I'm proud of</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
            >
              <div className="project-image">
                <img src={project.image} alt={project.name} />
              </div>
              <div className="project-content">
                <h3 className="project-name">{project.name}</h3>
                <span className="project-domain">{project.domain}</span>
                <p className="project-description">{project.description}</p>
                <span className="project-link">
                  View Live
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
