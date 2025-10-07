# Scripts de Generación de Cliente API - Termo Lab

Este documento describe los scripts disponibles para generar el cliente API de TypeScript/Angular a partir de la especificación Swagger.

## Scripts Disponibles

### Generación de Swagger
```bash
npm run generate:swagger
```
Genera el archivo `swagger.json` a partir de la documentación de la API.

### Generación de Clientes
```bash
npm run generate:clients
```
Genera el cliente TypeScript/Angular en la carpeta `./generated/api-client` usando la especificación Swagger.

### Construcción Completa del Cliente
```bash
npm run build:client
```
Ejecuta la generación de Swagger seguida de la generación del cliente.

### Despliegue del Cliente (Linux/macOS)
```bash
npm run postbuild:client
```
Copia el cliente generado a la aplicación Angular (`../termo-lab-app/src/app/api`).

### Despliegue del Cliente (Windows)
```bash
npm run postbuild:client-windows
```
Copia el cliente generado a la aplicación Angular usando comandos de Windows.

### Limpieza (Linux/macOS)
```bash
npm run clean:generated
```
Elimina la carpeta `./generated` y su contenido.

### Limpieza (Windows)
```bash
npm run clean:generated-windows
```
Elimina la carpeta `./generated` y su contenido usando comandos de Windows.

### Despliegue Completo (Linux/macOS)
```bash
npm run deploy:client
```
Ejecuta la construcción completa del cliente, lo despliega y limpia los archivos temporales.

### Despliegue Completo (Windows)
```bash
npm run deploy:client-windows
```
Ejecuta la construcción completa del cliente, lo despliega y limpia los archivos temporales usando comandos de Windows.

## Flujo de Trabajo Recomendado

1. **Desarrollo**: Durante el desarrollo, usa `npm run build:client` para generar el cliente localmente.
2. **Despliegue**: Para desplegar el cliente a la aplicación Angular, usa `npm run deploy:client` (o la versión de Windows).
3. **Limpieza**: Los scripts de despliegue incluyen limpieza automática, pero puedes usar `npm run clean:generated` si necesitas limpiar manualmente.

## Configuración

Los scripts utilizan la configuración definida en:
- `./openapi/config.json` - Configuración principal del generador
- `./openapitools.json` - Configuración alternativa del generador

## Estructura de Archivos Generados

```
./generated/api-client/
├── api/                    # Servicios de API
├── model/                  # Modelos de datos
├── configuration.ts        # Configuración del cliente
├── variables.ts           # Variables de configuración
└── ...                    # Otros archivos generados
```

## Notas Importantes

- Asegúrate de que la aplicación Angular (`termo-lab-app`) esté en el directorio hermano del API.
- Los scripts de Windows requieren que se ejecuten en Command Prompt o PowerShell.
- El cliente generado se copia a `../termo-lab-app/src/app/api`.
