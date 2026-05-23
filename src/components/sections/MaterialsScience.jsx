import { useState } from 'react'

export default function MaterialsScience() {
  const [expandedSection, setExpandedSection] = useState('overview')

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const materials = [
    {
      name: 'HfO₂',
      bandgap: '5.7-6.0 eV',
      mobility: '10⁻¹³ to 10⁻⁷',
      onOff: '10⁴',
      speed: '5 ns',
      status: '✓ Industry standard',
      color: '#3b82f6'
    },
    {
      name: 'TiO₂',
      bandgap: '3.0-3.2 eV',
      mobility: '10⁻¹⁰ to 10⁻⁵',
      onOff: '10²',
      speed: '10 ns',
      status: '✓ Well-studied',
      color: '#10b981'
    },
    {
      name: 'Perovskite',
      bandgap: '1.5-2.5 eV',
      mobility: 'Very High',
      onOff: '10⁶',
      speed: '1 ns',
      status: '~ Next-gen',
      color: '#f59e0b'
    },
    {
      name: 'SiO₂',
      bandgap: '8.9 eV',
      mobility: 'Medium',
      onOff: '10³',
      speed: '100 ns',
      status: '✓ Compatible',
      color: '#8b5cf6'
    }
  ]

  const properties = [
    {
      title: 'Oxygen Vacancies',
      description: 'Mobile defects that drift under electric field, creating conductive filaments',
      icon: '⚛️',
      detail: 'Essential for resistance switching'
    },
    {
      title: 'Wide Bandgap',
      description: 'Maintains insulating state (HRS) while allowing controlled conduction (LRS)',
      icon: '📊',
      detail: 'Prevents unwanted electron-hole generation'
    },
    {
      title: 'Defect Chemistry',
      description: 'Controllable oxygen vacancy concentration via deposition conditions',
      icon: '🧪',
      detail: 'Tuned by temperature, pressure, annealing'
    },
    {
      title: 'Ionic Mobility',
      description: 'How fast ions move determines switching speed (ns to μs)',
      icon: '⚡',
      detail: 'Higher mobility = faster switching'
    },
    {
      title: 'Two Conductivity States',
      description: 'HRS (high-R, insulating) and LRS (low-R, conducting) modes',
      icon: '🔀',
      detail: 'Filament on/off controls resistance'
    },
    {
      title: 'CMOS Compatible',
      description: 'Uses standard semiconductor deposition (ALD/PVD) techniques',
      icon: '🏭',
      detail: 'Integrates with existing Si technology'
    }
  ]

  return (
    <div className="section-hero gradient-bg">
      <div className="hero-content">
        <h1>🧪 Memristor Materials Science</h1>
        <p className="hero-subtitle">
          Why certain materials become memristors: oxygen vacancies, ionic transport, and defect engineering
        </p>
      </div>

      <style>{`
        .materials-section {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .materials-section h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          margin: 1rem 0 0.5rem 0;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .materials-section h2:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .section-content {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .material-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .material-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-left: 4px solid;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .material-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .material-card h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .property-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1rem;
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .property-label {
          font-weight: 600;
          opacity: 0.8;
        }

        .property-value {
          color: #60a5fa;
        }

        .property-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(96, 165, 250, 0.2);
          border: 1px solid rgba(96, 165, 250, 0.4);
          border-radius: 20px;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 1rem 0;
        }

        .property-item {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s;
        }

        .property-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(96, 165, 250, 0.4);
          transform: translateY(-2px);
        }

        .property-item-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .property-item h4 {
          margin: 0.5rem 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .property-item p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .property-detail {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.85rem;
          color: #60a5fa;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9rem;
        }

        .comparison-table th {
          padding: 0.75rem;
          text-align: left;
          background: rgba(96, 165, 250, 0.1);
          border-bottom: 2px solid rgba(96, 165, 250, 0.3);
          font-weight: 600;
        }

        .comparison-table td {
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .comparison-table tr:hover {
          background: rgba(96, 165, 250, 0.05);
        }

        .code-block {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 1rem 0;
        }

        .highlight-box {
          background: rgba(96, 165, 250, 0.1);
          border-left: 4px solid #3b82f6;
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .expand-arrow {
          display: inline-block;
          transition: transform 0.3s;
          margin-left: 0.5rem;
        }

        .expand-arrow.expanded {
          transform: rotate(180deg);
        }
      `}</style>

      <div className="content-card">
        {/* Fundamental Requirement */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('fundamental')}>
            🎯 The Fundamental Requirement
            <span className={`expand-arrow ${expandedSection === 'fundamental' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'fundamental' && (
            <div className="section-content">
              <p>
                A material becomes a <strong>memristor</strong> when it satisfies ONE KEY CONDITION:
              </p>

              <div className="highlight-box">
                <h3>Coupled Electronic + Ionic Transport</h3>
                <p>
                  <strong>Electronic conduction</strong> (electrons/holes) + <strong>Ionic transport</strong> (defects/vacancies) = Memristive behavior
                </p>
                <div className="code-block">
When these transports are COUPLED:
- Applied voltage drives ions (oxygen vacancies)
- Ion movement changes resistance
- Resistance changes accumulate (state-dependent)
- I-V curve exhibits hysteresis with memory

NO ionic transport = NO memristive behavior (just a resistor)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Critical Properties */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('properties')}>
            🔬 Six Critical Material Properties
            <span className={`expand-arrow ${expandedSection === 'properties' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'properties' && (
            <div className="section-content">
              <div className="properties-grid">
                {properties.map((prop, idx) => (
                  <div key={idx} className="property-item">
                    <div className="property-item-icon">{prop.icon}</div>
                    <h4>{prop.title}</h4>
                    <p>{prop.description}</p>
                    <div className="property-detail">{prop.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Material Comparison */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('comparison')}>
            📈 Material Performance Comparison
            <span className={`expand-arrow ${expandedSection === 'comparison' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'comparison' && (
            <div className="section-content">
              <div className="material-grid">
                {materials.map((mat, idx) => (
                  <div key={idx} className="material-card" style={{ borderLeftColor: mat.color }}>
                    <h4 style={{ color: mat.color }}>{mat.name}</h4>
                    <div className="property-row">
                      <div className="property-label">Bandgap:</div>
                      <div className="property-value">{mat.bandgap}</div>
                    </div>
                    <div className="property-row">
                      <div className="property-label">Mobility:</div>
                      <div className="property-value">{mat.mobility} S/cm</div>
                    </div>
                    <div className="property-row">
                      <div className="property-label">ON/OFF:</div>
                      <div className="property-value">{mat.onOff}</div>
                    </div>
                    <div className="property-row">
                      <div className="property-label">Speed:</div>
                      <div className="property-value">{mat.speed}</div>
                    </div>
                    <div className="property-badge">{mat.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Oxygen Vacancies */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('vacancies')}>
            🧬 Oxygen Vacancies: The Heart of Memristors
            <span className={`expand-arrow ${expandedSection === 'vacancies' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'vacancies' && (
            <div className="section-content">
              <div className="code-block">
Chemical Formula: V_O (oxygen vacancy)

Normal lattice:         With oxygen vacancy:
Hf - O - Hf - O        Hf - O - Hf - [EMPTY] - Hf - O
                                     ↑
                              Missing oxygen = V_O

Properties of V_O:
1. Electrically charged: 2+ charge
2. Mobile: Can drift/diffuse under electric field
3. Creates defect levels: New energy states in bandgap
4. Increases conductivity: When concentrated
5. Tunable concentration: Easy to control
              </div>

              <h3>Why Oxygen Vacancies Are Best:</h3>
              <ul>
                <li><strong>✓ MOBILE:</strong> Can move under E-field (others can too, but easiest to control)</li>
                <li><strong>✓ ABUNDANT:</strong> Easy to create in oxides (natural defect)</li>
                <li><strong>✓ CONTROLLABLE:</strong> Tuned by oxygen pressure, temperature, annealing</li>
                <li><strong>✓ STABLE:</strong> Don't disappear over time (locked in lattice)</li>
              </ul>
            </div>
          )}
        </div>

        {/* Switching Mechanism */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('mechanism')}>
            🔄 How Memristor Switching Actually Works
            <span className={`expand-arrow ${expandedSection === 'mechanism' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'mechanism' && (
            <div className="section-content">
              <div className="code-block">
INITIAL: Few oxygen vacancies → High Resistance (MΩ range)
    ↓
APPLY V+ VOLTAGE: O²⁻ anions pushed away
    ↓ Oxygen vacancies CONCENTRATE in filament region
    ↓
FILAMENT FORMS: Metal-like conduction through vacancies
    ↓ Low Resistance State (10-1000Ω)
    ↓
APPLY V- VOLTAGE: O²⁻ anions pulled back
    ↓ Oxygen vacancies DILUTE from filament
    ↓
FILAMENT BREAKS: Conduction blocked
    ↓ Back to High Resistance State (MΩ range)
    ↓
MEMORY: Resistance depends on history of applied voltage
    ↓ Creates HYSTERESIS LOOP
              </div>
            </div>
          )}
        </div>

        {/* Material Examples */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('examples')}>
            🏆 Why HfO₂ Is the Industry Standard
            <span className={`expand-arrow ${expandedSection === 'examples' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'examples' && (
            <div className="section-content">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>HfO₂ Value</th>
                    <th>Why It Matters</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Bandgap</strong></td>
                    <td>5.7-6.0 eV</td>
                    <td>Wide bandgap → good isolation in HRS</td>
                  </tr>
                  <tr>
                    <td><strong>Ionic Mobility</strong></td>
                    <td>10⁻¹³ to 10⁻⁷ S/cm</td>
                    <td>Highly tunable → precise control</td>
                  </tr>
                  <tr>
                    <td><strong>O-Vacancy Density</strong></td>
                    <td>Controllable</td>
                    <td>Easy to engineer performance</td>
                  </tr>
                  <tr>
                    <td><strong>CMOS Compatible</strong></td>
                    <td>✓ Excellent</td>
                    <td>Integrates with Si technology</td>
                  </tr>
                  <tr>
                    <td><strong>Thermal Stability</strong></td>
                    <td>&gt; 1000°C</td>
                    <td>Reliable at high temperature</td>
                  </tr>
                  <tr>
                    <td><strong>Deposition</strong></td>
                    <td>ALD/PVD</td>
                    <td>Standard fab processes</td>
                  </tr>
                  <tr>
                    <td><strong>ON/OFF Ratio</strong></td>
                    <td>10⁴ to 10⁶</td>
                    <td>Wide resistance window</td>
                  </tr>
                  <tr>
                    <td><strong>Switching Speed</strong></td>
                    <td>5-10 ns</td>
                    <td>Fast enough for computing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="materials-section">
          <h2 onClick={() => toggleSection('insights')}>
            🎓 Key Insights & Takeaways
            <span className={`expand-arrow ${expandedSection === 'insights' ? 'expanded' : ''}`}>▼</span>
          </h2>
          {expandedSection === 'insights' && (
            <div className="section-content">
              <h3>Why Metal Oxides Are the Answer:</h3>
              <div className="highlight-box">
                <h4>The Goldilocks Zone</h4>
                <ul>
                  <li>✓ Insulating in pure form (good HRS)</li>
                  <li>✓ Defects create pathways (good LRS)</li>
                  <li>✓ Defects mobile under field (good switching)</li>
                  <li>✓ Electrochemistry controlled (predictable)</li>
                </ul>
              </div>

              <h3>The Complete Requirement:</h3>
              <div className="code-block">
Material = Wide-bandgap oxide (HfO₂, TiO₂, etc)
         + Mobile oxygen vacancies
         + Controllable defect density
         + Two electron conduction mechanisms

Result = COUPLED electronic + ionic transport
       = Hysteretic I-V curve (memory)
       = Resistance changes by state history
       = MEMRISTOR BEHAVIOR ✓
              </div>
            </div>
          )}
        </div>

        {/* Research Links */}
        <div className="materials-section" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(96, 165, 250, 0.05)', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
          <h3>📚 Research Sources</h3>
          <ul style={{ lineHeight: '2' }}>
            <li><a href="https://www.nature.com/articles/s41598-022-22907-5.pdf" target="_blank" rel="noopener noreferrer">Oxygen Vacancy Engineering - Nature (2022)</a></li>
            <li><a href="https://pubs.acs.org/doi/10.1021/acsaelm.1c00398" target="_blank" rel="noopener noreferrer">Resistive Switching Mechanisms - ACS Materials (2024)</a></li>
            <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12781054/" target="_blank" rel="noopener noreferrer">Defect-Driven Filament Evolution - PMC (2024)</a></li>
            <li><a href="https://www.nature.com/articles/s41598-023-43888-z" target="_blank" rel="noopener noreferrer">Oxygen Vacancy Control - Nature (2023)</a></li>
            <li><a href="https://www.sciencedirect.com/science/article/pii/S2709472325000577" target="_blank" rel="noopener noreferrer">CMOS Compatible Memristors - ScienceDirect (2025)</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
