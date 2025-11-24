# Fórmulas Implementadas en el Sistema Termo-Lab

Este documento contiene todas las fórmulas implementadas en el sistema, organizadas por módulo y categoría según la norma API-12L.

---

## 📋 Índice

1. [Fórmulas de Propiedades del Crudo](#1-fórmulas-de-propiedades-del-crudo)
2. [Fórmulas de Propiedades del Agua](#2-fórmulas-de-propiedades-del-agua)
3. [Fórmulas de Propiedades del Gas](#3-fórmulas-de-propiedades-del-gas)
4. [Fórmulas de Flujos y Caudales](#4-fórmulas-de-flujos-y-caudales)
5. [Fórmulas de Áreas y Volúmenes](#5-fórmulas-de-áreas-y-volúmenes)
6. [Fórmulas de Tiempos de Retención](#6-fórmulas-de-tiempos-de-retención)
7. [Fórmulas de Decantación](#7-fórmulas-de-decantación)
8. [Fórmulas de Calor](#8-fórmulas-de-calor)
9. [Fórmulas de Boquillas](#9-fórmulas-de-boquillas)
10. [Fórmulas de Evaluación](#10-fórmulas-de-evaluación)

---

## 1. Fórmulas de Propiedades del Crudo

### 1.1 Gravedad Específica del Crudo (Ecuación 1.32)
**Archivo:** `thermal-calculator.service.ts` (línea 853-855)

```typescript
GE_crudo = 141.5 / (API + 131.5)
```

**Donde:**
- `GE_crudo`: Gravedad específica del crudo (adimensional)
- `API`: Grados API del crudo (°API)

---

### 1.2 Densidad del Crudo (Ecuación 1.35)
**Archivo:** `thermal-calculator.service.ts` (línea 857-866)

```typescript
ρ₀ = (GE_crudo × 62.4) / (1 + 0.00065 × (T - 60))
```

**Donde:**
- `ρ₀`: Densidad del crudo (lb/pie³)
- `GE_crudo`: Gravedad específica del crudo
- `T`: Temperatura del crudo (°F)
- `62.4`: Densidad del agua a 60°F (lb/pie³)

---

### 1.3 Calor Específico del Crudo (Ecuación 1.33)
**Archivo:** `thermal-calculator.service.ts` (línea 873-879) y `treatments.service.ts` (línea 562-567)

```typescript
Cpo = (0.388 + 0.00045 × T) / √GE_crudo
```

**Donde:**
- `Cpo`: Calor específico del crudo (BTU/(lb·°F))
- `T`: Temperatura del crudo (°F)
- `GE_crudo`: Gravedad específica del crudo

**Correlación:** Katz (1942) para crudos líquidos

---

### 1.4 Flujo Másico del Crudo (Ecuación 1.20)
**Archivo:** `thermal-calculator.service.ts` (línea 1055-1061) y `treatments.service.ts` (línea 547)

```typescript
Wo = 14.58 × Qo × GE_crudo
```

**Donde:**
- `Wo`: Flujo másico del crudo (lb/h)
- `Qo`: Caudal de crudo seco (BPD)
- `GE_crudo`: Gravedad específica del crudo

---

## 2. Fórmulas de Propiedades del Agua

### 2.1 Densidad del Agua (Ecuación 1.36)
**Archivo:** `thermal-calculator.service.ts` (línea 868-871)

```typescript
ρw = 62.4 - 0.013 × (T - 60)
```

**Donde:**
- `ρw`: Densidad del agua (lb/pie³)
- `T`: Temperatura del agua (°F)

---

### 2.2 Calor Específico del Agua (Ecuación 1.34)
**Archivo:** `thermal-calculator.service.ts` (línea 881-884) y `treatments.service.ts` (línea 573-575)

```typescript
Cpw = 1.0 - 0.000117 × (T - 60)
```

**Donde:**
- `Cpw`: Calor específico del agua (BTU/(lb·°F))
- `T`: Temperatura del agua (°F)

**Rango válido:** 32-212°F

---

### 2.3 Flujo Másico de Agua (Ecuación 1.21)
**Archivo:** `thermal-calculator.service.ts` (línea 1063-1069)

```typescript
Ww = 14.58 × Qw × GE_agua
```

**Donde:**
- `Ww`: Flujo másico de agua (lb/h)
- `Qw`: Caudal de agua (BPD)
- `GE_agua`: Gravedad específica del agua (típicamente 1.0)

---

## 3. Fórmulas de Propiedades del Gas

### 3.1 Densidad del Gas Real (Ecuación 1.31)
**Archivo:** `thermal-calculator.service.ts` (línea 1202-1216)

```typescript
ρg = (P × PMg) / (Z × R × T)
```

**Donde:**
- `ρg`: Densidad del gas (lb/pie³)
- `P`: Presión absoluta (Psia = Psig + 14.7)
- `PMg`: Peso molecular del gas (lb/mol)
- `Z`: Factor de compresibilidad
- `R`: Constante de los gases = 10.7316
- `T`: Temperatura absoluta (°R = °F + 459.67)

---

### 3.2 Factor de Compresibilidad Z (Ecuación 1.1)
**Archivo:** `thermal-calculator.service.ts` (línea 1251-1268)

```typescript
Z³ - (1 - B)Z² + (A - 3B² - 2B)Z - (AB - B² - B³) = 0
```

**Coeficientes:**
```typescript
A = (a × P) / (R² × T²)
B = (b × P) / (R × T)
```

**Donde:**
- `a = 0.8355419` (coeficiente de la Tabla 4-4)
- `b = 0.3803384` (coeficiente de la Tabla 4-4)
- `R = 10.7316` (constante de los gases)

**Método de resolución:** Newton-Raphson

---

### 3.3 Peso Molecular del Gas
**Archivo:** `thermal-calculator.service.ts` (línea 1218-1244)

```typescript
PMg = Σ(xi × MWi)
```

**Composición típica:**
- Metano (CH₄): 85% × 16.043 = 13.636 lb/mol
- Etano (C₂H₆): 8% × 30.07 = 2.406 lb/mol
- Propano (C₃H₈): 4% × 44.097 = 1.764 lb/mol
- Butano (C₄H₁₀): 2% × 58.123 = 1.162 lb/mol
- Pentano (C₅H₁₂): 1% × 72.151 = 0.722 lb/mol

**Total:** ~19.69 lb/mol

---

### 3.4 Velocidad Permisible para el Gas (Ecuación 1.14 / Ec. 24)
**Archivo:** `thermal-calculator.service.ts` (línea 969-977)

```typescript
Vg = K × √((ρo - ρg) / ρg)
```

**Donde:**
- `Vg`: Velocidad permisible para el gas (pie/s)
- `K`: Factor K (típicamente 0.5)
- `ρo`: Densidad del crudo (lb/pie³)
- `ρg`: Densidad del gas (lb/pie³)

---

## 4. Fórmulas de Flujos y Caudales

### 4.1 Caudal de Agua (Ecuación 1.6)
**Archivo:** `thermal-calculator.service.ts` (línea 942-948) y `treatments.service.ts` (línea 495-497)

```typescript
Qw = Qf × F
```

**Donde:**
- `Qw`: Caudal de agua (BPD)
- `Qf`: Flujo volumétrico total (BPD)
- `F`: Fracción volumétrica de agua (0-1)

---

### 4.2 Caudal de Crudo Seco (Ecuación 1.7)
**Archivo:** `thermal-calculator.service.ts` (línea 498) y `treatments.service.ts` (línea 488-490)

```typescript
Qo = Qf - Qw
```

**Donde:**
- `Qo`: Caudal de crudo seco (BPD)
- `Qf`: Flujo volumétrico total (BPD)
- `Qw`: Caudal de agua (BPD)

---

### 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26)
**Archivo:** `thermal-calculator.service.ts` (línea 886-893)

```typescript
%AguaLibre = (FracciónAgua × %Remoción) / 100
```

**Donde:**
- `%AguaLibre`: Porcentaje de agua libre y sedimento
- `FracciónAgua`: Porcentaje de agua en la corriente
- `%Remoción`: Porcentaje de agua libre retirada en el separador (típicamente 85%)

---

### 4.4 Porcentaje de Agua Emulsionada
**Archivo:** `thermal-calculator.service.ts` (línea 448-450)

```typescript
%AguaEmulsionada = %AguaTotal - %AguaLibre
```

---

### 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35)
**Archivo:** `thermal-calculator.service.ts` (línea 1167-1179)

```typescript
CAL = ((100 - PAT) × CAP / 100) × (100 - PAL) / 100
```

**Donde:**
- `CAL`: Caudal de agua libre entrando (BPD)
- `PAT`: Porcentaje de agua emulsionada en la corriente de entrada
- `CAP`: Caudal de agua producida (BPD)
- `PAL`: Porcentaje de agua libre retirada en el separador

---

### 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36)
**Archivo:** `thermal-calculator.service.ts` (línea 1181-1191)

```typescript
CAE = (CAP × PAE) / 100
```

**Donde:**
- `CAE`: Caudal de agua emulsionada entrando (BPD)
- `CAP`: Caudal de agua producida (BPD)
- `PAE`: Porcentaje de agua emulsionada

---

### 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37)
**Archivo:** `thermal-calculator.service.ts` (línea 1193-1200)

```typescript
CAT = CAL + CAE
```

**Donde:**
- `CAT`: Cantidad de agua total a ser manejada (BPD)
- `CAL`: Caudal de agua libre entrando (BPD)
- `CAE`: Caudal de agua emulsionada entrando (BPD)

---

### 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38)
**Archivo:** `thermal-calculator.service.ts` (línea 733-735)

```typescript
F = CAT / Qf
```

**Donde:**
- `F`: Fracción volumétrica del agua en la corriente de entrada
- `CAT`: Cantidad de agua total a ser manejada (BPD)
- `Qf`: Flujo volumétrico total (BPD)

---

### 4.9 Flujo Volumétrico del Gas
**Archivo:** `thermal-calculator.service.ts` (línea 1114-1136)

```typescript
Qg = (MMSCFD × 14.7 × (460 + Top) × 0.994) / (24 × 3600 × 520 × (Pop + 14.7))
```

**Donde:**
- `Qg`: Flujo volumétrico del gas a condiciones de operación (pie³/s)
- `MMSCFD`: Flujo de gas en millones de pies cúbicos estándar por día
- `Top`: Temperatura de operación (°F)
- `Pop`: Presión de operación (psig)
- `14.7`: Presión estándar (psia)
- `520`: Temperatura estándar (°R)
- `0.994`: Factor de corrección

---

## 5. Fórmulas de Áreas y Volúmenes

### 5.1 Área Total del Recipiente (Ecuación 1.10)
**Archivo:** `thermal-calculator.service.ts` (línea 895-898)

```typescript
B = π × D² / 4
```

**Donde:**
- `B`: Área total del recipiente (pie²)
- `D`: Diámetro del recipiente (pies)
- `π`: 3.14159...

---

### 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9)
**Archivo:** `thermal-calculator.service.ts` (línea 900-909)

```typescript
Nb = [2 × arccos(1 - 2H/(D×12)) - sin(2 × arccos(1 - 2H/(D×12)))] × B / (2π)
```

**Donde:**
- `Nb`: Área desde el fondo al nivel bajo bajo de agua (pie²)
- `H`: Nivel desde el fondo al nivel bajo bajo de agua (pulgadas)
- `D`: Diámetro del recipiente (pies)
- `B`: Área total del recipiente (pie²)

---

### 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26)
**Archivo:** `thermal-calculator.service.ts` (línea 911-925)

```typescript
C = [2 × arccos(1 - 2N/(D×12)) - sin(2 × arccos(1 - 2N/(D×12)))] × Nr / (2π) - Nb
```

**Donde:**
- `C`: Área ocupada por el agua (pie²)
- `N`: Nivel desde el fondo al nivel de interfase Agua-Crudo (pulgadas)
- `D`: Diámetro del recipiente (pies)
- `Nr`: Área total del recipiente (pie²)
- `Nb`: Área desde el fondo al nivel bajo bajo de agua (pie²)

---

### 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13)
**Archivo:** `thermal-calculator.service.ts` (línea 927-940)

```typescript
A_crudo = [2 × arccos(1 - 2A/(D×12)) - sin(2 × arccos(1 - 2A/(D×12)))] × B / (2π) - C - E
```

**Donde:**
- `A_crudo`: Área ocupada por el crudo (pie²)
- `A`: Nivel desde el fondo al nivel alto alto de crudo (pulgadas)
- `D`: Diámetro del recipiente (pies)
- `B`: Área total del recipiente (pie²)
- `C`: Área total ocupada por el agua (pie²)
- `E`: Área desde el fondo del equipo (pie²)

---

### 5.5 Área Disponible para el Gas (Ecuación 1.11)
**Archivo:** `thermal-calculator.service.ts` (línea 958-967)

```typescript
A_gas = [2 × arccos(1 - 2I/(D×12)) - sin(2 × arccos(1 - 2I/(D×12)))] × B / (2π)
```

**Donde:**
- `A_gas`: Área disponible para el gas (pie²)
- `I`: Altura libre para el gas (pies) = 0.5 × 12 = 6 pulgadas
- `D`: Diámetro del recipiente (pies)
- `B`: Área total del recipiente (pie²)

---

### 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25)
**Archivo:** `thermal-calculator.service.ts` (línea 979-991)

```typescript
A_requerida = Qg / Vg
```

**Donde:**
- `A_requerida`: Área requerida para el gas (pie²)
- `Qg`: Flujo volumétrico del gas (pie³/s)
- `Vg`: Velocidad permisible para el gas (pie/s)

---

### 5.7 Volumen de Retención del Crudo (Ecuación 1.5)
**Archivo:** `thermal-calculator.service.ts` (línea 490)

```typescript
V_oil = A_crudo × L
```

**Donde:**
- `V_oil`: Volumen de retención del crudo (pie³)
- `A_crudo`: Área ocupada por el crudo (pie²)
- `L`: Longitud del tratador (pies)

---

### 5.8 Volumen de Retención del Agua (Ecuación 1.12)
**Archivo:** `thermal-calculator.service.ts` (línea 491)

```typescript
V_water = C × L
```

**Donde:**
- `V_water`: Volumen de retención del agua (pie³)
- `C`: Área total ocupada por el agua (pie²)
- `L`: Longitud del tratador (pies)

---

## 6. Fórmulas de Tiempos de Retención

### 6.1 Tiempo de Retención Estimado (Ecuación 1.8)
**Archivo:** `thermal-calculator.service.ts` (línea 950-956) y `treatments.service.ts` (línea 1438-1443)

```typescript
T0 = (V_oil / 5.6146) × 24 × 60 / Qo
```

**Donde:**
- `T0`: Tiempo de retención estimado (minutos)
- `V_oil`: Volumen de retención del crudo (pie³)
- `5.6146`: Factor de conversión de pie³ a barriles
- `Qo`: Caudal de crudo seco (BPD)

---

### 6.2 Tiempo de Retención del Petróleo
**Archivo:** `thermal-calculator.service.ts` (línea 1438-1443)

```typescript
T_oil = (V_oil / 5.6146) × 24 × 60 / Qo
```

**Donde:**
- `T_oil`: Tiempo de retención del petróleo (minutos)
- `V_oil`: Volumen de retención del crudo (pie³)
- `Qo`: Caudal de crudo seco (BPD)

---

### 6.3 Tiempo de Retención del Agua
**Archivo:** `thermal-calculator.service.ts` (línea 1445-1453)

```typescript
T_water = (V_water / 5.6146) × 24 × 60 / Qw
```

**Donde:**
- `T_water`: Tiempo de retención del agua (minutos)
- `V_water`: Volumen de retención del agua (pie³)
- `Qw`: Caudal de agua (BPD)

---

## 7. Fórmulas de Decantación

### 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22)
**Archivo:** `thermal-calculator.service.ts` (línea 1138-1149)

```typescript
VDP = 18.4663 × (TGA)² × (DA - DC) / VC
```

**Donde:**
- `VDP`: Velocidad de decantación de la fase pesada (pie/min)
- `TGA`: Tamaño de la gota de agua (micrones)
- `DA`: Densidad del agua (lb/pie³)
- `DC`: Densidad del crudo (lb/pie³)
- `VC`: Viscosidad del crudo (cP)

---

### 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23)
**Archivo:** `thermal-calculator.service.ts` (línea 1151-1158)

```typescript
TDP = (NFA - N) / 12 / VDP
```

**Donde:**
- `TDP`: Tiempo de decantación de la fase pesada (minutos)
- `NFA`: Nivel desde el fondo al nivel alto alto de crudo (pulgadas)
- `N`: Nivel desde el fondo al nivel de interfase Agua-Crudo (pulgadas)
- `VDP`: Velocidad de decantación de la fase pesada (pie/min)

---

### 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33)
**Archivo:** `thermal-calculator.service.ts` (línea 730-731)

```typescript
T_liviana = TDP / 60
```

**Donde:**
- `T_liviana`: Tiempo de decantación de la fase liviana (horas)
- `TDP`: Tiempo de decantación de la fase pesada (minutos)

---

### 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28)
**Archivo:** `thermal-calculator.service.ts` (línea 1013-1053)

```typescript
PD = 100 × (VA / 5.6146) / [((cAL × 10) / (60 × 24)) + ((CAE × TDP) / (60 × 24))]
```

**Donde:**
- `PD`: Porcentaje de deshidratación del equipo (%)
- `VA`: Volumen de retención de agua (pie³)
- `cAL`: Cantidad de agua libre entrando (BPD)
- `CAE`: Cantidad de agua emulsionada entrando (BPD)
- `TDP`: Tiempo de decantación de la fase pesada (minutos)

---

### 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27)
**Archivo:** `thermal-calculator.service.ts` (línea 993-1002)

```typescript
AguaSaliendo = FAT - (PD × FAT) / 100
```

**Donde:**
- `AguaSaliendo`: Cantidad de agua saliendo con el crudo (BPD)
- `FAT`: Flujo de agua a ser manejado por el tratador (BPD) = CAT
- `PD`: Porcentaje de deshidratación del equipo (%)

---

### 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23)
**Archivo:** `thermal-calculator.service.ts` (línea 1004-1011)

```typescript
%AguaSaliendo = (AguaSaliendo × 100) / (AguaSaliendo + Qo)
```

**Donde:**
- `%AguaSaliendo`: Corte de agua del crudo saliendo (%)
- `AguaSaliendo`: Cantidad de agua saliendo con el crudo (BPD)
- `Qo`: Caudal de crudo seco (BPD)

---

## 8. Fórmulas de Calor

### 8.1 Calor Absorbido por el Proceso (Ecuación 1.25 / Ec. 8)
**Archivo:** `thermal-calculator.service.ts` (línea 1509-1522) y `treatments.service.ts` (línea 529-556)

```typescript
Q = (Wo × Cpo + Ww × Cpw) × (T2 - T1)
```

**Donde:**
- `Q`: Calor requerido (BTU/h)
- `Wo`: Flujo másico de petróleo (lb/h)
- `Ww`: Flujo másico de agua (lb/h)
- `Cpo`: Calor específico del petróleo (BTU/(lb·°F))
- `Cpw`: Calor específico del agua (BTU/(lb·°F))
- `T1`: Temperatura inicial (°F)
- `T2`: Temperatura final (°F)

---

### 8.2 Pérdidas de Calor (Ecuación 1.25 / Ec. 8)
**Archivo:** `thermal-calculator.service.ts` (línea 1458-1476) y `treatments.service.ts` (línea 580-590)

```typescript
Qpérdida = K × D × L × (T2 - T3)
```

**Donde:**
- `Qpérdida`: Pérdidas de calor (BTU/h)
- `K`: Constante que depende de la velocidad del viento
- `D`: Diámetro del tratador (pies)
- `L`: Longitud del tratador (pies)
- `T2`: Temperatura de tratamiento (°F)
- `T3`: Temperatura ambiente (°F)

**Valores de K según velocidad del viento:**
- 0 mph: K = 9.3
- 5 mph: K = 9.8
- 10 mph: K = 13.2
- 15 mph: K = 15.7
- 20 mph: K = 20.0

---

### 8.3 Calor Total Requerido (Ecuación 1.25 / Ec. 34)
**Archivo:** `thermal-calculator.service.ts` (línea 1160-1165) y `treatments.service.ts` (línea 407)

```typescript
Qtotal = Q + Qpérdida
```

**Donde:**
- `Qtotal`: Calor total requerido (BTU/h)
- `Q`: Calor absorbido por el proceso (BTU/h)
- `Qpérdida`: Pérdidas de calor (BTU/h)

---

## 9. Fórmulas de Boquillas

### 9.1 Velocidad en Boquilla de Entrada
**Archivo:** `thermal-calculator.service.ts` (línea 1086-1091)

```typescript
VM = 100 / √ρM
```

**Donde:**
- `VM`: Velocidad en la boquilla de entrada (pie/s)
- `ρM`: Densidad de la mezcla (lb/pie³)

**Densidad de la mezcla:**
```typescript
ρM = (Wl + Wg) / (Ql + Qg)
```

---

### 9.2 Diámetro de Boquilla
**Archivo:** `thermal-calculator.service.ts` (línea 1093-1104)

```typescript
φ = 12 × √(4 × Q / (π × v))
```

**Donde:**
- `φ`: Diámetro de la boquilla (pulgadas)
- `Q`: Caudal volumétrico (pie³/s)
- `v`: Velocidad en la boquilla (pie/s)

---

### 9.3 Velocidad en Boquilla de Salida de Crudo
**Archivo:** `thermal-calculator.service.ts` (línea 661-665)

```typescript
Vo = 100 / √ρo
```

**Donde:**
- `Vo`: Velocidad en la boquilla de salida de crudo (pie/s)
- `ρo`: Densidad del crudo (lb/pie³)

---

### 9.4 Velocidad en Boquilla de Salida de Agua
**Archivo:** `thermal-calculator.service.ts` (línea 681-685)

```typescript
Vw = 100 / √ρw
```

**Donde:**
- `Vw`: Velocidad en la boquilla de salida de agua (pie/s)
- `ρw`: Densidad del agua (lb/pie³)

---

### 9.5 Velocidad en Boquilla de Salida de Gas
**Archivo:** `thermal-calculator.service.ts` (línea 701-703)

```typescript
Vg = 100 / √ρg
```

**Donde:**
- `Vg`: Velocidad en la boquilla de salida de gas (pie/s)
- `ρg`: Densidad del gas (lb/pie³)

---

## 10. Fórmulas de Evaluación

### 10.1 Margen de Cumplimiento
**Archivo:** `evaluation-calculator.service.ts` (línea 106-112)

```typescript
MargenCumplimiento = (ValorActual / ValorRequerido) × 100
```

**Donde:**
- `MargenCumplimiento`: Porcentaje de cumplimiento (%)
- `ValorActual`: Valor medido/obtenido
- `ValorRequerido`: Valor requerido según norma

---

### 10.2 Promedio de Cumplimiento
**Archivo:** `evaluation-calculator.service.ts` (línea 73-78)

```typescript
PromedioCumplimiento = Σ(MargenCumplimiento_i) / n
```

**Donde:**
- `PromedioCumplimiento`: Promedio de cumplimiento (%)
- `n`: Número de criterios

---

### 10.3 Puntaje Ponderado
**Archivo:** `evaluation-calculator.service.ts` (línea 84-89)

```typescript
Puntaje = Σ(MargenCumplimiento_i × Peso_i) / Σ(Peso_i)
```

**Donde:**
- `Puntaje`: Puntaje ponderado (0-100)
- `Peso_i`: Peso del criterio i
- `MargenCumplimiento_i`: Margen de cumplimiento del criterio i

---

### 10.4 Eficiencia de Separación
**Archivo:** `thermal-calculator.service.ts` (línea 1306-1317)

```typescript
Eficiencia = (FactorDeshidratación × FactorRetención) × 100
```

**Donde:**
- `Eficiencia`: Eficiencia de separación (%)
- `FactorDeshidratación`: min(PD / 100, 1.0)
- `FactorRetención`: min(TiempoRetención / 60, 1.0)

---

### 10.5 Eficiencia de Separación (Alternativa)
**Archivo:** `treatments.service.ts` (línea 727-737)

```typescript
Eficiencia = (FactorTiempo × FactorVolumen) × 100
```

**Donde:**
- `Eficiencia`: Eficiencia de separación (%)
- `FactorTiempo`: min(TiempoResidencia / 60, 1.0)
- `FactorVolumen`: min((VolumenOil + VolumenWater) / 20, 1.0)

---

## 11. Fórmulas Adicionales

### 11.1 Conversión de BPD a pie³/s
**Archivo:** `thermal-calculator.service.ts` (línea 1106-1112)

```typescript
Q_pie3_s = (Q_BPD × 5.6146) / 86400
```

**Donde:**
- `Q_pie3_s`: Caudal en pie³/s
- `Q_BPD`: Caudal en barriles por día
- `5.6146`: Factor de conversión de barriles a pie³
- `86400`: Segundos en un día

---

### 11.2 Volumen Interno del Tratador
**Archivo:** `treatments.service.ts` (línea 606-609)

```typescript
V = π × (D/2)² × L × 0.1781
```

**Donde:**
- `V`: Volumen interno (bbl)
- `D`: Diámetro (pies)
- `L`: Longitud (pies)
- `0.1781`: Factor de conversión a barriles

---

### 11.3 Tiempo de Residencia Estimado
**Archivo:** `treatments.service.ts` (línea 430-432)

```typescript
T_residencia = (V_max × 1440) / Q_total
```

**Donde:**
- `T_residencia`: Tiempo de residencia (minutos)
- `V_max`: Volumen máximo de retención (bbl)
- `Q_total`: Flujo total (BPD)
- `1440`: Minutos en un día

---

## 📊 Resumen de Archivos

### Backend (termo-lab-api)

1. **`src/repositories/evaluations/services/thermal-calculator.service.ts`**
   - Contiene la mayoría de las fórmulas del módulo de evaluación térmica
   - Implementa todas las ecuaciones según API-12L
   - Más de 50 métodos de cálculo

2. **`src/repositories/treatments/treatments.service.ts`**
   - Fórmulas para cálculos de tratamientos
   - Cálculo de flujos, volúmenes y calor requerido
   - Selección de tratadores candidatos

3. **`src/repositories/evaluations/services/evaluation-calculator.service.ts`**
   - Fórmulas para cálculos de evaluaciones
   - Cálculo de márgenes de cumplimiento
   - Puntajes ponderados

---

## 🔍 Referencias

- **Norma API-12L**: Especificación para tratadores térmicos
- **Apéndice D de API-12L**: Base teórica y ecuaciones
- **Correlación de Katz (1942)**: Calor específico del crudo
- **Ecuación de Standing (1977)**: Densidad del crudo ajustada por temperatura
- **Ecuación de Peng-Robinson**: Factor de compresibilidad del gas

---

## 📝 Notas Importantes

1. **Unidades:**
   - Diámetros: pies (ft) o pulgadas (in)
   - Longitudes: pies (ft)
   - Caudales: BPD (barriles por día)
   - Temperaturas: °F
   - Presiones: psig o psia
   - Densidades: lb/pie³
   - Calor: BTU/h

2. **Constantes:**
   - Constante de los gases: R = 10.7316
   - Temperatura estándar: 60°F = 520°R
   - Presión estándar: 14.7 psia
   - Factor de conversión: 1 bbl = 5.6146 pie³

3. **Validaciones:**
   - Tiempo de retención mínimo: 60 minutos
   - Porcentaje de deshidratación mínimo: 85%
   - Eficiencia de separación mínimo: 85%
   - Velocidad de gas máximo: 0.5 pie/s
   - Corte de agua saliente máximo: 2%

---

**Última actualización:** 2024
**Versión del sistema:** 1.0.0

