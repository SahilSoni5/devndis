function Glow({ id, color }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feFlood floodColor={color} floodOpacity=".7" result="tint" />
      <feComposite in="tint" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

function Field({ color }) {
  return (
    <g stroke={color} strokeOpacity=".09" strokeWidth="1">
      {[80, 140, 200, 260, 320].map(x => <line key={'v' + x} x1={x} y1="18" x2={x} y2="282" />)}
      {[60, 120, 180, 240].map(y => <line key={'h' + y} x1="24" y1={y} x2="376" y2={y} />)}
    </g>
  )
}

function Orbit({ color, r = 108 }) {
  return (
    <>
      <circle cx="200" cy="150" r={r} fill="none" stroke={color} strokeOpacity=".2" strokeWidth="1.4" strokeDasharray="5 9" />
      <circle cx="200" cy="150" r={r - 28} fill="none" stroke={color} strokeOpacity=".32" strokeWidth="1.2" />
    </>
  )
}

export function ProjectVisual({ kind }) {
  if (kind === 'ai') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="AI automation">
      <defs>
        <Glow id="g-ai" color="#4D8DFF" />
        <radialGradient id="ai-core" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFD84D" />
          <stop offset="100%" stopColor="#4D8DFF" />
        </radialGradient>
      </defs>
      <Field color="#4D8DFF" />
      <Orbit color="#4D8DFF" />
      <g stroke="#4D8DFF" strokeOpacity=".55" strokeWidth="1.4">
        <line x1="200" y1="70" x2="200" y2="108" />
        <line x1="200" y1="192" x2="200" y2="230" />
        <line x1="122" y1="150" x2="156" y2="150" />
        <line x1="244" y1="150" x2="278" y2="150" />
        <line x1="146" y1="96" x2="170" y2="120" />
        <line x1="254" y1="96" x2="230" y2="120" />
        <line x1="146" y1="204" x2="170" y2="180" />
        <line x1="254" y1="204" x2="230" y2="180" />
      </g>
      {[
        [200, 64], [200, 236], [114, 150], [286, 150],
        [140, 90], [260, 90], [140, 210], [260, 210],
      ].map(([x, y], i) => (
        <g key={i} filter="url(#g-ai)">
          <circle cx={x} cy={y} r="8" fill="#12151c" stroke="#4D8DFF" strokeWidth="1.6" />
          <circle cx={x} cy={y} r="2.6" fill={i % 3 === 0 ? '#FFD84D' : '#4D8DFF'} />
        </g>
      ))}
      <g filter="url(#g-ai)">
        <circle cx="200" cy="150" r="38" fill="#12151c" stroke="#4D8DFF" strokeWidth="2.2" />
        <path d="M200 128 l6.6 13.2 14.6 2.1-10.6 10.3 2.5 14.5L200 160.6l-13.1 7 2.5-14.5-10.6-10.3 14.6-2.1z" fill="url(#ai-core)" />
      </g>
    </svg>
  )

  if (kind === 'software') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Software development">
      <defs>
        <Glow id="g-sw" color="#FF3B45" />
        <linearGradient id="sw-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#242833" />
          <stop offset="100%" stopColor="#15181f" />
        </linearGradient>
      </defs>
      <Field color="#FF3B45" />
      <Orbit color="#FF3B45" r="118" />
      <rect x="98" y="58" width="204" height="140" rx="18" fill="#1a1d24" stroke="#FF3B45" strokeOpacity=".2" />
      <g filter="url(#g-sw)">
        <rect x="78" y="74" width="244" height="156" rx="20" fill="url(#sw-win)" stroke="#FF3B45" strokeOpacity=".75" />
      </g>
      <circle cx="100" cy="96" r="5" fill="#FF3B45" />
      <circle cx="118" cy="96" r="5" fill="#FF813A" />
      <circle cx="136" cy="96" r="5" fill="#FFD84D" />
      <rect x="160" y="90" width="140" height="11" rx="5.5" fill="#fff" fillOpacity=".08" />
      <g fill="none" stroke="#FF3B45" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#g-sw)">
        <path d="M152 148 l-24 24 24 24" />
        <path d="M248 148 l24 24 -24 24" />
      </g>
      <rect x="188" y="166" width="24" height="8" rx="4" fill="#FFD84D" />
    </svg>
  )

  if (kind === 'web') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Web development">
      <defs>
        <Glow id="g-web" color="#4D8DFF" />
        <linearGradient id="web-hero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4D8DFF" />
          <stop offset="100%" stopColor="#7EB0FF" />
        </linearGradient>
      </defs>
      <Field color="#4D8DFF" />
      <g filter="url(#g-web)">
        <rect x="48" y="64" width="228" height="168" rx="18" fill="#15181f" stroke="#4D8DFF" strokeOpacity=".75" />
      </g>
      <rect x="48" y="64" width="228" height="28" rx="18" fill="#1c2230" />
      <rect x="48" y="78" width="228" height="14" fill="#1c2230" />
      <circle cx="68" cy="78" r="4.5" fill="#FF3B45" />
      <circle cx="84" cy="78" r="4.5" fill="#FF813A" />
      <circle cx="100" cy="78" r="4.5" fill="#FFD84D" />
      <rect x="122" y="72" width="132" height="11" rx="5.5" fill="#fff" fillOpacity=".08" />
      <rect x="66" y="108" width="118" height="72" rx="12" fill="url(#web-hero)" />
      <rect x="196" y="108" width="60" height="9" rx="4.5" fill="#fff" fillOpacity=".18" />
      <rect x="196" y="126" width="48" height="7" rx="3.5" fill="#fff" fillOpacity=".1" />
      <rect x="196" y="142" width="40" height="7" rx="3.5" fill="#fff" fillOpacity=".1" />
      <rect x="196" y="164" width="36" height="16" rx="8" fill="#4D8DFF" />
      <g filter="url(#g-web)">
        <rect x="262" y="86" width="86" height="148" rx="16" fill="#12151c" stroke="#4D8DFF" strokeWidth="2" />
      </g>
      <rect x="274" y="102" width="62" height="8" rx="4" fill="#4D8DFF" fillOpacity=".35" />
      <rect x="274" y="118" width="62" height="50" rx="8" fill="#4D8DFF" fillOpacity=".55" />
      <rect x="274" y="178" width="62" height="7" rx="3.5" fill="#fff" fillOpacity=".12" />
      <rect x="274" y="192" width="44" height="7" rx="3.5" fill="#fff" fillOpacity=".08" />
      <rect x="290" y="216" width="30" height="4" rx="2" fill="#fff" fillOpacity=".2" />
    </svg>
  )

  if (kind === 'aicontent') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="AI content">
      <defs>
        <Glow id="g-ac" color="#FF4FA3" />
        <linearGradient id="ac-img" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4FA3" />
          <stop offset="100%" stopColor="#4D8DFF" />
        </linearGradient>
      </defs>
      <Field color="#FF4FA3" />
      <g filter="url(#g-ac)">
        <rect x="86" y="54" width="228" height="192" rx="22" fill="#15181f" stroke="#FF4FA3" strokeOpacity=".75" />
      </g>
      <rect x="106" y="74" width="188" height="100" rx="16" fill="url(#ac-img)" />
      <path d="M122 154 l26-30 22 20 20-14 46 38 H122z" fill="#080808" fillOpacity=".28" />
      <circle cx="258" cy="98" r="11" fill="#FFD84D" />
      <rect x="106" y="188" width="118" height="10" rx="5" fill="#fff" fillOpacity=".16" />
      <rect x="106" y="206" width="78" height="8" rx="4" fill="#fff" fillOpacity=".1" />
      <rect x="236" y="192" width="48" height="24" rx="8" fill="#FF4FA3" />
      <text x="260" y="209" textAnchor="middle" fill="#080808" fontFamily="Geist, Inter, sans-serif" fontSize="11" fontWeight="700">AI</text>
      <g filter="url(#g-ac)" fill="#FFD84D">
        <path d="M64 92 l3.2 7.6 8.4 1.2-6.1 5.9 1.4 8.3L64 111.2l-7.1 3.8 1.4-8.3-6.1-5.9 8.4-1.2z" />
        <path d="M328 78 l4.4 10.2 11.2 1.6-8.1 7.9 1.9 11.1L328 103.4l-9.4 5.4 1.9-11.1-8.1-7.9 11.2-1.6z" />
        <path d="M340 150 l2.8 6.6 7.4 1.1-5.3 5.2 1.3 7.2L340 166.8l-6.2 3.3 1.3-7.2-5.3-5.2 7.4-1.1z" />
      </g>
    </svg>
  )

  if (kind === 'social') return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Social media content">
      <defs>
        <Glow id="g-so" color="#FF4FA3" />
        <linearGradient id="so-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4FA3" />
          <stop offset="55%" stopColor="#FF813A" />
          <stop offset="100%" stopColor="#FFD84D" />
        </linearGradient>
        <linearGradient id="so-post" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4FA3" />
          <stop offset="100%" stopColor="#4D8DFF" />
        </linearGradient>
      </defs>
      <Field color="#FF4FA3" />
      <g filter="url(#g-so)">
        <rect x="142" y="36" width="116" height="228" rx="26" fill="#12151c" stroke="#FF4FA3" strokeWidth="2" />
      </g>
      <circle cx="200" cy="50" r="3" fill="#fff" fillOpacity=".25" />
      <rect x="156" y="64" width="88" height="14" rx="7" fill="#1c2028" />
      <circle cx="170" cy="71" r="8" fill="none" stroke="url(#so-ring)" strokeWidth="2.2" />
      <circle cx="170" cy="71" r="4.5" fill="#FF4FA3" />
      <rect x="184" y="67" width="50" height="8" rx="4" fill="#fff" fillOpacity=".12" />
      <rect x="156" y="88" width="88" height="88" rx="14" fill="url(#so-post)" />
      <polygon points="190,116 220,132 190,148" fill="#080808" fillOpacity=".55" />
      <path d="M164 192 c0-6.2 4.8-11 10.8-11 3.4 0 6.4 1.7 8.2 4.4 1.8-2.7 4.8-4.4 8.2-4.4 6 0 10.8 4.8 10.8 11 0 12-19 21.5-19 21.5S164 204 164 192z" fill="#FF4FA3" />
      <rect x="210" y="190" width="28" height="7" rx="3.5" fill="#fff" fillOpacity=".16" />
      <rect x="164" y="216" width="72" height="6" rx="3" fill="#fff" fillOpacity=".12" />
      <rect x="164" y="230" width="48" height="5" rx="2.5" fill="#fff" fillOpacity=".08" />
      <g filter="url(#g-so)">
        <circle cx="84" cy="150" r="22" fill="#FF3B45" />
        <polygon points="78,140 96,150 78,160" fill="#080808" />
        <circle cx="316" cy="108" r="22" fill="#FF4FA3" />
        <rect x="306" y="98" width="20" height="20" rx="6" fill="none" stroke="#080808" strokeWidth="2" />
        <circle cx="316" cy="108" r="4" fill="none" stroke="#080808" strokeWidth="2" />
        <circle cx="322" cy="101" r="1.4" fill="#080808" />
        <circle cx="322" cy="186" r="18" fill="#4D8DFF" />
        <rect x="314" y="178" width="16" height="16" rx="3" fill="#080808" />
      </g>
    </svg>
  )

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Designing">
      <defs>
        <Glow id="g-ds" color="#FF813A" />
        <linearGradient id="ds-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a211c" />
          <stop offset="100%" stopColor="#17191e" />
        </linearGradient>
      </defs>
      <Field color="#FF813A" />
      <rect x="126" y="46" width="156" height="112" rx="16" fill="#1a1d24" stroke="#FF813A" strokeOpacity=".22" transform="rotate(-7 204 102)" />
      <g filter="url(#g-ds)">
        <rect x="92" y="68" width="196" height="148" rx="20" fill="url(#ds-board)" stroke="#FF813A" strokeOpacity=".85" />
      </g>
      <rect x="110" y="88" width="70" height="52" rx="10" fill="#FF813A" />
      <rect x="192" y="88" width="74" height="11" rx="5.5" fill="#fff" fillOpacity=".16" />
      <rect x="192" y="108" width="54" height="8" rx="4" fill="#fff" fillOpacity=".1" />
      <rect x="192" y="124" width="42" height="8" rx="4" fill="#fff" fillOpacity=".08" />
      {['#FF813A', '#FFD84D', '#FF3B45', '#FF4FA3', '#4D8DFF'].map((c, i) => (
        <rect key={c} x={110 + i * 32} y="156" width="24" height="36" rx="6" fill={c} />
      ))}
      <g filter="url(#g-ds)">
        <path d="M286 206 C 308 206, 324 150, 352 132" fill="none" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="352" cy="132" r="5" fill="#FFD84D" />
        <circle cx="286" cy="206" r="4" fill="#FFD84D" />
        <path d="M300 214 L332 128 l14 6 -12 22 20 8 -8 18z" fill="#FF813A" />
        <circle cx="338" cy="132" r="3.2" fill="#080808" />
      </g>
    </svg>
  )
}
