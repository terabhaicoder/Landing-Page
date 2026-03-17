import { useState, useEffect } from 'react'

export default function Header() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past the hero header area
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header-minimal ${visible ? 'header--visible' : ''}`}>
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
