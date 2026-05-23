import { useState, useMemo } from 'react'

const TOP_ELECTRODES = [
  { id: 'TiN', label: 'TiN', role: 'Inert + O-exchange', work: '4.5 eV', cmos: true, note: 'Most common CMOS-compatible top electrode. Some oxygen exchange capacity enables VCM.' },
  { id: 'Pt', label: 'Pt', role: 'Fully inert', work: '5.65 eV', cmos: false, note: 'Ideal for lab characterisation — chemically inert, high work function. Not CMOS-compatible.' },
  { id: 'Ag', label: 'Ag', role: 'Active (ECM source)', work: '4.26 eV', cmos: false, note: 'Active electrode for ECM (CBRAM). Ag dissolves under positive bias, forms filament.' },
  { id: 'Cu', label: 'Cu', role: 'Active (ECM source)', work: '4.65 eV', cmos: true, note: 'Active electrode for ECM. CMOS-compatible via Cu damascene process.' },
  { id: 'W', label: 'W', role: 'Inert', work: '4.55 eV', cmos: true, note: 'High melting point, inert. Used where thermal stability during switching is critical.' },
]

const ACTIVE_LAYERS = [
  { id: 'HfO2', label: 'HfO₂', thickness: '5–10 nm', mechanism: 'VCM', family: 'Binary Oxide',
    color: '#3b82f6', props: { onoff: '10²–10³', endurance: '~10⁹', retention: '>10yr', voltage: '1–2V' },
    note: 'Most CMOS-compatible. Already used in commercial embedded RRAM (TSMC, GF).' },
  { id: 'TaOx', label: 'TaOₓ', thickness: '5–15 nm', mechanism: 'VCM', family: 'Binary Oxide',
    color: '#10b981', props: { onoff: '10³–10⁴', endurance: '>10¹²', retention: '>10yr', voltage: '0.5–1.5V' },
    note: 'Record endurance (>10¹²). TaOₓ/Ta₂O₅ bilayer design with oxygen reservoir.' },
  { id: 'TiO2', label: 'TiO₂', thickness: '5–30 nm', mechanism: 'VCM', family: 'Binary Oxide',
    color: '#8b5cf6', props: { onoff: '10²–10⁴', endurance: '10⁶–10⁸', retention: '>10yr', voltage: '1–3V' },
    note: 'The original HP Labs material. Well understood physically. Basis of the Strukov model.' },
  { id: 'MAPbI3', label: 'MAPbI₃', thickness: '50–300 nm', mechanism: 'Mixed ionic-electronic', family: 'Halide Perovskite',
    color: '#ec4899', props: { onoff: '10³–10⁶', endurance: '10³–10⁵', retention: 'Days–months', voltage: '0.1–1V' },
    note: 'Huge ON/OFF ratio. Fast switching. Stability under humidity is the main challenge.' },
  { id: 'MoS2', label: 'MoS₂', thickness: '0.6–5 nm', mechanism: 'Defect-mediated', family: '2D Material',
    color: '#14b8a6', props: { onoff: '10³–10⁷', endurance: '10⁵–10⁷', retention: 'Good', voltage: '1–3V' },
    note: 'Atomically thin. Ultimate scaling. In-sensor computing demonstrations.' },
  { id: 'hBN', label: 'h-BN', thickness: '0.33–3 nm', mechanism: 'Filamentary', family: '2D Material',
    color: '#6366f1', props: { onoff: '10³–10⁵', endurance: '~10⁶', retention: 'Good', voltage: '1–5V' },
    note: 'Single-layer switching demonstrated. Van der Waals integration with 2D electrodes.' },
  { id: 'Ag2S', label: 'Ag₂S', thickness: '5–50 nm', mechanism: 'ECM', family: 'Chalcogenide',
    color: '#f59e0b', props: { onoff: '10⁴–10⁸', endurance: '~10⁶', retention: 'Moderate', voltage: '0.1–0.5V' },
    note: 'Classic ECM electrolyte. Very low voltage. Quantum conductance steps observable at atomic filament size.' },
  { id: 'GST', label: 'Ge₂Sb₂Te₅', thickness: '20–100 nm', mechanism: 'Phase-Change', family: 'Chalcogenide',
    color: '#d97706', props: { onoff: '10³–10⁴', endurance: '>10⁸', retention: '>10yr', voltage: '1–4V (mA current)' },
    note: 'PCM (phase-change memory). High reset current. Intel Optane used this stack.' },
]

const BOT_ELECTRODES = [
  { id: 'TiN_b', label: 'TiN', cmos: true, note: 'Standard bottom electrode. CMOS compatible, used in 1T1R and 1S1R arrays.' },
  { id: 'Pt_b', label: 'Pt', cmos: false, note: 'Lab standard. Inert, high work function. Not CMOS-compatible.' },
  { id: 'W_b', label: 'W', cmos: true, note: 'Used in via/plug bottom electrode structures in integrated devices.' },
  { id: 'ITO', label: 'ITO', cmos: false, note: 'Transparent conducting oxide. Used in optical/photonic memristors and flexible devices.' },
]

function PredictedBehaviour({ top, layer, bot }) {
  if (!top || !layer || !bot) return null

  const isECM = (top.role.includes('Active') || bot.id === 'Ag_b') && layer.mechanism === 'ECM'
  const isVCM = layer.mechanism === 'VCM'
  const isPCM = layer.mechanism === 'Phase-Change'
  const isMixed = layer.mechanism === 'Mixed ionic-electronic'
  const is2D = layer.family === '2D Material'
  const cmosOK = top.cmos && bot.cmos && layer.family !== 'Halide Perovskite'

  let switchType = isECM ? 'Electrochemical Metallization (ECM)' :
    isVCM ? 'Valence-Change Memory (VCM)' :
    isPCM ? 'Phase-Change Memory (PCM)' :
    isMixed ? 'Mixed ionic–electronic (Perovskite)' :
    is2D ? 'Defect / filament (2D material)' : 'Unknown'

  let forming = isPCM ? 'Not required (melt-quench)' : isMixed ? 'Often not required' : 'Likely required (first high-V step)'
  let bipolarity = isECM || isVCM || isMixed ? 'Bipolar (SET and RESET use opposite polarity)' : isPCM ? 'Unipolar (thermal)' : 'Likely bipolar'

  const warnings = []
  if (top.id === 'Ag' && layer.mechanism !== 'ECM') warnings.push('⚠️ Ag top electrode may diffuse into oxide — consider Pt or TiN for VCM.')
  if (layer.id === 'MAPbI3' && (top.id === 'Ag' || top.id === 'Cu')) warnings.push('⚠️ Reactive metals dissolve perovskite layer — use Au, ITO, or carbon electrode.')
  if (layer.id === 'GST' && top.cmos) warnings.push('ℹ️ PCM requires mA-range reset current — ensure compliance circuitry can supply it.')
  if (!cmosOK) warnings.push('⚠️ One or more components are not CMOS-compatible — not suitable for standard foundry fabrication.')
  if (is2D) warnings.push('ℹ️ 2D material memristors are research-stage — wafer-scale uniformity not yet demonstrated.')

  return (
    <div className="stack-prediction" style={{ borderColor: layer.color }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: layer.color, marginBottom: 12 }}>
        Predicted Behaviour
      </div>
      <div className="pred-grid">
        {[
          ['Switching Type', switchType],
          ['Forming', forming],
          ['Polarity', bipolarity],
          ['ON/OFF Ratio', layer.props.onoff],
          ['Endurance', layer.props.endurance],
          ['Retention', layer.props.retention],
          ['Operating Voltage', layer.props.voltage],
          ['CMOS Compatible', cmosOK ? '✅ Yes' : '❌ No — lab only'],
        ].map(([label, value]) => (
          <div key={label} className="pred-row">
            <span className="pred-label">{label}</span>
            <span className="pred-value">{value}</span>
          </div>
        ))}
      </div>
      {warnings.length > 0 && (
        <div className="pred-warnings">
          {warnings.map((w, i) => (
            <div key={i} className="pred-warning">{w}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DeviceStackBuilder() {
  const [topEl, setTopEl] = useState(null)
  const [activeLayer, setActiveLayer] = useState(null)
  const [botEl, setBotEl] = useState(null)

  const top = TOP_ELECTRODES.find(e => e.id === topEl)
  const layer = ACTIVE_LAYERS.find(l => l.id === activeLayer)
  const bot = BOT_ELECTRODES.find(e => e.id === botEl)

  return (
    <div className="viz-card">
      <div className="viz-header">
        <h3 className="viz-title">🏗 Device Stack Builder</h3>
        <p className="viz-subtitle">
          Choose your top electrode → active layer → bottom electrode.
          The builder predicts switching type, metrics, and CMOS compatibility.
        </p>
      </div>

      <div className="stack-builder-layout">
        {/* Visual stack */}
        <div className="stack-visual">
          <div className="stack-layer electrode top-electrode" style={{ background: top ? '#334155' : 'var(--bg-2)', borderColor: top ? '#64748b' : 'var(--border)' }}>
            <span className="layer-label">{top ? top.label : '? Top Electrode'}</span>
            {top && <span className="layer-sub">{top.role}</span>}
          </div>
          <div className="stack-connector" />
          <div className="stack-layer active-layer" style={{
            background: layer ? `${layer.color}18` : 'var(--bg-2)',
            borderColor: layer ? layer.color : 'var(--border)',
            height: layer ? Math.max(60, 60 + (parseInt(layer.thickness) || 20) * 0.8) : 60
          }}>
            <span className="layer-label" style={{ color: layer?.color }}>{layer ? layer.label : '? Active Layer'}</span>
            {layer && <span className="layer-sub">{layer.thickness} · {layer.mechanism}</span>}
          </div>
          <div className="stack-connector" />
          <div className="stack-layer electrode bot-electrode" style={{ background: bot ? '#334155' : 'var(--bg-2)', borderColor: bot ? '#64748b' : 'var(--border)' }}>
            <span className="layer-label">{bot ? bot.label : '? Bottom Electrode'}</span>
            {bot && <span className="layer-sub">{bot.cmos ? 'CMOS compatible' : 'Lab only'}</span>}
          </div>
        </div>

        {/* Selectors */}
        <div className="stack-selectors">
          <div className="selector-group">
            <div className="selector-title">① Top Electrode</div>
            <div className="selector-options">
              {TOP_ELECTRODES.map(e => (
                <button key={e.id} className={`selector-btn ${topEl === e.id ? 'selected' : ''}`}
                  onClick={() => setTopEl(topEl === e.id ? null : e.id)}
                  title={e.note}>
                  <span className="sel-label">{e.label}</span>
                  <span className="sel-sub">{e.role.split(' ')[0]}</span>
                  {e.cmos && <span className="sel-badge">CMOS</span>}
                </button>
              ))}
            </div>
            {top && <div className="selector-note">ℹ️ {top.note}</div>}
          </div>

          <div className="selector-group">
            <div className="selector-title">② Active Layer</div>
            <div className="selector-options">
              {ACTIVE_LAYERS.map(l => (
                <button key={l.id} className={`selector-btn ${activeLayer === l.id ? 'selected' : ''}`}
                  style={{ '--sel-color': l.color }}
                  onClick={() => setActiveLayer(activeLayer === l.id ? null : l.id)}
                  title={l.note}>
                  <span className="sel-label" style={{ color: l.color }}>{l.label}</span>
                  <span className="sel-sub">{l.mechanism}</span>
                  <span className="sel-badge" style={{ background: `${l.color}20`, color: l.color }}>{l.family}</span>
                </button>
              ))}
            </div>
            {layer && <div className="selector-note">ℹ️ {layer.note}</div>}
          </div>

          <div className="selector-group">
            <div className="selector-title">③ Bottom Electrode</div>
            <div className="selector-options">
              {BOT_ELECTRODES.map(e => (
                <button key={e.id} className={`selector-btn ${botEl === e.id ? 'selected' : ''}`}
                  onClick={() => setBotEl(botEl === e.id ? null : e.id)}
                  title={e.note}>
                  <span className="sel-label">{e.label}</span>
                  {e.cmos && <span className="sel-badge">CMOS</span>}
                </button>
              ))}
            </div>
            {bot && <div className="selector-note">ℹ️ {bot.note}</div>}
          </div>
        </div>
      </div>

      {/* Prediction */}
      {top && layer && bot ? (
        <PredictedBehaviour top={top} layer={layer} bot={bot} />
      ) : (
        <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border)', marginTop: 12 }}>
          Select all three layers to see predicted switching behaviour →
        </div>
      )}
    </div>
  )
}
