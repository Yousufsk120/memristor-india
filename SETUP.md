# MemristorIndia — Setup & Deployment Guide

Global Memristor Knowledge, Physics & Neuromorphic Intelligence Platform  
Chua (1971) → 2026 frontier · MIT/NASA/SpaceX engineering standard

---

## Quick Start (Local)

```bash
cd memristor-india
npm install
npm run dev
```
Open http://localhost:5173 — hot-reload enabled.

---

## Deploy to Netlify (Recommended)

### Option A — Drag & Drop (fastest)
1. Run `npm run build` locally → a `dist/` folder is created
2. Go to https://app.netlify.com → **Add new site → Deploy manually**
3. Drag the `dist/` folder onto the Netlify deploy zone
4. Done — you get a live URL like `https://memristor-india-xxxx.netlify.app`

### Option B — Git-connected (auto-deploys on push)
1. Push the `memristor-india/` folder to a GitHub repo
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Netlify auto-detects `netlify.toml` — settings are pre-configured:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site** — every `git push` triggers a new deploy

### Custom Domain
In Netlify → Site settings → Domain management → Add custom domain  
Point your DNS CNAME to `<your-site>.netlify.app`

---

## Project Structure

```
memristor-india/
├── src/
│   ├── App.jsx                    ← Main app, all sections, routing
│   ├── main.jsx                   ← React entry point
│   ├── styles/globals.css         ← All styles (CSS variables, dark mode)
│   ├── components/
│   │   └── visualizations/
│   │       ├── HysteresisExplorer.jsx   ← Live animated I-V loop
│   │       ├── FilamentAnimation.jsx    ← Filament formation/rupture
│   │       ├── CrossbarVMM.jsx          ← Matrix-vector multiply demo
│   │       ├── CircuitElements.jsx      ← 4-element periodic table
│   │       ├── DeviceStackBuilder.jsx   ← Interactive stack configurator
│   │       └── PulseSimulator.jsx       ← LTP/LTD + STDP simulator
│   └── data/
│       ├── qa.js          ← 100 Questions & Answers
│       ├── timeline.js    ← Timeline events 1971→2040
│       ├── materials.js   ← Materials database cards
│       ├── citations.js   ← Citation store
│       └── papers.js      ← Paper library (~38 references)
├── netlify.toml           ← Netlify SPA redirect config
├── vite.config.js
└── package.json
```

---

## What's Built (20 Sections)

| Section | Content |
|---------|---------|
| Home | Overview, quick-access, live hysteresis |
| What is a Memristor? | 3-depth explainer, circuit elements |
| Core Physics | VCM/ECM/PCM/FTJ mechanisms, filament animation |
| Principles | Chua's symmetry argument |
| Types & Positioning | Full taxonomy table |
| Materials Database | 8 material cards with specs |
| **Device Stack Builder** | Interactive electrode + layer configurator |
| Device & Stack | MIM, 1T1R, 1S1R, 3D architectures |
| Characterization | I-V, endurance, retention, variability |
| Neuromorphic Computing | VMM crossbar, synaptic functions |
| **Pulse Simulator** | LTP/LTD curves + STDP window |
| HMI / BCI | 128k-cell BCI chip, ethics, prosthetics |
| Applications | 8 application domains with TRL |
| Market & Economics | Multi-estimate table, global R&D map |
| Top Scientists & Labs | 10 researcher profiles |
| Timeline 1971→2026 | Filterable interactive timeline |
| 100 Q&As | Full searchable knowledge base |
| What Scientists Debate | 3 live controversies, both sides |
| **Paper Library** | 38 references, filterable by mechanism/app/year |
| **Thesis Support** | Perovskite NC memristors — synthesis to outlook |

---

## Adding Content

**New Q&A:** Edit `src/data/qa.js` — add an entry to the `qaData` array.  
**New paper:** Edit `src/data/papers.js` — add to the `papers` array.  
**New timeline node:** Edit `src/data/timeline.js`.  
**New material card:** Edit `src/data/materials.js`.

All content follows the three-depth pattern (`Explain / Standard / Deep`) via the `DepthContent` wrapper component in `App.jsx`.

---

## Tech Stack

- **React 18** + **Vite 5** — component-driven, static-first
- **Pure CSS** — CSS variables for theming, no Tailwind dependency
- **Canvas API** — all interactive physics animations (no D3 or Chart.js)
- **No backend required** — 100% static, deploy anywhere
- **Fonts:** Inter + JetBrains Mono via Google Fonts

---

## Extending the Platform

### Add MathJax/KaTeX for equations
```bash
npm install katex
```
Import in `App.jsx`: `import 'katex/dist/katex.min.css'`

### Add full-text search (Fuse.js)
```bash
npm install fuse.js
```
Create a combined index over `qaData`, `papers`, and `timelineEvents`.

### Add a backend API for live paper updates
Connect to Semantic Scholar API (`https://api.semanticscholar.org/graph/v1/paper/search`) to pull new memristor papers automatically.

---

Built on: Chua (1971) · Strukov et al. (2008) · Waser & Aono (2007) · Yang et al. (2013) · Ielmini & Pedretti (2025) · HKU BCI Team (2025)
