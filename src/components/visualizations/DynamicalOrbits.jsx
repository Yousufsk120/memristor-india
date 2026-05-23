import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * DYNAMICAL ORBITS: I-V Hysteresis Phase Space
 *
 * Shows how the memristor operates as a dynamical system:
 * - State variable: filament width (w)
 * - Input: voltage (V)
 * - Output: current (I)
 * - Model: Strukov 2008 with state evolution
 *
 * Key insight: At low frequency, system tracks applied voltage (wide hysteresis).
 * At high frequency, system can't follow (loop collapses to line).
 */

export default function DynamicalOrbits() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [frequency, setFrequency] = useState(10)
  const [amplitude, setAmplitude] = useState(2.0)
  const [showState, setShowState] = useState(true)
  const [showTrajectory, setShowTrajectory] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  const phaseRef = useRef(0)
  const trajectoryRef = useRef([]) // [t, w, V, I]

  const Ron = 100
  const Roff = 16000
  const D = 1
  const muV = 1e-14
  const Compliance = 0.5e-3

  // Compute the full state dynamics: dw/dt and I = V/M
  const computeStateEvo = useCallback((freq, amp, duration = 3) => {
    const dt = 0.0001
    const steps = Math.floor(duration / (1/freq) / dt)
    let w = 0.5
    const data = []

    for (let i = 0; i < steps; i++) {
      const t = i * dt
      const V = amp * Math.sin(2 * Math.PI * freq * t)
      const M = Ron * (w / D) + Roff * (1 - w / D)
      let I = V / M
      if (Math.abs(I) > Compliance) I = Math.sign(I) * Compliance

      // State evolution
      const dw = muV * Ron / (D * D) * I * dt * freq * 1e13
      w = Math.min(1, Math.max(0, w + dw))

      // Record every Nth point for visualization
      if (i % Math.ceil(steps / 2000) === 0) {
        data.push({ t, w, V, I: I * 1000, M })
      }
    }
    return data
  }, [])

  const draw = useCallback((ctx, w, h, freq, amp, phase) => {
    ctx.clearRect(0, 0, w, h)

    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, w, h)

    const data = computeStateEvo(freq, amp)
    if (!data.length) return

    // Plot 1: I-V Hysteresis (left side)
    const pad = 40
    const w1 = w * 0.48
    const h1 = h - 2*pad
    const x1 = pad, y1 = pad

    // Find I-V ranges
    const vMax = Math.max(...data.map(d => Math.abs(d.V))) * 1.1
    const iMax = Math.max(...data.map(d => Math.abs(d.I))) * 1.2

    const toX_iv = (v) => x1 + (v / vMax + 1) / 2 * w1
    const toY_iv = (i) => y1 + h1 * 0.5 - (i / iMax) * (h1 * 0.45)

    // Grid and axes for I-V
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(71,85,105,0.15)'
    ctx.lineWidth = 1
    ;[0, 0.5, 1].forEach(f => {
      const xpos = x1 + f * w1
      ctx.beginPath(); ctx.moveTo(xpos, y1); ctx.lineTo(xpos, y1 + h1); ctx.stroke()
      const ypos = y1 + f * h1
      ctx.beginPath(); ctx.moveTo(x1, ypos); ctx.lineTo(x1 + w1, ypos); ctx.stroke()
    })

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x1, y1 + h1*0.5); ctx.lineTo(x1 + w1, y1 + h1*0.5)
    ctx.moveTo(x1, y1); ctx.lineTo(x1, y1 + h1)
    ctx.stroke()

    // Labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('V (volt)', x1 + w1/2, y1 + h1 + 16)
    ctx.save()
    ctx.translate(12, y1 + h1/2)
    ctx.rotate(-Math.PI/2)
    ctx.textAlign = 'center'
    ctx.fillText('I (mA)', 0, 0)
    ctx.restore()

    // Draw I-V hysteresis loop with gradient
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    for (let i = 1; i < data.length; i++) {
      const t = i / data.length
      const r = Math.round(59 + t * (236 - 59))
      const g = Math.round(130 + t * (72 - 130))
      const b = Math.round(246 + t * (153 - 246))
      ctx.strokeStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.moveTo(toX_iv(data[i-1].V), toY_iv(data[i-1].I))
      ctx.lineTo(toX_iv(data[i].V), toY_iv(data[i].I))
      ctx.stroke()
    }

    // Title for plot 1
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('I-V Hysteresis (Current vs Voltage)', x1 + w1/2, pad - 8)

    // Plot 2: State Space (w, V) on right side
    const w2 = w * 0.48
    const h2 = h - 2*pad
    const x2 = w * 0.5 + pad, y2 = pad

    const wMax = 1.0
    const toX_ws = (wval) => x2 + (wval / wMax) * w2
    const toY_ws = (v) => y2 + h2 * 0.5 - (v / vMax) * (h2 * 0.45)

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(71,85,105,0.15)'
    ctx.lineWidth = 1
    ;[0, 0.5, 1].forEach(f => {
      const xpos = x2 + f * w2
      ctx.beginPath(); ctx.moveTo(xpos, y2); ctx.lineTo(xpos, y2 + h2); ctx.stroke()
      const ypos = y2 + f * h2
      ctx.beginPath(); ctx.moveTo(x2, ypos); ctx.lineTo(x2 + w2, ypos); ctx.stroke()
    })

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x2, y2 + h2*0.5); ctx.lineTo(x2 + w2, y2 + h2*0.5)
    ctx.moveTo(x2, y2); ctx.lineTo(x2, y2 + h2)
    ctx.stroke()

    // Orbit in (w, V) space
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    for (let i = 1; i < data.length; i++) {
      ctx.beginPath()
      ctx.moveTo(toX_ws(data[i-1].w), toY_ws(data[i-1].V))
      ctx.lineTo(toX_ws(data[i].w), toY_ws(data[i].V))
      ctx.stroke()
    }

    // Labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('w (filament state)', x2 + w2/2, y2 + h2 + 16)
    ctx.save()
    ctx.translate(12, y2 + h2/2)
    ctx.rotate(-Math.PI/2)
    ctx.textAlign = 'center'
    ctx.fillText('V (volt)', 0, 0)
    ctx.restore()

    // Title for plot 2
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Orbital Dynamics (State vs Voltage)', x2 + w2/2, pad - 8)

    // Info box
    ctx.fillStyle = isDark ? 'rgba(30,41,59,0.7)' : 'rgba(248,250,252,0.7)'
    ctx.fillRect(12, h - 90, w - 24, 78)
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(71,85,105,0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(12, h - 90, w - 24, 78)

    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`f = ${freq.toFixed(1)} Hz | A = ${amp.toFixed(1)} V | R_ON = ${Ron}Ω | R_OFF = ${Roff}Ω`, 20, h - 68)
    ctx.fillText(`ON/OFF Ratio = ${(Roff/Ron).toFixed(0)}:1 | Memory = state-dependent resistance`, 20, h - 52)
    ctx.font = '10px Inter, sans-serif'
    ctx.fillStyle = '#10b981'
    ctx.fillText('Low Freq: Wide loop (ionic motion follows voltage)', 20, h - 32)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('High Freq: Narrow loop (device freezes, acts resistive)', 20, h - 16)
  }, [computeStateEvo])

  useEffect(() => {
    if (!isAnimating) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      phaseRef.current = (phaseRef.current + frequency * 0.01) % 1
      draw(ctx, canvas.width, canvas.height, frequency, amplitude, phaseRef.current)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isAnimating, frequency, amplitude, draw])

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🌀 Dynamical Orbits & Phase Space</h3>
        <p className="viz-subtitle">
          Visualize the memristor as a dynamical system: state variable (filament width) evolves
          under applied voltage, tracing orbits in phase space. Frequency determines loop shape.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={700}
        height={380}
        className="viz-canvas"
        style={{ width: '100%', maxWidth: 700 }}
      />

      <div className="viz-controls">
        <div className="slider-group">
          <label>
            Frequency
            <span className="slider-value">{frequency.toFixed(1)} Hz</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={1000}
            step={0.5}
            value={frequency}
            onChange={e => setFrequency(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #3b82f6 ${Math.log(frequency) / Math.log(1000) * 100}%, var(--slider-track) ${Math.log(frequency) / Math.log(1000) * 100}%)` }}
          />
          <div className="slider-hint">↑ Higher frequency → hysteresis loop narrows (pinches)</div>
        </div>

        <div className="slider-group">
          <label>
            Amplitude
            <span className="slider-value">{amplitude.toFixed(1)} V</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={amplitude}
            onChange={e => setAmplitude(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #ec4899 ${((amplitude - 0.5) / 2.5) * 100}%, var(--slider-track) ${((amplitude - 0.5) / 2.5) * 100}%)` }}
          />
        </div>

        <button
          className={`viz-btn ${isAnimating ? 'active' : ''}`}
          onClick={() => setIsAnimating(a => !a)}
        >
          {isAnimating ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div className="viz-note">
        <div><strong>Left Plot (I-V Hysteresis):</strong> Blue→Pink gradient traces the current-voltage curve. Always pinches at origin (V=0, I=0).</div>
        <div><strong>Right Plot (Orbital Dynamics):</strong> Purple curve shows how the filament state (w) evolves with applied voltage — the "orbit" in state space.</div>
        <div><strong>Physics:</strong> At low frequency, ionic motion tracks the voltage → wide loop. At high frequency, ions can't move fast enough → loop collapses to resistive line.</div>
      </div>
    </div>
  )
}
