import { useState, useEffect, useRef } from 'react'

export default function FilamentAnimation() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [mode, setMode] = useState('auto') // auto | set | reset | off
  const [progress, setProgress] = useState(0) // 0=fully off, 1=fully on
  const progressRef = useRef(0)
  const dirRef = useRef(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    const draw = (prog) => {
      ctx.clearRect(0, 0, W, H)
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      // Background layers
      const metalH = 40
      const oxH = H - metalH * 2 - 20
      const oxY = metalH + 10

      // Bottom electrode
      const botGrad = ctx.createLinearGradient(0, H - metalH, 0, H)
      botGrad.addColorStop(0, '#334155')
      botGrad.addColorStop(1, '#1e293b')
      ctx.fillStyle = botGrad
      ctx.fillRect(20, H - metalH - 10, W - 40, metalH)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Bottom Electrode (TiN)', W / 2, H - metalH + 8)

      // Top electrode
      const topGrad = ctx.createLinearGradient(0, 0, 0, metalH)
      topGrad.addColorStop(0, '#1e293b')
      topGrad.addColorStop(1, '#334155')
      ctx.fillStyle = topGrad
      ctx.fillRect(20, 10, W - 40, metalH)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('Top Electrode (TiN/Pt)', W / 2, 25)

      // Oxide layer
      const oxGrad = ctx.createLinearGradient(0, oxY, 0, oxY + oxH)
      oxGrad.addColorStop(0, '#1e40af')
      oxGrad.addColorStop(1, '#1d4ed8')
      ctx.fillStyle = oxGrad
      ctx.fillRect(20, oxY, W - 40, oxH)
      ctx.fillStyle = '#93c5fd'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('HfO₂ / TiO₂ Active Layer', W / 2, oxY + 15)

      // Vacancy dots (random but seeded)
      const dots = []
      for (let i = 0; i < 40; i++) {
        const seed = Math.sin(i * 13.7) * 10000
        const x = 30 + ((seed % 1 + 1) / 2) * (W - 60)
        const seed2 = Math.sin(i * 7.3 + 1) * 10000
        const y = oxY + 20 + ((seed2 % 1 + 1) / 2) * (oxH - 40)
        dots.push({ x, y })
      }

      dots.forEach(({ x, y }) => {
        const cx = W / 2
        const distFromCenter = Math.abs(x - cx) / (W / 2)
        const onFilament = distFromCenter < 0.15
        const opacity = onFilament
          ? Math.max(0.1, 1 - prog * 0.7)
          : 0.5 + Math.sin(prog * Math.PI * 2 + x) * 0.2

        ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Conductive filament
      if (prog > 0.05) {
        const filW = 8 + prog * 14
        const filTop = oxY + oxH * (1 - prog)
        const filBot = oxY + oxH - 2

        const filGrad = ctx.createLinearGradient(0, filTop, 0, filBot)
        filGrad.addColorStop(0, `rgba(251,191,36,${prog * 0.5})`)
        filGrad.addColorStop(0.5, `rgba(251,191,36,${prog * 0.85})`)
        filGrad.addColorStop(1, `rgba(251,191,36,${prog * 0.9})`)
        ctx.fillStyle = filGrad

        // Draw tapered filament
        const cx = W / 2
        ctx.beginPath()
        ctx.moveTo(cx - filW / 4, filTop)
        ctx.quadraticCurveTo(cx - filW / 2, oxY + oxH / 2, cx - filW / 2, filBot)
        ctx.lineTo(cx + filW / 2, filBot)
        ctx.quadraticCurveTo(cx + filW / 2, oxY + oxH / 2, cx + filW / 4, filTop)
        ctx.closePath()
        ctx.fill()

        // Glow
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 10 * prog
        ctx.fill()
        ctx.shadowBlur = 0

        if (prog > 0.95) {
          ctx.fillStyle = 'rgba(251,191,36,0.3)'
          ctx.beginPath()
          ctx.arc(cx, filTop, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // State label
      const stateText = prog > 0.9 ? 'SET (Low Resistance = ON)' :
        prog > 0.1 ? 'Switching…' : 'RESET (High Resistance = OFF)'
      const stateColor = prog > 0.9 ? '#34d399' : prog > 0.1 ? '#f59e0b' : '#f87171'
      ctx.fillStyle = stateColor
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(stateText, W / 2, H - 2)

      // Resistance readout
      const R = Math.round(100 + (1 - prog) * 15900)
      ctx.fillStyle = stateColor
      ctx.font = '11px JetBrains Mono, monospace'
      ctx.fillText(`R ≈ ${R.toLocaleString()} Ω`, W / 2, H - 18)
    }

    const animate = () => {
      if (mode === 'auto') {
        progressRef.current += dirRef.current * 0.008
        if (progressRef.current >= 1) { progressRef.current = 1; dirRef.current = -1 }
        if (progressRef.current <= 0) { progressRef.current = 0; dirRef.current = 1 }
      } else if (mode === 'set') {
        progressRef.current = Math.min(1, progressRef.current + 0.015)
      } else if (mode === 'reset') {
        progressRef.current = Math.max(0, progressRef.current - 0.015)
      }
      setProgress(progressRef.current)
      draw(progressRef.current)
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [mode])

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🔬 Filament Formation & Rupture</h3>
        <p className="viz-subtitle">
          Watch oxygen-vacancy filaments grow (SET) and dissolve (RESET) in the oxide layer.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={280}
        className="viz-canvas"
        style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}
      />

      <div className="viz-controls">
        {['auto', 'set', 'reset'].map(m => (
          <button
            key={m}
            className={`viz-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'auto' ? '⟳ Auto' : m === 'set' ? '↑ SET' : '↓ RESET'}
          </button>
        ))}
      </div>

      <div className="viz-note">
        Gold: conductive filament (oxygen-vacancy rich). Blue dots: oxygen vacancies.
        Filament bridges top and bottom electrode → low resistance.
      </div>
    </div>
  )
}
