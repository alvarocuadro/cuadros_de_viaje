Sos un arquitecto de software senior. Se te entrega el siguiente Análisis Funcional (AF) o descripción del sistema:

<af>
$ARGUMENTS
</af>

Si `$ARGUMENTS` es una ruta a un archivo, leé ese archivo primero. Si es texto directo, usalo como entrada.

Tu tarea es producir DOS documentos técnicos en el directorio `docs/`. Si `docs/` no existe, crealo.

---

## DOCUMENTO 1: `docs/analisis-tecnico.md`

Generá un análisis técnico completo con estas secciones exactas:

### 1. RESUMEN EJECUTIVO
- Nombre y propósito del sistema (1-2 párrafos)
- Stack tecnológico recomendado (tabla: Capa | Tecnología | Justificación)
- Principales decisiones arquitectónicas con sus rationales

### 2. ACTORES Y ROLES
- Tabla de actores del sistema (Actor | Rol | Permisos principales)
- Flujos críticos por actor

### 3. ARQUITECTURA DEL SISTEMA
- Diagrama de arquitectura en texto/ASCII
- Patrón de capas recomendado (con ubicación de archivos)
- Árbol de componentes principal (si aplica, estilo árbol ASCII)

### 4. MODELOS DE DATOS
- Interfaces/tipos TypeScript para cada entidad principal
- Relaciones entre entidades
- Campos obligatorios vs opcionales
- Reglas de validación por campo

### 5. APIs Y SERVICIOS
- Lista de operaciones/endpoints necesarios (Operación | Método | Descripción)
- Contratos de entrada/salida para cada operación
- Si es frontend-only: servicios simulados con estructura de mock

### 6. ESTRUCTURA DE COMPONENTES
- Árbol de componentes React (o equivalente al stack elegido)
- Props interface para componentes clave
- Estado global vs estado local: qué va dónde

### 7. FLUJOS DE NEGOCIO CRÍTICOS
- Para cada flujo principal: diagrama de pasos en texto
- Estados de UI por paso (vacío, cargando, con datos, error, éxito)
- Validaciones y reglas de negocio en cada paso

### 8. SEGURIDAD Y PERMISOS
- Matriz de permisos (Rol | Recurso | Operaciones permitidas)
- Manejo de autenticación recomendado
- Datos sensibles y cómo manejarlos

### 9. PERFORMANCE Y ESCALABILIDAD
- Puntos de posible cuello de botella
- Estrategias de caché o paginación necesarias
- Estimación de volumen de datos

### 10. ESTRATEGIA DE TESTING
- Tipos de tests recomendados (unitarios, integración, E2E)
- Casos de prueba críticos a cubrir
- Herramientas sugeridas

### 11. PUNTOS AMBIGUOS Y CONSULTAS AL PO
- Lista numerada de todo lo que el AF NO especifica claramente
- Para cada punto: impacto en desarrollo si se asume sin confirmar
- Sugerencia de decisión por defecto (para no bloquear el trabajo)

Encabezado del documento:
```
# Análisis Técnico — [Nombre del Proyecto]
**Generado:** [fecha actual]
**Basado en:** [nombre del AF o descripción corta]
**Versión:** 1.0
```

---

## DOCUMENTO 2: `docs/plan-desarrollo.md`

Generá un plan de desarrollo accionable:

### 1. RESUMEN DEL PLAN
- Total de fases
- Estimación total (en días/semanas de desarrollo individual)
- Criterios de "done" generales

### 2. FASES DE DESARROLLO

Para cada fase, incluir:
- Número y nombre
- Objetivo de la fase
- Tareas detalladas (lista numerada)
- Criterio de aceptación
- Estimación en horas
- Prioridad (CRÍTICA / ALTA / MEDIA / BAJA)
- Dependencias de otras fases

**Fases mínimas a incluir:**
- Fase 0: Setup y scaffolding (estructura de proyecto, dependencias, configuración)
- Fase 1: Modelos de datos y mocks (tipos, datos de prueba realistas)
- Fase N: Una fase por módulo/feature principal identificado en el AF
- Fase Final: Integración, polish y testing

### 3. BACKLOG PRIORIZADO

Tabla con todas las tareas:
| ID | Tarea | Fase | Estimación | Prioridad | Dependencias |

### 4. RIESGOS Y MITIGACIONES
- Lista de riesgos técnicos identificados
- Plan de mitigación para cada uno

### 5. SUPUESTOS APLICADOS
- Lista de decisiones tomadas donde el AF era ambiguo
- Referencia al punto del AF correspondiente

Encabezado del documento:
```
# Plan de Desarrollo — [Nombre del Proyecto]
**Generado:** [fecha actual]
**Basado en:** [nombre del AF]
**Versión:** 1.0
```

---

Al finalizar, mostrá un resumen de:
- Los dos archivos creados con sus rutas
- Cantidad de secciones en cada documento
- Los 3 puntos más ambiguos encontrados en el AF
- Estimación total del plan de desarrollo
