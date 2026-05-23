import { useState, useEffect } from 'react'
import HysteresisExplorer from './components/visualizations/HysteresisExplorer'
import FilamentAnimation from './components/visualizations/FilamentAnimation'
import FilamentKinetics from './components/visualizations/FilamentKinetics'
import DynamicalOrbits from './components/visualizations/DynamicalOrbits'
import CrossbarVMM from './components/visualizations/CrossbarVMM'
import CircuitElements from './components/visualizations/CircuitElements'
import DeviceStackBuilder from './components/visualizations/DeviceStackBuilder'
import PulseSimulator from './components/visualizations/PulseSimulator'
import { qaData, qaCategories, qaLevels } from './data/qa'
import { timelineEvents } from './data/timeline'
import { materials, materialFamilies } from './data/materials'
import { papers, paperMechanisms, paperApplications, paperYearRanges, filterPapers } from './data/papers'

const NAV = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { section: 'LEARN' },
  { id: 'what', icon: '⚡', label: 'What is a Memristor?' },
  { id: 'physics', icon: '🔬', label: 'Core Physics' },
  { id: 'principles', icon: '📐', label: 'Principles & Fundamentals' },
  { id: 'types', icon: '🗂', label: 'Types & Positioning' },
  { section: 'DEVICES & MATERIALS' },
  { id: 'materials', icon: '🧪', label: 'Materials Database' },
  { id: 'stackbuilder', icon: '🏗', label: 'Device Stack Builder' },
  { id: 'devices', icon: '💾', label: 'Device & Stack' },
  { id: 'characterization', icon: '📊', label: 'Characterization' },
  { section: 'COMPUTING' },
  { id: 'neuromorphic', icon: '🧠', label: 'Neuromorphic Computing' },
  { id: 'pulsesim', icon: '📡', label: 'Pulse Simulator' },
  { id: 'bci', icon: '🔗', label: 'HMI / BCI' },
  { id: 'applications', icon: '🌍', label: 'Applications & Global' },
  { section: 'DYNAMICS & SIMULATION' },
  { id: 'orbits', icon: '🌀', label: 'Dynamical Orbits & Phase Space' },
  { id: 'filamentkin', icon: '🔥', label: 'Filament Kinetics' },
  { id: 'crossbar', icon: '⊞', label: 'Analog Crossbar Array' },
  { section: 'INTELLIGENCE' },
  { id: 'market', icon: '📈', label: 'Market & Economics' },
  { id: 'scientists', icon: '👩‍🔬', label: 'Top Scientists & Labs' },
  { id: 'timeline', icon: '🕐', label: 'Timeline 1971→2026' },
  { id: 'qa', icon: '💬', label: '100 Questions & Answers' },
  { id: 'controversy', icon: '⚖️', label: 'What Scientists Debate' },
  { section: 'RESEARCH TOOLS' },
  { id: 'papers', icon: '📚', label: 'Paper Library' },
  { id: 'thesis', icon: '🎓', label: 'Thesis Support' },
]

const DEPTHS = ['Explain', 'Standard', 'Deep']

function CitationChip({ id, label }) {
  return (
    <a
      href={`#ref-${id}`}
      className="citation-chip"
      title={`View citation: ${id}`}
    >
      [{label || id}]
    </a>
  )
}

function DepthContent({ depth, current, children }) {
  return (
    <div className={`depth-content ${current === depth ? 'show' : ''}`}>
      {children}
    </div>
  )
}

// ===== SECTIONS =====
function HomePage({ setSection, depth }) {
  return (
    <div className="page">
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: -1, marginBottom: 12 }}>
          MemristorIndia
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 560, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Global Memristor Knowledge, Physics & Neuromorphic Intelligence Platform.
          From Chua (1971) to the 2026 frontier — built for students, PhDs, engineers, and investors.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'what', label: '⚡ Start Here' },
            { id: 'qa', label: '💬 100 Q&As' },
            { id: 'physics', label: '🔬 Core Physics' },
            { id: 'neuromorphic', label: '🧠 Neuromorphic' },
            { id: 'stackbuilder', label: '🏗 Stack Builder' },
            { id: 'papers', label: '📚 Paper Library' },
          ].map(b => (
            <button key={b.id} className="viz-btn" style={{ fontSize: 14, padding: '10px 18px' }}
              onClick={() => setSection(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { icon: '🎓', title: 'Three Depths', desc: 'Every concept explained at Beginner, Standard, and PhD level. Toggle anytime.' },
          { icon: '⚡', title: 'Live Physics', desc: 'Animate the pinched hysteresis loop, watch filaments form and dissolve.' },
          { icon: '🔬', title: '100 Q&As', desc: 'Canonical question-answer knowledge base covering every aspect of the field.' },
          { icon: '📈', title: 'Market Intel', desc: 'Honest market forecasts with ranges and source caveat — not single false numbers.' },
          { icon: '🌍', title: 'Global Map', desc: 'Where research concentrates: US, EU, China, South Korea, Japan, India.' },
          { icon: '⚖️', title: 'Honest Debate', desc: 'Is the ideal memristor real? Both sides of the live scientific controversy.' },
        ].map(c => (
          <div key={c.title} className="content-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <HysteresisExplorer />
    </div>
  )
}

function WhatIsMemristor({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Fundamentals</div>
        <h1 className="section-title">What Is a Memristor?</h1>
        <p className="section-intro">
          The "fourth" fundamental circuit element — a two-terminal passive device whose resistance
          remembers every electron that has ever passed through it.
        </p>
      </div>

      <div className="takeaways-box">
        <h4>Key Takeaways</h4>
        <ul>
          <li>Predicted by Leon Chua in 1971 from circuit-theory symmetry</li>
          <li>First physically demonstrated at HP Labs in 2008 (TiO₂ nanoscale film)</li>
          <li>Fingerprint: pinched I–V hysteresis loop that always passes through the origin</li>
          <li>Non-volatile: remembers its resistance state without power</li>
          <li>Enables neuromorphic computing, in-memory processing, and adaptive BCI chips</li>
        </ul>
      </div>

      <div className="content-card">
        <h3>The One-Sentence Definition</h3>
        <DepthContent depth="Explain" current={depth}>
          <div className="depth-label explain">Beginner</div>
          <p>A memristor is a resistor with memory. It's a two-terminal electronic component that changes its resistance based on how much current has flowed through it — and crucially, it <em>remembers</em> that resistance when the power is off.</p>
          <p>Think of a pipe that slowly widens when water flows through it one way, and narrows when water flows the other way. The width (resistance) depends on the <em>history</em> of water flow (charge), not just the current pressure (voltage).</p>
        </DepthContent>
        <DepthContent depth="Standard" current={depth}>
          <div className="depth-label standard">Standard</div>
          <p>A memristor is a two-terminal passive element defined by the constitutive relation: <strong>dφ = M(q) · dq</strong>, where φ is magnetic flux-linkage, q is electric charge, and M(q) is the memristance in ohms.</p>
          <div className="math-block">V(t) = M(q(t)) · I(t)  &nbsp;&nbsp; where q(t) = ∫₋∞ᵗ I(τ) dτ</div>
          <p>Its resistance M depends on the integral of current — the charge history. It is non-volatile: M holds its value when I = 0. This makes it simultaneously a memory and a signal processor.</p>
        </DepthContent>
        <DepthContent depth="Deep" current={depth}>
          <div className="depth-label deep">PhD</div>
          <p>The memristor completes the set of four fundamental passive two-terminal circuit elements by relating the fourth pair of circuit variables: charge q and magnetic flux-linkage φ. Chua's 1971 argument: the four variables (V, I, q, φ) yield C(4,2)=6 pairwise relationships. Five (R, C, L, V=dφ/dt, I=dq/dt) were known. The sixth must exist. <CitationChip id="chua1971" label="Chua 1971" /></p>
          <p>Key properties: (1) M(q) &gt; 0 always (passive). (2) Power P = V·I = M·I² ≥ 0. (3) Cannot be synthesized from R, C, L. (4) In 1976, Chua and Kang generalized to memristive systems: I = G(x,V)·V, ẋ = f(x,V), encompassing all practical devices. <CitationChip id="chua1976" label="Chua & Kang 1976" /></p>
          <div className="math-block">Memristive system: I = G(x,V)·V,  ẋ = f(x,V,t) — state variable x evolves with applied voltage</div>
        </DepthContent>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <HysteresisExplorer />
        <CircuitElements />
      </div>

      <div className="content-card">
        <h3>Why Was It "Missing"?</h3>
        <p>By 1971, all three other elements (R, C, L) had been independently discovered through physics. The memristor, however, only becomes observable at <em>nanoscale</em>: in bulk materials, ionic drift is negligible compared to electronic conduction. Only at the ~5–10 nm scale does ion motion contribute significantly to device behavior — and that scale wasn't practically accessible until advanced nanofabrication arrived.</p>
        <p>The 2008 HP Labs demonstration found memristance in a 5nm TiO₂ film — not because the material was exotic, but because <strong>nanoscale physics is fundamentally different from bulk physics.</strong> <CitationChip id="strukov2008" label="Strukov 2008" /></p>
      </div>
    </div>
  )
}

function CorePhysics({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Physics</div>
        <h1 className="section-title">Core Physics, Made Easy</h1>
        <p className="section-intro">
          Ion drift, filament formation, charge transport — the mechanisms that make memristors work,
          explained from intuition to equations.
        </p>
      </div>

      <div className="takeaways-box">
        <h4>Key Takeaways</h4>
        <ul>
          <li>Switching is driven by ions (oxygen vacancies or metal atoms) moving under electric field</li>
          <li>SET: ions form a conductive "bridge" (filament) → low resistance</li>
          <li>RESET: filament dissolves at its narrowest point → high resistance</li>
          <li>The state variable (filament length/width) is what the device "remembers"</li>
          <li>Joule heating plays a role — too much causes permanent damage</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <FilamentAnimation />
        <div>
          <div className="content-card">
            <h3>The Strukov Model (2008)</h3>
            <DepthContent depth="Explain" current={depth}>
              <div className="depth-label explain">Beginner</div>
              <p>Imagine a thin slice of titanium dioxide with a movable boundary inside it. On one side: lots of oxygen vacancies (like Swiss cheese) — conducts well. Other side: perfect oxide — doesn't conduct. Apply voltage → boundary moves → resistance changes.</p>
            </DepthContent>
            <DepthContent depth="Standard" current={depth}>
              <div className="depth-label standard">Standard</div>
              <div className="math-block">
                R(w) = Rₒₙ·(w/D) + Rₒff·(1 - w/D)<br/>
                dw/dt = μᵥ·Rₒₙ/D² · I(t)
              </div>
              <p>w = width of doped (conducting) region. D = film thickness. μᵥ = oxygen vacancy mobility. <CitationChip id="strukov2008" label="Strukov 2008" /></p>
            </DepthContent>
            <DepthContent depth="Deep" current={depth}>
              <div className="depth-label deep">PhD</div>
              <p>The linear drift model has boundary conditions: w ∈ [0, D]. Window functions (Joglekar, Biolek) implement nonlinear drift near boundaries: dw/dt = μᵥ·Rₒₙ/D² · I · f(w). The Strukov model underestimates switching speed at high fields; nonlinear models using sinh(V/V₀) better fit experimental data. Temperature effects (Arrhenius activation) must be included for accurate retention modeling.</p>
            </DepthContent>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3>Switching Mechanisms</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { name: 'VCM (Valence-Change Memory)', color: '#3b82f6', icon: '🔵',
              desc: 'Oxygen vacancy drift in transition-metal oxides (HfO₂, TiO₂, TaOₓ). Most CMOS-compatible. Basis of commercial RRAM.' },
            { name: 'ECM (Electrochemical Metallization)', color: '#ec4899', icon: '🩷',
              desc: 'Active metal (Ag/Cu) electrode dissolves → ions drift → metal filament forms. High ON/OFF ratio. Used in CBRAM.' },
            { name: 'Phase-Change (PCM)', color: '#f59e0b', icon: '🟡',
              desc: 'Crystalline ↔ amorphous transition in chalcogenides (GST). Driven by Joule heating. Intel Optane used this.' },
            { name: 'Ferroelectric (FTJ)', color: '#10b981', icon: '🟢',
              desc: 'Polarization reversal in thin ferroelectric (HfZrO) changes tunnel barrier height → resistance modulation.' },
          ].map(m => (
            <div key={m.name} className="content-card" style={{ borderTop: `3px solid ${m.color}`, padding: 14, marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <strong style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.3 }}>{m.name}</strong>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <HysteresisExplorer />
    </div>
  )
}

function MaterialsSection({ depth }) {
  const [family, setFamily] = useState('All')
  const [selected, setSelected] = useState(null)
  const filtered = family === 'All' ? materials : materials.filter(m => m.family === family)

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Materials</div>
        <h1 className="section-title">Materials Database</h1>
        <p className="section-intro">
          From binary oxides to 2D materials and halide perovskites — each material card shows
          key metrics, switching mechanism, and application fit.
        </p>
      </div>

      <div className="qa-filters">
        {materialFamilies.map(f => (
          <button key={f} className={`filter-chip ${family === f ? 'active' : ''}`}
            onClick={() => setFamily(f)}>{f}</button>
        ))}
      </div>

      <div className="materials-grid">
        {filtered.map(m => (
          <div
            key={m.id}
            className="material-card"
            style={{ '--mat-color': m.color }}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
          >
            <div className="material-header">
              <span className="material-icon">{m.icon}</span>
              <div>
                <div className="material-name">{m.name}</div>
                <div className="material-family">{m.family} · {m.mechanism}</div>
              </div>
            </div>
            <div className="material-specs">
              {[
                ['SET Voltage', m.setVoltage],
                ['RESET Voltage', m.resetVoltage],
                ['ON/OFF Ratio', m.onOffRatio],
                ['Endurance', m.endurance],
                ['Retention', m.retention],
                ['CMOS Compatible', m.cmosCom],
              ].map(([label, value]) => (
                <div key={label} className="spec-row">
                  <span className="spec-label">{label}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
            {selected === m.id && (
              <p className="material-desc">{m.description}</p>
            )}
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, textAlign: 'center' }}>
              {selected === m.id ? '▲ Click to collapse' : '▼ Click for description'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NeuromorphicSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Neuromorphic Computing</div>
        <h1 className="section-title">Neuromorphic & In-Memory Computing</h1>
        <p className="section-intro">
          Memristors as artificial synapses, neurons, and crossbar compute engines.
          How the physics of ionic switching enables brain-inspired AI.
        </p>
      </div>

      <div className="takeaways-box">
        <h4>Key Takeaways</h4>
        <ul>
          <li>Memristors perform matrix multiplication using Ohm's law + Kirchhoff's laws — no data movement</li>
          <li>This eliminates the Von Neumann bottleneck: energy for AI inference drops 100×</li>
          <li>STDP learning rules can be implemented directly in hardware</li>
          <li>Energy per synaptic event: 1 fJ–100 pJ (comparable to biological synapses)</li>
          <li>Variability remains the main engineering challenge for large-scale deployment</li>
        </ul>
      </div>

      <CrossbarVMM />

      <div className="content-card">
        <h3>The Von Neumann Bottleneck</h3>
        <DepthContent depth="Explain" current={depth}>
          <div className="depth-label explain">Beginner</div>
          <p>In your laptop, memory and processor are physically separate. Every time the processor needs data, it has to go "get" it from memory. This constant back-and-forth uses most of the energy in modern computers — not the actual calculation.</p>
          <p>Memristors solve this by being both memory and processor at the same time. The multiplication happens right where the number is stored. No travel required.</p>
        </DepthContent>
        <DepthContent depth="Standard" current={depth}>
          <div className="depth-label standard">Standard</div>
          <p>Modern CPUs spend ~60–80% of energy on DRAM access, not arithmetic. In-memory computing (IMC) with memristors collapses this: <CitationChip id="neuromorphic2024" label="IMC Review 2024" /></p>
          <div className="math-block">I_j = Σᵢ Gᵢⱼ · Vᵢ   (Kirchhoff + Ohm in one analog step)</div>
          <p>This computes a full matrix–vector product in a single clock cycle, with energy scaling as O(N) not O(N²). The result is read as an analog current at the column output.</p>
        </DepthContent>
        <DepthContent depth="Deep" current={depth}>
          <div className="depth-label deep">PhD</div>
          <p>Key non-idealities: (1) IR drop along array wire resistance causes systematic error at large array sizes. (2) Analog-to-digital conversion of column currents costs energy proportional to ADC resolution. (3) Weight noise σ/μ degrades inference accuracy — hardware-aware training essential. (4) Temperature-dependent conductance drift (PCM) or stochastic variability (RRAM) requires periodic re-calibration. <CitationChip id="ielmini2025" label="Ielmini 2025" /></p>
        </DepthContent>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="content-card">
          <h3>Artificial Synapse Properties</h3>
          {[
            ['STDP', 'Spike-timing-dependent plasticity — biologically realistic learning'],
            ['LTP / LTD', 'Long-term potentiation / depression — Hebbian learning rules'],
            ['PPF', 'Paired-pulse facilitation — short-term plasticity analog'],
            ['Multilevel', 'Multiple analog states for weight precision'],
            ['Non-volatile', 'Synaptic weights persist without power'],
          ].map(([term, desc]) => (
            <div key={term} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', minWidth: 80, fontWeight: 600 }}>{term}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.4 }}>{desc}</span>
            </div>
          ))}
        </div>
        <div className="content-card">
          <h3>Computing Paradigms</h3>
          {[
            { name: 'ANN Inference', badge: 'Production', desc: 'VMM crossbar + ADC/DAC for neural network inference' },
            { name: 'SNN Hardware', badge: 'Research', desc: 'Spiking neural networks with memristive synapses/neurons' },
            { name: 'Reservoir Computing', badge: 'Research', desc: 'Memristor dynamics as natural reservoir' },
            { name: 'On-Chip Learning', badge: 'Challenge', desc: 'Online weight update via STDP-like rules' },
          ].map(p => (
            <div key={p.name} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  background: p.badge === 'Production' ? 'rgba(16,185,129,0.1)' : p.badge === 'Research' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                  color: p.badge === 'Production' ? '#10b981' : p.badge === 'Research' ? '#3b82f6' : '#f59e0b',
                }}>{p.badge}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BCISection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Brain-Machine Interface</div>
        <h1 className="section-title">HMI / BMI / BCI Hub</h1>
        <p className="section-intro">
          Memristors for Human–Machine and Brain–Machine Intelligence.
          From tactile skins to adaptive neural decoders — what's demonstrated vs. what's speculative.
        </p>
      </div>

      <div className="content-card" style={{ borderLeft: '4px solid #ec4899' }}>
        <h3>🔬 Flagship: 128k-Cell Memristor BCI Decoder (2025)</h3>
        <p><strong>What was demonstrated:</strong> A 128,000-cell memristor array implementing an <em>adaptive decoder</em> for real-time brain–computer interface (BCI) signal processing, published in <em>Nature Electronics</em> (HKU team, 2025). <CitationChip id="bci2025" label="HKU 2025" /></p>
        <p><strong>Key metrics:</strong> Real-time decoding of ECoG (electrocorticography) neural signals for motor intention. On-chip weight update using an STDP-like rule — the decoder adapts as neural signals drift over time. Energy efficiency low enough for wearable/implantable form factors.</p>
        <p><strong>Why it matters:</strong> This is the first large-scale memristive array demonstrated in a closed-loop BCI system — not just a benchmark. It directly addresses the clinical problem of decoder drift.</p>
        <div style={{ background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, padding: '12px 14px', marginTop: 12 }}>
          <strong style={{ fontSize: 12, color: '#ec4899' }}>Distinction:</strong>
          <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '4px 0 0', lineHeight: 1.5 }}>Demonstrated in lab ✓ · Proven in long-term implant context ✗ · FDA-approved ✗. The BCI direction is now real, not fantasy — but clinical deployment requires years of additional work.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '🤚', title: 'Artificial Electronic Skin', badge: 'Lab demo', color: '#10b981',
            desc: 'Flexible memristor arrays beneath pressure sensors: detects touch, encodes as spike trains, stores locally. Enables neuromorphic prosthetic feedback.' },
          { icon: '👁', title: 'Artificial Retina', badge: 'Lab demo', color: '#3b82f6',
            desc: 'Photonic memristors as light-sensitive pixels. Sense, adapt, and store visual features in one device layer — no separate image sensor + memory.' },
          { icon: '🧠', title: 'Adaptive BCI Decoder', badge: 'Demonstrated', color: '#ec4899',
            desc: '128k-cell chip decodes neural signals in real-time with on-chip adaptive learning. Energy-efficient enough for wearable use.' },
          { icon: '🦾', title: 'Prosthetic Sensory Feedback', badge: 'Research', color: '#f59e0b',
            desc: 'Memristive synapse encodes force from prosthetic fingertips into nerve-compatible spike trains. Enables touch sensation in prosthetics.' },
          { icon: '💊', title: 'Implantable Neuro-AI', badge: 'Speculative', color: '#8b5cf6',
            desc: 'Long-horizon vision: biocompatible memristive arrays as adaptive stimulators in closed-loop brain–machine systems. Requires decades of clinical evidence.' },
          { icon: '👂', title: 'Edge Neural Signal Processing', badge: 'Research', color: '#14b8a6',
            desc: 'On-device pre-processing of EEG/EMG to reduce wireless bandwidth and power. Key for always-on wearable BCIs.' },
        ].map(c => (
          <div key={c.title} className="content-card" style={{ borderTop: `3px solid ${c.color}`, padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{c.title}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  background: c.badge === 'Demonstrated' ? 'rgba(236,72,153,0.1)' : c.badge === 'Lab demo' ? 'rgba(16,185,129,0.1)' : c.badge === 'Research' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                  color: c.badge === 'Demonstrated' ? '#ec4899' : c.badge === 'Lab demo' ? '#10b981' : c.badge === 'Research' ? '#3b82f6' : '#8b5cf6',
                }}>{c.badge}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="content-card">
        <h3>⚖️ Ethical Considerations</h3>
        <p>Brain-interface technology raises considerations that must be addressed <em>before</em> widespread deployment, not after:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Privacy', text: 'Neural data is uniquely personal and biometrically identifying. Who owns decoded brain signals?' },
            { label: 'Agency', text: 'Adaptive hardware that updates its own weights raises questions about who controls the device over time.' },
            { label: 'Equity', text: 'Access to cognitive enhancement must be distinguished from therapeutic use, with equitable frameworks.' },
            { label: 'Consent', text: 'Subjects with severe motor impairments may have limited ability to communicate informed consent changes.' },
          ].map(e => (
            <div key={e.label} style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{e.label}</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MarketSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Market & Economics</div>
        <h1 className="section-title">Market & Economics</h1>
        <p className="section-intro">
          Honest market intelligence: ranges, not single false numbers.
          Market reports disagree substantially — we show you the spread and explain why.
        </p>
      </div>

      <div className="market-caveat">
        <div className="market-caveat-title">⚠️ Forecasts Vary Widely — Read Before Using</div>
        <p>Independent market reports disagree by factors of 10–100× because they define the market boundary differently, disagree on timing of commercial milestones, and cannot agree on what counts as "neuromorphic." Treat all figures as order-of-magnitude guidance only. None of this constitutes investment advice.</p>
      </div>

      <div className="content-card">
        <h3>Neuromorphic Computing Market — Multiple Estimates Side-by-Side</h3>
        <table className="market-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>2024 Estimate</th>
              <th>Forecast Year</th>
              <th>Forecast Value</th>
              <th>CAGR</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MarketsandMarkets</td>
              <td className="highlight">$28.5M</td>
              <td>2030</td>
              <td className="highlight">$1.325B</td>
              <td>~89%</td>
              <td>Narrow hardware definition</td>
            </tr>
            <tr>
              <td>Precedence Research</td>
              <td className="highlight">$6.90B</td>
              <td>2034</td>
              <td className="highlight">$47.31B</td>
              <td>~21%</td>
              <td>Broad system-level definition</td>
            </tr>
            <tr>
              <td>Grand View Research</td>
              <td>~$150M</td>
              <td>2030</td>
              <td>~$5B</td>
              <td>~73%</td>
              <td>Mid-range estimate</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Sources: MarketsandMarkets (2024), Precedence Research (2024), Grand View Research (est.). These are commercial reports with commercial incentives. Treat as directional only.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="content-card">
          <h3>Commercial Landscape (2025)</h3>
          {[
            { name: 'TSMC / GlobalFoundries', status: 'Shipping', desc: 'Embedded RRAM in 22nm IoT/MCU processes' },
            { name: 'Renesas', status: 'Shipping', desc: 'RRAM in RH850 automotive microcontrollers' },
            { name: 'Weebit Nano', status: 'Licensing', desc: 'RRAM IP licensing to foundries' },
            { name: 'Crossbar Inc.', status: 'Licensing', desc: 'RRAM IP for embedded NVM' },
            { name: 'BrainChip (Akida)', status: 'Production', desc: 'SNN chip (SRAM-based, RRAM roadmap)' },
            { name: 'IBM (HERMES)', status: 'Demo', desc: 'Analog PCM/RRAM compute-in-memory chips' },
            { name: 'Intel (Loihi 2)', status: 'Research', desc: 'Neuromorphic SNN — SRAM today, memristor roadmap' },
            { name: 'Rain AI', status: 'Startup', desc: 'Analog in-memory training accelerator' },
          ].map(c => (
            <div key={c.name} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, flex: 'none',
                background: c.status === 'Shipping' ? 'rgba(16,185,129,0.1)' : c.status === 'Production' ? 'rgba(59,130,246,0.1)' : c.status === 'Demo' ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.1)',
                color: c.status === 'Shipping' ? '#10b981' : c.status === 'Production' ? '#3b82f6' : c.status === 'Demo' ? '#f59e0b' : '#94a3b8',
              }}>{c.status}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="content-card">
          <h3>Global R&D Concentration</h3>
          {[
            { region: '🇺🇸 USA', orgs: 'Stanford, MIT, UCSB (Strukov), IBM Research, Intel Labs, HP Labs', focus: 'Devices, computing, commercialization' },
            { region: '🇨🇳 China', orgs: 'Tsinghua, Peking Univ., HKUST, HKU', focus: 'Neuromorphic arrays, perovskite devices, BCI' },
            { region: '🇰🇷 South Korea', orgs: 'Samsung, SK Hynix, KAIST', focus: 'Commercial RRAM, advanced nodes' },
            { region: '🇪🇺 Europe', orgs: 'IMEC, TU Delft, FZ Jülich (Waser group)', focus: 'Materials, mechanisms, device physics' },
            { region: '🇯🇵 Japan', orgs: 'NEC, Tohoku University, Sony', focus: 'Memory, PCM, neuromorphic' },
            { region: '🇮🇳 India', orgs: 'IIT Delhi, IIT Bombay, IISc Bangalore, IIT Madras', focus: 'Perovskite devices, oxide RRAM — rapidly growing' },
          ].map(r => (
            <div key={r.region} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{r.region}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{r.orgs}</div>
              <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>Focus: {r.focus}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScientistsSection() {
  const scientists = [
    { name: 'Leon Chua', initials: 'LC', affil: 'UC Berkeley', contrib: 'Predicted the memristor in 1971 from circuit-theory symmetry. Arguably the most important theoretical contribution in circuit theory in 50 years.' },
    { name: 'R. Stanley Williams', initials: 'SW', affil: 'HP Labs / Texas A&M', contrib: 'Led the HP Labs team that demonstrated memristance in TiO₂ (2008). Transformed the field from theory to experiment.' },
    { name: 'Dmitri Strukov', initials: 'DS', affil: 'UC Santa Barbara', contrib: 'First author of the 2008 Nature paper. Developed the linear drift model and continues leading RRAM device research.' },
    { name: 'Wei Lu', initials: 'WL', affil: 'Univ. of Michigan', contrib: 'Pioneered STDP in memristors and synaptic plasticity demonstrations. Key architect of memristive neuromorphic systems.' },
    { name: 'J. Joshua Yang', initials: 'JY', affil: 'USC', contrib: 'Co-authored the definitive "Memristive devices for computing" review (2013). Expert on switching mechanisms and crossbar arrays.' },
    { name: 'Rainer Waser', initials: 'RW', affil: 'FZ Jülich / RWTH Aachen', contrib: 'With Aono, established the nanoionics framework for resistive switching (2007). Leading European figure in the field.' },
    { name: 'Ilia Valov', initials: 'IV', affil: 'FZ Jülich', contrib: 'Leading expert on electrochemical metallization (ECM) memory — the nanoscale electrochemistry of conductive-bridge RAM.' },
    { name: 'Daniele Ielmini', initials: 'DI', affil: 'Politecnico di Milano', contrib: '2025 Chemical Reviews co-author. Leading voice on RRAM reliability, compute-in-memory requirements, and device modeling.' },
    { name: 'HKU BCI Team', initials: 'HK', affil: 'HKU (Hong Kong)', contrib: 'Demonstrated 128k-cell memristive BCI decoder in Nature Electronics (2025). Flagship brain-machine interface result.' },
    { name: 'IBM Research Team', initials: 'IB', affil: 'IBM Research Zurich', contrib: 'Developed analog compute-in-memory chips (HERMES) and demonstrated deep learning inference on PCM crossbar arrays.' },
  ]

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Scientists & Labs</div>
        <h1 className="section-title">Top Scientists & Labs</h1>
        <p className="section-intro">
          The researchers and groups who built the field — from Chua's 1971 prediction
          to the 2025 BCI demonstrations.
        </p>
      </div>
      <div className="scientists-grid">
        {scientists.map(s => (
          <div key={s.name} className="scientist-card">
            <div className="scientist-avatar">{s.initials}</div>
            <div className="scientist-name">{s.name}</div>
            <div className="scientist-affil">{s.affil}</div>
            <div className="scientist-contrib">{s.contrib}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineSection() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const categories = ['All', 'Theory', 'Devices', 'Materials', 'Computing', 'Commercial']

  const filtered = filter === 'All' ? timelineEvents : timelineEvents.filter(e => e.category === filter)
  const selectedEvent = timelineEvents.find(e => e.year === selected)

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Timeline</div>
        <h1 className="section-title">Timeline: 1971 → 2026</h1>
        <p className="section-intro">
          From Chua's mathematical prediction to the 128k-cell BCI chip.
          Filter by category; click any node for full context.
        </p>
      </div>

      <div className="timeline-filters">
        {categories.map(c => (
          <button key={c} className={`filter-chip ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="timeline-scroll">
        <div className="timeline-track">
          {filtered.map(e => (
            <div
              key={e.year}
              className="timeline-node"
              onClick={() => setSelected(selected === e.year ? null : e.year)}
            >
              <div
                className="timeline-dot"
                style={{
                  background: e.isFuture ? 'transparent' : e.color,
                  border: e.isFuture ? `2px dashed ${e.color}` : `3px solid white`,
                  boxShadow: `0 0 0 2px ${e.color}`,
                }}
              />
              <span className="timeline-year">{e.year}</span>
              <span className="timeline-event-title">{e.title}</span>
              <span className="timeline-category" style={{ color: e.color }}>{e.category}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="timeline-card" style={{ borderLeftColor: selectedEvent.color }}>
          <h4>{selectedEvent.title} {selectedEvent.isFuture && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>(Vision)</span>}</h4>
          <div className="tc-year">{selectedEvent.year} · {selectedEvent.category}</div>
          <div className="tc-summary">{selectedEvent.summary}</div>
          <details>
            <summary style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', marginBottom: 8 }}>→ More detail</summary>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>{selectedEvent.detail}</p>
          </details>
          <div className="tc-impact">{selectedEvent.impact}</div>
        </div>
      )}
    </div>
  )
}

function QASection({ depth }) {
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(null)

  const filtered = qaData.filter(q => {
    const matchCat = category === 'All' || q.category === category
    const matchLevel = level === 'All' || q.level === level
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchLevel && matchSearch
  })

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Knowledge Base</div>
        <h1 className="section-title">100 Questions & Answers</h1>
        <p className="section-intro">
          A canonical, searchable knowledge base covering every aspect of the memristor field —
          from beginner fundamentals to PhD-level mechanisms.
        </p>
      </div>

      <div className="qa-search">
        <span style={{ color: 'var(--text-3)' }}>🔍</span>
        <input
          placeholder="Search questions and answers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
          onClick={() => setSearch('')}>✕</button>}
      </div>

      <div className="qa-filters" style={{ marginBottom: 8 }}>
        {qaCategories.map(c => (
          <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="qa-filters">
        {qaLevels.map(l => (
          <button key={l} className={`filter-chip ${level === l ? 'active' : ''}`}
            onClick={() => setLevel(l)}
            style={{ background: level === l && l !== 'All' ?
              l === 'Beginner' ? '#10b981' : l === 'Standard' ? '#3b82f6' : '#ec4899' : undefined }}>
            {l}
          </button>
        ))}
      </div>

      <div className="qa-count">{filtered.length} question{filtered.length !== 1 ? 's' : ''}</div>

      {filtered.map(q => (
        <div key={q.id} className="qa-item">
          <button className="qa-question" onClick={() => setOpen(open === q.id ? null : q.id)}>
            <span className="qa-num">Q{q.id}</span>
            <span className="qa-q-text">{q.question}</span>
            <span className={`qa-level-badge ${q.level}`}>{q.level}</span>
            <span className={`qa-chevron ${open === q.id ? 'open' : ''}`}>▾</span>
          </button>
          {open === q.id && (
            <div className="qa-answer">
              <p>{q.answer}</p>
              {depth === 'Deep' && q.deepExpansion && (
                <div className="qa-deep-expand">
                  <div className="qa-deep-label">PhD Expansion</div>
                  {q.deepExpansion}
                </div>
              )}
              {q.citation && (
                <div style={{ marginTop: 10 }}>
                  <CitationChip id={q.citation} label={`Source: ${q.citation}`} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ControversySection() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Scientific Debate</div>
        <h1 className="section-title">What Scientists Argue About</h1>
        <p className="section-intro">
          Honest presentation of the live debates in the field.
          Science advances through disagreement — here's what's genuinely contested.
        </p>
      </div>

      <div className="content-card">
        <h3>⚖️ Is the Ideal Chua Memristor Real?</h3>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          This is the central epistemological controversy in the field — not about device performance, but about
          whether the HP 2008 device (and all practical RRAM) is genuinely the element Chua predicted in 1971.
        </p>
        <div className="controversy-card">
          <div className="controversy-side mainstream">
            <div className="controversy-tag">Mainstream View</div>
            <p>Practical resistive-switching devices are <em>memristive systems</em> in Chua's 1976 generalized sense. The pinched hysteresis, non-volatility, state-dependent resistance, and history-dependence are all present and match Chua's theoretical predictions. The 1976 definition explicitly encompasses real devices without requiring strict charge–flux coupling. Calling them "memristors" is scientifically appropriate and the 2008 Nature paper correctly credits Chua's foundational work. <CitationChip id="chua1976" label="Chua 1976" /></p>
          </div>
          <div className="controversy-side critique">
            <div className="controversy-tag">Critical View</div>
            <p>The strict 1971 memristor is defined by a direct q–φ constitutive relation. This physically requires magnetic coupling (flux-linkage is intrinsically magnetic). Ionic drift devices couple charge to resistance via <em>mechanical ion position</em>, not magnetism — making them memristive systems (1976), not strict memristors (1971). By appropriating the "memristor" label, the field conflates two mathematically distinct things and misleads students about what was actually predicted and what was actually found. (Vongehr & Klingeler, 2015). <CitationChip id="chua1971" label="Chua 1971" /></p>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', padding: 14, background: 'var(--bg-2)', borderRadius: 8, marginTop: 12 }}>
          <strong>Platform position:</strong> Both views are scientifically legitimate. The devices are real and practically important regardless of the terminological dispute. We present this disagreement as a feature — it reflects how science actually works when a theoretical prediction meets physical reality.
        </div>
      </div>

      <div className="content-card">
        <h3>⚖️ Variability: Fundamental or Engineerable?</h3>
        <div className="controversy-card">
          <div className="controversy-side mainstream">
            <div className="controversy-tag">Optimistic View</div>
            <p>Cycle-to-cycle variability in filamentary RRAM is fundamentally a stochastic nucleation problem — solvable with defect engineering, deterministic switching designs (e.g., atomic-layer thin barriers), compliance control, and process optimization. Recent results with geometric constraints (pillar structures, nanotip electrodes) show σ/μ &lt; 5% in controlled experiments. It is an engineering problem, not a fundamental barrier.</p>
          </div>
          <div className="controversy-side critique">
            <div className="controversy-tag">Pessimistic View</div>
            <p>Filament formation involves stochastic defect nucleation at the single-atom scale. The randomness is not merely a process artifact — it is inherent to the thermodynamics of nanoscale ion migration. Achieving the &lt; 2% variability needed for precise analog neural network weights at wafer scale may require abandoning filamentary switching altogether in favor of interface-type or ferroelectric mechanisms, which have different (and potentially worse) scaling challenges. <CitationChip id="ielmini2025" label="Ielmini 2025" /></p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3>⚖️ Will In-Memory Computing Reach Volume Production?</h3>
        <div className="controversy-card">
          <div className="controversy-side mainstream">
            <div className="controversy-tag">Bull Case</div>
            <p>AI energy constraints are existential for data centers. In-memory computing is the only architectural path to 100× efficiency improvement for inference. IBM, Intel, and multiple startups have demonstrated working chips. Commercial embedded RRAM already ships — the process integration is solved. Only variability and software toolchains remain as barriers, both actively being addressed.</p>
          </div>
          <div className="controversy-side critique">
            <div className="controversy-tag">Bear Case</div>
            <p>Digital compute technology (SRAM, logic) continues to improve. Software-based quantization achieves near-analog efficiency in digital hardware without the variability and reliability concerns of analog memristive hardware. Customers are conservative — they will not trust mission-critical inference to analog hardware with stochastic weights when digital alternatives work reliably. The market window may close before memristive IMC is production-ready. <CitationChip id="marketsandmarkets2024" label="Market 2024" /></p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrinciplesSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Principles</div>
        <h1 className="section-title">Principles & Fundamentals</h1>
        <p className="section-intro">Chua's symmetry argument, the four-element periodic table, and the formal foundations of memristance.</p>
      </div>
      <CircuitElements />
      <div className="content-card">
        <h3>Chua's Symmetry Argument (1971)</h3>
        <DepthContent depth="Explain" current={depth}>
          <div className="depth-label explain">Beginner</div>
          <p>Leon Chua asked: "Are there any circuit element types we're missing?" He listed the four basic quantities in electronics: voltage (V), current (I), charge (q), and magnetic flux (φ). He noted that physics gives us 6 possible pairwise relationships between these four. Five already had elements. The sixth — connecting charge and flux — had no element. So he predicted one must exist.</p>
        </DepthContent>
        <DepthContent depth="Standard" current={depth}>
          <div className="depth-label standard">Standard</div>
          <p>The four circuit variables satisfy: V = dφ/dt (Faraday's law) and I = dq/dt (definition). These two are identities. The remaining four pairwise relationships define four elements:</p>
          <div className="math-block">
            R: V = R·I &nbsp;|&nbsp; C: dq = C·dV &nbsp;|&nbsp; L: dφ = L·dI &nbsp;|&nbsp; M: dφ = M(q)·dq
          </div>
          <p>Chua proved M cannot be synthesized from R, C, L in any configuration — it is genuinely irreducible. <CitationChip id="chua1971" label="Chua 1971" /></p>
        </DepthContent>
        <DepthContent depth="Deep" current={depth}>
          <div className="depth-label deep">PhD</div>
          <p>The formal proof of irreducibility: any combination of R, C, L elements produces a v–i relationship that can be expressed as a rational function of frequency — specifically, an impedance Z(jω) = R(ω) + jX(ω) with specific analyticity properties. A memristor's v–i relationship cannot be so expressed because it is state-dependent and history-dependent in a way that breaks the linearity required for Z(jω) to exist. Therefore, no R-L-C network can replicate memristive behavior, QED.</p>
        </DepthContent>
      </div>
    </div>
  )
}

function TypesSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Taxonomy</div>
        <h1 className="section-title">Types & Positioning</h1>
        <p className="section-intro">How memristors are classified and how they compare to RRAM, PCM, MRAM, FeRAM, and Flash.</p>
      </div>
      <div className="content-card">
        <h3>Memristor Taxonomy</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="market-table">
            <thead>
              <tr><th>Type</th><th>Mechanism</th><th>Materials</th><th>ON/OFF</th><th>Endurance</th><th>Key Use</th></tr>
            </thead>
            <tbody>
              {[
                ['VCM', 'O-vacancy filament', 'HfO₂, TaOₓ, TiO₂', '10²–10⁴', '>10⁹', 'Embedded NVM, IMC'],
                ['ECM (CBRAM)', 'Metal filament (Ag/Cu)', 'Ag₂S, GeS₂, SiO₂', '10⁴–10⁸', '10⁶–10⁸', 'Dense memory, PUFs'],
                ['PCM', 'Phase transition (cryst/amor)', 'GST, GeSbTe', '10³–10⁴', '>10⁸', 'SCM, compute-in-memory'],
                ['FTJ', 'Ferroelectric polarization', 'HfZrO, BaTiO₃', '10–100', '>10⁸', 'Fast NVM, neurons'],
                ['Spintronic', 'Domain wall / STT', 'CoFe/MgO/CoFe', '2–10', '>10¹⁵', 'MRAM, sensors'],
                ['Organic', 'Redox / ion intercalation', 'Polymers, small molecules', '10²–10⁵', '10³–10⁵', 'Flexible, bio-compatible'],
                ['2D Material', 'Vacancy / metal filament', 'MoS₂, h-BN, GO', '10³–10⁷', '10⁵–10⁷', 'Scalable, in-sensor'],
              ].map(row => (
                <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DevicesSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Devices</div>
        <h1 className="section-title">Device & Stack</h1>
        <p className="section-intro">MIM structure, 1T1R/1S1R cells, crossbar arrays, forming, and selectors.</p>
      </div>
      <FilamentAnimation />
      <div className="content-card">
        <h3>Cell Architectures</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {[
            { name: '1T1R', icon: '🔌', desc: 'One transistor + one memristor. No sneak paths. Precise compliance via Vgs. ~2× area vs. passive crossbar. Dominant in commercial embedded RRAM.' },
            { name: '1S1R', icon: '⚡', desc: 'One selector (threshold switcher) + one memristor. No transistor — smaller cell. Requires highly nonlinear selector I–V. Used in 3D crossbar research.' },
            { name: 'Passive Crossbar', icon: '⊞', desc: 'Memristors at every row/column intersection. Maximum density (4F²). Suffers sneak-path current — requires half-select bias schemes or high ON/OFF ratio.' },
            { name: '3D Stacked', icon: '🏗', desc: 'Multiple 2D layers stacked vertically with via interconnects. Requires BEOL-compatible (<400°C) deposition. Enables ultra-dense memory or multi-layer compute arrays.' },
          ].map(c => (
            <div key={c.name} className="content-card" style={{ marginBottom: 0, padding: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <strong style={{ fontSize: 14, color: 'var(--text)' }}>{c.name}</strong>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CharacterizationSection({ depth }) {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Characterization</div>
        <h1 className="section-title">Characterization Lab</h1>
        <p className="section-intro">I–V sweeps, endurance, retention, variability — the standard measurement suite and what each metric means.</p>
      </div>
      <HysteresisExplorer />
      <div className="content-card">
        <h3>Standard Measurement Suite</h3>
        <table className="market-table">
          <thead>
            <tr><th>Metric</th><th>What it measures</th><th>Typical target</th><th>Why it matters</th></tr>
          </thead>
          <tbody>
            {[
              ['ON/OFF Ratio', 'ROFF / RON', '>100:1', 'Read margin; sneak-path suppression'],
              ['Endurance', 'Cycles to failure', '>10⁶ (memory), >10⁸ (synapse)', 'Lifetime for repeated programming'],
              ['Retention', 'Time to state loss', '>10 years at 85°C', 'Data integrity without power'],
              ['C2C Variability', 'σ/μ of RON across cycles', '<20% (memory), <2% (analog)', 'Weight precision in neural networks'],
              ['D2D Variability', 'σ/μ across devices', '<30% (memory), <5% (analog)', 'Array yield and uniformity'],
              ['SET Voltage', 'Voltage to switch ON', '<2V (target)', 'Power, CMOS compatibility'],
              ['Switching Speed', 'Time to complete SET', '<10 ns (memory), <1 ns (BCI)', 'Bandwidth and latency'],
              ['Energy/op', 'Energy per SET/RESET', '<100 fJ (synapse)', 'Edge AI power budget'],
            ].map(row => (
              <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ApplicationsSection() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Applications</div>
        <h1 className="section-title">Applications, Mapping & Global Use</h1>
        <p className="section-intro">Memory, edge AI, sensing, security, aerospace — where memristors are used today and where they are headed.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {[
          { icon: '💾', title: 'Embedded NVM', trl: 'TRL 9', color: '#10b981', desc: 'Commercial RRAM replacing Flash in IoT MCUs, automotive chips, and wearables. Shipping in TSMC, GlobalFoundries processes.' },
          { icon: '🧠', title: 'Edge AI Inference', trl: 'TRL 5–6', color: '#3b82f6', desc: 'In-memory computing for neural network inference at μW power. Key for always-on AI in wearables and IoT sensors.' },
          { icon: '🔒', title: 'Hardware Security (PUFs)', trl: 'TRL 4–5', color: '#8b5cf6', desc: 'Stochastic filament geometry exploited as a device fingerprint. Unclonable hardware IDs for authentication.' },
          { icon: '🛰', title: 'Aerospace / Radiation', trl: 'TRL 3–4', color: '#f59e0b', desc: 'Non-volatile state storage tolerant to total ionizing dose. Research-stage — potential for space-grade data recorders.' },
          { icon: '👁', title: 'Sensing & Perception', trl: 'TRL 3–4', color: '#14b8a6', desc: 'Optoelectronic memristors as artificial retinas. Pressure-sensitive skins for prosthetics. In-sensor computing.' },
          { icon: '🔗', title: 'Brain-Machine Interface', trl: 'TRL 3–4', color: '#ec4899', desc: '128k-cell adaptive decoder demonstrated (2025). Long path to clinical deployment — requires biocompatibility certification.' },
          { icon: '💰', title: 'SCM (Storage-Class Memory)', trl: 'TRL 4–5', color: '#6366f1', desc: 'RRAM targeting the DRAM–Flash gap. Byte-addressable, non-volatile, faster than Flash. Intel Optane (PCM) showed the market.' },
          { icon: '🌐', title: 'Neuromorphic Data Centers', trl: 'TRL 4', color: '#ef4444', desc: 'Large-scale VMM compute-in-memory for energy-efficient deep learning training and inference at data-center scale.' },
        ].map(a => (
          <div key={a.title} className="content-card" style={{ borderTop: `3px solid ${a.color}`, padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{a.title}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                  background: `${a.color}18`, color: a.color
                }}>{a.trl}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== PAPER LIBRARY =====
function PaperLibrarySection() {
  const [mechanism, setMechanism] = useState('All')
  const [application, setApplication] = useState('All')
  const [yearRange, setYearRange] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = filterPapers({ mechanism, application, yearRange, search })

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Research Tools</div>
        <h1 className="section-title">Paper Library</h1>
        <p className="section-intro">
          {papers.length} anchor references — foundational theory, key experimental results, reviews, and 2024–2025 frontiers.
          Filter by mechanism, application, or year; search by keyword, author, or title.
        </p>
      </div>

      {/* Search */}
      <div className="qa-search">
        <span style={{ color: 'var(--text-3)' }}>🔍</span>
        <input placeholder="Search title, author, abstract, tags…"
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
          onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 5 }}>Mechanism</div>
          <div className="qa-filters" style={{ marginBottom: 0 }}>
            {paperMechanisms.map(m => (
              <button key={m} className={`filter-chip ${mechanism === m ? 'active' : ''}`}
                onClick={() => setMechanism(m)}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 5 }}>Application</div>
          <div className="qa-filters" style={{ marginBottom: 0 }}>
            {paperApplications.map(a => (
              <button key={a} className={`filter-chip ${application === a ? 'active' : ''}`}
                onClick={() => setApplication(a)}>{a}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 5 }}>Year</div>
          <div className="qa-filters" style={{ marginBottom: 0 }}>
            {paperYearRanges.map(y => (
              <button key={y} className={`filter-chip ${yearRange === y ? 'active' : ''}`}
                onClick={() => setYearRange(y)}>{y}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="qa-count">{filtered.length} paper{filtered.length !== 1 ? 's' : ''} matching filters</div>

      {filtered.map(p => (
        <div key={p.id} className="paper-card">
          <div className="paper-header">
            <div className="paper-title">{p.title}</div>
            <div className="paper-year">{p.year}</div>
          </div>
          <div className="paper-authors">{p.authors}</div>
          <div className="paper-venue">{p.journal}{p.vol ? `, ${p.vol}` : ''}{p.pages ? `, pp. ${p.pages}` : ''}</div>

          {(expanded === p.id) && (
            <div className="paper-abstract">{p.abstract}</div>
          )}

          <div className="paper-tags">
            <span className="paper-tag" style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--accent)', borderColor: 'rgba(59,130,246,0.2)' }}>
              {p.mechanism}
            </span>
            <span className="paper-tag">{p.application}</span>
            {p.tags.slice(0, 3).map(t => <span key={t} className="paper-tag">{t}</span>)}
          </div>

          <div className="paper-footer">
            {(p.doi || p.url) && (
              <a href={p.doi ? `https://doi.org/${p.doi}` : p.url}
                target="_blank" rel="noopener noreferrer" className="paper-doi">
                {p.doi ? `DOI: ${p.doi}` : 'View →'}
              </a>
            )}
            {p.citedBy && p.citedBy !== 'N/A' && (
              <span className="paper-cited">Cited: {p.citedBy}</span>
            )}
            <button className="viz-btn" style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 10px' }}
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              {expanded === p.id ? '▲ Hide abstract' : '▼ Show abstract'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ===== THESIS SUPPORT =====
function ThesisSupportSection({ depth }) {
  const [topic, setTopic] = useState('overview')
  const topics = [
    { id: 'overview', label: 'Overview' },
    { id: 'synthesis', label: 'Synthesis & Fabrication' },
    { id: 'switching', label: 'Switching Mechanism' },
    { id: 'characterization', label: 'Characterization' },
    { id: 'neuromorphic', label: 'Neuromorphic Use' },
    { id: 'challenges', label: 'Challenges & Outlook' },
  ]

  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Thesis Support</div>
        <h1 className="section-title">Thesis Support: Perovskite Nanocrystal Memristors</h1>
        <p className="section-intro">
          Structured guidance for researchers working on halide perovskite nanocrystal memristors —
          the fastest-growing materials sub-field in resistive switching.
          Covers synthesis, mechanism, characterization, neuromorphic applications, and the stability challenge.
        </p>
      </div>

      <div className="qa-filters" style={{ marginBottom: 20 }}>
        {topics.map(t => (
          <button key={t.id} className={`filter-chip ${topic === t.id ? 'active' : ''}`}
            onClick={() => setTopic(t.id)}>{t.label}</button>
        ))}
      </div>

      {topic === 'overview' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">🔬 Why Perovskite Nanocrystals?</div>
            <p>Halide perovskite nanocrystals (NCs) combine the large ON/OFF ratios of bulk perovskite memristors (10³–10⁶) with enhanced size-tuneable properties, surface-chemistry control, and compatibility with low-temperature solution processing. Their quantum-confinement effects modify the electronic structure and ion-migration activation energies in ways that bulk films do not show.</p>
            <p>For neuromorphic applications, the rich interplay of ionic and electronic transport in perovskite NCs produces multi-state analog conductance, self-rectifying characteristics, and light-responsive synaptic behaviour — a combination not easily achieved in oxide RRAM.</p>
            <div className="thesis-ref">Key review: Hwang & Lee (2019), Adv. Materials 31(47):1904256. DOI: 10.1002/adma.201904256</div>
          </div>
          <div className="two-col">
            <div className="thesis-card">
              <div className="thesis-section-title">📊 Typical Metrics (2024 State-of-Art)</div>
              {[
                ['ON/OFF ratio', '10³ – 10⁶'],
                ['SET voltage', '0.1 – 1 V'],
                ['Endurance', '10³ – 10⁵ cycles'],
                ['Retention', 'Days – months (humidity key)'],
                ['Switching speed', '10 ns – 1 μs'],
                ['Energy/spike', '~1 fJ (estimated)'],
              ].map(([k, v]) => (
                <div key={k} className="spec-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-3)' }}>{k}</span>
                  <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="thesis-card">
              <div className="thesis-section-title">🧪 Common Compositions</div>
              {[
                ['MAPbI₃', 'Lead halide, benchmark system, high ON/OFF'],
                ['CsPbBr₃', 'All-inorganic, better stability than MA-based'],
                ['CsPbI₃', 'Red-emitting, photonic memristor applications'],
                ['FAPbI₃', 'Wider bandgap, lower ion-migration energy'],
                ['Cs₂AgBiBr₆', 'Lead-free double perovskite, emerging'],
                ['Sn-halide', 'Lead-free, Pb²⁺ → Sn²⁺ substitution'],
              ].map(([comp, desc]) => (
                <div key={comp} style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{comp}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', marginLeft: 8 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {topic === 'synthesis' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">⚗️ Synthesis Routes for NC Memristors</div>
            <p><strong>Hot-injection (HI):</strong> Cs-oleate injected into hot PbBr₂/ODE solution (160–200°C). Produces monodisperse CsPbX₃ NCs (5–15 nm). Surface ligands (oleic acid, oleylamine) passivate surface halide vacancies — critical for stability and switching uniformity.</p>
            <p><strong>Ligand-assisted reprecipitation (LARP):</strong> Dissolve perovskite precursors in DMF; inject into poor solvent (toluene) with ligands. Room-temperature process, scalable, compatible with flexible substrates.</p>
            <p><strong>Device integration:</strong> NC dispersion spin-coated onto bottom electrode (ITO or TiN). Film thickness 50–300 nm. Post-deposition ligand exchange (short-chain amines) reduces inter-NC spacing and improves conductance. Top electrode (Au or Al) deposited by thermal evaporation through a shadow mask.</p>
            <div className="thesis-ref">Protesescu, L. et al. (2015), Nano Letters 15(6):3692. DOI: 10.1021/acs.nanolett.5b00693 — foundational synthesis paper for CsPbX₃ NCs.</div>
          </div>
          <div className="thesis-card">
            <div className="thesis-section-title">⚠️ Synthesis Pitfalls</div>
            <p><strong>Phase instability:</strong> CsPbI₃ NCs convert from photoactive cubic (black) to yellow non-perovskite phase at room temperature in humid air. Use encapsulation or A-site mixing (Cs/FA) to stabilize.</p>
            <p><strong>Ligand stripping during deposition:</strong> Thermal evaporation of top electrode (even Al at low power) can strip surface ligands, causing NC aggregation and leakage paths. Use gentle shadow masking and limit substrate temperature rise.</p>
            <p><strong>Ion contamination:</strong> Halide ions from the NC layer can migrate into the electrode interface during switching — changes the effective electrode workfunction and creates drift in SET/RESET voltages.</p>
          </div>
        </>
      )}

      {topic === 'switching' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">🔬 Switching Mechanism in Perovskite NCs</div>
            <p>Unlike binary oxide RRAM (oxygen-vacancy filaments), perovskite NC memristors operate through <strong>mixed ionic–electronic conduction</strong>: halide ions (I⁻, Br⁻) and organic/inorganic cations (MA⁺, Cs⁺) migrate under electric field, redistributing throughout the NC film.</p>
            <DepthContent depth="Explain" current={depth}>
              <div className="depth-label explain">Beginner</div>
              <p>Think of the NC film as a sponge full of loosely bound charged atoms. When you apply a voltage, some of those atoms drift toward one side, changing how well the material conducts electricity. Remove the voltage — many atoms stay put (non-volatile). Reverse the voltage — they drift back.</p>
            </DepthContent>
            <DepthContent depth="Standard" current={depth}>
              <div className="depth-label standard">Standard</div>
              <p>The activation energy for halide-ion migration in MAPbI₃ is ~0.1–0.6 eV — far lower than oxygen vacancy migration in HfO₂ (~0.5–1.5 eV). This makes switching very fast and low-voltage but also makes retention strongly temperature-dependent. The resistive state is primarily set by the space-charge distribution near the electrode interfaces (interface-type switching), not by a filament.</p>
              <div className="math-block">Ea (I⁻ migration in MAPbI₃) ≈ 0.1–0.6 eV  vs.  Ea (Vo in HfO₂) ≈ 0.5–1.5 eV</div>
            </DepthContent>
            <DepthContent depth="Deep" current={depth}>
              <div className="depth-label deep">PhD</div>
              <p>Two competing models: (1) <strong>Ion accumulation at electrode</strong>: halide ions pile up at the cathode interface, forming a low-barrier region — Schottky barrier modulation model. (2) <strong>Filamentary ECM-like</strong>: mobile Pb²⁺ or metal ions from electrode form a partial filament. Evidence: TEM of switched devices shows both interface and filament features depending on compliance current. At low compliance (&lt; 1 μA): interface-dominated. At high compliance (&gt; 100 μA): possible ECM-like filament. The mechanism is likely compliance-dependent.</p>
            </DepthContent>
          </div>
        </>
      )}

      {topic === 'characterization' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">📊 Essential Characterization for a Perovskite NC Memristor Thesis</div>
            <p><strong>I–V sweeps:</strong> Use a slow sweep rate (0.01–0.1 V/s) to avoid ionic polarisation masking the switching. Compare sweep rates to distinguish ionic from electronic contributions.</p>
            <p><strong>Frequency-dependent I–V:</strong> The pinched hysteresis loop area decreases with frequency. Plot loop area vs. frequency. Pure electronic switching: loop disappears above ~1 MHz. Ionic contribution: loop persists to lower frequencies (~100 Hz–10 kHz for halide perovskites).</p>
            <p><strong>Retention under humidity:</strong> Critical for perovskite NCs. Measure RON and ROFF at 20%, 50%, and 80% RH after programming. MAPbI₃ degrades rapidly above 50% RH; CsPbBr₃ is more robust.</p>
            <p><strong>Light-dependent switching:</strong> Illuminate at bandgap energy (green laser for CsPbBr₃, red/NIR for MAPbI₃) during I–V. Photo-generated carriers modify space charge — you should observe photo-modulated resistance (photonic memristor behaviour).</p>
            <div className="thesis-ref">Lanza et al. (2022), Adv. Electronic Materials. Recommended methods for RRAM characterization — apply these protocols to perovskite devices.</div>
          </div>
          <PulseSimulator />
        </>
      )}

      {topic === 'neuromorphic' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">🧠 Neuromorphic Functions in Perovskite NC Devices</div>
            <p><strong>Analog multilevel states:</strong> Use compliance current stepping (1–100 μA) to programme 4–8 distinct conductance levels per device. Lower compliance → smaller filament/weaker interface state → lower G.</p>
            <p><strong>Potentiation and depression:</strong> Apply repeated positive pulses (100 ms, 0.5 V) to potentiate (increase G). Apply negative pulses to depress. Record G after each pulse. Plot G vs. pulse number.</p>
            <p><strong>PPF (paired-pulse facilitation):</strong> Apply two identical pulses 10–500 ms apart. Measure EPSC₂/EPSC₁. Values &gt; 1 indicate short-term plasticity — a signature of biological synapse-like behaviour.</p>
            <p><strong>Photo-STDP:</strong> Perovskite NCs are light-responsive — use optical pulses as pre-synaptic and voltage pulses as post-synaptic. This enables opto-electronic STDP: a unique advantage over oxide RRAM.</p>
            <div className="thesis-ref">Shi et al. (2018), Nature Electronics 1:458. Demonstrates electronic synaptic functions in 2D material devices — same protocols apply to perovskite NCs.</div>
          </div>
        </>
      )}

      {topic === 'challenges' && (
        <>
          <div className="thesis-card">
            <div className="thesis-section-title">⚠️ Open Challenges (2025)</div>
            {[
              { h: 'Stability', text: 'Halide perovskites degrade under humidity, oxygen, heat, and intense light. MAPbI₃ is particularly fragile. Encapsulation with Al₂O₃ (ALD), parylene, or PMMA buys time but doesn\'t solve the root cause. CsPbBr₃ and double perovskites offer better stability but sacrifice ON/OFF ratio.' },
              { h: 'Lead toxicity', text: 'Lead-containing devices face regulatory barriers for commercialisation. Pb-free alternatives (Cs₂AgBiBr₆, Sn-halide) have been demonstrated but with ~10× lower ON/OFF ratios and worse endurance. Active research problem.' },
              { h: 'Cycle-to-cycle variability', text: 'Stochastic halide-ion redistribution produces larger C2C variability than oxide RRAM. Typical σ/μ for SET voltage in perovskite memristors: 15–30%. Strategies: defect engineering (halide-rich synthesis), geometric confinement, and pulse engineering.' },
              { h: 'Endurance', text: 'Most perovskite NC memristors show 10³–10⁵ cycles before failure vs. 10⁶–10¹² for oxide RRAM. Root cause: irreversible halide migration and electromigration of metal from electrode. Mitigation: inert buffer layers (PMMA, SiOₓ) at electrode interfaces.' },
              { h: 'Temperature', text: 'Ion migration velocity scales exponentially with temperature (Arrhenius). Devices that work at 25°C may switch too fast or retain poorly at 50°C. Characterise retention at 25°C, 50°C, 75°C to build Arrhenius plots and extrapolate to operating lifetime.' },
            ].map(c => (
              <div key={c.h} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>{c.h}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="thesis-card">
            <div className="thesis-section-title">🔭 Outlook for Your Thesis</div>
            <p>The field is moving from proof-of-concept demonstrations to understanding fundamentals. A thesis that rigorously maps the switching mechanism (interface vs. filamentary, as a function of compliance and temperature), characterises stability under controlled humidity, and demonstrates at least one synaptic function (STDP or multilevel conductance) with statistical reporting (N ≥ 10 devices, C2C variability shown) will be competitive with the current literature standard.</p>
            <p>The most impactful direction for 2025–2027: lead-free perovskite NC synapses with photonic responsivity — combining the optoelectronic advantage of perovskites with neuromorphic function. This intersects two hot research areas and has clear application in artificial retinas and in-sensor computing.</p>
          </div>
        </>
      )}
    </div>
  )
}

// ===== PULSE SIMULATOR PAGE =====
function PulseSimulatorPage() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Simulator</div>
        <h1 className="section-title">Neuromorphic Pulse Simulator</h1>
        <p className="section-intro">
          Simulate synaptic conductance update under repeated voltage pulses.
          Explore potentiation/depression curves and the STDP learning window.
        </p>
      </div>
      <PulseSimulator />
      <div className="content-card">
        <h3>How to Read These Plots</h3>
        <p>The <strong>Potentiation/Depression</strong> plot shows how conductance G (normalized) changes as you apply N repeated pulses. Green = potentiation (LTP, positive pulses). Red = depression (LTD, negative pulses). Ideal analog synapse: symmetric, linear curves from Gmin to Gmax. Real devices: nonlinear saturation — the slider lets you tune this.</p>
        <p>The <strong>STDP Window</strong> shows ΔW as a function of timing difference Δt between pre- and post-synaptic spikes. Positive Δt (pre fires before post): synapse strengthens (LTP). Negative Δt: synapse weakens (LTD). This is implemented in hardware by overlapping voltage pulse waveforms — the net voltage at the device encodes Δt.</p>
      </div>
      <DeviceStackBuilder />
    </div>
  )
}

// ===== STACK BUILDER PAGE =====
function StackBuilderPage() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Design Tool</div>
        <h1 className="section-title">Device Stack Builder</h1>
        <p className="section-intro">
          Explore how electrode and active-layer choices determine switching type, metrics, and CMOS compatibility.
          Select any combination — the builder predicts the resulting device behaviour.
        </p>
      </div>
      <DeviceStackBuilder />
      <div className="content-card">
        <h3>Design Rules Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { rule: 'VCM target', text: 'Use TiN or W electrodes + HfO₂/TaOₓ active layer. Both electrodes inert or one with O-exchange capacity.' },
            { rule: 'ECM target', text: 'Use Ag or Cu as active top electrode + solid electrolyte (Ag₂S, SiO₂, GeS₂). Bottom electrode must be inert (W, Pt).' },
            { rule: 'CMOS integration', text: 'TiN/HfO₂/TiN is the canonical embedded RRAM stack. All layers BEOL-compatible at <400°C.' },
            { rule: 'BCI / biocompatible', text: 'Avoid Pb-based perovskites. Prefer HfO₂ (biocompatible) or organic polymer layers with Ti/Au electrodes.' },
            { rule: 'Flexible devices', text: 'Use ITO or PEDOT:PSS electrodes + perovskite or organic active layer on PET/PI substrate.' },
            { rule: 'Maximum ON/OFF', text: 'ECM stack (Ag or Cu / Ag₂S or GeS₂ / W or Pt) achieves highest ON/OFF (>10⁶) but is not CMOS-compatible.' },
          ].map(r => (
            <div key={r.rule} style={{ padding: 10, background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{r.rule}</div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== DYNAMICAL ORBITS PAGE =====
function DynamicalOrbitsPage() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Dynamics</div>
        <h1 className="section-title">Dynamical Orbits & Phase Space</h1>
        <p className="section-intro">
          Visualize the memristor as a dynamical system with state-dependent behavior.
          Watch how orbits trace through phase space as frequency and voltage vary.
        </p>
      </div>
      <DynamicalOrbits />
      <div className="content-card">
        <h3>Understanding Phase Space Dynamics</h3>
        <p><strong>Pinched Hysteresis:</strong> The I-V curve always passes through the origin — a fundamental fingerprint of memristive behavior.</p>
        <p><strong>Frequency Dependence:</strong> At low frequency, the ionic motion can follow the applied voltage, producing a wide hysteresis loop. At high frequency, the device "freezes" — ions can't move fast enough, and the loop collapses to a simple resistive line.</p>
        <p><strong>State Space Orbits:</strong> The right plot shows how the internal state variable (filament width) evolves with voltage. This orbit reveals the "memory" — the system doesn't return to the same point when voltage reverses.</p>
      </div>
    </div>
  )
}

// ===== FILAMENT KINETICS PAGE =====
function FilamentKineticsPage() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Growth & Kinetics</div>
        <h1 className="section-title">Filament Formation & Rupture Kinetics</h1>
        <p className="section-intro">
          Simulate how oxygen-vacancy filaments grow under positive bias (SET) and rupture under negative bias (RESET).
          Watch Joule heating accumulate — excessive heat enables fast switching but risks catastrophic failure.
        </p>
      </div>
      <FilamentKinetics />
      <div className="content-card">
        <h3>Filament Growth Mechanisms</h3>
        <p><strong>SET Operation:</strong> Positive bias drives oxygen vacancies toward the bottom electrode via electric field. Vacancies accumulate, forming a conductive filament bridge. Resistance drops dramatically (low resistance state).</p>
        <p><strong>RESET Operation:</strong> Negative bias reverses the field, driving vacancies back. The filament thins at its narrowest point — this "hotspot" ruptures first due to Joule heating concentration. Resistance rises (high resistance state).</p>
        <p><strong>Joule Heating Trade-off:</strong> Higher current = faster switching, but P = I²R dissipates as heat. Excessive heat weakens the oxide and can cause uncontrolled rupture or device degradation. Engineering challenge: achieve fast switching without exceeding thermal limits.</p>
      </div>
    </div>
  )
}

// ===== ANALOG CROSSBAR PAGE =====
function AnalogCrossbarPage() {
  return (
    <div className="page">
      <div className="section-hero">
        <div className="section-tag">Computing</div>
        <h1 className="section-title">Analog Crossbar Array & VMM</h1>
        <p className="section-intro">
          Memristor crossbars perform vector-matrix multiplication using just Ohm's law and Kirchhoff's current law.
          Each cell encodes a weight; voltage is applied to rows; output currents are read from columns.
        </p>
      </div>
      <CrossbarVMM />
      <div className="content-card">
        <h3>In-Memory Computing: How It Works</h3>
        <p><strong>The Math:</strong> I_j = Σᵢ G_{ij} · V_i. The output current from column j is the sum of (conductance × input voltage) for all rows. This is a dot product — computed in one analog step.</p>
        <p><strong>Energy Advantage:</strong> Traditional computing: load weights from memory (huge energy), move to processor (huge energy), compute. Memristor crossbar: weights stay in memory (the conductances), apply voltage, read current. No data movement. 100–1000× better energy efficiency for inference.</p>
        <p><strong>Conductance Values:</strong> Each memristor's conductance is set by programming (pulse sequences). Darker cells = higher conductance = "more ON". The weight matrix can be updated via STDP learning rules for adaptive, online learning.</p>
      </div>
    </div>
  )
}

// ===== MAIN APP =====
export default function App() {
  const [section, setSection] = useState('home')
  const [depth, setDepth] = useState('Standard')
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const renderSection = () => {
    switch (section) {
      case 'home': return <HomePage setSection={setSection} depth={depth} />
      case 'what': return <WhatIsMemristor depth={depth} />
      case 'physics': return <CorePhysics depth={depth} />
      case 'principles': return <PrinciplesSection depth={depth} />
      case 'types': return <TypesSection depth={depth} />
      case 'materials': return <MaterialsSection depth={depth} />
      case 'devices': return <DevicesSection depth={depth} />
      case 'characterization': return <CharacterizationSection depth={depth} />
      case 'neuromorphic': return <NeuromorphicSection depth={depth} />
      case 'bci': return <BCISection depth={depth} />
      case 'applications': return <ApplicationsSection />
      case 'market': return <MarketSection depth={depth} />
      case 'scientists': return <ScientistsSection />
      case 'timeline': return <TimelineSection />
      case 'qa': return <QASection depth={depth} />
      case 'controversy': return <ControversySection />
      case 'papers': return <PaperLibrarySection />
      case 'thesis': return <ThesisSupportSection depth={depth} />
      case 'pulsesim': return <PulseSimulatorPage />
      case 'stackbuilder': return <StackBuilderPage />
      case 'orbits': return <DynamicalOrbitsPage />
      case 'filamentkin': return <FilamentKineticsPage />
      case 'crossbar': return <AnalogCrossbarPage />
      default: return <HomePage setSection={setSection} depth={depth} />
    }
  }

  const currentNav = NAV.find(n => n.id === section)

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <nav className="sidebar" role="navigation" aria-label="Main navigation">
        <div className="sidebar-logo">
          <div className="sidebar-brand">⚡ MemristorIndia</div>
          <div className="sidebar-tagline">Global Knowledge Platform<br />Chua 1971 → 2026 Frontier</div>
        </div>

        {NAV.map((item, idx) => {
          if (item.section) {
            return <div key={idx} className="nav-section"><div className="nav-section-label">{item.section}</div></div>
          }
          return (
            <button
              key={item.id}
              className={`nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          )
        })}

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 16 }}>
          <div style={{ fontSize: 11, color: '#334155', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Based on ~1,000 Works</div>
          <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
            Chua (1971) · Strukov (2008) · Yang (2013) · Waser (2007) · Ielmini (2025) · HKU BCI (2025)
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar" role="banner">
          <div className="breadcrumb">
            <span>MemristorIndia</span> {currentNav && <> › <span>{currentNav.label}</span></>}
          </div>

          <div className="search-bar" role="search">
            <span aria-hidden>🔍</span>
            <input
              placeholder="Search…"
              aria-label="Search the platform"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setSection('qa')
                }
              }}
            />
          </div>

          <div className="depth-toggle" role="group" aria-label="Content depth">
            {DEPTHS.map(d => (
              <button
                key={d}
                className={`depth-btn ${depth === d ? 'active' : ''}`}
                onClick={() => setDepth(d)}
                aria-pressed={depth === d}
                title={d === 'Explain' ? 'Beginner — intuition & analogy' : d === 'Standard' ? 'Working model + key equations' : 'Full mechanism + citations'}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Page content */}
        <main role="main" id="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
