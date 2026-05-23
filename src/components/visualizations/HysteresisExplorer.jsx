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

    for (let i = 0; i < N * 3; i++) {
      const t = i * dt
      const V = amp * Math.sin(2 * Math.PI * freq * t)
      const M = ron * (w / D) + roff * (1 - w / D)
      let I = V / M
      if (Math.abs(I) > Compliance) I = Math.sign(I) * Compliance
      const dw = muV * ron / (D * D) * I * dt * freq * 1e13
      w = Math.min(1, Math.max(0, w + dw))
      if (i >= N) points.push([V, I * 1000]) // mA
    }
    return points
  }, [muV])

  const draw = useCallback((ctx, w, h, freq, amp, animPhase, ron, roff) => {
    ctx.clearRect(0, 0, w, h)

    // Background
    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, w, h)

    const loop = computeLoop(freq, amp, ron, roff)
    if (!loop.length) return

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

    // Hysteresis loop — gradient color
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'

    for (let i = 1; i < loop.length; i++) {
      const t = i / loop.length
      const r = Math.round(59 + t * (236 - 59))
      const g = Math.round(130 + t * (72 - 130))
      const b = Math.round(246 + t * (153 - 246))
      ctx.strokeStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.moveTo(toX(loop[i - 1][0]), toY(loop[i - 1][1]))
      ctx.lineTo(toX(loop[i][0]), toY(loop[i][1]))
      ctx.stroke()
    }

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

    // "Pinched at origin" label
    ctx.fillStyle = '#f59e0b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('pinched at origin →', w / 2 + 40, h / 2 - 6)
  }, [computeLoop])

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
        <div><strong>Observation:</strong> As ON-OFF ratio increases, the hysteresis loop expands (wider and taller). The yellow dot traces the real-time operating point.</div>
      </div>
    </div>
  )
}
