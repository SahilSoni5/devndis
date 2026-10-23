import { useEffect, useRef, useState } from 'react'
import { SOCIALS } from './content.js'

function Clock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }))
    u(); const id = setInterval(u, 30000); return () => clearInterval(id)
  }, [])
  return <>Mumbai · IST {t}</>
}

const Row = ({ children, rev }) => (
  <div className={'foot-row' + (rev ? ' rev' : '')} aria-hidden="true">
    <div>{[0, 1].map(k => <span key={k}>{Array.from({ length: 3 }, (_, i) => <b key={i}>{children}</b>)}</span>)}</div>
  </div>
)

export default function Footer() {
  const ref = useRef(null), orb = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: .15 })
    io.observe(el)
    if (!matchMedia('(hover: hover)').matches) return () => io.disconnect()
    const move = (e) => {
      const r = el.getBoundingClientRect()
      orb.current.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`
      orb.current.style.opacity = 1
    }
    const leave = () => { orb.current.style.opacity = 0 }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { io.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [])
  const link = (s) => <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{s.label}</a>
  return (
    <footer className="foot" ref={ref}>
      <div className="foot-orb" ref={orb} aria-hidden="true" />
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-cta" data-rise="0"><p>Have a project in mind?</p><a className="foot-pill" href="#contact">Let's talk</a></div>
          <nav className="foot-links" aria-label="Social" data-rise="1">{SOCIALS.slice(0, 2).map(link)}</nav>
          <nav className="foot-links" aria-label="Contact" data-rise="2">{SOCIALS.slice(2).map(link)}</nav>
          <a className="foot-top-btn" href="#top" data-rise="3"><i aria-hidden="true" />Back to top</a>
        </div>
      </div>
      <div className="foot-marquee" data-rise="1">
        <Row rev><img src="/logo-white.svg" alt="" className="brand-logo foot-logo" /></Row>
      </div>
      <div className="wrap foot-base">
        <span>© 2026 DEVNDIS Studio. All rights reserved.</span>
        <span><Clock /></span>
      </div>
    </footer>
  )
}
