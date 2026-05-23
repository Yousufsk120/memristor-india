import { useState, useEffect, useRef, useCallback } from 'react'

// Live Pinched Hysteresis Explorer
// Physics: Strukov 2008 linear drift model
// M(w) = Ron*(w/D) + Roff*(1-w/D), dw/dt = muV*Ron/D^2 * I
export default function HysteresisExplorer() {
  const canvasRef = useRef(null)
  const [frequency, setFrequency] = useState(1)
  const [amplitude, setAmplitude] = useState(1.5)
  const [isAnimating, setIsAnimating] = useState(true)
  const [phase, setPhase] = useState(0)
  const animRef = useRef(null)
  const phaseRef = useRef(0)

  // Interactive resistance parameters
  const [onOffRatio, setOnOffRatio] = useState(160) // Roff/Ron ratio
  const [ronValue, setRonValue] = useState(100) // LRS in Ohms

  const Ron = ronValue      // Ohms (LRS - Low Resistance State)
  const Roff = ronValue * onOffRatio   // Ohms (HRS - High Resistance State)
  const D = 1          // normalized
  const muV = 1e-14    // ion mobility (normalized)
  const Compliance = 0.5e-3 // A, soft compliance

  const computeLoop = useCallback((freq, amp, ron, roff) => {
    const N = 500
    const dt = 1 / (N * freq)
    let w = 0.5
    const points = []
    const forwardPath = []  // Rising voltage (increasing V)
    const reversePath = []  // Falling voltage (decreasing V)
    let lastV = 0

    for (let i = 0; i < N * 3; i++) {
      const t = i * dt
      const V = amp * Math.sin(2 * Math.PI * freq * t)
      const M = ron * (w / D) + roff * (1 - w / D)
      let I = V / M
      if (Math.abs(I) > Compliance) I = Math.sign(I) * Compliance
      const dw = muV * ron / (D * D) * I * dt * freq * 1e13
      w = Math.min(1, Math.max(0, w + dw))

      if (i >= N) {
        const point = [V, I * 1000] // mA
        points.push(point)

        // Separate forward and reverse paths
        if (V > lastV) {
          // Voltage rising → forward path
          forwardPath.push(point)
        } else {
          // Voltage falling → reverse path
          reversePath.push(point)
        }
      }
      lastV = V
    }
    return { points, forwardPath, reversePath }
  }, [muV])

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

    // Calculate loop area (area between forward and reverse paths)
    const loopArea = calculateLoopArea(loop)

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

    // Frequency and parameters label
    const freqLabel = freq >= 1000 ? `${(freq / 1000).toFixed(0)} kHz` : `${freq.toFixed(1)} Hz`
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`f = ${freqLabel}`, 35, 30)
    ctx.fillText(`A = ${amp.toFixed(1)} V`, 35, 48)
    ctx.font = '10px Inter, sans-serif'
    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.fillText(`LRS (ON) = ${ron.toFixed(0)}Ω  |  HRS (OFF) = ${roff.toFixed(0)}Ω`, 35, 62)
    ctx.fillStyle = '#10b981'
    ctx.fillText(`ON-OFF Ratio = ${(roff/ron).toFixed(0)}:1`, 35, 75)

    // Loop area display with color gradient based on size
    const maxArea = 10 // Normalized maximum for color scaling
    const displayAreaRatio = Math.min(loopArea / maxArea, 1)
    const areaColor = displayAreaRatio > 0.7 ? '#ef4444' : displayAreaRatio > 0.4 ? '#f59e0b' : '#10b981'
    ctx.fillStyle = areaColor
    ctx.font = 'bold 13px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`Loop Area = ${loopArea.toFixed(3)} V·mA`, w - 35, 30)

    // Energy dissipation indicator (proportional to loop area)
    const energyBar = Math.min((loopArea / maxArea) * 100, 100)
    ctx.fillStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(71,85,105,0.2)'
    ctx.fillRect(w - 150, 42, 115, 8)
    ctx.fillStyle = areaColor
    ctx.fillRect(w - 150, 42, (energyBar / 100) * 115, 8)
    ctx.strokeStyle = areaColor
    ctx.lineWidth = 1
    ctx.strokeRect(w - 150, 42, 115, 8)
    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '9px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('Energy dissipation', w - 35, 60)

    // "Pinched at origin" label
    ctx.fillStyle = '#f59e0b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('pinched at origin →', w / 2 + 40, h / 2 - 6)
  }, [computeLoop, calculateLoopArea])

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
            Frequency
            <span className="slider-value">
              {frequency >= 1000 ? `${(frequency / 1000).toFixed(0)} kHz` : `${frequency.toFixed(1)} Hz`}
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
          <div className="slider-hint">↑ Higher frequency → loop collapses (device freezes)</div>
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
        <div><strong>Physics Model:</strong> Strukov et al. (2008) linear drift with memristive behavior</div>
        <div><strong>Current Values:</strong> LRS (ON) = {Ron.toFixed(0)}Ω, HRS (OFF) = {Roff.toFixed(0)}Ω, ON-OFF Ratio = {(Roff/Ron).toFixed(0)}:1</div>
        <div><strong>Hysteresis Effect:</strong> 🔵 Forward path (voltage ↑) and 🔴 Reverse path (voltage ↓) are DIFFERENT curves. The gap between them is the hysteresis loop area.</div>
        <div><strong>Physical Meaning:</strong> Area = Energy dissipated per cycle. Higher ON-OFF ratio → wider gap → larger area → more energy loss</div>
        <div><strong>Memory Effect:</strong> The memristor "remembers" where it came from. Going UP takes a different path than going DOWN due to state variable (filament width) evolution.</div>
        <div><strong>Experiment:</strong> Increase ON-OFF Ratio → watch the forward (blue) and reverse (red) paths separate more. This is true hysteresis!</div>
      </div>
    </div>
  )
}
