# Normas de referencia

## API Spec 12L — Vertical and Horizontal Emulsion Treaters

- Archivo: [API-Spec-12L-1994.pdf](./API-Spec-12L-1994.pdf) (4.ª edición, 1 de noviembre de 1994).
- Es un escaneo, sin texto extraíble: para consultarlo hay que ver las páginas como imagen.
- Material con copyright de API: es de uso interno del proyecto y no se debe redistribuir.

### Dónde se aplica en el código

Todas las tablas están en [`api12l.tables.ts`](../../src/repositories/evaluations/services/api12l.tables.ts), que es la única fuente de verdad.

| Sección de la norma | Página del documento | Qué fija | Dónde se usa |
|---|---|---|---|
| 3.23 Operating pressure | 5 | La presión de operación no puede superar la de diseño (MAWP) | `validateAPI12LCompliance` |
| 5.1 · Tabla 1 (vertical) y Tabla 2 (horizontal) | 6 | Diámetros, longitudes y presión mínima de diseño | `API12L_VERTICAL_SIZES` / `API12L_HORIZONTAL_SIZES` |
| 5.2 · Tabla 3 | 7 | Firebox mínimo por diámetro **y orientación** (área y heat duty) | `api12lFirebox` |
| 5.3 Firetube heat flux | 7 | ≤ 10 000 BTU/h·ft² | Implícito en la Tabla 3 |
| A.2 Heating | 11 | Viscosidad ≤ 150 SSU; temperatura de tratamiento típica de 100–250 °F | Advertencias |
| A.3 Coalescing | 11 | Retención típica: crudo 30–100 min, agua 15–30 min | Advertencias |
| Apéndice D · Liquid capacity / Heat duty | 17 | `V = W·R/1440`; `Q = Wo·Co·ΔT + Ww·Cw·ΔT`; `Wo = 14.58·W·(1−X)·so` | Calculador térmico |
| Apéndice D · Heat loss | 17–18 | `Ql = K·D·L·(T2 − Ta)`; K = 9.3 / 9.8 / 13.2 / 15.7 (0 / 5 / 10 / 20 mph); aislado = 5–10 % | `api12lWindK`, `API12L_INSULATED_LOSS_FACTOR` |
| Apéndice D · Sizing | 17 | Dimensionar con el caudal instantáneo máximo | `selectOptimalDimensions` |
| Apéndice E · Tabla E-1 | 19 | Ejemplo de diseño y volúmenes de retención de crudo y agua por tamaño | `selectOptimalDimensions`, `treatments.service` |
| Apéndice H | 25–26 | Eficiencia de combustión y consumo de combustible | Pendiente: faltan datos del gas combustible |

El ejemplo del Apéndice E está reproducido como test en [`api12l.tables.spec.ts`](../../src/repositories/evaluations/services/api12l.tables.spec.ts).

### Inconsistencias de la norma y cómo se resolvieron

- **Horizontal 6 × 10 ft:** la Tabla 2 lo lista, pero la Tabla E-1 solo trae 6 × 12. Sus volúmenes se estimaron escalando por longitud (× 10/12).
- **Vertical 12 ft:** la Tabla 3 no tiene rating; se trata como "sin rating".
- **Rótulos de la Tabla E-1:** "2'-6"" y "27'-0"" corresponden a 27.5 ft (Tabla 1).
- **Tamaños no estándar:** para la cámara de combustión se usa el diámetro estándar inmediatamente menor (criterio conservador).

### Pendiente, porque falta información de entrada

- Densidad de calor del firetube (5.4), máximo 15 000 BTU/h·in²: falta el área de sección del firetube.
- Espesor mínimo de pared del firetube (5.9): 3/16" en verticales y 1/4" en horizontales.
- Velocidad en lechos de excelsior (A.3): 7–40 BPD/ft² en verticales y 17–120 BPD/ft² en horizontales.
