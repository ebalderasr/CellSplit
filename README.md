# 🧪 CellSplit | Host Cell Lab Suite
> **Precision cell passaging. Zero friction.**

CellSplit is a minimalist, professional-grade tool designed to streamline mammalian cell culture maintenance. It bridges the gap between Neubauer chamber counting and inoculum calculation in a single, high-contrast interface.

<p align="center">
  <img src="icon-512.png" width="180" alt="CellSplit Logo">
</p>

<p align="center">
  <a href="https://ebalderasr.github.io/CellSplit/">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_APP-CLICK_HERE_TO_START-d4ff00?style=for-the-badge&labelColor=000000" alt="Launch CellSplit App">
  </a>
</p>

---

## 🧬 Scientific Fundamentals

CellSplit automates the critical calculations required for bioprocess scaling and cell line maintenance (optimized for CHO cells).

### 1. Viable Cell Concentration
The app calculates the density of viable cells per milliliter based on your count and dilution factor:

$$\text{cell/mL} = \left( \frac{\text{Live Cells counted}}{\text{Squares counted}} \right) \times \text{Dilution Factor} \times 10,000$$

### 2. Viability (%)
Determines the health of the culture using dye exclusion (e.g., Trypan Blue):

$$\text{Viability (\%)} = \left( \frac{\text{Live Cells}}{\text{Live Cells} + \text{Dead Cells}} \right) \times 100$$

### 3. Inoculum Volume (Passaging)
Applies the conservation of mass principle ($C_1 V_1 = C_2 V_2$) to determine the exact volume needed for a new flask:

$$V_1 = \frac{C_2 \times V_2}{C_1}$$

---

## 🔍 Equipment Specifications


CellSplit's algorithms assume the use of a standard **Neubauer counting chamber** (or hemocytometer) with the following precision dimensions:

* **Chamber Depth:** $0.1$ mm.
* **Smallest Square Area:** $0.0025 \text{ mm}^2$ ($0.05$ mm side length).
* **Conversion Factor:** The $10,000$ ($10^4$) factor is derived from the volume of one large square ($1 \text{ mm}^2 \text{ area} \times 0.1 \text{ mm} \text{ depth} = 0.1 \text{ mm}^3$), which is equivalent to $10^{-4} \text{ mL}$.

---

## ⚡ Features
* **Automated Data Link:** Results from the counting module are automatically transferred to the passaging module.
* **Range Diagnostics:** Visual alerts if your count is outside the optimal statistical range (100–500 cells in 10 squares).
* **PWA Ready:** Install it on Android or iOS for offline use inside the biosafety cabinet.
* **Dark Mode UX:** Designed for high visibility in low-light microscope rooms.

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Why does the app use the $10,000$ factor?**
A: Since one large square on a Neubauer chamber represents a volume of $0.1 \text{ mm}^3$, multiplying by $10,000$ converts the average count per square into cells per $1 \text{ mL}$ ($1,000 \text{ mm}^3$).

**Q: Can I use this for non-CHO cells?**
A: Yes. While developed for CHO cell bioprocessing, the math is universal for any mammalian cell line counted via hemocytometer.

**Q: Does it work without internet?**
A: Yes. Once installed as a PWA, the Service Worker caches the logic for offline lab use.

---

## Installation / PWA (optional)

MolarPrep can be installed as a Progressive Web App (PWA) on supported browsers.

### Desktop / Android
- Open the live app
- Click the **Install** button (if shown), or use browser install prompt

### iPhone / iPad (Safari)
- Open the live app
- Tap **Share**
- Select **Add to Home Screen**

Once installed, it can work offline after the necessary files are cached.

---

## 👨‍🔬 Author
**Emiliano Balderas**
Biotechnology Engineer | PhD Student in Biochemistry
*Instituto de Biotecnología (IBt) - UNAM.*

---

## Part of the Host Cell Suite

**MolarPrep** is part of **Host Cell**, a suite of practical tools for bioprocessing and lab workflows.
