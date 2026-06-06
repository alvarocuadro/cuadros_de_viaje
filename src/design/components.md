# Componentes UI — Cuadros de viaje

Extraído del prototipo: `docs/public/prototype/app/`

---

## Button (Botón)

**Descripción:** Componente interactivo para acciones primarias, secundarias y peligrosas.
**Uso principal:** Navegación, envío de formularios, confirmaciones, acciones destructivas.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| variant | string | `primary` / `secondary` / `ghost` / `danger` / `danger-soft` | `primary` |
| size | string | `base` / `sm` | `base` |
| disabled | boolean | `true` / `false` | `false` |

### Especificación Visual

**Primary**
- Tamaño: 44px (min-height), 18px horizontal padding
- Color de fondo: `--color-brand` (#1E7FA8)
- Color de texto: `--color-on-brand` (#FFFFFF)
- Border-radius: `--border-radius-pill` (999px)
- Typography: 15px, weight 600
- Focus ring: `--color-focus-ring`

**Secondary**
- Tamaño: 44px (min-height), 18px horizontal padding
- Color de fondo: `--color-surface`
- Color de texto: `--color-brand-700` (#186A8C)
- Border: 1px `--color-border`
- Border-radius: `--border-radius-pill`
- Typography: 15px, weight 600

**Ghost**
- Tamaño: 40px (min-height), 14px horizontal padding
- Background: transparent
- Color de texto: `--color-brand-700`
- Typography: 15px, weight 600

**Danger**
- Tamaño: 44px (min-height), 18px horizontal padding
- Color de fondo: `--color-error` (#DC2626)
- Color de texto: `--color-on-error` (#FFFFFF)
- Border-radius: `--border-radius-pill`

**Danger Soft**
- Tamaño: 44px (min-height), 18px horizontal padding
- Color de fondo: `--color-error-tint` (#FCEBEA)
- Color de texto: `--color-error-strong` (#B91C1C)
- Border-radius: `--border-radius-pill`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Color base, sin transformación |
| hover | Background más oscuro (brand-hover, error-strong, etc) |
| active | Scale 0.99, background más fuerte |
| disabled | Background gris (surface-sunken), texto deshabilitado, cursor not-allowed |
| focus | Focus ring 3px azure |

### Notas de Implementación
- Min-height 44px (tap target mínimo)
- Ancho 100% en formularios
- Transiciones suaves: `background --transition-duration-fast`, `transform --transition-duration-fast`
- Border-radius pill para botones primarios; ajustable para secundarios
- El ghost button no tiene padding vertical definido explícitamente, se centra con flexbox

---

## Input (Campo de entrada)

**Descripción:** Campo de texto, número, fecha, hora o textarea para capturar datos.
**Uso principal:** Formularios, búsqueda, entrada de datos de viajes.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| type | string | `text` / `email` / `password` / `date` / `time` / `number` / `textarea` | `text` |
| disabled | boolean | `true` / `false` | `false` |
| error | boolean | `true` / `false` | `false` |
| required | boolean | `true` / `false` | `false` |

### Especificación Visual

- Tamaño: 48px height (min-height), 13px horizontal padding
- Color de fondo: `--color-surface` (#FFFFFF)
- Border: 1px `--color-border` (#D6DEE7)
- Border-radius: `--border-radius-md` (12px)
- Typography: 15px, weight 400, color `--color-fg1`
- Placeholder: `--color-fg-disabled`
- Etiqueta: 13px, weight 600, color `--color-fg2` (arriba del campo)

**Textarea**
- Align-items: flex-start
- Padding adicional: 11px top/bottom
- Resize: none
- Line-height: 1.45
- Font-size: 14.5px

**Focus**
- Border-color: `--color-brand`
- Box-shadow: `--color-focus-ring`

**Error**
- Border-color: `--color-error` (#DC2626)
- Box-shadow: 0 0 0 3px `--color-error-tint`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Border neutral, sin focus ring |
| focus | Border brand-color, focus ring 3px |
| filled | Texto fg1, placeholder oculto |
| disabled | Cursor not-allowed, texto fg-disabled |
| error | Border y shadow rojo |
| empty | Placeholder visible |

### Notas de Implementación
- Date/time inputs usan `font-variant-numeric: tabular-nums` para alineación
- El picker de calendario (webkit) es invisible pero clickeable (inset 0, opacity 0)
- Select elements: appearance none para custom styling
- Aria labels recomendadas para accesibilidad
- Transitions: `border-color --transition-duration-fast`, `box-shadow --transition-duration-fast`

---

## Badge

**Descripción:** Etiqueta pequeña indicadora de estado o categoría.
**Uso principal:** Estados de viaje (futuro, actual, pasado), indicadores de estado.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| variant | string | `futuro` / `actual` / `pasado` | `futuro` |
| showDot | boolean | `true` / `false` | `true` |

### Especificación Visual

**Futuro**
- Padding: 5px 11px
- Border-radius: `--border-radius-pill`
- Background: `--color-futuro-tint` (#E3F4F2)
- Color de texto: `--color-futuro-strong` (#237E7A)
- Font-size: 12.5px, weight 600
- Dot: 7px × 7px, background `--color-futuro` (#2FA39E)

**Actual**
- Padding: 5px 11px
- Border-radius: `--border-radius-pill`
- Background: `--color-actual-tint` (#ECF4F9)
- Color de texto: `--color-actual-strong` (#14536E)
- Font-size: 12.5px, weight 600
- Dot: 7px × 7px, background `--color-actual` (#1E7FA8)

**Pasado**
- Padding: 5px 11px
- Border-radius: `--border-radius-pill`
- Background: `--color-pasado-tint` (#EEF2F6)
- Color de texto: `--color-pasado-strong` (#51607A)
- Font-size: 12.5px, weight 600
- Dot: 7px × 7px, background `--color-pasado` (#64748B)

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Badge with dot |
| without-dot | Badge sin dot |
| dark-mode | Colores más claros (futuro: #6FD0CB, actual: #45A6D2, etc) |

### Notas de Implementación
- Flex layout, gap 6px (dot + texto)
- Display inline-flex
- White-space: nowrap (no romper línea)
- Dot: círculo, flex-none

---

## Chip

**Descripción:** Etiqueta seleccionable con icono opcional y botón de eliminar.
**Uso principal:** Tags, categorías, códigos de reserva.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| removable | boolean | `true` / `false` | `false` |
| monospace | boolean | `true` / `false` | `false` |
| disabled | boolean | `true` / `false` | `false` |

### Especificación Visual

- Tamaño: 32px (min-height, approx)
- Padding: 6px 11px
- Border-radius: `--border-radius-pill` (999px)
- Background: `--color-surface-sunken` (#EEF2F6)
- Color de texto: `--color-fg2` (#45586A)
- Border: 1px `--color-border-subtle` (#E6EBF1)
- Font-size: 12.5px, weight 500

**Con icono de código**
- Font-family: `--typography-font-family-mono`
- Weight: 600
- Color: `--color-fg1` (#102A40)

**Botón de eliminar (si removable)**
- Padding interno: 2px
- Border-radius: 50%
- Cursor: pointer
- Color: `--color-fg3` (#7C8A98)
- Hover color: `--color-error` (#DC2626)
- Hover background: `--color-error-tint` (#FCEBEA)

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Background neutral, border sutil |
| hover-remove | Ícono rojo, background rojo claro |
| disabled | Opacity reducida |

### Notas de Implementación
- Flex layout, gap 6px
- White-space: nowrap
- Transiciones suaves en hover del botón

---

## Card

**Descripción:** Contenedor de contenido con borde y sombra.
**Uso principal:** Viajes, reservas, itinerarios, información de hospedaje.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| interactive | boolean | `true` / `false` | `false` |
| variant | string | `default` / `raised` | `default` |

### Especificación Visual

- Padding: variable (según contenido)
- Background: `--color-surface` (#FFFFFF)
- Border: 1px `--color-border-subtle` (#E6EBF1)
- Border-radius: variable (default 16px via `--cv-card-radius`, tweakable)
- Box-shadow: `--shadow-sm`

**Interactive (tap)**
- Cursor: pointer
- Transiciones: `box-shadow --transition-duration-base`, `transform --transition-duration-fast`, `border-color --transition-duration-base`
- Hover: box-shadow `--shadow-md`, border-color `--color-border` (#D6DEE7)
- Active: scale(0.992)

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Sombra sm, border sutil |
| hover | Sombra md, border más visible |
| active | Scale 0.992 |
| dark-mode | Background #12202C, border #1E2E3B |

### Notas de Implementación
- El border-radius se puede ajustar con `--cv-card-radius` (tweakable)
- Cards pueden tener contenido estructurado (label/value, imágenes, etc)
- En dark mode, sombras son más oscuras

---

## Modal / Sheet

**Descripción:** Diálogo superpuesto para confirmaciones, formularios o contenido adicional.
**Uso principal:** Confirmaciones, agregar viaje, editar detalles.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| type | string | `sheet` / `modal` / `centered-modal` | `sheet` |
| size | string | `sm` / `md` | `md` |

### Especificación Visual

**Sheet (Modal inferior)**
- Ancho: 100%
- Max-width: 100%
- Max-height: 92%
- Border-radius: 20px 20px 0 0 (arriba redondo, abajo recto)
- Background: `--color-surface` (#FFFFFF)
- Box-shadow: `--shadow-sheet` (0 -8px 28px)
- Padding: 8px 16px 22px
- Animación: rise `--transition-duration-slow` `--ease-out`

**Grip bar (handle)**
- Tamaño: 38px × 4px
- Border-radius: pill
- Background: `--color-border-strong`
- Margin: 6px auto 14px

**Modal (Centered)**
- Ancho: 100%
- Max-width: 320px
- Border-radius: `--border-radius-xl` (20px)
- Background: `--color-surface`
- Box-shadow: `--shadow-lg`
- Padding: 22px 20px 18px
- Animación: pop `--transition-duration-base` `--ease-out`

**Scrim (Overlay)**
- Position: absolute, inset 0
- Background: rgba(14, 28, 40, 0.45)
- Z-index: 20
- Animación: fade `--transition-duration-base`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| visible | Animación de entrada |
| closed | Animación de salida (inversa) |
| dark-mode | Scrim más oscuro, shadows más pronunciadas |

### Notas de Implementación
- CSS animations: fade, rise, pop
- `@media (prefers-reduced-motion)` disables animations
- Sheet scrollable internamente (overflow-y auto)
- Scrim clickeable para cerrar (delegado a JS)
- Z-index 20 asegura estar sobre el contenido

---

## Toggle / Switch

**Descripción:** Control binario (on/off) para configuraciones.
**Uso principal:** Preferencias, filtros, modo dark.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| checked | boolean | `true` / `false` | `false` |
| disabled | boolean | `true` / `false` | `false` |

### Especificación Visual

- Tamaño: 46px (width) × 28px (height)
- Border-radius: pill (999px)
- Track (background):
  - Unchecked: `--color-border-strong` (#BCC8D4)
  - Checked: `--color-brand` (#1E7FA8)
- Knob (círculo):
  - Tamaño: 22px × 22px
  - Background: #fff
  - Box-shadow: `--shadow-sm`
  - Position: top 3px, left 3px
  - Checked: translateX(18px)
- Transición: `--transition-duration-base` `--ease-out`
- Focus ring: `--color-focus-ring`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| unchecked | Track gris, knob a la izquierda |
| checked | Track azul brand, knob desplazado |
| hover | Cursor pointer |
| focus-visible | Focus ring alrededor del track |

### Notas de Implementación
- Input radio/checkbox hidden (opacity 0)
- Transitions suaves con easing
- Focus-visible para accesibilidad

---

## TabBar

**Descripción:** Navegación inferior con pestañas (tab navigation).
**Uso principal:** Navegación principal de la app (Viajes, Mapa, Más).

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| active | boolean | `true` / `false` | `false` |
| icon | component | Lucide icon | required |
| label | string | Texto corto | required |

### Especificación Visual

- Tamaño: 64px height (full), flex 1 width por tab
- Background: `--color-surface` (#FFFFFF)
- Border-top: 1px `--color-border-subtle`
- Display: flex, flex-direction column, centered

**Tab Item**
- Gap: 3px (entre icono y label)
- Font-size: 10.5px
- Font-weight: 600
- Color inactive: `--color-fg3` (#7C8A98)
- Color active: `--color-brand-700` (#186A8C)
- Transición: `color --transition-duration-fast`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| inactive | Color gris (fg3) |
| active | Color azul brand |
| dark-mode | Active color: `--color-brand` (#45A6D2) |

### Notas de Implementación
- Z-index: 4 (arriba del contenido, debajo de FAB)
- Posición: bottom
- No scrollable
- Iconos de Lucide

---

## FAB (Floating Action Button)

**Descripción:** Botón flotante para acción primaria (agregar viaje).
**Uso principal:** Crear nuevo viaje, agregar itinerario.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| icon | component | Lucide icon | required |
| onClick | function | callback | required |

### Especificación Visual

- Tamaño: 56px × 56px
- Border-radius: `--border-radius-pill` (999px)
- Background: `--color-brand` (#1E7FA8)
- Color de icono: `--color-on-brand` (#FFFFFF)
- Box-shadow: `--shadow-lg`
- Position: absolute, right 18px, bottom (tabbar-height + 16px)
- Z-index: 6
- Transiciones: `transform --transition-duration-fast`, `background --transition-duration-fast`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Brand blue, sombra lg |
| hover | Background `--color-brand-hover` (#186A8C) |
| active | Scale 0.94, background `--color-brand-press` (#14536E) |
| dark-mode | Background `--color-brand` (#45A6D2) |

### Notas de Implementación
- Display flex, centered
- Cursor pointer
- Z-index 6 (arriba del tabbar)
- Position fixed en el prototipo, puede ser absolute según contexto

---

## AppBar / Header

**Descripción:** Barra de encabezado fija superior con título y acciones.
**Uso principal:** Título de pantalla, botones de acción rápida.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| title | string | Cualquier texto | required |
| backButton | boolean | `true` / `false` | `false` |
| actions | array | Botones de icono | [] |

### Especificación Visual

- Tamaño: 56px height (--header-h)
- Background: color-mix(canvas 82%, transparent) con backdrop-filter blur(10px)
- Border-bottom: 1px `--color-border-subtle`
- Display: flex, aligned center
- Padding: 0 12px 0 14px
- Z-index: 4

**Título**
- Font-size: 18px
- Font-weight: 700
- Letter-spacing: -0.01em
- Color: `--color-fg1`

**Icon Button**
- Tamaño: 40px × 40px
- Border-radius: `--border-radius-md` (12px)
- Background: none (default)
- Color: `--color-fg2`
- Hover background: `--color-surface-sunken`
- Active: scale(0.94)
- Transición: `background --transition-duration-fast`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Título y botones visibles |
| hover-button | Button background gris claro |
| active-button | Button scale 0.94 |
| dark-mode | Title blanco, backgrounds más oscuros |

### Notas de Implementación
- Backdrop filter crea efecto glassmorphic
- Z-index 4 (debajo de FAB y modales, arriba del contenido)
- Spacer flex: 1 para empujar botones al lado

---

## Empty State / Placeholder

**Descripción:** Pantalla vacía cuando no hay datos.
**Uso principal:** Sin viajes, sin itinerarios, sin hospedajes.

### Recomendaciones

- Ilustración o icono grande
- Mensaje principal (h2 o h3)
- Mensaje secundario (body o small text)
- Botón de acción (CTA)
- Center alineado
- Padding vertical espacioso

### Colores

- Icono: `--color-brand-tint` o `--color-fg3`
- Texto principal: `--color-fg1`
- Texto secundario: `--color-fg2`
- Botón: variant primary

---

## Loading / Skeleton

**Descripción:** Indicador de carga mientras se obtienen datos.
**Uso principal:** Carga de viajes, itinerarios, detalles.

### Recomendaciones

- Shimmer animation (fade 0.6s infinite)
- Backgrounds: `--color-surface-sunken`
- Border-radius acorde al componente que reemplaza
- Gaps mantienen estructura visual

### Colores

- Background: `--color-surface-sunken` (#EEF2F6)
- Animation: fade in/out

---

## Error State / Validation

**Descripción:** Mensajes de error en formularios o pantallas.
**Uso principal:** Validación de campos, errores de red.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| severity | string | `error` / `warning` / `info` | `error` |
| message | string | Texto de error | required |

### Especificación Visual

**Error (Field)**
- Border-color: `--color-error` (#DC2626)
- Box-shadow (focus): 0 0 0 3px `--color-error-tint`
- Mensaje: font-size 12.5px, color `--color-error-strong`, weight 500

**Error (Standalone)**
- Background: `--color-error-tint` (#FCEBEA)
- Border: 1px `--color-error` (#DC2626)
- Color: `--color-error-strong` (#B91C1C)
- Padding: 12px 16px
- Border-radius: `--border-radius-md` (12px)

**Warning**
- Color: `--color-warning` (#D97706)
- Tint: `--color-warning-tint` (#FCEFD9)
- On-warning: `#3A2606`

**Info**
- Color: `--color-info` (azul brand)
- Tint: `--color-info-tint` (#ECF4F9)

### Notas de Implementación
- Ícono + texto (flex layout)
- Margin-top 6px si está bajo un input
- Transiciones suaves

---

## Segmented Control

**Descripción:** Selector con múltiples opciones (radio group estilizado).
**Uso principal:** Filtros (Futuro/Actual/Pasado), opciones de vista.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| options | array | Array de opciones | required |
| value | string | Opción seleccionada | required |
| onChange | function | Callback | required |

### Especificación Visual

- Display: flex
- Background: `--color-surface-sunken` (#EEF2F6)
- Border-radius: `--border-radius-md` (12px)
- Padding: 4px
- Gap: 4px

**Button (opción)**
- Flex: 1
- Height: auto (approx 32px)
- Font-size: 13px
- Font-weight: 600
- Color inactive: `--color-fg2` (#45586A)
- Border-radius: 9px
- Transición: all `--transition-duration-fast`

**Button.on (seleccionado)**
- Background: `--color-surface` (#FFFFFF)
- Color: `--color-brand-700` (#186A8C)
- Box-shadow: `--shadow-xs`

### Estados

| Estado | Cambio visual |
|--------|--------------|
| unselected | Text fg2, background sunken |
| selected | Background white, text brand-700, sombra xs |
| dark-mode | Selected text: `--color-brand` (#45A6D2) |

### Notas de Implementación
- Flex layout con wrap: nowrap
- Transiciones suaves

---

## Type Icon Chip

**Descripción:** Ícono pequeño en un cuadrado redondeado para categorías (transporte, hospedaje).
**Uso principal:** Categorización rápida de ítems de viaje.

### Props / Variantes

| Prop/Estado | Tipo | Valores posibles | Default |
|-------------|------|-----------------|---------|
| type | string | `transport` / `lodging` / `activity` / `pasado` | `transport` |
| icon | component | Lucide icon | required |

### Especificación Visual

**Default (Transport)**
- Tamaño: 40px × 40px
- Border-radius: `--border-radius-md` (12px)
- Background: `--color-brand-tint` (#ECF4F9)
- Color: `--color-brand-700` (#186A8C)

**Lodging**
- Background: `--color-teal-tint` (#E3F4F2)
- Color: `--color-teal-strong` (#237E7A)

**Pasado (past)**
- Background: `--color-pasado-tint` (#EEF2F6)
- Color: `--color-pasado-strong` (#51607A)

**Dark mode**
- Color (default): `--color-brand` (#45A6D2)

### Notas de Implementación
- Display flex, centered
- Flex-none (no shrink)

---

## Formscreen / FormBar

**Descripción:** Estructura full-screen para formularios con barra de acciones al pie.
**Uso principal:** Crear/editar viajes, hospedajes, transporte.

### Especificación Visual

**FormScreen Container**
- Display: flex, flex-direction column
- Flex: 1, min-height 0

**FormScreen.body (Scroll)**
- Flex: 1, overflow-y auto
- Padding: 16px * --cv-density, 16px, 24px
- Scrollable internamente

**FormBar (Actions)**
- Flex: none
- Height: auto (approx 50px)
- Padding: 12px 16px 12px + safe-area-inset-bottom
- Border-top: 1px `--color-border-subtle`
- Background: `--color-surface`
- Display: flex, gap 10px

**Botones en FormBar**
- Flex: 1 (igual ancho)
- Mín. 2 botones (Cancel / Save)

### Estados

| Estado | Cambio visual |
|--------|--------------|
| default | Botones primario/secundario |
| loading | Deshabilitados durante operación |
| error | Mensaje de error en el body |

### Notas de Implementación
- Safe-area-inset-bottom para notch/status bar
- No scrollable el bar
- Botones full-width (flex 1)

---

## Density Control

**Descripción:** Variable CSS tweakable `--cv-density` para compactar/expandir espacios.
**Uso principal:** Ajuste de confort visual.

**Aplicación:**
```css
.pad { padding: calc(16px * var(--cv-density)); }
```

Default `--cv-density: 1`
- Valores típicos: 0.8 (compacto), 1.0 (normal), 1.2 (espacioso)

---

## Logo / Brand Mark

**Descripción:** Logotipo de la app.
**Ubicación:** 
- `docs/public/prototype/app/assets/logo-mark.svg` — favicon
- A importar en `src/` para uso en la app

**Especificación:**
- SVG escalable
- Color: azul brand #1E7FA8
- Proporción: cuadrada (recomendado)
- Uso: favicon, header, splash screen

---

## Resumen de Tokens Clave

| Categoría | Cantidad | Detalles |
|-----------|----------|----------|
| Colores | 54+ | Incluyendo neutrals, brand, status semántico, feedback |
| Tipografía | 9 escalas | Display, h1-h3, body, small, caption, micro, overline |
| Espaciado | 14 niveles | Space-0 a space-14 (4px base) |
| Border Radius | 7 valores | xs a 2xl + pill |
| Sombras | 5 niveles | xs a lg + sheet |
| Transiciones | 6 valores | Easing + durations |
| Layout | 4 values | App width, tap target, header, tabbar |

---

## Próximos Pasos

1. **Verificar logo**: El prototipo referencia `app/assets/logo-mark.svg`. Necesita ser copiado/refactorizado a `src/`.
2. **Implementar componentes**: React + TypeScript usando estos tokens.
3. **Test en múltiples temas**: Light mode (default) + Dark mode.
4. **Validar accesibilidad**: Focus rings, color contrast, labels.
5. **Considerar responsive**: Tablet/desktop breakpoints (actualmente mobile-first 440px).
