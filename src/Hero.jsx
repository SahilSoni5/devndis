import { useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Magnetic from './Magnetic.jsx'

const ease = [0.16, 1, 0.3, 1]
// Exploded "design -> code" stack: a code layer, a wireframe layer and a finished UI layer
// floating in 3D, with the DEVNDIS mark above. Drawn on 2D canvas with a tiny perspective projector.
const PW = 4.6, PH = 3.1
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
const RED = [255, 59, 69], BLUE = [77, 141, 255], YEL = [255, 216, 77], PINK = [255, 79, 163], ORG = [255, 129, 58], WHITE = [245, 245, 245]

function makeProjector(W, H, t, pointer) {
  const ry = -.62 + pointer.x * .5 + Math.sin(t * .00035) * .1
  const rx = .5 + pointer.y * .3 + Math.cos(t * .0003) * .05
  const cy_ = Math.cos(ry), sy_ = Math.sin(ry), cx_ = Math.cos(rx), sx_ = Math.sin(rx)
  const S = W / 9.6, cx = W * .48, cy = H / 2
  return (x, y, z) => {
    let x1 = x * cy_ + z * sy_, z1 = -x * sy_ + z * cy_
    const y1 = y * cx_ - z1 * sx_; z1 = y * sx_ + z1 * cx_
    const p = 8 / (8 - z1)
    return [cx + x1 * S * p, cy + y1 * S * p, z1]
  }
}

function drawStack(ctx, W, H, dpr, t, pointer) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H)
  const P = makeProjector(W, H, t, pointer)
  const gap = 1.25 + .12 * Math.sin(t * .0007)
  const bob = (k) => .06 * Math.sin(t * .001 + k * 1.7)
  const layers = [
    { id: 'code', z: -gap + bob(0), col: BLUE },
    { id: 'wire', z: 0 + bob(1), col: WHITE },
    { id: 'ui', z: gap + bob(2), col: RED },
  ]
  const poly = (pts, z, fill, stroke, lw = 1) => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => { const q = P(x, y, z); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]) })
    ctx.closePath()
    if (fill) { ctx.fillStyle = fill; ctx.fill() }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke() }
  }
  const rect = (z, x0, y0, x1, y1, fill, stroke, lw) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z, fill, stroke, lw)
  const line = (z, x0, y0, x1, y1, stroke, lw = 1, dash) => {
    const a = P(x0, y0, z), b = P(x1, y1, z)
    ctx.beginPath(); ctx.setLineDash(dash || []); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); ctx.setLineDash([])
  }
  const hx = PW / 2, hy = PH / 2

  // vertical connectors between layers (the "everything is linked" idea)
  const zs = layers.map(l => l.z)
  ;[[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].forEach(([x, y]) => {
    const a = P(x, y, zs[0]), b = P(x, y, zs[2])
    const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, rgba(BLUE, .5)); g.addColorStop(1, rgba(RED, .5))
    ctx.beginPath(); ctx.setLineDash([3, 6]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([])
  })

  // soft floor shadow
  { const c = P(0, hy + .5, zs[0] - .3), r = W * .3
    const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save(); ctx.translate(0, 0); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r * .5, r * 2, r) ; ctx.restore() }

  // painter's order: back (smallest z after rotation) first -> keep authored back-to-front
  for (const L of layers) {
    const z = L.z
    // base plate
    const tint = L.id === 'ui' ? .10 : L.id === 'code' ? .07 : .035
    rect(z, -hx, -hy, hx, hy, rgba(L.id === 'code' ? [14, 22, 46] : [20, 22, 28], L.id === 'wire' ? .35 : .82), rgba(L.col, L.id === 'wire' ? .5 : .75), 1.2)
    rect(z, -hx, -hy, hx, hy, rgba(L.col, tint))

    if (L.id === 'code') {
      // syntax-coloured code lines with line numbers
      const rows = 13, lh = PH / (rows + 1)
      const widths = [.5, .7, .35, .62, .8, .45, .3, .66, .55, .25, .72, .4, .6]
      const cols = [BLUE, PINK, YEL, WHITE, BLUE]
      for (let r = 0; r < rows; r++) {
        const y = -hy + lh * (r + 1), indent = [0, .25, .25, .5, 0, .25, .5, .5, .25, 0, .25, .25, 0][r]
        rect(z, -hx + .18, y - .012, -hx + .32, y + .012, rgba(WHITE, .22))
        let x = -hx + .5 + indent
        for (let k = 0; k < 3; k++) {
          const w = widths[(r * 3 + k) % widths.length] * (k === 0 ? .8 : .55) * 1.1
          if (x + w > hx - .25) break
          rect(z, x, y - .026, x + w, y + .026, rgba(cols[(r + k * 2) % cols.length], k === 0 ? .85 : .5))
          x += w + .1
        }
      }
      // caret
      if (Math.floor(t / 520) % 2 === 0) rect(z, -hx + .5, -hy + lh * 5 - .05, -hx + .54, -hy + lh * 5 + .05, rgba(YEL, .95))
    }

    if (L.id === 'wire') {
      // layout grid + selection boxes with handles (design-tool vocabulary)
      const gx = 6, gy = 4
      for (let i = 1; i < gx; i++) line(z, -hx + (PW / gx) * i, -hy, -hx + (PW / gx) * i, hy, rgba(WHITE, .18))
      for (let j = 1; j < gy; j++) line(z, -hx, -hy + (PH / gy) * j, hx, -hy + (PH / gy) * j, rgba(WHITE, .18))
      const boxes = [[-1.95, -1.25, -.2, -.45], [-1.95, -.25, -.45, .55], [-.2, -.25, 1.95, .55], [.1, .75, 1.95, 1.25], [-1.95, .75, -.15, 1.25]]
      boxes.forEach(([x0, y0, x1, y1]) => {
        rect(z, x0, y0, x1, y1, null, rgba(BLUE, .75), 1)
        ;[[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([x, y]) => rect(z, x - .04, y - .04, x + .04, y + .04, 'rgba(8,8,8,1)', rgba(WHITE, .9), 1))
      })
      // dimension line
      line(z, -1.95, 1.4, 1.95, 1.4, rgba(WHITE, .5)); line(z, -1.95, 1.34, -1.95, 1.46, rgba(WHITE, .5)); line(z, 1.95, 1.34, 1.95, 1.46, rgba(WHITE, .5))
    }

    if (L.id === 'ui') {
      // finished interface: nav, hero block, cards, button, swatches
      rect(z, -hx + .15, -hy + .15, hx - .15, -hy + .38, rgba(WHITE, .1))
      rect(z, -hx + .25, -hy + .22, -hx + .65, -hy + .31, rgba(WHITE, .85))
      ;[0, 1, 2].forEach(k => rect(z, hx - 1.4 + k * .4, -hy + .23, hx - 1.15 + k * .4, -hy + .3, rgba(WHITE, .35)))
      // hero gradient block
      const a = P(-hx + .2, -hy + .55, z), b = P(hx - .2, .35, z)
      const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, rgba(RED, .95)); g.addColorStop(.55, rgba(PINK, .9)); g.addColorStop(1, rgba(ORG, .9))
      rect(z, -hx + .2, -hy + .55, hx - .2, .35, g)
      rect(z, -hx + .45, -hy + .8, -hx + 1.9, -hy + .95, rgba(8, 8, 8, .9)); rect(z, -hx + .45, -hy + 1.05, -hx + 1.3, -hy + 1.15, rgba(8, 8, 8, .55))
      rect(z, -hx + .45, .05, -hx + 1.15, .22, rgba(YEL, 1))
      // cards
      ;[0, 1, 2].forEach(k => {
        const x0 = -hx + .2 + k * 1.48
        rect(z, x0, .55, x0 + 1.3, hy - .2, rgba(WHITE, .1), rgba(WHITE, .22))
        rect(z, x0 + .15, .7, x0 + .5, 1.0, rgba([BLUE, YEL, PINK][k], .9))
        rect(z, x0 + .15, 1.1, x0 + 1.0, 1.17, rgba(WHITE, .6))
      })
    }
  }

  // labels with leader lines (right edge of each layer)
  const labels = [['01', 'CODE', layers[0], BLUE], ['02', 'SYSTEM', layers[1], WHITE], ['03', 'DESIGN', layers[2], RED]]
  ctx.font = '500 10px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle'
  labels.forEach(([n, name, L, col]) => {
    const a = P(hx, hy * .55, L.z), bx = a[0] + 36
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(bx, a[1]); ctx.strokeStyle = rgba(col, .7); ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = rgba(col, .95); ctx.fillText(n, bx + 6, a[1] - 1); ctx.fillStyle = rgba(WHITE, .75); ctx.fillText(name, bx + 26, a[1] - 1)
  })

  // DEVNDIS mark floating above the stack: two overlapping pills (red = Dis, blue = Dev)
  const mz = gap + 1.15 + .12 * Math.sin(t * .0012), pill = (cx0, col) => {
    const w = .62, h = 1.0, r = w / 2, pts = []
    for (let i = 0; i <= 14; i++) { const a = Math.PI + (i / 14) * Math.PI; pts.push([cx0 + Math.cos(a) * r, -h / 2 + r + Math.sin(a) * r]) }
    for (let i = 0; i <= 14; i++) { const a = (i / 14) * Math.PI; pts.push([cx0 + Math.cos(a) * r, h / 2 - r + Math.sin(a) * r]) }
    const q = pts.map(([x, y]) => P(x, y + .0, mz))
    ctx.beginPath(); q.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath()
    ctx.fillStyle = rgba(col, .88); ctx.fill()
  }
  const m = P(0, 0, mz); const glow = ctx.createRadialGradient(m[0], m[1], 0, m[0], m[1], W * .17)
  glow.addColorStop(0, 'rgba(255,79,163,.28)'); glow.addColorStop(1, 'rgba(255,79,163,0)'); ctx.fillStyle = glow; ctx.fillRect(m[0] - W * .2, m[1] - W * .2, W * .4, W * .4)
  ctx.globalCompositeOperation = 'lighter'; pill(-.2, RED); pill(.2, BLUE); ctx.globalCompositeOperation = 'source-over'
  const ma = P(0, .6, mz), mb = P(0, .6, layers[2].z)
  ctx.beginPath(); ctx.setLineDash([2, 5]); ctx.moveTo(ma[0], ma[1]); ctx.lineTo(mb[0], mb[1]); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.stroke(); ctx.setLineDash([])
}

// Aurora: drifting colour fields rendered on a tiny canvas that CSS scales up (smooth + very cheap).
const BLOBS = [
  { c: [255, 59, 69], a: .30, r: .62, sx: 1.1e-4, sy: 1.7e-4, px: 0, py: 1.2, ox: .78, oy: .22, follow: .12 },
  { c: [77, 141, 255], a: .26, r: .6, sx: 1.4e-4, sy: 9e-5, px: 2, py: .4, ox: .2, oy: .75, follow: -.08 },
  { c: [255, 79, 163], a: .16, r: .5, sx: 8e-5, sy: 1.3e-4, px: 4, py: 2.6, ox: .62, oy: .8 },
  { c: [255, 129, 58], a: .13, r: .42, sx: 1.6e-4, sy: 1.1e-4, px: 1, py: 3.4, ox: .9, oy: .6 },
]

const CODE = `.hero {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  min-height: 100svh;
  isolation: isolate;
}
.hero__title {
  font: 600 clamp(46px, 8.6vw, 148px) / .92 var(--font);
  letter-spacing: -.055em;
}
@property --angle { syntax: '<angle>'; }
const ease = cubic-bezier(.16, 1, .3, 1);
export function Sculpture({ pointer }) {
  const rot = useSpring(pointer.x * .9);
  return <canvas ref={cv} aria-hidden />;
}
:root {
  --red: #FF3B45;  --blue: #4D8DFF;
  --yellow: #FFD84D;  --pink: #FF4FA3;
  --radius: 20px;  --space: 16px;
}
requestAnimationFrame(frame); // 60fps`.split('\n')

function useHeroEngine(sectionRef, refs, reduced) {
  useEffect(() => {
    const section = sectionRef.current
    const { knot: cv, aurora: au, readout } = refs
    if (!section || !cv.current) return
    const ctx = cv.current.getContext('2d'), actx = au.current.getContext('2d')
    au.current.width = 256; au.current.height = 144
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const lens = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9, set: false }
    let W = 0, H = 0, dpr = 1, visible = true, raf = 0, rect = section.getBoundingClientRect()
    const grid = section.querySelector('.hero-grid')

    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); const r = cv.current.getBoundingClientRect(); W = r.width; H = r.height; cv.current.width = W * dpr; cv.current.height = H * dpr; rect = section.getBoundingClientRect() }

    const drawAurora = (t) => {
      const w = 256, h = 144
      actx.globalCompositeOperation = 'source-over'; actx.fillStyle = '#080808'; actx.fillRect(0, 0, w, h)
      actx.globalCompositeOperation = 'lighter'
      for (const b of BLOBS) {
        const cx = (b.ox + .22 * Math.sin(t * b.sx + b.px) + (b.follow || 0) * pointer.x) * w
        const cy = (b.oy + .2 * Math.cos(t * b.sy + b.py) + (b.follow || 0) * pointer.y) * h
        const r = b.r * w, g = actx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${b.c},${b.a})`); g.addColorStop(1, `rgba(${b.c},0)`)
        actx.fillStyle = g; actx.fillRect(0, 0, w, h)
      }
    }

    const drawKnot = (t) => drawStack(ctx, W, H, dpr, t, pointer)

    size()
    const ro = new ResizeObserver(() => { size(); if (reduced) { drawKnot(5000); drawAurora(5000) } }); ro.observe(cv.current)
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting }); io.observe(section)
    const move = (e) => {
      pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = (e.clientY / innerHeight) * 2 - 1
      rect = section.getBoundingClientRect()
      lens.tx = e.clientX - rect.left; lens.ty = e.clientY - rect.top; lens.last = performance.now()
      if (!lens.set) { lens.x = lens.tx; lens.y = lens.ty; lens.set = true }
      if (readout.current) readout.current.textContent = `x ${String(Math.round(lens.tx)).padStart(4, '0')}  y ${String(Math.round(lens.ty)).padStart(4, '0')}`
    }
    addEventListener('pointermove', move, { passive: true })

    const frame = (t) => {
      pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05
      if (visible) {
        // idle (and touch) -> the lens wanders on its own so the "dev view" is always discoverable
        if (t - lens.last > 2500) {
          lens.tx = rect.width * (.62 + .22 * Math.sin(t * 2.7e-4)); lens.ty = rect.height * (.5 + .22 * Math.cos(t * 3.3e-4)); if (!lens.set) { lens.x = lens.tx; lens.y = lens.ty; lens.set = true }
        }
        lens.x += (lens.tx - lens.x) * .09; lens.y += (lens.ty - lens.y) * .09
        section.style.setProperty('--lx', lens.x.toFixed(1) + 'px'); section.style.setProperty('--ly', lens.y.toFixed(1) + 'px')
        section.style.setProperty('--lr', (190 + 14 * Math.sin(t * 8e-4)).toFixed(1) + 'px')
        drawAurora(t); drawKnot(t)
        grid.style.setProperty('--gx', (pointer.x * -14).toFixed(1) + 'px'); grid.style.setProperty('--gy', (pointer.y * -14).toFixed(1) + 'px')
      }
      raf = requestAnimationFrame(frame)
    }
    if (reduced) { drawKnot(5000); drawAurora(5000) } else raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener('pointermove', move) }
  }, [reduced, sectionRef, refs])
}

function Cursor({ name, color, cls }) {
  return (
    <div className={'fcursor ' + cls} style={{ '--c': color }} aria-hidden="true">
      <svg width="18" height="22" viewBox="0 0 18 22"><path d="M1.5 1.2l14 8.600-6.300 1.700-3.200 6.300z" fill={color} stroke="#080808" strokeWidth="1.2" strokeLinejoin="round" /></svg>
      <span>{name}</span>
    </div>
  )
}

export default function Hero({ ready }) {
  const sec = useRef(null)
  const refs = useRef({ knot: { current: null }, aurora: { current: null }, readout: { current: null } }).current
  const reduced = useReducedMotion()
  useHeroEngine(sec, refs, reduced)
  const st = ready ? 'show' : 'hide'
  const word = { hide: { y: '115%' }, show: (i) => ({ y: 0, transition: { duration: 1.2, ease, delay: .05 + i * .08 } }) }
  const fade = { hide: { opacity: 0, y: 24 }, show: (i) => ({ opacity: 1, y: 0, transition: { duration: .9, ease, delay: .7 + i * .1 } }) }
  const W = ({ i, cls, children }) => <span className="w-clip"><motion.span className={cls} variants={word} custom={i} initial="hide" animate={st}>{children}</motion.span></span>

  return (
    <section className={'hero' + (ready ? ' ready' : '')} id="top" ref={sec}>
      {/* ---- background stack: aurora > grid > pen-tool curve > knot > dev-view lens ---- */}
      <canvas className="hero-aurora" ref={(n) => (refs.aurora.current = n)} aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <svg className="hero-bezier" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><linearGradient id="bz" x1="0" x2="1"><stop offset="0" stopColor="#FF3B45" /><stop offset=".55" stopColor="#FF4FA3" /><stop offset="1" stopColor="#4D8DFF" /></linearGradient></defs>
        <path className="bz-path" d="M-40 650 C 260 520, 470 790, 800 600 S 1230 410, 1500 520" fill="none" stroke="url(#bz)" strokeWidth="1.6" pathLength="1" />
        <path className="bz-path soft" d="M-40 720 C 300 640, 560 820, 900 690 S 1250 520, 1500 640" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1" pathLength="1" />
        <g className="bz-handles" stroke="rgba(255,255,255,.35)" strokeWidth="1" fill="none">
          <line x1="260" y1="520" x2="-40" y2="650" /><line x1="470" y1="790" x2="800" y2="600" /><line x1="1230" y1="410" x2="1500" y2="520" />
          <g fill="#080808"><circle cx="260" cy="520" r="4" /><circle cx="470" cy="790" r="4" /><circle cx="1230" cy="410" r="4" /></g>
          <g fill="#fff" stroke="#080808"><rect x="793" y="593" width="14" height="14" rx="2" /><rect x="-47" y="643" width="14" height="14" rx="2" /></g>
        </g>
        <text x="818" y="586" className="bz-label">anchor · 800, 600</text>
      </svg>
      <canvas className="hero-canvas" ref={(n) => (refs.knot.current = n)} aria-hidden="true" />
      <div className="hero-lens" aria-hidden="true">
        <div className="lens-code">{[0, 1, 2, 3].map(k => <pre key={k}>{CODE.slice(k * 3 % 7).concat(CODE.slice(0, k * 3 % 7)).join('\n')}</pre>)}</div>
      </div>
      <div className="hero-lens-ring" aria-hidden="true"><span>dev view</span></div>
      <div className="ruler ruler-x" aria-hidden="true" /><div className="ruler ruler-y" aria-hidden="true" />

      <div className="wrap hero-inner">
        <h1 className="hero-title" aria-label="Think it. Build it. Automate it. Create it.">
          <span className="line" aria-hidden="true"><W i={0}>Think</W> <W i={1} cls="dim">it.</W> <W i={2} cls="t-blue">Build</W> <W i={3} cls="dim">it.</W></span>
          <span className="line" aria-hidden="true"><W i={4}>Automate</W> <W i={5} cls="dim">it.</W> <W i={6} cls="grad-text">Create</W> <W i={7} cls="dim">it.</W></span>
        </h1>
        <div className="hero-foot">
          <motion.p className="hero-sub" variants={fade} custom={0} initial="hide" animate={st}>
            Designers and developers under one roof — we shape the idea, build <b>fast, cinematic web products</b>, automate the busywork and create <b>brands and design systems</b> that last.
          </motion.p>
          <motion.div className="hero-cta" variants={fade} custom={1} initial="hide" animate={st}>
            <Magnetic><a className="btn red" href="#contact">Start a project <span className="arr" aria-hidden="true">→</span></a></Magnetic>
          </motion.div>
        </div>
      </div>

      <Cursor name="Dis" color="#FF3B45" cls="a" />
      <Cursor name="Dev" color="#4D8DFF" cls="b" />
      <div className="hero-status mono" aria-hidden="true"><span className="live" /><span ref={(n) => (refs.readout.current = n)}>x 0000  y 0000</span><em>Design ⟷ Development</em></div>
      <div className="scroll-cue mono" aria-hidden="true"><i /> Scroll</div>
    </section>
  )
}
