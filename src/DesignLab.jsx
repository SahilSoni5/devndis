import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, Split } from './Sections.jsx'

const COLORS = [['Red', '#FF3B45'], ['Orange', '#FF813A'], ['Yellow', '#FFD84D'], ['Pink', '#FF4FA3'], ['Blue', '#4D8DFF']]
const WEIGHTS = [['Light', 300], ['Regular', 400], ['Semibold', 600]]

// Interactive demo: the designer's controls and the developer's output are the same object.
export default function DesignLab() {
  const [c, setC] = useState(COLORS[4][1])
  const [radius, setRadius] = useState(20)
  const [w, setW] = useState(600)
  const [gap, setGap] = useState(16)
  const rgb = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).join(',')
  return (
    <section className="sec lab" id="lab" aria-labelledby="lab-h">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><div className="kicker mono">Design × code</div><Split as="h2" className="h2" id="lab-h">Design it. Tweak it. <span className="grad-text">Ship it.</span></Split></Reveal>
          <Reveal delay={.1}><p className="lead">Our design systems are code from day one. Change the tokens below and watch the component — and the CSS a developer would ship — update together. A live demo, not client work.</p></Reveal>
        </div>
        <div className="lab-grid">
          <Reveal className="lab-controls">
            <fieldset><legend className="mono">Accent</legend>
              <div className="swatches">{COLORS.map(([n, v]) => (
                <button key={v} type="button" aria-label={n} aria-pressed={c === v} className={c === v ? 'on' : ''} style={{ '--sw': v }} onClick={() => setC(v)} />
              ))}</div>
            </fieldset>
            <label><span className="mono">Radius <b>{radius}px</b></span><input type="range" min="0" max="36" value={radius} onChange={e => setRadius(+e.target.value)} /></label>
            <label><span className="mono">Spacing <b>{gap}px</b></span><input type="range" min="8" max="28" value={gap} onChange={e => setGap(+e.target.value)} /></label>
            <fieldset><legend className="mono">Heading weight</legend>
              <div className="seg">{WEIGHTS.map(([n, v]) => <button key={v} type="button" aria-pressed={w === v} className={w === v ? 'on' : ''} onClick={() => setW(v)}>{n}</button>)}</div>
            </fieldset>
          </Reveal>
          <Reveal delay={.1} className="lab-stage">
            <div className="lab-preview" style={{ '--a': c, '--ar': rgb, '--rad': radius + 'px', '--gap': gap + 'px', '--w': w }}>
              <motion.div layout className="lp-card">
                <div className="lp-top"><span className="lp-badge">Design system</span><span className="lp-dot" /></div>
                <h3>Quantum Spatial UI</h3>
                <p>Optical tracking, translucent materials and spring-physics interactions.</p>
                <div className="lp-bars"><i style={{ width: '82%' }} /><i style={{ width: '56%' }} /></div>
                <div className="lp-row"><button type="button" className="lp-btn">Explore</button><button type="button" className="lp-btn alt">Docs</button></div>
              </motion.div>
            </div>
            <pre className="lab-code" aria-label="Generated CSS tokens"><code>{`:root {\n  --accent: ${c};\n  --radius: ${radius}px;\n  --space: ${gap}px;\n  --heading-weight: ${w};\n}`}</code></pre>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
