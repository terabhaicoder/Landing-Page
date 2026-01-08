import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero
      setScrolled(window.scrollY > window.innerHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header-minimal ${scrolled ? 'header--light' : ''}`}>
      <nav className="nav-minimal">
        <div className="nav-links">
          <a href="#work" className="nav-link">Work</a>
          <a href="#about" className="nav-link">Info</a>
          <a href="#contact" className="nav-link">Connect</a>
        </div>
      </nav>
    </header>
  )
}
