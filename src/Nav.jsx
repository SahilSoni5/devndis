import { useEffect, useRef, useState } from 'react'
import { SOCIALS } from './content.js'
import Logo from './Logo.jsx'

const ease = [0.16, 1, 0.3, 1]
const DISCIPLINES = [
  { label: 'Designing', href: '#design', tag: 'Design' },
  { label: 'UI/UX & Web design', href: '#design', tag: 'Design' },
  { label: 'AI Content', href: '#design', tag: 'Design' },
  { label: 'Social media content', href: '#design', tag: 'Design' },
  { label: 'Web development', href: '#development', tag: 'Dev' },
  { label: 'Software development', href: '#development', tag: 'Dev' },
  { label: 'Workflow', href: '#development', tag: 'Dev' },
  { label: 'AI automation', href: '#development', tag: 'Dev' },
]
const EXPLORE = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Design Lab', href: '#lab', badge: 'Interactive' },
  { label: 'What we do', href: '#work' },
  { label: 'Values', href: '#values' },
]
const ICONS = {
  Instagram: <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.8-2.3a.9.9 0 100 1.8.9.9 0 000-1.8z" />,
  LinkedIn: <path d="M5 9h3v10H5zM6.5 4.5a1.7 1.7 0 110 3.4 1.7 1.7 0 010-3.4zM10 9h2.9v1.4c.5-.9 1.600-1.600 3.200-1.600 3 0 3.400 2 3.400 4.500V19h-3v-5c0-1.200 0-2.600-1.600-2.600S13 12.700 13 14v5h-3z" />,
  Email: <path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" />,
  WhatsApp: <path d="M12 3a9 9 0 00-7.800 13.500L3 21l4.600-1.200A9 9 0 1012 3zm-3.200 5c.2-.4.500-.4.700-.4h.5c.2 0 .4.100.5.400l.7 1.700c.1.200 0 .4-.1.600l-.5.700c-.1.200-.1.300 0 .500.600 1 1.500 1.800 2.600 2.300.2.100.4.100.5-.1l.7-.9c.1-.2.300-.2.500-.1l1.700.8c.2.100.3.200.3.400 0 .6-.3 1.300-.9 1.600-.6.300-1.300.4-2.200.1-2.700-.9-4.800-3.100-5.500-5.400-.2-.7-.1-1.300.2-1.800z" />,
}

export default function Nav({ hidden, ready }) {
  const [open, setOpen] = useState(false)
  const btn = useRef(null), panel = useRef(null)
  const close = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const key = (e) => { if (e.key === 'Escape') { close(); btn.current?.focus() } }
    addEventListener('keydown', key)
    const f = setTimeout(() => panel.current?.querySelector('a')?.focus({ preventScroll: true }), 450)
    return () => { removeEventListener('keydown', key); clearTimeout(f) }
  }, [open])

  let i = 0
  const item = () => ({ '--i': i++ })
  return (
    <>
      <div className={'nav-scrim' + (open ? ' on' : '')} onClick={close} aria-hidden="true" />
      <header className={'nav' + (hidden && !open ? ' hide' : '') + (open ? ' open' : '') + (ready ? ' in' : '')} role="banner">
        <div className="nav-shell">
          <div className="nav-bar">
            <button ref={btn} className="nav-toggle" aria-expanded={open} aria-controls="mega" onClick={() => setOpen(!open)}>
              <span className="burger" aria-hidden="true"><i /><i /></span>Menu
            </button>
            <a className="logo nav-logo" href="#top" aria-label="DEVNDIS home" onClick={close}><Logo variant="white" /></a>
            <div className="nav-actions">
              <a className="nav-pill ghost" href="#lab" onClick={close} tabIndex={open ? 0 : -1}>Design Lab</a>
              <a className="nav-pill solid" href="#contact" onClick={close}>Let's talk</a>
            </div>
          </div>
          <div className="mega-wrap" id="mega" ref={panel} inert={open ? undefined : ''} aria-hidden={!open} role="dialog" aria-label="Site menu">
            <div className="mega">
              <div className="mega-col card mega-item" style={item()}>
                <span className="mono">Disciplines</span>
                <ul>{DISCIPLINES.map(d => <li key={d.label} className="mega-item" style={item()}><a href={d.href} onClick={close}>{d.label}<em className={d.tag === 'Design' ? 'rd' : 'rv'}>{d.tag}</em></a></li>)}</ul>
              </div>
              <div className="mega-col mega-item" style={item()}>
                <span className="mono">Explore</span>
                <ul>{EXPLORE.map(d => <li key={d.label} className="mega-item" style={item()}><a href={d.href} onClick={close}>{d.label}{d.badge && <em className="rn">{d.badge}</em>}</a></li>)}</ul>
                <div className="mega-social mega-item" style={item()}>
                  {SOCIALS.map(s => (
                    <a key={s.label} href={s.href} aria-label={s.label} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">{ICONS[s.label]}</svg>
                    </a>
                  ))}
                </div>
              </div>
              <a className="mega-promo mega-item" style={item()} href="#contact" onClick={close}>
                <span className="mono">Start here</span>
                <h3>Have a project in mind?</h3>
                <div className="promo-vis" aria-hidden="true"><i className="c1" /><i className="c2" /><i className="c3" /></div>
                <span className="promo-btn">Start a project →</span>
              </a>
            </div>
          </div>
        </div>
        <div className="nav-ticker" aria-hidden="true">
          <div>{Array.from({ length: 8 }, (_, k) => <span key={k}>Open for projects · Design + Development · Reply in under 24h<b>✦</b></span>)}</div>
        </div>
      </header>
    </>
  )
}
