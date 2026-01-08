import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      })
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      })
    }

    const handleMouseEnter = () => {
      gsap.to(follower, {
        scale: 2,
        opacity: 0.5,
        duration: 0.3,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(follower, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      })
    }

    window.addEventListener('mousemove', moveCursor)

    const interactiveElements = document.querySelectorAll('a, button, .work-item')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor"></div>
      <div ref={followerRef} className="cursor-follower"></div>
    </>
  )
}
