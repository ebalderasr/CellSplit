<div align="center">

# ⚗ CellSplit

### Neubauer cell counting and passage planning for CHO cultures

**Count cells → get viable density and inoculum volume — in your browser, no installation required.**

[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://ebalderasr.github.io/CellSplit/)
[![License](https://img.shields.io/badge/License-MIT-107F80?style=for-the-badge)](LICENSE)

<br/>

**[→ Open CellSplit](https://ebalderasr.github.io/CellSplit/)**

</div>

---

## Why CellSplit?

Routine cell culture maintenance involves two calculations performed at every passage: converting a Neubauer chamber count into a viable cell density, and computing the inoculum volume needed to seed the next flask at a target density. Done manually, this is error-prone and slow — especially when working inside a biosafety cabinet.

**CellSplit compresses that workflow into two steps.** Enter your live and dead cell counts, and the app returns the viable concentration and viability. Switch to the passage module and the concentration is already filled in — just set your target volume and density.

- Neubauer hemocytometer math with configurable squares and dilution factor
- Count diagnostics: flags counts outside the optimal statistical range
- Automatic data transfer from counting to passaging
- Installable PWA — works fully offline inside the biosafety cabinet

No dependencies. No installation. Opens instantly in any modern browser.

---

## Features

| | |
|---|---|
| **Neubauer counting** | Configurable squares (1–10) and dilution factor (1–200); supports all common setups |
| **Count diagnostics** | Visual badge flags low, high, or optimal cell counts per square |
| **Passage calculator** | Solves C₁V₁ = C₂V₂ for inoculum and fresh medium volumes |
| **Auto data link** | Viable concentration transfers automatically to the passage module |
| **Offline-first PWA** | Service Worker caches all assets; works without internet after first load |
| **Bilingual UI** | Full Spanish / English interface, persisted in localStorage |
| **Dark mode** | System-level dark mode support — high contrast for microscope rooms |

---

## Getting started

1. Open **[ebalderasr.github.io/CellSplit](https://ebalderasr.github.io/CellSplit/)**
2. Enter your live and dead cell counts
3. Confirm the number of squares counted and the dilution factor
4. Click **Analizar Conteo** — viable density, viability, and diagnostic appear instantly
5. Switch to **02. Pase / Inóculo** — the concentration is pre-filled
6. Set your target volume and target density, then click **Calcular Pase**

To install as a PWA: on Android or desktop, use the **Install** button in the nav bar. On iOS, tap **Share → Add to Home Screen** in Safari.

---

## Methods

### Viable cell concentration

Cells are counted in the large corner squares (1 mm² each) of a standard Neubauer chamber (depth = 0.1 mm). The conversion factor of 10,000 comes from the reciprocal volume of one large square (10⁻⁴ mL):

$$\text{Viable conc.} \left(\frac{\times 10^6 \text{ cells}}{\text{mL}}\right) = \frac{\text{Live cells counted}}{\text{Squares counted}} \times \text{Dilution factor} \times 0.01$$

### Viability

$$\text{Viability (\%)} = \frac{\text{Live cells}}{\text{Live cells} + \text{Dead cells}} \times 100$$

Dye exclusion is assumed (e.g. Trypan Blue). Dead cells take up the dye and appear dark; live cells exclude it.

### Count diagnostic thresholds

| Status | Criterion |
|---|---|
| Low | Total cells counted < squares × 10 |
| Optimal | squares × 10 ≤ total ≤ squares × 50 |
| High | Total cells counted > squares × 50 |

The optimal window (~10–50 events per square) minimizes both sampling noise (low counts) and systematic undercounting from cell overlap (high counts).

### Passage / inoculum calculation

Applies conservation of mass assuming ideal mixing:

$$V_1 = \frac{C_2 \times V_2}{C_1}$$

where C₁ is the current density, C₂ is the target seeding density, V₂ is the target culture volume, and V₁ is the required inoculum. Fresh medium volume = V₂ − V₁.

> C₁ must be greater than C₂. The app returns an error if you attempt to seed at a density higher than the current culture.

---

## Project structure

```
CellSplit/
├── index.html          ← markup only
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker (cache-first, offline support)
├── icon-192.png
├── icon-512.png
└── src/
    ├── css/
    │   └── app.css     ← all styles (CSS variables, dark mode, glassmorphism)
    └── js/
        ├── i18n.js     ← translation strings (ES / EN)
        └── app.js      ← all application logic
```

No build step. The entire app is static and deployable to any file host.

---

## Tech stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

Fully static — no backend, no framework, no build tools. All computation runs client-side in vanilla JavaScript.

---

## Author

**Emiliano Balderas Ramírez**
Bioengineer · PhD Candidate in Biochemical Sciences
Instituto de Biotecnología (IBt), UNAM

[![LinkedIn](https://img.shields.io/badge/LinkedIn-emilianobalderas-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/emilianobalderas/)
[![Email](https://img.shields.io/badge/Email-ebalderas%40live.com.mx-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:ebalderas@live.com.mx)

---

## Related

[**Clonalyzer 2**](https://github.com/ebalderasr/Clonalyzer-2) — browser-based kinetics analysis for CHO fed-batch cultures: specific rates, clone comparisons, and publication-ready plots from a single CSV upload.
