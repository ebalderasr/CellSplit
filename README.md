<div align="center">

# CellSplit

### Neubauer cell counting and passage planning for CHO cultures

<a href="https://ebalderasr.github.io/CellSplit/">
  <img src="icon-512.png" alt="CellSplit" width="120">
</a>

<br>

**[→ Open the live app](https://ebalderasr.github.io/CellSplit/)**

<br>

[![Stack](https://img.shields.io/badge/Stack-HTML_·_CSS_·_JavaScript-4A90D9?style=for-the-badge)]()
[![Focus](https://img.shields.io/badge/Focus-Cell_Culture_·_CHO-34C759?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)
[![Part of](https://img.shields.io/badge/Part_of-HostCell_Lab_Suite-5856D6?style=for-the-badge)](https://github.com/ebalderasr)

</div>

---

## What is CellSplit?

CellSplit is a **browser-based calculator** for routine cell culture maintenance. It covers the two calculations performed at every passage: converting a Neubauer chamber count into viable cell density, and computing the inoculum volume needed to seed the next flask at a target density.

Both modules are linked — the viable concentration calculated in Module 1 is transferred automatically to Module 2, eliminating transcription between steps. The app runs entirely in the browser, installs as a PWA for offline use inside the biosafety cabinet, and requires no setup.

---

## Why it matters

Cell culture passaging involves repetitive manual arithmetic done under time pressure, often inside a biosafety cabinet without access to a computer. Without a dedicated tool:

- Concentration calculations are done by hand or on scratch paper, introducing transcription errors
- The inoculum volume must be computed separately, from values just written down
- No feedback is given when the cell count falls outside a statistically reliable range

CellSplit removes all three problems. It validates the count range, computes both outputs in one step, and carries the result forward automatically.

---

## How it works

### Module 1 — Cell count

Enter the number of live and dead cells counted, the number of squares used, and the dilution factor. CellSplit returns the viable cell concentration (×10⁶ cells/mL), the viability (%), and a count diagnostic.

| Diagnostic | Criterion |
|---|---|
| Low | Total cells < squares × 10 |
| Optimal | squares × 10 ≤ total ≤ squares × 50 |
| High | Total cells > squares × 50 |

The optimal window (~10–50 events per square) avoids both sampling noise from sparse counts and systematic undercounting from cell overlap.

**Formulas**

$$\frac{\text{cells}}{\text{mL}} = \frac{\text{Live}}{\text{Squares}} \times \text{Dilution} \times 10{,}000$$

$$\text{Viability (\%)} = \frac{\text{Live}}{\text{Live} + \text{Dead}} \times 100$$

The factor 10,000 comes from the Neubauer chamber geometry: one large square covers 1 mm² at 0.1 mm depth = 10⁻⁴ mL, so multiplying by its reciprocal converts count per square into cells per mL.

### Module 2 — Passage / inoculum

The viable concentration from Module 1 is pre-filled. Set the target culture volume and target seeding density; CellSplit returns the inoculum volume and the volume of fresh medium required.

$$V_1 = \frac{C_2 \times V_2}{C_1}$$

$$V_{\text{fresh}} = V_2 - V_1$$

C₁ must exceed C₂. The app returns an error if the target density is higher than the current culture density.

---

## Features

| | |
|---|---|
| **Automatic data link** | Viable concentration transfers from Module 1 to Module 2 without manual entry |
| **Count diagnostics** | Visual badge flags low, optimal, or high cell counts per square |
| **Offline-first PWA** | Service Worker caches all assets; works without internet after first load |
| **Bilingual UI** | Full Spanish / English interface, persisted across sessions |
| **Dark mode** | System-level dark mode — high contrast for low-light microscope rooms |
| **No installation** | Opens instantly in any modern browser; installable on Android, iOS, and desktop |

---

## Tech stack

**Frontend**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

**Deployment**

![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

Fully static — no backend, no framework, no build step. All computation runs client-side in vanilla JavaScript.

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

---

## Author

**Emiliano Balderas Ramírez**
Bioengineer · PhD Candidate in Biochemical Sciences
Instituto de Biotecnología (IBt), UNAM

[![LinkedIn](https://img.shields.io/badge/LinkedIn-emilianobalderas-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/emilianobalderas/)
[![Email](https://img.shields.io/badge/Email-ebalderas%40live.com.mx-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:ebalderas@live.com.mx)

---

## Related

[**CellBlock**](https://github.com/ebalderasr/CellBlock) — shared biosafety cabinet scheduling for cell culture research groups.

[**Clonalyzer 2**](https://github.com/ebalderasr/Clonalyzer-2) — browser-based kinetics analysis for CHO fed-batch cultures.

---

<div align="center"><i>CellSplit — count, calculate, passage.</i></div>
