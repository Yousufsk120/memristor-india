import { useState, useEffect, useRef, useCallback } from 'react'

// Neuromorphic Pulse Simulator
// Simulates conductance update under repeated voltage pulses
// Model: nonlinear potentiation/depression (fits most RRAM synaptic devices)

const PRESETS = [
  { label: 'HfO₂ Synapse', amp: 1.2, width: 100, interval: 200, polarity: 'pos', nonlin: 0.6, gmin: 0.1, gmax: 1.0 },
  { label: 'TaOₓ Synapse', amp: 0.8, width: 50, interval: 100, polarity: 'pos', nonlin: 0.3, gmin: 0.05, gmax: 0.9 },
  { label: 'Perovskite', amp: 0.5, width: 200, interval: 300, polarity: 'pos', nonlin: 0.8, gmin: 0.2, gmax: 1.0 },
]

function computePotDep(nPulses, amp, nonlin, gmin, gmax, depress = false) {
  // Nonlinear conductance model: ΔG = A * (Gmax - G)^α for potentiation
  //                                   = -A * (G - Gmin)^α for depression
  const alpha = 1 + nonlin * 2
  const A = amp * 0.08
  let G = depress ? gmax : gmin
  const points = [G]
  for (let i = 0; i < nPulses; i++) {
    if (!depress) {
      const dG = A * Math.pow(Math.max(0, gmax - G), alpha)
      G = Math.min(gmax, G + dG)
    } else {
      const dG = A * Math.pow(Math.max(0, G - gmin), alpha)
      G = Math.max(gmin, G - dG)
    }
    points.push(G)
  }
  return points
}

function computeSTDP(dtRange = 60) {
  // STDP window: ΔW = A+ * exp(-Δt/τ+) for pre→post, A- * exp(Δt/τ-) for post→pre
  const tauPlus = 20, tauMinus = 20, Aplus = 0.8, Aminus = -0.6
  const points = []
  for (let dt = -dtRange; dt <= dtRange; dt++) {
    const dw = dt > 0
      ? Aplus * Math.exp(-dt / tauPlus)
      : Aminus * Math.exp(dt / tauMinus)
    points.push({ dt, dw })
  }
  return points
}

export default function PulseSimulator() {
  const potCanvasRef = useRef(null)
  const stdpCanvasRef = useRef(null)
  const [preset, setPreset] = useState(0)
  const [nPulses, setNPulses] = useState(20)
  const [nonlin, setNonlin] = useState(PRESETS[0].nonlin)
  const [amp, setAmp] = useState(PRESETS[0].amp)
  const [mode, setMode] = useState('potdep') // potdep | stdp

  const applyPreset = (idx) => {
    setPreset(idx)
    const p = PRESETS[idx]
    setNonlin(p.nonlin)
    setAmp(p.amp)
  }

  const drawPotDep = useCallback(() => {
    const canvas = potCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const p = PRESETS[preset]

    ctx.clearRect(0, 0, W, H)
    const isDark = document.documentElement.classList.contains('dark')
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, W, H)

    const potPts = computePotDep(nPulses, amp, nonlin, p.gmin, p.gmax, false)
    const depPts = computePotDep(nPulses, amp, nonlin, p.gmin, p.gmax, true)

    const pad = { l: 42, r: 16, t: 20, b: 36 }
    const gw = W - pad.l - pad.r
    const gh = H - pad.t - pad.b

    const toX = (i) => pad.l + (i / nPulses) * gw
    const toY = (g) => pad.t + (1 - (g - p.gmin) / (p.gmax - p.gmin + 0.01)) * gh

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(71,85,105,0.12)'
    ctx.lineWidth = 1
    ;[0, 0.25, 0.5, 0.75, 1].forEach(f => {
      const y = toY(p.gmin + f * (p.gmax - p.gmin))
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke()
    })

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.5)' : 'rgba(71,85,105,0.5)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b)
    ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b)
    ctx.stroke()

    // Y labels
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'right'
    ;[0, 0.5, 1].forEach(f => {
      const g = p.gmin + f * (p.gmax - p.gmin)
      ctx.fillText(g.toFixed(2), pad.l - 4, toY(g) + 4)
    })

    // X label
    ctx.textAlign = 'center'
    ctx.fillText('Pulse #', W / 2, H - 4)

    // Y axis label
    ctx.save()
    ctx.translate(12, H / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('G (norm.)', 0, 0)
    ctx.restore()

    // Potentiation curve (green)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    potPts.forEach((g, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(g))
      else ctx.lineTo(toX(i), toY(g))
    })
    ctx.stroke()

    // Depression curve (red)
    ctx.strokeStyle = '#f87171'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    depPts.forEach((g, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(g))
      else ctx.lineTo(toX(i), toY(g))
    })
    ctx.stroke()

    // Dots at last values
    ;[[potPts, '#10b981'], [depPts, '#f87171']].forEach(([pts, col]) => {
      ctx.fillStyle = col
      ctx.beginPath()
      ctx.arc(toX(nPulses), toY(pts[pts.length - 1]), 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Legend
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'left'
    ;[['Potentiation (LTP)', '#10b981', 28], ['Depression (LTD)', '#f87171', 44]].forEach(([label, col, y]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(pad.l + 8, y); ctx.lineTo(pad.l + 28, y); ctx.stroke()
      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
      ctx.fillText(label, pad.l + 32, y + 4)
    })
  }, [preset, nPulses, nonlin, amp])

  const drawSTDP = useCallback(() => {
    const canvas = stdpCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    ctx.clearRect(0, 0, W, H)
    const isDark = document.documentElement.classList.contains('dark')
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, W, H)

    const pts = computeSTDP(50)
    const pad = { l: 44, r: 16, t: 20, b: 36 }
    const gw = W - pad.l - pad.r
    const gh = H - pad.t - pad.b

    const cx = pad.l + gw / 2
    const cy = pad.t + gh / 2

    const toX = dt => cx + (dt / 50) * (gw / 2)
    const toY = dw => cy - (dw / 0.8) * (gh / 2 - 8)

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(71,85,105,0.12)'
    ctx.lineWidth = 1
    ;[-0.5, 0.5].forEach(f => {
      ctx.beginPath(); ctx.moveTo(pad.l, toY(f)); ctx.lineTo(W - pad.r, toY(f)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(toX(f * 50), pad.t); ctx.lineTo(toX(f * 50), H - pad.b); ctx.stroke()
    })

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(pad.l, cy); ctx.lineTo(W - pad.r, cy)
    ctx.moveTo(cx, pad.t); ctx.lineTo(cx, H - pad.b)
    ctx.stroke()

    // Labels
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Δt (ms)', W / 2, H - 4)
    ctx.fillText('pre → post (LTP)', W - 60, cy - 8)
    ctx.fillText('post → pre (LTD)', 60, cy + 16)

    ctx.save(); ctx.translate(12, H / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('ΔW', 0, 0); ctx.restore()

    // Split STDP curve: green for LTP (Δt > 0), red for LTD (Δt < 0)
    const drawSide = (filterFn, col) => {
      const filtered = pts.filter(filterFn)
      if (!filtered.length) return
      ctx.strokeStyle = col
      ctx.lineWidth = 2.5
      ctx.beginPath()
      filtered.forEach(({ dt, dw }, i) => {
        if (i === 0) ctx.moveTo(toX(dt), toY(dw))
        else ctx.lineTo(toX(dt), toY(dw))
      })
      ctx.stroke()
    }

    drawSide(p => p.dt >= 0, '#10b981')
    drawSide(p => p.dt <= 0, '#f87171')

    // Origin dot
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()

    // Annotations
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'left'
    ctx.fillText('Synapse strengthens', cx + 8, pad.t + 16)
    ctx.fillStyle = '#f87171'; ctx.textAlign = 'right'
    ctx.fillText('Synapse weakens', cx - 8, pad.t + 16)
  }, [])

  useEffect(() => { drawPotDep() }, [drawPotDep])
  useEffect(() => { if (mode === 'stdp') drawSTDP() }, [mode, drawSTDP])

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🧠 Neuromorphic Pulse Simulator</h3>
        <p className="viz-subtitle">
          Simulate conductance update under repeated voltage pulses (LTP/LTD) and the STDP learning window.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="viz-controls" style={{ marginBottom: 16 }}>
        <button className={`viz-btn ${mode === 'potdep' ? 'active' : ''}`} onClick={() => setMode('potdep')}>
          📈 Potentiation / Depression
        </button>
        <button className={`viz-btn ${mode === 'stdp' ? 'active' : ''}`} onClick={() => setMode('stdp')}>
          ⚡ STDP Window
        </button>
      </div>

      {mode === 'potdep' && (
        <>
          {/* Preset selector */}
          <div className="viz-controls" style={{ marginBottom: 12 }}>
            {PRESETS.map((p, i) => (
              <button key={i} className={`viz-btn ${preset === i ? 'active' : ''}`}
                onClick={() => applyPreset(i)}>{p.label}</button>
            ))}
          </div>

          <canvas ref={potCanvasRef} width={480} height={260}
            className="viz-canvas" style={{ width: '100%', maxWidth: 480 }} />

          <div className="viz-controls">
            <div className="slider-group">
              <label>
                Pulses
                <span className="slider-value">{nPulses}</span>
              </label>
              <input type="range" min={5} max={50} step={1} value={nPulses}
                onChange={e => setNPulses(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #10b981 ${((nPulses-5)/45)*100}%, var(--slider-track) ${((nPulses-5)/45)*100}%)` }} />
            </div>
            <div className="slider-group">
              <label>
                Nonlinearity
                <span className="slider-value">{nonlin.toFixed(1)}</span>
              </label>
              <input type="range" min={0} max={1} step={0.05} value={nonlin}
                onChange={e => setNonlin(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #ec4899 ${nonlin*100}%, var(--slider-track) ${nonlin*100}%)` }} />
              <div className="slider-hint">0 = linear (ideal) → 1 = highly saturating</div>
            </div>
          </div>

          <div className="viz-note">
            Green = potentiation (LTP): conductance rises with repeated positive pulses.
            Red = depression (LTD): conductance falls with repeated negative pulses.
            Ideal synapse: symmetric, linear curves. Most real devices are nonlinear.
          </div>
        </>
      )}

      {mode === 'stdp' && (
        <>
          <canvas ref={stdpCanvasRef} width={480} height={260}
            className="viz-canvas" style={{ width: '100%', maxWidth: 480 }} />
          <div className="viz-note">
            STDP (Spike-Timing-Dependent Plasticity): synapse strengthens (LTP) when pre-synaptic neuron
            fires before post-synaptic; weakens (LTD) when it fires after. Time constant τ ≈ 20 ms.
            Implemented in hardware by shaping overlapping voltage pulses on the memristor.
          </div>
        </>
      )}
    </div>
  )
}
