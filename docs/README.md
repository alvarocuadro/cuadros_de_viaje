# Convenciones de Documentación — cuadros_de_viaje

## Estructura del directorio `docs/`

```
docs/
├── README.md                # Este archivo (convenciones)
├── analisis-tecnico.md      # Generado por /analisis-tecnico
├── plan-desarrollo.md       # Generado por /analisis-tecnico
├── consultas-po.md          # Preguntas al PO (manual o generado)
└── decisiones/              # Registro de Architecture Decision Records (ADRs)
    └── ADR-001-[titulo].md
```

## Nomenclatura

- Archivos: `kebab-case.md`
- ADRs: `ADR-NNN-descripcion-corta.md`
- Versión en header: `**Versión:** N.N`
- Fecha en header: `**Generado:** YYYY-MM-DD`

## Formato de encabezado estándar

Todo documento en `docs/` debe comenzar con:

```markdown
# Título del Documento — Nombre del Proyecto
**Generado:** YYYY-MM-DD
**Basado en:** [fuente o comando que lo generó]
**Versión:** 1.0
**Estado:** Borrador | En revisión | Aprobado
```

## Ciclo de vida de los documentos

1. **`analisis-tecnico.md`** — Se genera UNA vez por AF recibido, luego se actualiza manualmente
2. **`plan-desarrollo.md`** — Documento vivo; actualizarlo al completar tareas
3. **`consultas-po.md`** — Preguntas abiertas al PO; marcar como `[RESUELTA]` al responderse
4. **`ADR-*.md`** — Una entrada por decisión arquitectónica importante; inmutable tras aprobación
