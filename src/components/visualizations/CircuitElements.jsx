import { useState } from 'react'

const elements = [
  {
    symbol: 'R',
    name: 'Resistor',
    color: '#3b82f6',
    relation: 'V = R · I',
    vars: 'V (voltage) ↔ I (current)',
    discovered: '1827, Ohm',
    formula: 'dV = R · dI',
    description: 'The original passive element. Resistance is constant and independent of history. Dissipates energy as heat.',
    analogy: 'A pipe with fixed width — flow rate always proportional to pressure.',
    icon: '⚡',
  },
  {
    symbol: 'C',
    name: 'Capacitor',
    color: '#10b981',
    relation: 'dV/dt = I / C',
    vars: 'q (charge) ↔ V (voltage)',
    discovered: '1745, Leyden jar',
    formula: 'dq = C · dV',
    description: 'Stores energy in an electric field. Voltage is the time-integral of current divided by capacitance. Volatile — loses charge when disconnected.',
    analogy: 'A tank that stores water. Pressure (voltage) proportional to stored volume (charge).',
    icon: '🔋',
  },
  {
    symbol: 'L',
    name: 'Inductor',
    color: '#f59e0b',
    relation: 'dI/dt = V / L',
    vars: 'φ (flux) ↔ I (current)',
    discovered: '1831, Faraday',
    formula: 'dφ = L · dI',
    description: 'Stores energy in a magnetic field. Current is the time-integral of voltage divided by inductance. Resists changes in current.',
    analogy: 'A heavy flywheel — hard to start spinning and hard to stop.',
    icon: '🌀',
  },
  {
    symbol: 'M',
    name: 'Memristor',
    color: '#ec4899',
    relation: 'dφ = M(q) · dq',
    vars: 'q (charge) ↔ φ (flux)',
    discovered: '1971 (theory, Chua) / 2008 (HP Labs)',
    formula: 'V = M(q) · I',
    description: 'The "missing" fourth element. Memristance depends on the charge history — the device remembers. Non-volatile: state holds without power. The only passive element connecting charge and flux.',
    analogy: 'A pipe whose width changes permanently based on how much water has flowed through it — and remembers that width after the flow stops.',
    icon: '🧠',
  },
]

export default function CircuitElements() {
  const [selected, setSelected] = useState('M')

  const el = elements.find(e => e.symbol === selected)

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🔬 The Four Fundamental Circuit Elements</h3>
        <p className="viz-subtitle">
          Chua's symmetry: four circuit variables (V, I, q, φ) → four elements.
          Click each to explore its constitutive relation.
        </p>
      </div>

      {/* 2×2 Grid */}
      <div className="circuit-grid">
        {elements.map(e => (
          <button
            key={e.symbol}
            className={`circuit-element-btn ${selected === e.symbol ? 'selected' : ''}`}
            style={{ '--el-color': e.color }}
            onClick={() => setSelected(e.symbol)}
          >
            <span className="el-icon">{e.icon}</span>
            <span className="el-symbol">{e.symbol}</span>
            <span className="el-name">{e.name}</span>
            <span className="el-vars">{e.vars.split('↔').map((v, i) => (
              <span key={i}>{v.trim()}{i === 0 ? <span className="el-arrow">↔</span> : null}</span>
            ))}</span>
          </button>
        ))}
      </div>

      {/* Symmetry diagram */}
      <div className="symmetry-diagram">
        <div className="sym-row">
          <div className="sym-label var-label">V</div>
          <div className={`sym-el ${selected === 'R' ? 'active' : ''}`} style={{ '--ec': '#3b82f6' }}>R</div>
          <div className={`sym-el ${selected === 'C' ? 'active' : ''}`} style={{ '--ec': '#10b981' }}>C</div>
          <div className="sym-label var-label">q</div>
        </div>
        <div className="sym-row">
          <div className="sym-label identity">V=dφ/dt</div>
          <div style={{ width: 32 }}></div>
          <div style={{ width: 32 }}></div>
          <div className="sym-label identity">I=dq/dt</div>
        </div>
        <div className="sym-row">
          <div className="sym-label var-label">φ</div>
          <div className={`sym-el ${selected === 'L' ? 'active' : ''}`} style={{ '--ec': '#f59e0b' }}>L</div>
          <div className={`sym-el ${selected === 'M' ? 'active' : ''}`} style={{ '--ec': '#ec4899' }}>M</div>
          <div className="sym-label var-label">I</div>
        </div>
      </div>

      {/* Detail panel */}
      {el && (
        <div className="element-detail" style={{ '--el-color': el.color }}>
          <div className="detail-header">
            <span className="detail-icon">{el.icon}</span>
            <div>
              <div className="detail-name">{el.name}</div>
              <div className="detail-formula">{el.formula}</div>
            </div>
          </div>
          <p className="detail-desc">{el.description}</p>
          <div className="detail-analogy">💡 {el.analogy}</div>
          <div className="detail-meta">Discovered/proposed: {el.discovered}</div>
        </div>
      )}

      <div className="viz-note">
        M = the "missing" element — its existence follows from symmetry alone.
        Chua predicted it 37 years before HP Labs built one.
      </div>
    </div>
  )
}
