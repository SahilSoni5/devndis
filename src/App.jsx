import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Hero from './Hero.jsx'
import DesignLab from './DesignLab.jsx'
import { Marquee, Capabilities, Work, Values, Contact } from './Sections.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

function Intro({ done }) {
  return (
    <motion.div className="intro" exit={{ y: '-100%' }} transition={{ duration: .9, ease: [0.76, 0, 0.24, 1] }} aria-hidden="true">
      <div className="intro-word">
        <motion.img
          src="/logo-white.png"
          alt=""
          className="intro-logo"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="intro-bar"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} onAnimationComplete={done} /></div>
    </motion.div>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const [intro, setIntro] = useState(!reduced)
  const [menu, setMenu] = useState(false)
  const [hide, setHide] = useState(false)
  useEffect(() => {
    let last = scrollY
    const on = () => { const y = scrollY; setHide(y > last && y > 500); last = y }
    addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover)').matches) return
    const g = document.querySelector('.cursor-glow')
    const m = (e) => { g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; g.style.opacity = 1 }
    addEventListener('pointermove', m, { passive: true }); return () => removeEventListener('pointermove', m)
  }, [reduced])
  useEffect(() => { const t = setTimeout(() => setIntro(false), 2800); return () => clearTimeout(t) }, []) // safety net if the intro animation stalls
  useEffect(() => { document.body.style.overflow = intro || menu ? 'hidden' : '' }, [intro, menu])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <AnimatePresence>{intro && <Intro done={() => setIntro(false)} />}</AnimatePresence>
      <div className="cursor-glow" aria-hidden="true" />
      <Nav hidden={hide} ready={!intro} />
      <main id="main">
        <Hero ready={!intro} />
        <Marquee />
        <Capabilities />
        <DesignLab />
        <Work />
        <Values />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
