# Testing Checklist — Design System

Verificación visual y funcional de la implementación del design system.

---

## Fase 1: Setup & Integration ✅

### Theme
- [x] `src/theme.ts` creado con tokens de light/dark mode
- [x] `src/context/ThemeContext.tsx` implementado con toggle
- [x] `src/design/variables.css` integrado en main.tsx
- [x] localStorage para persistencia de tema

### Logo
- [x] `src/assets/logo-mark.svg` copiado del prototipo
- [x] `src/components/Logo.tsx` componente React
- [x] Logo integrado en AppHeader

### AppHeader
- [x] Incluye logo
- [x] Toggle de tema (light/dark)
- [x] Mantiene funcionalidad de usuario/logout

---

## Fase 2: Visual Testing (Browser)

### Colores Light Mode
Run `npm run dev` y verificar en http://localhost:5173:

**Neutrals**
- [ ] Canvas background: #F5F7FA (gris claro)
- [ ] Surface cards: #FFFFFF (blanco puro)
- [ ] Surface sunken inputs: #EEF2F6 (gris muy claro)
- [ ] Borders visible pero sutiles

**Brand Colors**
- [ ] Primary button: #1E7FA8 (azul vivo)
- [ ] Hover state: #186A8C (más oscuro)
- [ ] Pressed state: #14536E (más fuerte)
- [ ] Tint background: #ECF4F9 (muy claro)

**Feedback Colors**
- [ ] Success: #16A34A (verde)
- [ ] Error: #DC2626 (rojo)
- [ ] Warning: #D97706 (ámbar)
- [ ] Info: #1E7FA8 (azul)

**Text (Contrast)**
- [ ] Headings fg1: #102A40 (negro azulado) readable
- [ ] Body fg2: #45586A (gris azulado) readable
- [ ] Captions fg3: #7C8A98 (gris) readable on white
- [ ] Disabled fg-disabled: #AEB9C4 (gris claro) subtle

### Colores Dark Mode
- [ ] Toggle tema en AppHeader
- [ ] Canvas: #0B1620 (negro muy oscuro)
- [ ] Surface: #12202C (gris muy oscuro)
- [ ] Text fg1: #EAF1F6 (blanco azulado) readable
- [ ] Brand primary: #45A6D2 (azul claro)
- [ ] Contraste suficiente en todos los textos

### Tipografía
- [ ] Display (32px, bold): títulos grandes claramente visible
- [ ] H1 (24px): encabezados principales
- [ ] H2 (20px): encabezados secundarios
- [ ] Body (16px): texto normal readable
- [ ] Caption (13px): texto pequeño legible
- [ ] Font families: 'Hanken Grotesk' (sans), 'Spline Sans Mono' (mono)

### Espaciado
- [ ] Gap 8px (space-3): visible entre elementos
- [ ] Padding 16px (space-5): standard interno
- [ ] Padding 24px (space-7): secciones
- [ ] Margin 32px (space-8): separación grande

### Border Radius
- [ ] Buttons: 999px (pill shape)
- [ ] Cards: 16px (sharp pero redondeado)
- [ ] Inputs: 12px (smooth)
- [ ] Modal top: 20px
- [ ] FAB: 999px (círculo)

### Sombras
- [ ] Shadow-sm: sutil (tarjetas)
- [ ] Shadow-md: hover (más visible)
- [ ] Shadow-lg: FAB, modals (prominente)
- [ ] Shadow-sheet: modal inferior (desde arriba)

### Transiciones
- [ ] Buttons: suave al hover (~120ms)
- [ ] Inputs: suave al focus (~120ms)
- [ ] Cards: tap feedback visible
- [ ] Modals: slide/fade animation (~200ms)

---

## Fase 3: Component Testing

### Button Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="danger-soft">Danger Soft</Button>
```

**Checklist:**
- [ ] Primary: azul, hover más oscuro, active más fuerte
- [ ] Secondary: blanco border, hover gris
- [ ] Ghost: transparente, hover tint
- [ ] Danger: rojo brillante
- [ ] Danger-soft: rojo claro, text oscuro
- [ ] Todos: disabled state gris
- [ ] Todos: focus ring visible
- [ ] Todos: active scale 0.99

### Input Field
```tsx
<Input label="Email" type="email" required error={false} helperText="" />
```

**Checklist:**
- [ ] Label arriba, 13px, weight 600
- [ ] Input height 48px
- [ ] Border 1px gris
- [ ] Placeholder visible pero muted
- [ ] Focus: border azul, focus ring 3px
- [ ] Error: border rojo, ring rojo claro
- [ ] Helper text: 12px gris bajo
- [ ] Required asterisk rojo

### Card
```tsx
<Card interactive={false}>Content</Card>
<Card interactive={true}>Clickable</Card>
```

**Checklist:**
- [ ] Background blanco/surface
- [ ] Border 1px subtle
- [ ] Border radius 16px
- [ ] Shadow-sm visible
- [ ] Interactive hover: shadow-md, border más visible
- [ ] Interactive active: scale 0.992

### Badge
```tsx
<Badge variant="futuro" showDot>Upcoming</Badge>
<Badge variant="actual" showDot>Happening</Badge>
<Badge variant="pasado" showDot>Done</Badge>
```

**Checklist:**
- [ ] Futuro: teal background + teal dot
- [ ] Actual: azul background + azul dot
- [ ] Pasado: gris background + gris dot
- [ ] Dot: 7px circle visible
- [ ] Text: 12.5px weight 600
- [ ] Pill shape (border-radius 999px)

### Modal / Sheet
```tsx
<Modal open={true} title="Confirm" type="sheet" onClose={() => {}}>
  Content here
</Modal>
```

**Checklist:**
- [ ] Sheet: comes from bottom, rounded top only
- [ ] Modal: centered, rounded all sides
- [ ] Grip bar visible in sheet
- [ ] Backdrop 45% opacity
- [ ] Close button or ESC to close
- [ ] Title visible
- [ ] Animation smooth

### TabBar
```tsx
<TabBar
  tabs={[
    { id: 'trips', icon: MapIcon, label: 'Trips' },
    { id: 'map', icon: MapPinIcon, label: 'Map' },
    { id: 'more', icon: MoreIcon, label: 'More' },
  ]}
  activeTab="trips"
  onChange={(id) => {}}
/>
```

**Checklist:**
- [ ] Fixed bottom
- [ ] Height 64px
- [ ] Icon + label visible
- [ ] Active tab: azul color, bold
- [ ] Inactive: gris
- [ ] Transition suave color

### FAB
```tsx
<FAB icon={PlusIcon} onClick={() => {}} />
```

**Checklist:**
- [ ] Fixed bottom-right, arriba del tabbar
- [ ] 56x56px círculo
- [ ] Azul brand
- [ ] Icono blanco
- [ ] Shadow-lg prominente
- [ ] Hover: más oscuro
- [ ] Active: scale 0.94

---

## Fase 4: Accessibility Testing

### Keyboard Navigation
- [ ] Tab navega todos los botones
- [ ] Shift+Tab va atrás
- [ ] Enter activa botones
- [ ] Space activa buttons/checkboxes
- [ ] Arrow keys en selects/tabs
- [ ] ESC cierra modales

### Focus Visibility
- [ ] Focus ring azul 3px visible en:
  - [ ] Buttons (todos)
  - [ ] Inputs
  - [ ] Links
  - [ ] Tabs
  - [ ] FAB
- [ ] Focus ring suficientemente contraste (dark bg: visible)

### Screen Reader (NVDA/JAWS/VoiceOver)
- [ ] Button announced: "Button, [label]"
- [ ] Input announced: "[Label] Edit form field"
- [ ] Link announced: "Link, [text], unvisited"
- [ ] Badge announced: badge content
- [ ] Modal announced: "Dialog, [title]"
- [ ] Error announced: "Alert, [message]"
- [ ] Tab announced: "Tab, [label]"

### Color Contrast (axe DevTools)
- [ ] No automatic contrast violations
- [ ] All text 4.5:1 minimum (AA level)
- [ ] Large text 3:1 minimum
- [ ] Border 3:1 contrast con background

### Reduced Motion
- [ ] Check `prefers-reduced-motion: reduce`
- [ ] Animations disabled
- [ ] Transitions still work (instant)

---

## Fase 5: Dark Mode Testing

### Colors
- [ ] Background canvas: #0B1620
- [ ] Surface: #12202C (muy visible)
- [ ] Text: #EAF1F6 (muy claro)
- [ ] All elements readable
- [ ] Borders visible

### Components
- [ ] Buttons: dark mode colors
- [ ] Cards: surface oscuro visible
- [ ] Inputs: border visible
- [ ] Modal: surface oscuro, no blend con background
- [ ] All focus rings visible

### Persistence
- [ ] Reload página: tema se mantiene
- [ ] localStorage contiene `theme-mode`
- [ ] data-theme attribute en html

---

## Fase 6: Responsive Testing

### Mobile (390px)
- [ ] All components stack vertically
- [ ] Touch targets 44px minimum
- [ ] No horizontal scroll
- [ ] TabBar visible at bottom
- [ ] FAB visible
- [ ] Modal fullwidth

### Tablet (768px)
- [ ] Layout adapts (wider)
- [ ] Still mobile-first

### Desktop (1024px+)
- [ ] Max-width respected (440px recomendado mobile)
- [ ] Desktop optimizations if needed

---

## Fase 7: Integration with Pages

### Dashboard
- [ ] Logo en header
- [ ] Theme toggle funciona
- [ ] Trip cards usan design tokens
- [ ] Botones new trip usan design system
- [ ] Colors consistentes

### Login/Register
- [ ] Inputs usan design system
- [ ] Buttons usan design system
- [ ] Responsive
- [ ] Dark mode supported

### Trip Form
- [ ] All inputs styled correctly
- [ ] Error states work
- [ ] Buttons (primary/secondary) visible
- [ ] Focus ring on inputs

### Trip Detail
- [ ] Cards displaying data
- [ ] Badges showing status (futuro/actual/pasado)
- [ ] Edit/Delete buttons styled
- [ ] Icons colored correctly

---

## Bugs Found & Fixed

| Issue | Status | Fix |
|-------|--------|-----|
| Logo SVG needs `currentColor` | ✅ Fixed | Updated Logo.tsx to use currentColor |
| Focus ring needs dark mode variant | ✅ Fixed | Added dark mode focus ring in theme |
| Input placeholder color wrong | ✅ Fixed | Set to var(--color-fg-disabled) |
| Modal z-index conflicts | ⏳ TBD | May need adjustment |
| TabBar color in dark mode | ✅ Fixed | Updated to var(--color-brand) |

---

## Performance Checks

- [ ] CSS-in-JS size reasonable
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse performance >90
- [ ] Accessibility score 90+

---

## Sign-off

- [ ] Visual design matches prototype
- [ ] All components functional
- [ ] Accessibility WCAG AA
- [ ] Dark mode fully working
- [ ] Keyboard navigation complete
- [ ] Ready for development

---

**Last Updated:** 2026-06-05
**Tester:** Design System Implementation
