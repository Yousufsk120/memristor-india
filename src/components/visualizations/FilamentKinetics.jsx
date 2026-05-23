import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * FILAMENT KINETICS: Growth & Rupture Dynamics
 *
 * Simulates oxygen-vacancy filament formation under electrical bias.
 * Shows how growth rate depends on applied voltage and current.
 *
 * Physics:
 * - Growth velocity ∝ V (linear approximation) or ∝ exp(V/V₀) (nonlinear)
 * - Current through filament → Joule heating → rupture risk
 * - Narrowest point ruptures first (hotspot)
 */

export default function FilamentKinetics() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [biasVoltage, setBiasVoltage] = useState(1.5)
  const [mode, setMode] = useState('grow') // grow | rupture | auto
  const [filamentWidth, setFilamentWidth] = useState(0)
  const [filamentHeight, setFilamentHeight] = useState(0.1)
  const [jouleHeat, setJouleHeat] = useState(0)
  const [modelType, setModelType] = useState('linear') // linear | exponential

  const filamentRef = useRef(0)
  const heightRef = useRef(0.1)

  const drawFilament = useCallback((ctx, w, h, bias, width, height, heat, model) => {
    ctx.clearRect(0, 0, w, h)

    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches

    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, w, h)

    // Device structure
    const pad = 30
    const devW = w - 2*pad
    const devH = h - 2*pad

    // Electrodes
    const metalH = 35
    const oxH = devH - metalH * 2 - 20
    const oxY = pad + metalH + 10

    // Bottom electrode
    const botGrad = ctx.createLinearGradient(0, pad + metalH + oxH + 10, 0, pad + metalH + oxH + 10 + metalH)
    botGrad.addColorStop(0, '#334155')
    botGrad.addColorStop(1, '#1e293b')
    ctx.fillStyle = botGrad
    ctx.fillRect(pad, pad + metalH + oxH + 10, devW, metalH)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('TiN (bottom)', w/2, pad + metalH + oxH + 32)

    // Top electrode
    const topGrad = ctx.createLinearGradient(0, pad, 0, pad + metalH)
    topGrad.addColorStop(0, '#1e293b')
    topGrad.addColorStop(1, '#334155')
    ctx.fillStyle = topGrad
    ctx.fillRect(pad, pad, devW, metalH)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('TiN (top)', w/2, pad + 20)

    // Oxide layer background
    const oxGrad = ctx.createLinearGradient(0, oxY, 0, oxY + oxH)
    oxGrad.addColorStop(0, '#1e40af')
    oxGrad.addColorStop(1, '#1d4ed8')
    ctx.fillStyle = oxGrad
    ctx.fillRect(pad, oxY, devW, oxH)
    ctx.fillStyle = '#93c5fd'
    ctx.font = '10px Inter, sans-serif'
    ctx.fillText('HfO₂ Active Layer', w/2, oxY + 16)

    // Vacancy distribution (background)
    ctx.fillStyle = 'rgba(93, 188, 253, 0.3)'
    for (let i = 0; i < 50; i++) {
      const seed = Math.sin(i * 13.7) * 10000
      const x = pad + ((seed % 1 + 1) / 2) * devW
      const seed2 = Math.sin(i * 7.3) * 10000
      const y = oxY + ((seed2 % 1 + 1) / 2) * oxH
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // FILAMENT
    if (width > 0.05) {
      const cx = w / 2
      const filTop = oxY + oxH * (1 - height)
      const filBot = oxY + oxH - 2

      // Filament width
      const filW = 6 + width * 20

      // Color based on heat
      const heatNorm = Math.min(1, heat / 2)
      const hue = 50 - heatNorm * 30 // Yellow to red
      const sat = 100 - heatNorm * 20
      const light = 50 - heatNorm * 15

      // Main filament
      const filGrad = ctx.createLinearGradient(0, filTop, 0, filBot)
      filGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${width * 0.6})`)
      filGrad.addColorStop(0.5, `hsla(${hue}, ${sat}%, ${light}%, ${width * 0.9})`)
      filGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, ${width * 0.95})`)
      ctx.fillStyle = filGrad

      ctx.beginPath()
      ctx.moveTo(cx - filW/3, filTop)
      ctx.quadraticCurveTo(cx - filW/2, filTop + (filBot - filTop)/2, cx - filW/2, filBot)
      ctx.lineTo(cx + filW/2, filBot)
      ctx.quadraticCurveTo(cx + filW/2, filTop + (filBot - filTop)/2, cx + filW/3, filTop)
      ctx.closePath()
      ctx.fill()

      // Glow based on heat
      if (heatNorm > 0.3) {
        ctx.shadowColor = `hsla(${hue}, ${sat}%, 50%, 0.5)`
        ctx.shadowBlur = 15 * heatNorm
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Hotspot at narrowest point (middle)
      if (heatNorm > 0.5) {
        const hotRadius = 3 + heatNorm * 5
        ctx.fillStyle = `hsla(0, 100%, 60%, ${heatNorm * 0.7})`
        ctx.beginPath()
        ctx.arc(cx, filTop + (filBot - filTop) * 0.4, hotRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Current and voltage info
    const Ron = 100
    const Roff = 16000
    const M = Ron * width + Roff * (1 - width)
    const I = Math.abs(bias) / M
    const P = Math.abs(I * bias) // Power dissipation

    // Panel with info
    ctx.fillStyle = isDark ? 'rgba(30,41,59,0.8)' : 'rgba(248,250,252,0.8)'
    ctx.fillRect(pad, h - 120, devW, 110)
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(71,85,105,0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(pad, h - 120, devW, 110)

    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Bias: ${bias.toFixed(2)}V | Width: ${(width*100).toFixed(1)}% | Height: ${(height*100).toFixed(1)}%`, pad + 12, h - 100)
    ctx.fillText(`Resistance: ${M.toFixed(0)}Ω | Current: ${(I*1e6).toFixed(1)}μA | Power: ${(P*1e3).toFixed(2)}mW`, pad + 12, h - 82)

    ctx.fillStyle = heat > 1 ? '#f87171' : '#10b981'
    ctx.font = 'bold 11px Inter, sans-serif'
    ctx.fillText(`Joule Heat Index: ${(heat).toFixed(2)}`, pad + 12, h - 64)

    if (heat > 1.5) {
      ctx.fillStyle = '#f87171'
      ctx.fillText('⚠ HIGH HEAT - RUPTURE RISK!', pad + 12, h - 45)
    }

    // Growth rate info
    const growthRate = model === 'linear'
      ? Math.abs(bias) * 0.15
      : Math.abs(bias) > 0.1 ? Math.exp(Math.abs(bias)) * 0.01 : 0

    ctx.fillStyle = isDark ? '#cbd5e1' : '#475569'
    ctx.font = '10px Inter, sans-serif'
    ctx.fillText(`Growth Rate (${model}): ${(growthRate).toFixed(3)}/cycle | Model: ${model === 'linear' ? 'V-linear' : 'Exponential'}`, pad + 12, h - 30)

  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      // Update filament state
      const Ron = 100
      const Roff = 16000
      const M = Ron * filamentRef.current + Roff * (1 - filamentRef.current)
      const I = Math.abs(biasVoltage) / M
      const P = Math.abs(I * biasVoltage)

      // Joule heating proportional to power
      const heatPower = P * 10
      setJouleHeat(prev => prev * 0.9 + heatPower * 0.1)

      // Growth/rupture logic
      if (mode === 'grow' || (mode === 'auto' && biasVoltage > 0)) {
        const growthRate = modelType === 'linear'
          ? Math.abs(biasVoltage) * 0.01
          : Math.abs(biasVoltage) > 0.1 ? Math.exp(Math.abs(biasVoltage) * 0.5) * 0.0005 : 0
        filamentRef.current = Math.min(1, filamentRef.current + growthRate)
      } else if (mode === 'rupture' || (mode === 'auto' && biasVoltage < 0)) {
        const ruptureRate = Math.abs(biasVoltage) * 0.008 + heatPower * 0.001
        filamentRef.current = Math.max(0, filamentRef.current - ruptureRate)
      }

      // Height evolves with width
      heightRef.current = 0.1 + filamentRef.current * 0.85

      setFilamentWidth(filamentRef.current)
      setFilamentHeight(heightRef.current)

      drawFilament(ctx, canvas.width, canvas.height, biasVoltage, filamentRef.current, heightRef.current, jouleHeat, modelType)
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [biasVoltage, mode, modelType, jouleHeat, drawFilament])

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🔥 Filament Kinetics & Growth</h3>
        <p className="viz-subtitle">
          Oxygen-vacancy filament grows under positive bias (SET), ruptures under negative bias (RESET).
          Watch Joule heating build up — excessive heat can cause catastrophic failure.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={580}
        height={420}
        className="viz-canvas"
        style={{ width: '100%', maxWidth: 580 }}
      />

      <div className="viz-controls">
        <div className="slider-group">
          <label>
            Applied Bias
            <span className="slider-value">{biasVoltage.toFixed(2)} V</span>
          </label>
          <input
            type="range"
            min={-2.5}
            max={2.5}
            step={0.05}
            value={biasVoltage}
            onChange={e => setBiasVoltage(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #f87171 0%, #f87171 ${((0 - (-2.5)) / 5) * 100}%, #94a3b8 ${((0 - (-2.5)) / 5) * 100}%, #94a3b8 ${((2.5 - (-2.5)) / 5 + ((biasVoltage - (-2.5)) / 5)) * 100}%, #10b981 ${((2.5 - (-2.5)) / 5 + ((biasVoltage - (-2.5)) / 5)) * 100}%, #10b981 100%)`
            }}
          />
          <div className="slider-hint">Negative = RESET (rupture) | Positive = SET (growth)</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="slider-group" style={{ flex: 1 }}>
            <label>Mode</label>
            <div className="viz-controls" style={{ marginTop: 6 }}>
              {['grow', 'rupture', 'auto'].map(m => (
                <button
                  key={m}
                  className={`viz-btn ${mode === m ? 'active' : ''}`}
                  onClick={() => setMode(m)}
                  style={{ flex: 1, fontSize: 12 }}
                >
                  {m === 'grow' ? '↑ SET' : m === 'rupture' ? '↓ RESET' : '⟳ Auto'}
                </button>
              ))}
            </div>
          </div>

          <div className="slider-group" style={{ flex: 1 }}>
            <label>Growth Model</label>
            <div className="viz-controls" style={{ marginTop: 6 }}>
              {['linear', 'exponential'].map(mt => (
                <button
                  key={mt}
                  className={`viz-btn ${modelType === mt ? 'active' : ''}`}
                  onClick={() => setModelType(mt)}
                  style={{ flex: 1, fontSize: 12 }}
                >
                  {mt === 'linear' ? '📈 Linear' : '📊 Exp'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="viz-note">
        <div><strong>SET (Positive Bias):</strong> Positive voltage drives oxygen vacancies toward bottom electrode, forming conductive filament → low resistance.</div>
        <div><strong>RESET (Negative Bias):</strong> Negative voltage reverses field, ions drift back, filament ruptures at narrowest point → high resistance.</div>
        <div><strong>Joule Heating:</strong> Power dissipation (P=V²/R) causes heat. High heat accelerates rupture. Balance: high current for fast switching, but thermal risk increases.</div>
      </div>
    </div>
  )
}
