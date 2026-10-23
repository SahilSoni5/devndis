import { useRef, useState, useEffect, Fragment } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { DESIGN, ENGINEERING, PROJECTS, RULES, SOCIALS } from './content.js'
import { ProjectVisual } from './Visuals.jsx'

const ease = [0.16, 1, 0.3, 1]
export function Reveal({ children, delay = 0, as = 'div', ...rest }) {
  const M = motion[as]
  return <M className="reveal" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .9, ease, delay }} {...rest}>{children}</M>
}

export function Split({ as = 'h2', children, className, ...rest }) {
  // Words rise out of a clip mask when scrolled into view; plain text is kept for screen readers.
  const Tag = motion[as]
  const parts = []
  const walk = (node, cls) => {
    if (typeof node === 'string') node.split(' ').filter(Boolean).forEach(w => parts.push([w, cls]))
    else if (Array.isArray(node)) node.forEach(n => walk(n, cls))
    else if (node?.props) walk(node.props.children, node.props.className)
  }
  walk(children)
  return (
    <Tag className={className} initial="h" whileInView="s" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: .06 }} {...rest}>
      {parts.map(([w, cls], i) => (
        <Fragment key={i}><span className="w-clip"><motion.span className={cls} style={{ display: 'inline-block' }} variants={{ h: { y: '115%' }, s: { y: 0, transition: { duration: 1, ease } } }}>{w}</motion.span></span>{' '}</Fragment>
      ))}
    </Tag>
  )
}

const STACK = ['Designing', 'Web Development', 'Software Development', 'AI Automation', 'AI Content', 'Social Media', 'Branding', 'UI/UX', 'Chatbots', 'SaaS', 'E-commerce', 'Integrations']
const COLORS = ['var(--red)', 'var(--blue)', 'var(--yellow)', 'var(--pink)', 'var(--orange)']
export function Marquee() {
  const items = [...STACK, ...STACK]
  return (
    <div className="marquee" aria-label="Technologies and disciplines">
      <div className="marquee-track" aria-hidden="true">
        {items.map((s, i) => <span key={i} style={{ '--c': COLORS[i % 5] }}>{s}</span>)}
      </div>
    </div>
  )
}

function Panel({ id, title, accent, items, tagline }) {
  return (
    <Reveal>
      <article className="panel" id={id} data-accent={accent} aria-labelledby={id + '-h'}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px') }}>
        <header>
          <h3 id={id + '-h'} className={accent === 'red' ? 'grad-text' : 't-blue'}>{title}</h3>
          <p>{tagline}</p>
        </header>
        <ul>
          {items.map(it => (
            <li key={it.n} className="svc">
              <span className="svc-n mono">{it.n}</span>
              <div>
                <h4>{it.title}</h4>
                <p>{it.body}</p>
                <div className="pills">{it.tags.map(t => <span className="pill" key={t}>{t}</span>)}</div>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

export function Capabilities() {
  return (
    <section className="sec" id="capabilities" aria-labelledby="cap-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><div className="kicker mono">Strategy · Creativity · Technology</div><Split as="h2" className="h2" id="cap-h">We don&apos;t just create. <span className="grad-text">We build.</span></Split></Reveal>
          <Reveal delay={.1}><p className="lead">End-to-end solutions powered by creativity &amp; technology. All under one roof.</p></Reveal>
        </div>
        <div className="panels">
          <Panel id="design" accent="red" title="Design" tagline="Designs that don’t just look good — they communicate, connect and convert." items={DESIGN} />
          <Panel id="development" accent="blue" title="Development" tagline="Custom software built for performance, scalability and real-world impact." items={ENGINEERING} />
        </div>
        <Reveal><div className="bridge"><span className="b-dot red" /><span>Create</span><i /><b>Let&apos;s build something iconic.</b><i /><span>Build</span><span className="b-dot blue" /></div></Reveal>
      </div>
    </section>
  )
}

export function Work() {
  const ref = useRef(null)
  const track = useRef(null)
  const reduced = useReducedMotion()
  const [travel, setTravel] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, travel])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const measure = () => {
      const el = track.current
      const pin = el?.parentElement
      if (!el || !pin) return
      setTravel(Math.min(0, pin.clientWidth - el.scrollWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    addEventListener('resize', measure)
    return () => { ro.disconnect(); removeEventListener('resize', measure) }
  }, [])

  return (
    <section className="work" id="work" aria-labelledby="work-h">
      <div className="hscroll" ref={ref} style={travel ? { height: `calc(100svh + ${Math.abs(travel)}px)` } : undefined}>
        <div className="hscroll-pin">
          <div className="wrap hscroll-head">
            <div className="kicker mono">What we do</div>
            <Split as="h2" className="h2" id="work-h">Everything we <span className="grad-text">build.</span></Split>
          </div>
          <motion.div className="hscroll-track" ref={track} style={reduced ? undefined : { x }}>
            {PROJECTS.map(p => (
              <article className="proj" key={p.n} data-accent={p.accent} tabIndex={0} aria-label={p.title}>
                <div className="proj-vis"><ProjectVisual kind={p.kind} /></div>
                <div className="proj-info">
                  <div>
                    <span className="mono">{p.n} · {p.tag}</span>
                    <div className="roles">{p.roles.map(r => <em key={r} className={r === 'Design' ? 'rd' : 'rv'}>{r}</em>)}</div>
                    <h3>{p.title}</h3>
                    <div className="sub">{p.sub}</div>
                    <p>{p.body}</p>
                  </div>
                  <div>
                    <div className="pills" style={{ marginBottom: 16 }}>{p.stack.map(s => <span className="pill" key={s}>{s}</span>)}</div>
                    <span className="stat">{p.stat}</span>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
          <div className="hprog" aria-hidden="true"><motion.i style={{ scaleX: bar }} /></div>
        </div>
      </div>
    </section>
  )
}

export function Values() {
  const acc = ['red', 'blue', 'yellow', 'pink']
  const grid = useRef(null)
  useEffect(() => {
    const root = grid.current
    if (!root) return
    let width = -1
    const fit = () => {
      const cards = [...root.querySelectorAll('.rule')]
      cards.forEach(c => { c.style.minHeight = '' })
      const max = Math.ceil(Math.max(...cards.map(c => c.getBoundingClientRect().height)))
      cards.forEach(c => { c.style.minHeight = max + 'px' })
    }
    const ro = new ResizeObserver(() => {
      const w = root.clientWidth
      if (w === width) return
      width = w
      fit()
    })
    ro.observe(root)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])
  return (
    <section className="sec" id="values" aria-labelledby="val-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><div className="kicker mono">The DEVNDIS standard</div><Split as="h2" className="h2" id="val-h">Rules we never break.</Split></Reveal>
          <Reveal delay={.1}><p className="lead">Strategy, creativity and technology — four non-negotiables for every brand we build.</p></Reveal>
        </div>
        <div className="rules" ref={grid}>
          {RULES.map((r, i) => (
            <Reveal key={r.n} delay={(i % 2) * .08}>
              <article className="rule" data-accent={acc[i]}>
                <span className="rule-n" aria-hidden="true">{r.n}</span>
                <div><h3>{r.title}</h3><p>{r.body}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="sec contact" id="contact" aria-labelledby="con-h">
      <div className="wrap">
        <Reveal><div className="kicker mono">Contact</div>
          <h2 className="h-contact" id="con-h">Let's build something <span className="grad-text">unforgettable.</span></h2></Reveal>
        <div className="contact-grid">
          <Reveal>
            <div className="direct">
              {SOCIALS.map(s => <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{s.label}<span>↗</span></a>)}
            </div>
            <p className="mono" style={{ marginTop: 24 }}>Response time: &lt; 24 hours</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
