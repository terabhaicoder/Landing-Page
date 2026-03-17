import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AmbientBackground from './components/AmbientBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Experience from './components/Experience'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.fromTo(header,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: { trigger: header, start: 'top 95%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="app">
      <AmbientBackground />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
