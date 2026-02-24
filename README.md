# 🧪 CellSplit | Host Cell Lab Suite
> **Precision cell passaging. Zero friction.**

CellSplit es una herramienta minimalista diseñada para optimizar el flujo de trabajo en el laboratorio de cultivo celular. Permite transitar del conteo en cámara de Neubauer al cálculo del volumen de inóculo en una sola interfaz, eliminando errores de transcripción y cálculos manuales.

[ ![Live App](https://img.shields.io/badge/Status-Live_App-d4ff00?style=for-the-badge&logo=githubpages&logoColor=000) ](https://ebalderasr.github.io/CellSplit/)

---

<p align="center">
  <img src="icon-512.png" width="200" alt="CellSplit Logo">
</p>

---

## 🧬 Fundamentos del Cálculo

CellSplit automatiza los cálculos críticos para el mantenimiento de líneas celulares (como células CHO). Las fórmulas implementadas son:

### 1. Concentración Celular
Se calcula la densidad de células viables por mililitro basándose en el conteo total y los parámetros de dilución:

$$\text{cell/mL} = \left( \frac{\text{Células Contadas}}{\text{Cuadrantes}} \right) \times \text{Factor de Dilución} \times 10,000$$

### 2. Viabilidad
Determina el porcentaje de salud del cultivo mediante exclusión con colorante (ej. Azul de Tripano):

$$\text{Viabilidad (\%)} = \left( \frac{\text{Células Vivas}}{\text{Células Vivas} + \text{Células Muertas}} \right) \times 100$$

### 3. Volumen de Inóculo (Pase)
Utiliza el principio de conservación de masa ($C_1 V_1 = C_2 V_2$) para determinar cuánto volumen del cultivo actual se requiere para alcanzar la densidad de siembra meta:

$$V_1 = \frac{C_2 \times V_2}{C_1}$$

*Donde:*
* $C_1$: Concentración celular actual.
* $V_1$: Volumen de inóculo requerido.
* $C_2$: Densidad de siembra meta.
* $V_2$: Volumen final del nuevo matraz.

---

## 🔍 Especificaciones del Equipo
Los algoritmos de CellSplit asumen el uso de una **Cámara de Neubauer estándar** (o hemocitómetro) con las dimensiones especificadas por [Marienfeld Superior](https://www.marienfeld-superior.com/counting-grids.html):

* **Profundidad (Depth):** 0.1 mm.
* **Área del cuadro pequeño:** 0.0025 mm² (lado de 0.05 mm).
* **Factor de conversión:** El factor $10,000$ ($10^4$) se deriva del volumen de un cuadrante grande ($1 \text{ mm}^2 \times 0.1 \text{ mm} = 0.1 \text{ mm}^3$), convirtiendo $\text{mm}^3$ a $\text{mL}$.

---

## ⚡ Características
- **Data Link:** Los resultados del conteo se transfieren automáticamente al módulo de pase.
- **Diagnostics:** Alertas visuales si el conteo está fuera del rango estadístico óptimo (100-500 células en 10 cuadrantes).
- **PWA Ready:** Instalable en Android e iOS para uso offline dentro de la campana de bioseguridad.
- **Multilingüe:** Interfaz bilingüe (ES/EN) con terminología técnica corregida.

## 🚀 Instalación
Al ser una **Progressive Web App (PWA)**, no necesitas descargar nada de la Play Store:
1. Accede a [CellSplit](https://ebalderasr.github.io/CellSplit/).
2. Haz clic en el botón **[ Install App ]** o selecciona "Agregar a inicio" en tu navegador.

---

## 🧬 Part of Host Cell
**Host Cell** es una suite de herramientas sencillas para biotecnología, enfocadas en la eficiencia del laboratorio con una estética brutalista y técnica.

Desarrollado por [Emiliano Balderas](https://github.com/ebalderasr).
*Instituto de Biotecnología (IBt) - UNAM.*