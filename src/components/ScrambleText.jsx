import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

export default function ScrambleText({ text, className, delay = 0 }) {
    const [display, setDisplay] = useState(text)
    const elementRef = useRef(null)
    const originalText = useRef(text)
    const isScrambling = useRef(false)

    const scramble = (duration = 1) => {
        if (isScrambling.current) return
        isScrambling.current = true

        let obj = { p: 0 }

        gsap.to(obj, {
            p: 1,
            duration: duration,
            ease: 'none',
            onUpdate: () => {
                const progress = obj.p
                const result = originalText.current.split('').map((char, i) => {
                    if (progress * originalText.current.length > i) {
                        return char
                    }
                    return chars[Math.floor(Math.random() * chars.length)]
                }).join('')

                setDisplay(result)
            },
            onComplete: () => {
                isScrambling.current = false
                setDisplay(originalText.current)
            }
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            scramble(1.5)
        }, delay * 1000)

        return () => clearTimeout(timer)
    }, [delay])

    return (
        <span
            ref={elementRef}
            className={className}
            style={{ display: 'inline-block', cursor: 'default' }}
        >
            {display}
        </span>
    )
}
