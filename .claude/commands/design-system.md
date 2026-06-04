Sos un especialista en design systems. Se te entrega una especificación de design system (puede venir de Claude Design, un documento de diseño, o un archivo de tokens):

<design-spec>
$ARGUMENTS
</design-spec>

Si `$ARGUMENTS` es una ruta a un archivo, leé ese archivo primero. Si es texto directo, usalo como entrada.

Determiná el directorio de salida:
- Si existe un directorio `src/` en el proyecto, usá `src/design/`
- Si no existe `src/`, usá `design/`
- Si no existe el directorio de salida, crealo

Tu tarea es producir los siguientes artefactos:

---

## ARTEFACTO 1: `[dir-salida]/tokens.json`

Extraé y estructurá todos los design tokens en formato estándar (compatible con Design Tokens Community Group / W3C):

```json
{
  "$schema": "https://design-tokens-format-module.netlify.app/",
  "metadata": {
    "project": "[nombre del proyecto]",
    "extractedFrom": "[nombre del archivo o descripción]",
    "generatedAt": "[fecha]"
  },
  "color": {
    "primary": { "$value": "...", "$type": "color" },
    "secondary": { "$value": "...", "$type": "color" },
    "success": { "$value": "...", "$type": "color" },
    "error": { "$value": "...", "$type": "color" },
    "warning": { "$value": "...", "$type": "color" },
    "info": { "$value": "...", "$type": "color" },
    "neutral": { "$value": "...", "$type": "color" },
    "background": { "$value": "...", "$type": "color" },
    "text": { "$value": "...", "$type": "color" },
    "border": { "$value": "...", "$type": "color" }
  },
  "typography": {
    "fontFamily": { "$value": "...", "$type": "fontFamily" },
    "scale": { "$value": "...", "$type": "dimension" }
  },
  "spacing": { "$value": "...", "$type": "dimension" },
  "borderRadius": { "$value": "...", "$type": "dimension" },
  "shadow": { "$value": "...", "$type": "shadow" },
  "transition": { "$value": "...", "$type": "transition" },
  "zIndex": { "$value": "...", "$type": "number" }
}
```

Para cada token usar la estructura:
```json
"tokenName": { "$value": "valor", "$type": "color|dimension|fontFamily|etc" }
```

Si la especificación no define un grupo de tokens (ej: no hay shadows definidos), omitir ese grupo del JSON.

---

## ARTEFACTO 2: `[dir-salida]/variables.css`

Generá el equivalente en CSS Custom Properties, organizado por grupos:

```css
/* =========================================================
   [Nombre del Proyecto] — Design Tokens
   Generado: [fecha]
   Fuente: [nombre del archivo fuente]
   ========================================================= */

/* --- Colores: Primario --- */
:root {
  --color-primary-light: ...;
  --color-primary-main: ...;
  --color-primary-dark: ...;
  --color-secondary-light: ...;
  --color-secondary-main: ...;
  --color-secondary-dark: ...;
  --color-success: ...;
  --color-error: ...;
  --color-warning: ...;
  --color-info: ...;
  --color-neutral: ...;
  --color-background: ...;
  --color-text: ...;
  --color-border: ...;
}

/* --- Tipografía --- */
:root {
  --typography-font-family: ...;
  --typography-size-xs: ...;
  --typography-size-sm: ...;
  --typography-size-base: ...;
  --typography-size-lg: ...;
  --typography-size-xl: ...;
}

/* --- Espaciado --- */
:root {
  --spacing-xs: ...;
  --spacing-sm: ...;
  --spacing-md: ...;
  --spacing-lg: ...;
  --spacing-xl: ...;
}

/* --- Border Radius --- */
:root {
  --border-radius-sm: ...;
  --border-radius-md: ...;
  --border-radius-lg: ...;
}

/* --- Sombras --- */
:root {
  --shadow-sm: ...;
  --shadow-md: ...;
  --shadow-lg: ...;
}

/* --- Transiciones --- */
:root {
  --transition-duration-fast: ...;
  --transition-duration-normal: ...;
  --transition-duration-slow: ...;
}

/* --- Z-Index --- */
:root {
  --z-index-dropdown: ...;
  --z-index-sticky: ...;
  --z-index-fixed: ...;
  --z-index-modal: ...;
  --z-index-popover: ...;
  --z-index-tooltip: ...;
}
```

Usar convención `--[grupo]-[variante]` para todos los tokens.

---

## ARTEFACTO 3: `[dir-salida]/components.md`

Documentá los componentes especificados, en este formato por componente:

```markdown
## [NombreComponente]

**Descripción:** [qué hace]
**Uso principal:** [dónde se usa en la app]

### Props / Variantes
| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| variant | string | primary / secondary / ... | primary |
| size | string | sm / md / lg | md |
| disabled | boolean | true / false | false |

### Especificación Visual
- Tamaño: [dimensiones, padding, margin]
- Color de fondo: [token]
- Color de texto: [token]
- Border: [valor]
- Border-radius: [token]
- Typography: [variante tipográfica]

### Estados
| Estado | Cambio visual |
|--------|--------------|
| default | ... |
| hover | ... |
| active | ... |
| disabled | ... |
| error | ... |

### Notas de Implementación
[Cualquier comportamiento especial, accesibilidad, animaciones]
```

---

## ARTEFACTO 4 (OPCIONAL): `[dir-salida]/theme.ts`

Solo generarlo si la especificación menciona MUI (Material UI) o un framework con sistema de theming. Generá el theme object correspondiente.

Para MUI:
```typescript
// [dir-salida]/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { light: '...', main: '...', dark: '...' },
    secondary: { light: '...', main: '...', dark: '...' },
    success: { main: '...' },
    error: { main: '...' },
    warning: { main: '...' },
    info: { main: '...' },
  },
  typography: {
    fontFamily: '...',
    h1: { fontSize: '...', fontWeight: '...' },
    h2: { fontSize: '...', fontWeight: '...' },
    body1: { fontSize: '...', lineHeight: '...' },
    body2: { fontSize: '...', lineHeight: '...' },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  shape: {
    borderRadius: 4,
  },
  shadows: [
    '0px 1px 3px rgba(0, 0, 0, 0.12)',
    '0px 2px 6px rgba(0, 0, 0, 0.16)',
    // ... más sombras
  ],
});
```

---

Al finalizar, mostrá un resumen de:
- Directorio de salida utilizado y por qué
- Lista de archivos creados con sus rutas
- Cantidad de tokens extraídos por categoría (colores: N, tipografía: N, etc.)
- Componentes documentados
- Tokens que NO pudieron extraerse por falta de información en la especificación
