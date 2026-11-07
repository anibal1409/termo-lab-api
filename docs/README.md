# Documentación — Termo-Lab API

Índice de documentación del repositorio backend (NestJS) para diseño térmico de tratadores según API 12L, evaluaciones, cálculos y control del piloto Arduino.

## Hoja de ruta y producto

| Documento | Contenido |
|-----------|-----------|
| [Plan de acción — análisis avanzado y gemelo digital](./PLAN_ACCION_AVANZADO.md) | Roadmap en 4 fases: detective de fallas, Monte Carlo, ensayos en piloto (flight recorder) y gemelo térmico con calibración |

Origen del plan (borrador interactivo): [artefacto Claude](https://claude.ai/artifact/4vZUoJggjtwYYfYAHTbBSC).

## Referencia técnica en el repositorio

| Documento | Contenido |
|-----------|-----------|
| [Fórmulas implementadas](../FORMULAS_IMPLEMENTADAS.md) | Ecuaciones API 12L implementadas en el motor térmico, por módulo |
| [Scripts del cliente API](../API_CLIENT_SCRIPTS.md) | Generación de Swagger y cliente TypeScript/Angular |

## Código relacionado con el plan

| Área | Ubicación |
|------|-----------|
| Motor térmico y criterios API 12L | `src/repositories/evaluations/services/thermal-calculator.service.ts`, `src/repositories/evaluations/controllers/thermal-calculations.controller.ts` |
| Módulo de dispositivos y serial | `src/repositories/devices/` |
| Firmware piloto | `arduino/termolab/termolab.ino` |

## Grafo del código

Tras cambios relevantes en el código, actualizar el knowledge graph con `graphify update .` (salida en `graphify-out/`). Ver también `graphify-out/GRAPH_REPORT.md`.
