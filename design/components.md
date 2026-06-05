# Cuadros de Viaje — Especificación de Componentes
**Generado:** 2026-06-05
**Fuente:** docs/public/prototype/app/ (ui.jsx, cards.jsx, ui.css)
**Stack objetivo:** React 18 + TypeScript + MUI v5

---

## AppBar

**Descripción:** Barra de navegación superior de la app mobile.
**Uso principal:** Tope de cada pantalla. Soporta tres modos: branding (logo wordmark), navegación interna (con back button), y pantalla de sección (solo logo mark + título).

### Props / Variantes
| Prop | Tipo | Valores posibles | Default |
|------|------|-----------------|---------|
| `title` | string | Cualquier texto | — |
| `onBack` | function | callback | undefined |
| `right` | ReactNode | Botones de acción opcionales | undefined |
| `brand` | boolean | true / false | false |
| `theme` | string | `'light'` / `'dark'` | `'light'` |

### Especificación Visual
- Altura: `56px` (`--layout-header-height`)
- Padding: `0 12px 0 14px`
- Fondo: `color-mix(in srgb, var(--color-canvas) 82%, transparent)` + `backdrop-filter: blur(10px)`
- Borde inferior: `1px solid var(--color-border-subtle)`
- Título: `18px / 700 / --color-text-primary / letter-spacing: -0.01em`
- Logo mark: 30×30px (cuando no hay back)
- Logo wordmark: height 30px (cuando `brand = true`)
- `z-index`: 4

### Estados
| Estado | Cambio visual |
|--------|--------------|
| default | Fondo translúcido con blur |
| scroll | Sin cambio (sticky por defecto) |

### Notas de Implementación
- En modo `brand`, el wordmark reemplaza el título. Usar `logo-wordmark.svg` / `logo-wordmark-dark.svg` según el tema.
- Los botones de acción (`right`) usan la clase `.iconbtn` (40×40px, border-radius md, hover con surface-sunken).

---

## TabBar

**Descripción:** Barra de pestañas fija en la parte inferior de la pantalla mobile.
**Uso principal:** Navegación principal entre secciones: Viajes, Agenda, Cuenta.

### Props / Variantes
| Prop | Tipo | Valores posibles | Default |
|------|------|-----------------|---------|
| `active` | string | `'viajes'` / `'agenda'` / `'cuenta'` | `'viajes'` |
| `onChange` | function | callback(tabId) | — |

### Especificación Visual
- Altura: `64px` (`--layout-tabbar-height`)
- Fondo: `var(--color-surface)`
- Borde superior: `1px solid var(--color-border-subtle)`
- Tab inactivo: color `var(--color-text-muted)`, font-size `10.5px`, font-weight `600`
- Tab activo: color `var(--color-brand-700)` (light) / `var(--color-brand-main)` (dark)
- Ícono activo: stroke `2.2`, inactivo: stroke `2`
- Gap icono → label: `3px`
- `z-index`: 4

### Tabs definidas
| ID | Ícono (Lucide) | Label |
|----|---------------|-------|
| `viajes` | `luggage` | Viajes |
| `agenda` | `calendar-clock` | Agenda |
| `cuenta` | `user-round` | Cuenta |

### Notas de Implementación
- En MUI v5: usar `BottomNavigation` + `BottomNavigationAction` con los colores mapeados al tema.

---

## Button

**Descripción:** Botón de acción principal y secundaria.
**Uso principal:** CTAs en formularios, sheets y pantallas de auth.

### Props / Variantes
| Prop | Tipo | Valores posibles | Default |
|------|------|-----------------|---------|
| `variant` | string | `primary` / `secondary` / `ghost` / `danger` / `danger-soft` | `primary` |
| `size` | string | `default` / `sm` | `default` |
| `icon` | string | nombre Lucide | undefined |
| `iconRight` | string | nombre Lucide | undefined |
| `disabled` | boolean | true / false | false |
| `fullWidth` | boolean | true / false | true |

### Especificación Visual
- Font: `var(--font-sans)`, `15px`, weight `600`
- Border-radius: `var(--border-radius-pill)` (999px)
- Padding default: `12px 18px`
- Min-height default: `44px` (touch target)
- Width: `100%` por defecto
- Gap icon + label: `8px`

| Variante | Fondo | Texto | Borde |
|---------|-------|-------|-------|
| `primary` | `--color-brand-main` | `--color-on-brand` | transparent |
| `secondary` | `--color-surface` | `--color-brand-700` | `--color-border` |
| `ghost` | transparent | `--color-brand-700` | transparent |
| `danger` | `--color-error` | `--color-on-error` | transparent |
| `danger-soft` | `--color-error-tint` | `--color-error-strong` | transparent |

### Estados
| Estado | Variante | Cambio visual |
|--------|---------|--------------|
| hover | primary | fondo `--color-brand-hover` |
| hover | secondary | borde `--color-border-strong`, fondo `--color-surface-sunken` |
| hover | ghost | fondo `--color-brand-tint` |
| hover | danger | fondo `--color-error-strong` |
| active | primary | fondo `--color-brand-press`, scale(0.99) |
| disabled | primary | fondo `--color-surface-sunken`, texto `--color-text-disabled` |

### Variante sm
- Font-size: `14px`
- Padding: `9px 14px`
- Min-height: `40px`

### Notas de Implementación
- En MUI v5: `Button` base con `sx` overrides. La variante `ghost` mapea a `variant="text"` de MUI.
- La variante `danger` mapea a `color="error"` de MUI.
- Transición: `background 120ms, transform 120ms, box-shadow 120ms, border-color 120ms`.

---

## FAB (Floating Action Button)

**Descripción:** Botón flotante circular para la acción principal de la pantalla.
**Uso principal:** Agregar nuevo ítem en TripDetail, crear nuevo viaje en Dashboard.

### Especificación Visual
- Tamaño: `56×56px`
- Border-radius: `var(--border-radius-pill)`
- Fondo: `var(--color-brand-main)`
- Color ícono: `var(--color-on-brand)`
- Ícono: `plus` (Lucide, size 26)
- Sombra: `var(--shadow-lg)`
- Posición: `absolute; right: 18px; bottom: tabbar-height + 16px`
- `z-index`: 6

### Estados
| Estado | Cambio visual |
|--------|--------------|
| hover | fondo `--color-brand-hover` |
| active | scale(0.94), fondo `--color-brand-press` |

### Notas de Implementación
- En MUI v5: `Fab` con `color="primary"`. Posicionamiento relativo al contenedor `position: absolute` del teléfono.

---

## TripCard

**Descripción:** Card para mostrar un viaje en el listado del dashboard.
**Uso principal:** Dashboard — grupos de viajes (actuales, futuros, pasados).

### Props / Variantes
| Prop | Tipo | Valores posibles | Default |
|------|------|-----------------|---------|
| `variant` | string | `default` / `hero` / `compact` | `default` |
| `trip` | Viaje | objeto Viaje | — |
| `onOpen` | function | callback | — |
| `overline` | string | texto supra-título | undefined |
| `flat` | boolean | sin margin-bottom | false |

### Especificación Visual (variant: default)
- Padding: `15px 16px`
- Margin-bottom: `12px`
- Border-radius: `var(--border-radius-lg)` (16px)
- Fondo: `var(--color-surface)`
- Borde: `1px solid var(--color-border-subtle)` (viajes actuales: `var(--color-actual)`)
- Sombra: `var(--shadow-sm)` (hover: `var(--shadow-md)`)
- Título viaje: `20px`, weight `700`, `letter-spacing: -0.015em`
- Chips de destinos: componente `Chip` con ícono `map-pin`

**variant: hero** (solo para viaje actual)
- Padding: `18px 18px 16px`
- Fondo degradado: `linear-gradient(180deg, var(--color-actual-tint), var(--color-surface) 70%)`
- Borde doble: `1px solid var(--color-actual)` + `box-shadow: 0 0 0 1px var(--color-actual), var(--shadow-md)`
- Título: `23px`
- Badge con label completo (no abreviado)

**variant: compact**
- Padding: `12px 14px`
- Layout horizontal: TypeIcon + nombre/destinos + fecha/badge
- Título: `16px / 700`

### Estados
| Estado | Cambio visual |
|--------|--------------|
| default | shadow-sm |
| hover | shadow-md, border `--color-border` |
| active | scale(0.992) |

---

## ItemRow

**Descripción:** Fila de ítem (transporte u hospedaje) en la agenda del viaje.
**Uso principal:** Lista de ítems dentro de TripDetail.

### Especificación Visual
- Padding: `13px`
- Layout: `TypeIcon (40×40) + contenido grow + hora/dato-derecho + ChevronRight`
- Título ítem: `16px / 700` — transporte: `origen → destino`; hospedaje: nombre del alojamiento
- Subtítulo: `12.5px`, color `--color-text-muted` — transporte: compañía + N° servicio; hospedaje: tipo + noches
- Dato derecho: hora en mono `17px / 600`; subtítulo derecho: código/origen en `10.5px muted`
- Chevron: ícono `chevron-right` size 18, color `--color-text-disabled`

### TypeIcon (contenedor del ícono de tipo)
- Tamaño: `40×40px`
- Border-radius: `var(--border-radius-md)` (12px)
- Transport (futuro/actual): fondo `--color-brand-tint`, color `--color-brand-700`
- Lodging (futuro/actual): fondo `--color-teal-tint`, color `--color-teal-strong`
- Cualquier tipo pasado: fondo `--color-pasado-tint`, color `--color-pasado-strong`

### Íconos Lucide por tipo de ítem
| Tipo | Ícono |
|------|-------|
| avion | `plane` |
| tren | `train` |
| micro | `bus` |
| hotel | `building-2` |
| airbnb | `home` |
| posada | `house` |
| hostel | `bed` |
| casa_familia | `users` |
| otro (hospedaje) | `map-pin` |

---

## StatusBadge

**Descripción:** Pill badge que indica el estado de un viaje (futuro / actual / pasado).
**Uso principal:** TripCard (arriba a la derecha), headers de sección.

### Especificación Visual
- Padding: `5px 11px`
- Border-radius: `var(--border-radius-pill)`
- Font-size: `12.5px`, weight `600`
- Dot: `7×7px`, border-radius `50%`, color = color principal del status

| Status | Fondo | Texto | Dot |
|--------|-------|-------|-----|
| futuro | `--color-futuro-tint` | `--color-futuro-strong` | `--color-futuro` |
| actual | `--color-actual-tint` | `--color-actual-strong` | `--color-actual` |
| pasado | `--color-pasado-tint` | `--color-pasado-strong` | `--color-pasado` |

---

## Chip

**Descripción:** Etiqueta inline para destinos, códigos de reserva y tags.
**Uso principal:** Destinos en TripCard, chips de códigos de reserva en formularios.

### Props / Variantes
| Prop | Tipo | Descripción |
|------|------|-------------|
| `code` | boolean | Aplica font-mono y peso 600 |
| `icon` | string | Ícono Lucide antes del texto |
| `onRemove` | function | Si presente, muestra botón × para quitar |

### Especificación Visual
- Padding: `6px 11px`
- Border-radius: `var(--border-radius-pill)`
- Font-size: `12.5px`, weight `500`
- Fondo: `var(--color-surface-sunken)`
- Color texto: `var(--color-text-secondary)`
- Borde: `1px solid var(--color-border-subtle)`
- Chip code: font-family mono, weight `600`, color `--color-text-primary`
- Botón remove (×): color `--color-text-muted`; hover: color `--color-error`, fondo `--color-error-tint`

---

## Field (Form Field Wrapper)

**Descripción:** Contenedor de campo de formulario con label, required/optional indicator, hint y error.
**Uso principal:** Todos los formularios de la app.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `label` | string | Texto del label |
| `required` | boolean | Muestra asterisco rojo |
| `optional` | boolean | Muestra `(opcional)` gris |
| `hint` | string | Texto de ayuda bajo el campo |
| `error` | string | Mensaje de error (reemplaza hint) |

### Especificación Visual
- Label: `13px / 600 / --color-text-secondary`, margin-bottom `7px`
- Required `*`: color `--color-error`
- Optional: `12px`, color `--color-text-disabled`
- Error: ícono `alert-circle` + texto, `12.5px / 500 / --color-error-strong`
- Hint: `12px / --color-text-muted`
- Margin entre campos: `16px`

---

## TextInput / TextArea / DateInput / TimeInput / SelectInput

**Descripción:** Inputs de formulario con contenedor visual unificado.
**Uso principal:** Todos los formularios (registro, viaje, transporte, hospedaje).

### Especificación Visual del contenedor `.input`
- Min-height: `48px` (touch target)
- Padding: `0 13px`
- Border-radius: `var(--border-radius-md)` (12px)
- Fondo: `var(--color-surface)`
- Borde: `1px solid var(--color-border)`
- Font-size interno: `15px`, color `--color-text-primary`
- Placeholder: color `--color-text-disabled`
- Gap ícono + input: `10px`

### Estados
| Estado | Cambio visual |
|--------|--------------|
| focus | borde `--color-brand-main`, `box-shadow: var(--focus-ring)` |
| error | borde `--color-error` |
| error + focus | box-shadow `0 0 0 3px var(--color-error-tint)` |

### Variantes especiales
- **TextArea**: `padding-top: 11px`, `resize: none`, font-size `14.5px`
- **DateInput / TimeInput**: `font-variant-numeric: tabular-nums`, el calendar picker cubre el campo completo (opacity 0, inset 0)
- **SelectInput**: `appearance: none` + chevron-down ícono a la derecha

---

## Segmented (Segmented Control)

**Descripción:** Control de selección exclusiva con botones visuales tipo píldora agrupados.
**Uso principal:** Tipo de transporte (avión/tren/micro), selector de modo en formularios.

### Especificación Visual
- Contenedor: fondo `--color-surface-sunken`, border-radius `var(--border-radius-md)`, padding `4px`, gap `4px`
- Botón inactivo: `13px / 600`, color `--color-text-secondary`, bg transparente
- Botón activo: fondo `--color-surface`, color `--color-brand-700`, border-radius `9px`, shadow-xs
- Padding botón: `9px 4px`

---

## Switch (Toggle)

**Descripción:** Toggle switch on/off para configuraciones booleanas.
**Uso principal:** "¿Reservado por agencia?" en formularios de ítems.

### Especificación Visual
- Tamaño: `46×28px`
- Track inactivo: `--color-border-strong`
- Track activo: `--color-brand-main`
- Knob: `22×22px`, blanco, shadow-sm, offset `3px`
- Transición knob: `translateX(18px)` cuando activo
- Transición: `200ms var(--ease-out)`

---

## ChipInput

**Descripción:** Input multivalue que añade chips al presionar Enter o coma.
**Uso principal:** Campo "Destinos" en el formulario de viaje; códigos de reserva.

### Comportamiento
- Escribe texto → Enter o `,` → agrega chip
- Backspace en campo vacío → elimina último chip
- Chips debajo del input con botón × para remover
- Botón `↵` inline aparece cuando hay texto no guardado

---

## Sheet (Bottom Sheet)

**Descripción:** Panel deslizante desde la parte inferior. Cubre hasta el 92% de la pantalla.
**Uso principal:** Selección de tipo de ítem a agregar, confirmaciones ligeras, sub-opciones.

### Especificación Visual
- Fondo: `var(--color-surface)`
- Border-radius: `var(--border-radius-xl) var(--border-radius-xl) 0 0` (solo arriba)
- Sombra: `var(--shadow-sheet)` (0 -8px 28px)
- Grip: `38×4px`, border-radius pill, color `--color-border-strong`, centrado, margin-top `6px`
- Padding: `8px 16px 22px`
- Scrim (fondo): `rgba(14, 28, 40, 0.45)`
- Animación entrada: `translateY(34px) → 0, opacity 0.6 → 1`, duración `320ms var(--ease-out)`

---

## Modal (Dialog de confirmación)

**Descripción:** Diálogo modal centrado para confirmaciones destructivas.
**Uso principal:** Eliminar viaje, eliminar ítem.

### Especificación Visual
- Max-width: `320px`, ancho `100%`
- Border-radius: `var(--border-radius-xl)` (20px)
- Sombra: `var(--shadow-lg)`
- Padding: `22px 20px 18px`
- Ícono: contenedor `48×48px`, border-radius `14px`
  - Danger: fondo `--color-error-tint`, color `--color-error-strong`
- Título: `19px / 700 / --color-text-primary / letter-spacing: -0.01em`
- Animación: `scale(0.94) → 1, opacity 0 → 1`, `200ms var(--ease-out)`

---

## EmptyState

**Descripción:** Estado vacío ilustrado con ícono, título y descripción.
**Uso principal:** Dashboard sin viajes, sección sin resultados, viaje sin ítems.

### Especificación Visual
- Padding: `40px 24px`
- Arte: `96×96px`, border-radius `28px`, `background: linear-gradient(160deg, --color-brand-tint, --color-teal-tint)`, color `--color-brand-700`, shadow-sm
- Ícono central: Lucide, size 42, stroke 1.75
- Título: `19px / 700 / --color-text-primary / letter-spacing: -0.01em`
- Texto: `14.5px / --color-text-secondary / line-height: 1.5 / max-width: 280px`
- Animación entrada: `fadeup` (translateY 9px → 0, opacity 0 → 1)

---

## Toast

**Descripción:** Notificación efímera de éxito flotante sobre el tab bar.
**Uso principal:** Confirmación tras guardar, eliminar o actualizar un ítem.

### Especificación Visual
- Fondo (light): `var(--color-navy-900)` (#0E2B44)
- Fondo (dark): `var(--color-surface-raised)` + borde
- Color texto: `#FFFFFF`
- Font-size: `13.5px / 500`
- Padding: `11px 16px`
- Border-radius: `var(--border-radius-pill)`
- Sombra: `var(--shadow-lg)`
- Ícono check: color `var(--color-success)`
- Posición: `bottom: tabbar-height + 84px`, centrado horizontalmente
- `z-index`: 30
- Animación: `translateY(10px) → 0, opacity 0 → 1`

---

## LV (Label–Value)

**Descripción:** Par label/valor semántico para mostrar datos en el detalle de un ítem.
**Uso principal:** Detalle de transporte y hospedaje — todos los campos informativos.

### Especificación Visual
- Label: clase `.overline` — `10.5px / 600 / uppercase / letter-spacing: 0.07em / --color-text-muted`
- Valor: `15px / 600 / --color-text-primary / line-height: 1.3`
- Valor mono: `font-family: var(--font-mono)` (para códigos, horarios)
- Valor vacío (—): color `--color-text-disabled`, weight `500`
- URL: `color: --color-brand-700`, `text-decoration: none`; hover: underline

---

## Tipografía — Clases semánticas

| Clase | Size | Weight | Color | Uso |
|-------|------|--------|-------|-----|
| `.t-display` | 32px | 700 | fg1 | Pantallas de bienvenida |
| `.t-h1` | 24px | 700 | fg1 | Títulos de sección |
| `.t-h2` | 20px | 600 | fg1 | Sub-títulos, nombres de viaje |
| `.t-h3` | 17px | 600 | fg1 | Encabezados de card |
| `.t-body` | 16px | 400 | fg2 | Texto principal |
| `.t-sm` | 14px | 400 | fg2 | Texto secundario |
| `.t-caption` | 13px | 400 | fg3 | Captions, hints |
| `.t-overline` | 11px | 600 | fg3 | Labels de sección (uppercase) |
| `.t-mono` | 14px | 500 | fg1 | Códigos de reserva, horarios, N° de vuelo |
