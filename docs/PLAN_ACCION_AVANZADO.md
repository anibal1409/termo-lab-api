# Plan de acción — Análisis avanzado y gemelo digital

2026-11-06

Cuatro fases. Las dos primeras usan solo el motor de cálculo que ya existe y pueden empezar hoy. Las dos últimas dependen del piloto montado y de corridas reales.

| Fase | Entrega | Depende de | Esfuerzo estimado |
|------|---------|------------|-------------------|
| 1. Detective de fallas y tornado | Qué criterio falla, el cambio mínimo para cumplir y qué variable pesa más | Nada: motor actual | 1–2 semanas |
| 2. Monte Carlo | Probabilidad de cumplir API 12L con incertidumbre en el crudo | Fase 1 | 1 semana |
| 3. Ensayo en piloto y flight recorder | Un diseño se convierte en una corrida del piloto, grabada y reproducible | Piloto con dos UNO montado; soporte HC-SR04 | 2–3 semanas |
| 4. Gemelo térmico y calibración | Curva real contra simulada en vivo; η y UA ajustados con datos | Fase 3 y al menos 3 corridas reales | 2–3 semanas |

Los esfuerzos son estimaciones para una persona a tiempo completo y se revisan al cerrar la fase 1.

## Fase 1 — Detective de fallas y tornado

Objetivo: ante un tratador que no cumple, decir qué criterio falla, cuánto falta y cuál es el cambio más pequeño que lo hace cumplir.

**Base existente.** `ThermalCalculatorService.calculateThermalResults(input)` es una función pura y ya valida 6 criterios API 12L:

| Criterio | Límite |
|----------|--------|
| Tiempo de retención | ≥ 60 min |
| Deshidratación | ≥ 85 % |
| Eficiencia de separación | ≥ 85 % |
| Velocidad de gas | ≤ 0,5 pie/s |
| Corte de agua a la salida | ≤ 2 % |
| Factor Z | 0,1 – 2,0 |

Hoy devuelve solo textos de aviso. El primer paso es que devuelva cada criterio con valor, límite y margen.

**Tareas**

1. Refactorizar la validación para devolver `{criterio, valor, límite, margen %, cumple}` por criterio, sin cambiar los resultados actuales; tests de regresión con 3–5 diseños existentes.
2. Definir las **variables de diseño** que el usuario puede cambiar (diámetro, largo, temperatura de tratamiento, tiempos de retención) y las **propiedades del crudo**, que no se cambian pero sí tienen incertidumbre (API, BSW, viscosidad, tamaño de gota).
3. Detective: para cada variable de diseño, búsqueda por bisección del cambio mínimo que hace cumplir todos los criterios. Ordenar por cambio relativo y devolver las 3 mejores opciones.
4. Tornado: mover cada variable ±10 % (configurable) y medir el cambio en el margen de cada criterio.
5. Endpoints `POST /thermal-calculations/diagnose` y `POST /thermal-calculations/sensitivity` con DTOs tipados y Swagger.
6. Frontend: en la evaluación, un panel "Por qué no cumple" con las sugerencias y un gráfico tornado.

**Criterio de aceptación.** En un diseño que falla por retención, el detective propone un largo o diámetro mayor, y al aplicarlo la evaluación cumple.

## Fase 2 — Monte Carlo de cumplimiento

Objetivo: pasar de "cumple / no cumple" a "cumple con un 87 % de probabilidad", porque las propiedades del crudo nunca se conocen exactas.

**Tareas**

1. A cada propiedad del crudo de la fase 1 se le asigna una distribución: normal (media ± desviación) o uniforme (mínimo–máximo). Valores por defecto razonables, editables por el usuario.
2. Ejecutar el motor N veces (por defecto 5 000) con muestras aleatorias y semilla fija, para que el resultado sea reproducible.
3. Devolver la probabilidad de cumplir en total y por criterio, más los percentiles P10, P50 y P90 de los resultados clave (retención, corte de agua, calor requerido).
4. Endpoint `POST /thermal-calculations/monte-carlo` con tope de 20 000 corridas.
5. Frontend: histograma por criterio con la línea del límite y la probabilidad en grande.
6. Guardar el resultado en la evaluación e incluirlo en el reporte API 12L.

**Criterio de aceptación.** Con desviación cero se obtiene 0 % o 100 % y coincide con el cálculo determinista; 5 000 corridas tardan menos de 2 s.

## Fase 3 — Ensayo en piloto y flight recorder

Objetivo: que un diseño se pueda ejecutar en el piloto como una corrida, y que cada corrida quede grabada y se pueda reproducir.

**Requisitos previos (hardware y módulo de dispositivos)**

- [ ] Comando `US <trig> <echo>` en el firmware y tipo de canal `ultrasonic` en el backend
- [ ] Aceptar rutas `/dev/serial/by-path/...`, para que los dos UNO no se intercambien al reconectar
- [ ] Piloto montado: UNO 1 con los 3 HC-SR04 y termopares, UNO 2 con el motor, las bombas, los ESC y el calentador
- [ ] Pantallas del frontend para dispositivos y panel en vivo

**Tareas**

1. Entidad `Ensayo`: diseño de referencia, geometría del piloto, potencia del calentador, mapeo de canales (temperatura del baño, ambiente, calentador, niveles), inicio, fin, estado y notas.
2. "Probar en piloto": a partir del diseño, generar la consigna del PID de temperatura, el caudal de las bombas (escalado al piloto) y las reglas de seguridad. El usuario las revisa antes de iniciar.
3. Iniciar y detener un ensayo: activar y desactivar ese PID y esas reglas, y marcar el rango de tiempo.
4. Muestras manuales: registrar BSW de salida u otras mediciones con su hora.
5. Flight recorder: endpoint que devuelve todas las lecturas y escrituras del rango del ensayo, y una pantalla con línea de tiempo, reproducción a 1×, 10× y 60×, y eventos marcados (reglas activadas, watchdog).
6. Exportar un ensayo a CSV.

**Criterio de aceptación.** Un ensayo de 30 minutos se reproduce completo y muestra el mismo encendido y apagado del calentador que ocurrió.

## Fase 4 — Gemelo térmico y calibración

Objetivo: ver en vivo la temperatura real del piloto junto a la que predice el modelo, y ajustar el modelo con esos datos.

El modelo se alimenta con las entradas medidas (potencia real del calentador y temperatura ambiente), no con las consignas. Así, la diferencia entre las curvas es error del modelo y no del control.

```
m · cp · dT/dt = η · P_calentador(t) - UA · (T - T_amb(t))
```

**Tareas**

1. Modelo transitorio: integrar el balance paso a paso, usando los calores específicos y las densidades que ya calcula el motor. Tests contra la solución analítica con potencia constante.
2. Simulación en vivo: con el ensayo activo, cada lectura de temperatura avanza el modelo y emite `{real, simulado, error}` por el SSE existente.
3. Pantalla del gemelo: curva real continua, simulada discontinua, banda de error, y RMSE de la corrida.
4. Calibración: al cerrar un ensayo, ajustar η y UA por mínimos cuadrados con un calentamiento y un enfriamiento. Guardar los valores por piloto con su RMSE.
5. Usar los valores calibrados en las simulaciones siguientes y mostrar "calibrado con N ensayos".
6. Ampliación posterior: con medición de interfaz, calibrar el tamaño efectivo de gota con Stokes inversa y llevarlo a los diseños de ese tipo de crudo.

**Criterio de aceptación.** Después de calibrar con 3 ensayos, el RMSE de un cuarto ensayo es menor que el del modelo sin calibrar.

## Cronograma

El montaje del piloto y el soporte del HC-SR04 avanzan en paralelo a las fases 1 y 2, así la fase 3 puede empezar en cuanto termine la 2.

## Riesgos y decisiones abiertas

| Riesgo | Efecto | Mitigación |
|--------|--------|------------|
| Hay dos vías de cumplimiento: los 6 criterios del motor térmico y los criterios de evaluación con `actualValue` manual | El detective solo puede razonar sobre la vía calculada | Fase 1 cubre el motor térmico; los criterios manuales se señalan como "no calculables" |
| El piloto no es a escala del tratador real | Comparar valores absolutos no tiene sentido | El gemelo simula siempre con la geometría del piloto; lo que se transfiere son parámetros (η, UA, tamaño de gota) |
| El HC-SR04 mide la superficie libre, no la interfaz agua–aceite | No se puede calibrar la separación dentro de un mismo recipiente | Compartimentos separados, o electrodos de conductividad a varias alturas |
| Monte Carlo con distribuciones mal elegidas da una seguridad falsa | Probabilidades engañosas | Mostrar siempre las distribuciones usadas en el reporte; valores por defecto conservadores |
| Reglas y PID corren en la API | Si la API cae durante un ensayo, solo protege el watchdog (5 s) | Termostato de seguridad físico en el calentador antes de la fase 3 |

**Decisiones abiertas**

- [ ] ¿Qué variables de diseño puede cambiar el detective? Propuesta: diámetro, largo, temperatura de tratamiento y tiempos de retención.
- [ ] ¿Qué incertidumbre por defecto tiene cada propiedad del crudo en Monte Carlo?
- [ ] ¿Cómo se mide el BSW de salida en el piloto? ¿Muestra manual con centrífuga?
- [ ] ¿Qué potencia nominal tiene el calentador del piloto?
