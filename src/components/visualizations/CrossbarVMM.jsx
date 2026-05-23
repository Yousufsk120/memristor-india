import { useState } from 'react'

const ROWS = 4
const COLS = 4

// Default conductance matrix (normalized 0–1)
const DEFAULT_G = [
  [0.9, 0.3, 0.7, 0.5],
  [0.2, 0.8, 0.4, 0.6],
  [0.6, 0.5, 0.9, 0.2],
  [0.4, 0.7, 0.3, 0.8],
]

const DEFAULT_V = [1.0, 0.7, 0.5, 0.3]

export default function CrossbarVMM() {
  const [G, setG] = useState(DEFAULT_G)
  const [V, setV] = useState(DEFAULT_V)
  const [animating, setAnimating] = useState(false)
  const [highlighted, setHighlighted] = useState(null) // {row, col}

  // Compute output currents: I_j = sum_i G_ij * V_i
  const computeOutputs = () => {
    return Array.from({ length: COLS }, (_, j) =>
      V.reduce((sum, v, i) => sum + G[i][j] * v, 0)
    )
  }

  const outputs = computeOutputs()
  const maxOut = Math.max(...outputs)

  const randomize = () => {
    setG(Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => Math.round(Math.random() * 10) / 10)
    ))
    setV(Array.from({ length: ROWS }, () => Math.round(Math.random() * 10) / 10))
  }

  const conductanceColor = (g) => {
    const r = Math.round(251 - g * 200)
    const gb = Math.round(191 - g * 150)
    return `rgba(${r + 50}, ${gb}, 36, ${0.2 + g * 0.8})`
  }

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">⊞ Crossbar VMM Visualizer</h3>
        <p className="viz-subtitle">
          Ohm's law + Kirchhoff's current law = free matrix multiplication.
          Column current = sum of (G × V) along each row.
        </p>
      </div>

      <div className="crossbar-layout">
        {/* Input vector V */}
        <div className="crossbar-inputs">
          <div className="crossbar-label">Input V</div>
          {V.map((v, i) => (
            <div key={i} className="crossbar-input-cell">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={v}
                onChange={e => {
                  const newV = [...V]
                  newV[i] = Number(e.target.value)
                  setV(newV)
                }}
                className="crossbar-slider"
              />
              <span className="crossbar-value">{v.toFixed(1)}V</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="crossbar-grid-container">
          <div
            className="crossbar-grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
          >
            {Array.from({ length: ROWS }, (_, i) =>
              Array.from({ length: COLS }, (_, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`crossbar-cell ${highlighted?.row === i || highlighted?.col === j ? 'highlighted' : ''}`}
                  style={{ backgroundColor: conductanceColor(G[i][j]) }}
                  onMouseEnter={() => setHighlighted({ row: i, col: j })}
                  onMouseLeave={() => setHighlighted(null)}
                  title={`G[${i}][${j}] = ${G[i][j].toFixed(1)} (V[${i}] × G = ${(V[i] * G[i][j]).toFixed(2)} mA contribution)`}
                >
                  <span className="cell-g">{G[i][j].toFixed(1)}</span>
                </div>
              ))
            )}
          </div>
          <div className="crossbar-matrix-label">Conductance Matrix G (mS)</div>
        </div>

        {/* Output currents */}
        <div className="crossbar-outputs">
          <div className="crossbar-label">Output I</div>
          {outputs.map((I, j) => (
            <div key={j} className="crossbar-output-cell">
              <div
                className="output-bar"
                style={{ height: `${(I / maxOut) * 52}px`, backgroundColor: '#3b82f6' }}
              />
              <span className="crossbar-value" style={{ color: '#3b82f6' }}>
                {I.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Math readout */}
      {highlighted && (
        <div className="vmm-readout">
          <strong>Cell [{highlighted.row},{highlighted.col}]:</strong>{' '}
          G = {G[highlighted.row][highlighted.col].toFixed(1)} mS,{' '}
          V = {V[highlighted.row].toFixed(1)} V,{' '}
          contribution = <strong>{(G[highlighted.row][highlighted.col] * V[highlighted.row]).toFixed(3)} mA</strong>
        </div>
      )}

      <div className="viz-controls">
        <button className="viz-btn" onClick={randomize}>🎲 Randomize weights</button>
      </div>

      <div className="viz-note">
        Each cell = one memristor. Darker = higher conductance (more ON).
        Hover any cell to see its contribution to the output column current.
        I_j = Σᵢ Gᵢⱼ·Vᵢ — this is a dot product, computed in one analog step.
      </div>
    </div>
  )
}
