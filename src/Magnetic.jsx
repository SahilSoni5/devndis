import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
// Pulls its child slightly toward the pointer. Disabled for reduced motion; keyboard focus is unaffected.
export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const move = (e) => {
    if (reduced || e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return <motion.div ref={ref} style={{ x, y, display: 'inline-block' }} onPointerMove={move} onPointerLeave={leave}>{children}</motion.div>
}
