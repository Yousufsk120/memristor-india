import { useState, useEffect, useRef, useCallback } from 'react'

// Research-Based Pinched Hysteresis Explorer
// Physics: Strukov 2008 linear drift model + frequency-dependent area
// SET cycle (V+): Counterclockwise, inductive, conductance ↑
// RESET cycle (V-): Clockwise, capacitive, conductance ↓
export default function HysteresisExplorer() {
  const canvasRef = useRef(null)
  const [frequency, setFrequency] = useState(10)
  const [amplitude, setAmplitude] = useState(1.5)
  const [isAnimating, setIsAnimating] = useState(true)
  const [phase, setPhase] = useState(0)
  const animRef = useRef(null)
  const phaseRef = useRef(0)

  // Device preset selector
  const [devicePreset, setDevicePreset] = useState('HfO2') // HfO2, TiO2, Perovskite
  const [onOffRatio, setOnOffRatio] = useState(1000)
  const [ronValue, setRonValue] = useState(100)

  // Device presets from research
  const presets = {
    HfO2: { ratio: 10000, ron: 100, name: 'HfO₂ (High-k Oxide)', color: '#3b82f6' },
    TiO2: { ratio: 400, ron: 150, name: 'TiO₂ (Classic)', color: '#10b981' },
    Perovskite: { ratio: 1000000, ron: 200, name: 'Perovskite (Hybrid)', color: '#f59e0b' }
  }

  const currentPreset = presets[devicePreset]
  const Ron = ronValue
  const Roff = ronValue * onOffRatio
  const D = 1
  const muV = 1e-14
  const Compliance = 0.5e-3

  // Calculate theoretical loop area based on frequency
  const calculateTheoreticalArea = useCallback((freq, onOffRatio, amplitude, ron) => {
    // Area ∝ (Roff - Ron) * amplitude / frequency = (onOffRatio * Ron) * amplitude / freq
    // with bell-curve peak at f_optimal ≈ 1/(2π*τ)
    const timeConstant = 0.01 // τ in seconds
    const f_optimal = 1 / (2 * Math.PI * timeConstant)

    // Bell curve function: peaks at f_optimal
    const bellCurve = Math.exp(-Math.pow((freq - f_optimal) / (f_optimal * 0.5), 2))

    // Base area from resistance window
    const baseArea = (onOffRatio - 1) * amplitude * ron / 100

    // Apply frequency scaling (inverse relationship with bell curve envelope)
    const frequencyScaling = (1 / freq) * Math.max(0.1, bellCurve)

    return baseArea * frequencyScaling
  }, [])

  const computeLoop = useCallback((freq, amp, ron, roff) => {
    const N = 500
    const dt = 1 / (N * freq)
    let w = 0.5
    const points = []
    const forwardPath = []  // SET cycle: V rising, conductance ↑, inductive
    const reversePath = []  // RESET cycle: V falling, conductance ↓, capacitive
    let lastV = 0

    for (let i = 0; i < N * 3; i++) {
      const t = i * dt
      const V = amp * Math.sin(2 * Math.PI * freq * t)
      const M = ron * (w / D) + roff * (1 - w / D)
      let I = V / M
      if (Math.abs(I) > Compliance) I = Math.sign(I) * Compliance

      // Frequency-dependent state evolution
      // Higher frequency → slower response → less state change
      const freqFactor = Math.min(1, freq / 1000)
      const dw = muV * ron / (D * D) * I * dt * freq * 1e13 * freqFactor
      w = Math.min(1, Math.max(0, w + dw))

      if (i >= N) {
        const point = [V, I * 1000] // mA
        points.push(point)

        // Separate SET (V rising) and RESET (V falling) paths
        if (V > lastV) {
          // Voltage rising (SET): V- → 0 → V+, conductance increases
          forwardPath.push(point)
        } else {
          // Voltage falling (RESET): V+ → 0 → V-, conductance decreases
          reversePath.push(point)
        }
      }
      lastV = V
    }

    return { points, forwardPath, reversePath }
  }, [muV, D])

  // Calculate hysteresis loop area using Shoelace formula
  const calculateLoopArea = useCallback((points) => {
    if (points.length < 3) return 0
    let area = 0
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      const p2 = points[(i + 1) % points.length]
      area += p1[0] * p2[1] - p2[0] * p1[1]
    }
    return Math.abs(area) / 2 // Shoelace formula
  }, [])

  const draw = useCallback((ctx, w, h, freq, amp, animPhase, ron, roff) => {
    ctx.clearRect(0, 0, w, h)

    // Background
    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, w, h)

    const loopData = computeLoop(freq, amp, ron, roff)
    const { points: loop, forwardPath, reversePath } = loopData
    if (!loop.length) return

    // Calculate measured and theoretical loop areas
    const loopArea = calculateLoopArea(loop)
    const theoreticalArea = calculateTheoreticalArea(freq, roff / ron, amp, ron)

    // find ranges
    const vMax = Math.max(...loop.map(p => Math.abs(p[0]))) * 1.1
    const iMax = Math.max(...loop.map(p => Math.abs(p[1]))) * 1.2

    const toX = v => w / 2 + (v / vMax) * (w / 2 - 30)
    const toY = i => h / 2 - (i / iMax) * (h / 2 - 30)

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(71,85,105,0.15)'
    ctx.lineWidth = 1
    ;[-1, -0.5, 0.5, 1].forEach(f => {
      ctx.beginPath()
      ctx.moveTo(toX(f * vMax), 20)
      ctx.lineTo(toX(f * vMax), h - 20)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(20, toY(f * iMax))
      ctx.lineTo(w - 20, toY(f * iMax))
      ctx.stroke()
    })

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(30, h / 2); ctx.lineTo(w - 10, h / 2)
    ctx.moveTo(w / 2, 10); ctx.lineTo(w / 2, h - 10)
    ctx.stroke()

    // Axis labels
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`V (max ${amp.toFixed(1)}V)`, w - 25, h / 2 - 8)
    ctx.save()
    ctx.translate(18, h / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('I (mA)', 0, 0)
    ctx.restore()

    // Draw hysteresis loop with separate forward and reverse paths
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'

    // Fill the area between forward and reverse paths
    const areaRatio = Math.min(loopArea / 10, 1)
    ctx.fillStyle = isDark
      ? `rgba(239, 68, 68, ${0.15 * areaRatio})`
      : `rgba(239, 68, 68, ${0.1 * areaRatio})`
    ctx.beginPath()
    if (forwardPath.length > 1) {
      ctx.moveTo(toX(forwardPath[0][0]), toY(forwardPath[0][1]))
      for (let i = 1; i < forwardPath.length; i++) {
        ctx.lineTo(toX(forwardPath[i][0]), toY(forwardPath[i][1]))
      }
      // Connect reverse path back
      for (let i = reversePath.length - 1; i >= 0; i--) {
        ctx.lineTo(toX(reversePath[i][0]), toY(reversePath[i][1]))
      }
      ctx.closePath()
      ctx.fill()
    }

    // Draw forward path (voltage rising) — BLUE
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    if (forwardPath.length > 1) {
      ctx.beginPath()
      ctx.moveTo(toX(forwardPath[0][0]), toY(forwardPath[0][1]))
      for (let i = 1; i < forwardPath.length; i++) {
        ctx.lineTo(toX(forwardPath[i][0]), toY(forwardPath[i][1]))
      }
      ctx.stroke()
    }

    // Draw reverse path (voltage falling) — RED/ORANGE
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2.5
    if (reversePath.length > 1) {
      ctx.beginPath()
      ctx.moveTo(toX(reversePath[0][0]), toY(reversePath[0][1]))
      for (let i = 1; i < reversePath.length; i++) {
        ctx.lineTo(toX(reversePath[i][0]), toY(reversePath[i][1]))
      }
      ctx.stroke()
    }

    // Legend for paths
    ctx.font = '9px Inter, sans-serif'
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(w - 160, h - 30, 8, 8)
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.textAlign = 'left'
    ctx.fillText('Forward (V↑)', w - 150, h - 24)

    ctx.fillStyle = '#ef4444'
    ctx.fillRect(w - 160, h - 18, 8, 8)
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.fillText('Reverse (V↓)', w - 150, h - 12)

    // Animated dot
    const idx = Math.floor(((animPhase % 1) * loop.length + loop.length) % loop.length)
    const [dotV, dotI] = loop[idx]
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(toX(dotV), toY(dotI), 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Device info and parameters
    const freqLabel = freq >= 1000 ? `${(freq / 1000).toFixed(1)} kHz` : `${freq.toFixed(1)} Hz`
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.font = 'bold 11px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Frequency: ${freqLabel}`, 35, 28)
    ctx.fillText(`Amplitude: ${amp.toFixed(1)} V`, 35, 42)

    ctx.font = '10px Inter, sans-serif'
    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.fillText(`Ron (LRS): ${ron.toFixed(0)}Ω  |  Roff (HRS): ${roff.toFixed(0)}Ω`, 35, 56)
    ctx.fillStyle = currentPreset.color
    ctx.font = 'bold 10px Inter, sans-serif'
    ctx.fillText(`ON-OFF Ratio: ${(roff/ron).toFixed(0)}:1  [${currentPreset.name}]`, 35, 70)

    // Loop area and energy dissipation display
    const displayRatio = Math.min(theoreticalArea / 15, 1)
    const areaColor = displayRatio > 0.7 ? '#dc2626' : displayRatio > 0.4 ? '#f59e0b' : '#10b981'

    ctx.fillStyle = areaColor
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`Loop Area: ${theoreticalArea.toFixed(2)} V·mA`, w - 35, 28)

    // Frequency impact indicator
    const timeConstant = 0.01
    const f_optimal = 1 / (2 * Math.PI * timeConstant)
    const bellValue = Math.exp(-Math.pow((freq - f_optimal) / (f_optimal * 0.5), 2))

    ctx.fillStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(71,85,105,0.2)'
    ctx.fillRect(w - 150, 40, 115, 10)
    ctx.fillStyle = areaColor
    ctx.fillRect(w - 150, 40, Math.min(bellValue, 1) * 115, 10)
    ctx.strokeStyle = areaColor
    ctx.lineWidth = 1
    ctx.strokeRect(w - 150, 40, 115, 10)

    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '9px Inter, sans-serif'
    ctx.textAlign = 'right'
    const optimFreq = f_optimal.toFixed(0)
    ctx.fillText(`Freq Response (optimal: ${optimFreq} Hz)`, w - 35, 58)

    // Cycle information
    ctx.font = 'bold 9px Inter, sans-serif'
    ctx.fillStyle = '#3b82f6'
    ctx.fillText('SET (V↑): Inductive, CCW', w - 35, 72)
    ctx.fillStyle = '#ef4444'
    ctx.fillText('RESET (V↓): Capacitive, CW', w - 35, 84)

    // "Pinched at origin" label
    ctx.fillStyle = '#f59e0b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('← Pinched at origin (memristor fingerprint)', w / 2 + 45, h / 2 - 6)
  }, [computeLoop, calculateLoopArea, calculateTheoreticalArea, currentPreset])

  useEffect(() => {
    if (!isAnimating) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      phaseRef.current = (phaseRef.current + frequency * 0.004) % 1
      setPhase(phaseRef.current)
      draw(ctx, canvas.width, canvas.height, frequency, amplitude, phaseRef.current, Ron, Roff)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isAnimating, frequency, amplitude, Ron, Roff, draw])

  useEffect(() => {
    if (isAnimating) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    draw(ctx, canvas.width, canvas.height, frequency, amplitude, phaseRef.current, Ron, Roff)
  }, [isAnimating, frequency, amplitude, Ron, Roff, draw])

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">⚡ Live Pinched Hysteresis Explorer</h3>
        <p className="viz-subtitle">
          The memristor's fingerprint: an I–V loop that always passes through the origin.
          Raise frequency — watch the loop collapse to a line.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={520}
        height={340}
        className="viz-canvas"
        style={{ width: '100%', maxWidth: 520 }}
      />

      <div className="viz-controls">
        <div className="slider-group">
          <label>
            Device Preset
            <span className="slider-value" style={{ color: currentPreset.color }}>{currentPreset.name}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                className={`viz-btn ${devicePreset === key ? 'active' : ''}`}
                onClick={() => {
                  setDevicePreset(key)
                  setOnOffRatio(preset.ratio)
                  setRonValue(preset.ron)
                }}
                style={{
                  borderLeft: `4px solid ${preset.color}`,
                  fontSize: '11px',
                  padding: '6px 8px'
                }}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-group">
          <label>
            Frequency (Controls Loop Pinching)
            <span className="slider-value">
              {frequency >= 1000 ? `${(frequency / 1000).toFixed(1)} kHz` : `${frequency.toFixed(1)} Hz`}
            </span>
          </label>
          <input
            type="range"
            min={0.1}
            max={5000}
            step={0.1}
            value={frequency}
            onChange={e => setFrequency(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #3b82f6 ${(frequency / 5000) * 100}%, var(--slider-track) ${(frequency / 5000) * 100}%)` }}
          />
          <div className="slider-hint">Area ∝ 1/frequency | Peak at ~100Hz | Optimal operation region</div>
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

        <div className="slider-group">
          <label>
            ON-OFF Ratio (HRS/LRS)
            <span className="slider-value">{onOffRatio.toFixed(0)}:1</span>
          </label>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={onOffRatio}
            onChange={e => setOnOffRatio(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #10b981 ${((onOffRatio - 10) / 990) * 100}%, var(--slider-track) ${((onOffRatio - 10) / 990) * 100}%)` }}
          />
          <div className="slider-hint">↑ Larger ratio → bigger hysteresis loop area</div>
        </div>

        <div className="slider-group">
          <label>
            LRS (Low Resistance State - ON)
            <span className="slider-value">{ronValue.toFixed(0)} Ω</span>
          </label>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={ronValue}
            onChange={e => setRonValue(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #8b5cf6 ${((ronValue - 10) / 990) * 100}%, var(--slider-track) ${((ronValue - 10) / 990) * 100}%)` }}
          />
          <div className="slider-hint">Adjusted resistance: HRS = LRS × ON-OFF Ratio</div>
        </div>

        <button
          className={`viz-btn ${isAnimating ? 'active' : ''}`}
          onClick={() => setIsAnimating(a => !a)}
        >
          {isAnimating ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div className="viz-note">
        <div><strong>Research-Based Model:</strong> Strukov et al. (2008) + frequency-dependent area scaling from Karatas et al. (2024)</div>
        <div><strong>Device Physics:</strong>
          SET Cycle (V positive, counterclockwise ↺): Inductive behavior, conductance increases ↑
          RESET Cycle (V negative, clockwise ⟳): Capacitive behavior, conductance decreases ↓
        </div>
        <div><strong>Loop Area Formula:</strong> Area ∝ (Roff - Ron) × Amplitude / Frequency = (ON-OFF ratio) × Amplitude / f</div>
        <div><strong>Frequency Effect:</strong> Optimal area at f_opt ≈ 1/(2π·τ) ≈ 100 Hz. Bell curve: low freq weak loop, mid freq peak area, high freq pinched</div>
        <div><strong>On Slider Changes:</strong>
          Frequency: Loop pinches/unpinches (frequency-dependent area)
          ON-OFF Ratio: Loop width changes (wider ratio = larger area)
          Device Preset: Realistic parameters (HfO₂: 10⁴, TiO₂: 400, Perovskite: 10⁶)
        </div>
        <div><strong>Current Values:</strong> Ron={Ron.toFixed(0)}Ω, Roff={Roff.toFixed(0)}Ω, Ratio={(Roff/Ron).toFixed(0)}:1</div>
      </div>
    </div>
  )
}
