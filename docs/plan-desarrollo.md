# Plan de Desarrollo — Cuadros de Viaje
**Generado:** 2026-06-04
**Basado en:** Análisis Funcional – Cuadros de viaje (docs/public/Analisis_Funcional-Cuadros_de_viaje.md)
**Versión:** 1.0

---

## 1. RESUMEN DEL PLAN

| Ítem | Valor |
|------|-------|
| Total de fases | 7 (Fase 0 → Fase 6) |
| Estimación total | ~76 horas (~9.5 días de desarrollo individual) |
| Stack | React 18 + Vite 5 + TypeScript + MUI v5 + Supabase |

### Criterios generales de "done"

- El código compila sin errores TypeScript.
- Los tests unitarios de la fase pasan.
- Todos los estados de UI están cubiertos: vacío, cargando, con datos, error.
- Las reglas de negocio definidas en el AF están implementadas y validadas.
- La UI es usable en pantalla de 375px (iPhone SE) sin scroll horizontal.

---

## 2. FASES DE DESARROLLO

---

### Fase 0 — Setup y Scaffolding

**Objetivo:** Tener el entorno de desarrollo completo, funcional y deployable antes de escribir una línea de lógica de negocio.

**Tareas:**
1. Crear proyecto con `npm create vite@latest cuadros-de-viaje -- --template react-ts`
2. Instalar dependencias: MUI v5, React Router v6, DayJS, Supabase JS client
3. Instalar dependencias de dev: Vitest, React Testing Library, Playwright, MSW
4. Configurar `tsconfig.json` con path aliases (`@/` → `src/`)
5. Configurar MUI v5: `ThemeProvider` con tema base mobile-first
6. Configurar React Router v6: estructura base de rutas con placeholders
7. Crear proyecto en Supabase Cloud: configurar Auth (magic link + OTP email habilitados)
8. Crear archivo `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
9. Crear `src/supabase.ts` (cliente singleton)
10. Configurar ESLint + Prettier
11. Configurar Vitest con `jsdom` y setup de React Testing Library
12. Deploy inicial en Vercel (rama `main` → producción)
13. Verificar que el proyecto vacío levanta en `localhost:5173` y en Vercel

**Criterio de aceptación:**
- `npm run dev` levanta sin errores
- `npm run test` pasa (suite vacía)
- Deploy en Vercel funciona
- Supabase conectado (puede hacer ping al healthcheck)

**Estimación:** 8 horas
**Prioridad:** CRÍTICA
**Dependencias:** Ninguna

---

### Fase 1 — Modelos de Datos y Mocks

**Objetivo:** Definir los tipos TypeScript de todas las entidades y crear datos de prueba realistas que sirvan para desarrollo y testing.

**Tareas:**
1. Crear `src/types/auth.ts` — interfaces `Usuario`
2. Crear `src/types/trips.ts` — interfaces `Viaje`, `EstadoViaje`, `ViajeConItems`
3. Crear `src/types/items.ts` — interfaces `ItemTransporte`, `ItemHospedaje`, `DatosReserva`, tipos `TipoTransporte`, `TipoHospedaje`
4. Crear `src/utils/tripClassifier.ts` — función `clasificarViaje(viaje: Viaje): EstadoViaje`
5. Crear `src/utils/dateValidation.ts` — `isFutureOrToday`, `isEndAfterStart`, `validateTransportDates`, `validateAccommodationDates`
6. Crear `src/utils/formatters.ts` — `formatDate`, `formatDateTime`, `formatTransportType`, `formatAccomType`
7. Crear `src/mocks/users.json` — 2 usuarios de prueba con datos realistas
8. Crear `src/mocks/viajes.json` — 5 viajes por usuario (1 actual, 2 futuros, 2 pasados), destinos múltiples
9. Crear `src/mocks/items_transporte.json` — 2–4 ítems por viaje (avión, tren, micro)
10. Crear `src/mocks/items_hospedaje.json` — 1–3 ítems por viaje (hotel, airbnb, posada)
11. Crear tests unitarios para `tripClassifier` (casos límite: inicio=hoy, fin=hoy, sin fechas)
12. Crear tests unitarios para `dateValidation` (RN-5, RN-11)

**Criterio de aceptación:**
- Todos los tipos compilan sin errores
- Tests de `tripClassifier` y `dateValidation` pasan al 100%
- Los mocks tienen datos coherentes (fechas consistentes, IDs relacionados correctamente)

**Estimación:** 8 horas
**Prioridad:** CRÍTICA
**Dependencias:** Fase 0

---

### Fase 2 — Autenticación (E1)

**Objetivo:** Implementar el flujo completo de acceso sin contraseña: registro con OTP, verificación de email y login con magic link.

**Tareas:**
1. Crear esquema en Supabase: tabla `profiles` (id, nombre, apellido, pais, email, fecha_alta)
2. Crear `src/services/authService.ts` — register, verifyEmail, resendOtp, requestMagicLink, logout, getSession
3. Crear `src/context/AuthContext.tsx` — user, loading, logout, listener `onAuthStateChange`
4. Crear `PrivateRoute` — redirige a `/login` si no hay sesión
5. Crear `LoginPage` + `LoginForm` — campo email, botón, estados loading/enviado
6. Crear `RegisterPage` + `RegisterForm` — nombre, apellido, país, email; validaciones inline
7. Crear `VerifyEmailPage` + `VerifyCodeForm` — input código 6 dígitos, botón verificar, reenviar
8. Configurar redirección post-magic-link en Supabase (URL de callback → `/dashboard`)
9. Implementar manejo de error "email ya registrado" con sugerencia de login
10. Implementar pantalla post-login "Revisá tu correo" (sin revelar existencia de cuenta, RN-7)
11. Implementar logout desde AppBar
12. Tests de integración: flujo registro → verificar con MSW
13. Tests de integración: flujo login con magic link expirado

**Criterio de aceptación:**
- Un usuario nuevo puede registrarse y verificar su email recibiendo el OTP real
- Login con magic link funciona end-to-end (email recibido, clic → dashboard)
- OTP incorrecto/expirado muestra error + botón reenviar
- Email duplicado muestra mensaje correcto
- Rutas privadas redirigen a `/login` si no hay sesión
- En producción (Vercel), el magic link redirige correctamente

**Estimación:** 16 horas
**Prioridad:** CRÍTICA
**Dependencias:** Fase 0, Fase 1

---

### Fase 3 — Gestión de Viajes (E2)

**Objetivo:** Implementar el CRUD completo de viajes con clasificación automática y agrupación en el dashboard.

**Tareas:**
1. Crear tablas en Supabase: `viajes` (id, usuario_id, nombre, destinos jsonb, fecha_inicio, fecha_fin, created_at, updated_at) + políticas RLS
2. Crear `src/services/tripsService.ts` — getViajes, getViajeById, createViaje, updateViaje, deleteViaje
3. Crear `src/context/TripsContext.tsx` — lista de viajes, operaciones CRUD con optimistic updates
4. Crear `DashboardPage` — estructura con tres secciones + AppBar + FAB "Nuevo viaje"
5. Crear `TripGroup` — sección colapsable para Actuales / Futuros / Pasados
6. Crear `TripCard` — nombre, destinos, fechas, badge de estado, acciones editar/eliminar
7. Crear `EmptyState` — estado vacío para dashboard sin viajes y para cada grupo vacío
8. Crear `TripFormPage` + `TripForm` — nombre (obligatorio), destinos (chips, 1+), fechas opcionales; validaciones (RN-5, RN-11)
9. Crear `TripDeleteDialog` — confirmación con advertencia de eliminación de ítems asociados (RN-9)
10. Integrar `tripClassifier` — clasificar viajes al cargar en TripsContext
11. Lógica: viaje sin fechas → grupo "Futuros" como fallback (supuesto #6)
12. Tests de componente: TripGroup (grupos vacíos, con datos), TripCard (acciones), TripForm (validaciones)

**Criterio de aceptación:**
- Dashboard muestra viajes agrupados en Actuales / Futuros / Pasados con clasificación correcta
- CRUD completo: crear, editar nombre/destinos/fechas, eliminar con confirmación
- Validaciones activas: nombre obligatorio, mínimo 1 destino, fechas coherentes, no fechas pasadas
- El viaje actual/próximo es el más visible al entrar
- Eliminar viaje pide confirmación y menciona que se borran los ítems
- Estado vacío correcto cuando no hay viajes

**Estimación:** 14 horas
**Prioridad:** CRÍTICA
**Dependencias:** Fase 2

---

### Fase 4 — Ítems de Transporte (E3)

**Objetivo:** Implementar la carga, visualización, edición y eliminación de tramos de transporte (avión, tren, micro).

**Tareas:**
1. Crear tabla en Supabase: `items_transporte` (todos los campos del modelo + políticas RLS con CASCADE en delete del viaje)
2. Crear operaciones en `src/services/itemsService.ts` — createTransporte, updateTransporte, deleteTransporte
3. Crear `TripDetailPage` — estructura base: header del viaje + lista de ítems + FAB
4. Crear `TransportItem` — vista compacta mobile: tipo, compañía, origen→destino, fechas/horas, N° servicio, asiento; sección colapsable para datos de reserva
5. Crear `BookingDataFields` — componente reutilizable: toggle agencia + nombre condicional, chips de códigos (add/remove), URL con link externo, textarea comentarios
6. Crear `TransportFormPage` + `TransportForm` — selector tipo → campos específicos → sección BookingDataFields; validaciones completas (RN-4, RN-5, RN-11, formato HH:mm)
7. Integrar ordenamiento cronológico en `TripDetailPage` (por `fecha_salida + hora_salida`)
8. Implementar edición: pre-cargar datos del ítem en el formulario
9. Implementar eliminación: confirm dialog + delete optimista
10. Tests de componente: TransportForm (campos obligatorios, validación agencia condicional, formato hora)

**Criterio de aceptación:**
- CRUD completo de ítems de transporte para los tres tipos
- La agenda del viaje muestra los tramos ordenados cronológicamente
- Validaciones activas: origen/destino obligatorios, fechas coherentes, hora HH:mm, agencia condicional
- URL de reserva se puede abrir como enlace externo
- La vista mobile es legible sin zoom (horarios, origen, destino, N° reserva)

**Estimación:** 12 horas
**Prioridad:** CRÍTICA
**Dependencias:** Fase 3

---

### Fase 5 — Ítems de Hospedaje (E4 + E5)

**Objetivo:** Implementar la carga, visualización, edición y eliminación de alojamientos, reutilizando `BookingDataFields`.

**Tareas:**
1. Crear tabla en Supabase: `items_hospedaje` (todos los campos del modelo + políticas RLS con CASCADE)
2. Agregar operaciones en `src/services/itemsService.ts` — createHospedaje, updateHospedaje, deleteHospedaje
3. Crear `AccommodationItem` — vista compacta mobile: tipo, nombre, check-in / check-out, dirección, teléfono (enlace `tel:`), email (enlace `mailto:`); sección colapsable para datos de reserva
4. Crear `AccommodationFormPage` + `AccommodationForm` — selector tipo → campos específicos → `BookingDataFields`; validaciones (RN-4, RN-5, RN-11)
5. Integrar en `TripDetailPage`: mezclar y ordenar cronológicamente transporte + hospedaje (por fecha de inicio)
6. Implementar edición y eliminación (mismo patrón que transporte)
7. Agregar botón FAB con selector "Transporte / Hospedaje" en `TripDetailPage`
8. Tests de componente: AccommodationForm (fechas inconsistentes, datos de contacto opcionales)

**Criterio de aceptación:**
- CRUD completo de ítems de hospedaje para todos los tipos
- La agenda del viaje mezcla transporte y hospedaje ordenados por fecha
- Validaciones activas: nombre y fechas obligatorios, checkout > checkin, no fechas pasadas, email válido si presente
- Teléfono y email son enlaces interactivos en la vista del ítem
- `BookingDataFields` reutilizado sin duplicación de código

**Estimación:** 10 horas
**Prioridad:** CRÍTICA
**Dependencias:** Fase 4

---

### Fase 6 — Integración, Polish y Testing (E6)

**Objetivo:** Pulir la experiencia completa, asegurar la calidad mobile-first, cubrir casos límite con tests y preparar para producción.

**Tareas:**
1. Audit responsive: probar en 375px, 390px (iPhone 14), 768px (tablet), 1440px (desktop)
2. Revisar accesibilidad: contrastes MUI, labels en formularios, roles ARIA en dialogs
3. Implementar `AppBar` final: título de app + avatar/initiales del usuario + logout
4. Implementar loading skeletons en Dashboard y TripDetail (estados de carga)
5. Implementar snackbar global para errores y confirmaciones de éxito
6. Revisar y completar todos los estados vacíos (EmptyState por sección)
7. Asegurar bloqueo de edición de fechas pasadas en ítems existentes (supuesto #1: solo campos de fecha)
8. Probar clasificación en fechas límite: viaje cuyo inicio = hoy, fin = hoy
9. Probar eliminación en cascada: borrar viaje elimina sus ítems (verificar en Supabase)
10. Escribir tests E2E con Playwright: flujo completo registro → verificar → crear viaje → agregar transporte → agregar hospedaje → eliminar viaje
11. Revisar seguridad RLS: intentar acceder a viaje de otro usuario vía URL directa
12. Optimización: verificar que no hay re-renders innecesarios en Dashboard (React DevTools)
13. Actualizar variables de entorno en Vercel para producción
14. Smoke test en producción

**Criterio de aceptación:**
- App usable y estética en móvil (375px) sin scroll horizontal
- Tests E2E de flujo completo pasan en CI
- RLS validado: un usuario no puede ver datos de otro
- Todos los estados de UI cubiertos: vacío, cargando, con datos, error
- Deploy en Vercel sin errores de consola

**Estimación:** 8 horas
**Prioridad:** ALTA
**Dependencias:** Fases 2–5

---

## 3. BACKLOG PRIORIZADO

| ID | Tarea | Fase | Est. (h) | Prioridad | Dependencias |
|----|-------|------|----------|-----------|--------------|
| T-01 | Crear proyecto Vite + React + TS | 0 | 1 | CRÍTICA | — |
| T-02 | Instalar y configurar dependencias (MUI, Router, DayJS, Supabase) | 0 | 2 | CRÍTICA | T-01 |
| T-03 | Configurar Supabase Cloud (proyecto, auth settings) | 0 | 1 | CRÍTICA | — |
| T-04 | Configurar Vitest + RTL + ESLint | 0 | 2 | CRÍTICA | T-01 |
| T-05 | Deploy inicial en Vercel | 0 | 1 | CRÍTICA | T-01 |
| T-06 | ThemeProvider MUI base mobile-first | 0 | 1 | ALTA | T-02 |
| T-07 | Definir tipos TypeScript (auth, trips, items) | 1 | 3 | CRÍTICA | T-02 |
| T-08 | Implementar `tripClassifier` + tests | 1 | 2 | CRÍTICA | T-07 |
| T-09 | Implementar `dateValidation` + tests | 1 | 1 | CRÍTICA | T-07 |
| T-10 | Crear mocks JSON realistas | 1 | 2 | ALTA | T-07 |
| T-11 | Tabla `profiles` + políticas RLS en Supabase | 2 | 1 | CRÍTICA | T-03 |
| T-12 | `authService` (register, verify, magicLink, logout) | 2 | 3 | CRÍTICA | T-11 |
| T-13 | `AuthContext` + listener `onAuthStateChange` | 2 | 2 | CRÍTICA | T-12 |
| T-14 | `PrivateRoute` | 2 | 1 | CRÍTICA | T-13 |
| T-15 | `LoginPage` + `LoginForm` | 2 | 2 | CRÍTICA | T-13 |
| T-16 | `RegisterPage` + `RegisterForm` | 2 | 2 | CRÍTICA | T-13 |
| T-17 | `VerifyEmailPage` + `VerifyCodeForm` | 2 | 2 | CRÍTICA | T-13 |
| T-18 | Redirección magic link (Supabase callback) | 2 | 1 | CRÍTICA | T-12 |
| T-19 | Tests integración auth (MSW) | 2 | 2 | ALTA | T-17 |
| T-20 | Tabla `viajes` + RLS en Supabase | 3 | 1 | CRÍTICA | T-03 |
| T-21 | `tripsService` CRUD | 3 | 2 | CRÍTICA | T-20 |
| T-22 | `TripsContext` con optimistic updates | 3 | 2 | CRÍTICA | T-21 |
| T-23 | `DashboardPage` + estructura grupos | 3 | 2 | CRÍTICA | T-22 |
| T-24 | `TripGroup` + `TripCard` | 3 | 2 | CRÍTICA | T-23 |
| T-25 | `TripFormPage` + validaciones (RN-5, RN-11) | 3 | 3 | CRÍTICA | T-22 |
| T-26 | `TripDeleteDialog` con advertencia de ítems | 3 | 1 | CRÍTICA | T-24 |
| T-27 | `EmptyState` para dashboard y grupos | 3 | 1 | ALTA | T-23 |
| T-28 | Tabla `items_transporte` + RLS + CASCADE | 4 | 1 | CRÍTICA | T-03 |
| T-29 | `itemsService` transporte CRUD | 4 | 2 | CRÍTICA | T-28 |
| T-30 | `TripDetailPage` base (header + lista) | 4 | 2 | CRÍTICA | T-22 |
| T-31 | `TransportItem` (vista mobile) | 4 | 2 | CRÍTICA | T-30 |
| T-32 | `BookingDataFields` (componente compartido) | 4 | 2 | CRÍTICA | — |
| T-33 | `TransportFormPage` + validaciones completas | 4 | 3 | CRÍTICA | T-32 |
| T-34 | Tabla `items_hospedaje` + RLS + CASCADE | 5 | 1 | CRÍTICA | T-03 |
| T-35 | `itemsService` hospedaje CRUD | 5 | 2 | CRÍTICA | T-34 |
| T-36 | `AccommodationItem` (vista mobile) | 5 | 2 | CRÍTICA | T-30 |
| T-37 | `AccommodationFormPage` + validaciones | 5 | 3 | CRÍTICA | T-32 |
| T-38 | FAB con selector transporte/hospedaje | 5 | 1 | CRÍTICA | T-36 |
| T-39 | Ordenamiento cronológico mixto en agenda | 5 | 1 | ALTA | T-37 |
| T-40 | Audit responsive (375px → desktop) | 6 | 2 | ALTA | T-39 |
| T-41 | Loading skeletons Dashboard + TripDetail | 6 | 1 | MEDIA | T-39 |
| T-42 | Snackbar global (errores y éxito) | 6 | 1 | ALTA | T-39 |
| T-43 | AppBar final (initiales, logout) | 6 | 1 | ALTA | T-13 |
| T-44 | Tests E2E Playwright (flujo completo) | 6 | 2 | ALTA | T-39 |
| T-45 | Verificar RLS cross-user | 6 | 0.5 | CRÍTICA | T-39 |
| T-46 | Smoke test en producción | 6 | 0.5 | CRÍTICA | T-44 |

---

## 4. RIESGOS Y MITIGACIONES

**R-1: Complejidad del flujo de auth en producción (magic link)**

- **Riesgo:** La redirección del magic link puede fallar en producción si las URLs de callback no están configuradas correctamente en Supabase o si Vercel modifica el dominio.
- **Probabilidad:** Media | **Impacto:** Alto (bloquea el acceso completo)
- **Mitigación:** Configurar las URLs de redirect en Supabase desde el inicio (Fase 0). Testear el flujo completo en Vercel antes de finalizar Fase 2.

---

**R-2: Manejo de zonas horarias en fechas de transporte**

- **Riesgo:** El AF exige almacenar fechas en hora local sin conversión UTC. Si se usa un DatePicker de MUI mal configurado, puede convertir silenciosamente a UTC al guardar.
- **Probabilidad:** Alta | **Impacto:** Medio (datos incorrectos difíciles de detectar)
- **Mitigación:** Usar DayJS sin el plugin `utc`. Almacenar fechas como strings `YYYY-MM-DD` y horas como `HH:mm`. Nunca usar `Date` nativo para persistencia. Agregar test unitario que verifique el round-trip.

---

**R-3: Clasificación de viajes con fechas parciales o nulas**

- **Riesgo:** Si un viaje tiene solo fecha de inicio (sin fin) o ninguna fecha, `tripClassifier` puede fallar o clasificar incorrectamente.
- **Probabilidad:** Alta | **Impacto:** Medio (UX del dashboard rota)
- **Mitigación:** Cubrir explícitamente estos casos en tests unitarios de Fase 1. Implementar fallback documentado: sin fechas → "Futuros".

---

**R-4: RLS mal configurada en Supabase**

- **Riesgo:** Un error en las políticas RLS puede exponer datos de un usuario a otro, o puede bloquear operaciones legítimas del propio usuario.
- **Probabilidad:** Media | **Impacto:** Crítico (vulnerabilidad de seguridad)
- **Mitigación:** Habilitar RLS en todas las tablas desde el inicio. Testear explícitamente en Fase 6 que un usuario no puede leer ni escribir datos de otro. Usar el SQL editor de Supabase para verificar las políticas.

---

**R-5: Pérdida de datos por eliminación en cascada**

- **Riesgo:** Al eliminar un viaje, la cascade delete elimina todos sus ítems. Si hay un bug en el dialog de confirmación, el usuario puede perder datos por error.
- **Probabilidad:** Baja | **Impacto:** Alto (datos irrecuperables)
- **Mitigación:** El dialog de confirmación debe ser explícito y requiere acción activa. Considerar soft-delete (campo `deleted_at`) en una iteración futura. Implementar el test E2E que verifica el flujo de confirmación.

---

**R-6: Scope creep en formularios**

- **Riesgo:** Los formularios de transporte y hospedaje tienen muchos campos opcionales. Puede existir la tentación de agregar campos no definidos en el AF durante el desarrollo.
- **Probabilidad:** Media | **Impacto:** Bajo-Medio (retraso y complejidad)
- **Mitigación:** Respetar estrictamente los modelos de datos del AF. Cualquier campo nuevo debe pasar por consulta al PO. Ver sección 5 (Supuestos aplicados).

---

## 5. SUPUESTOS APLICADOS

| # | Decisión tomada | Referencia AF | Punto ambiguo |
|---|----------------|---------------|---------------|
| S-1 | En viajes/ítems pasados, solo los campos de **fecha** quedan bloqueados para edición. El resto (nombre, comentarios, códigos) sigue editable. | RN-11, HU-9 | ¿Se puede editar información no-fecha en ítems pasados? |
| S-2 | Las fechas del viaje son **manuales y opcionales**. No se derivan automáticamente de los ítems. | Sección 6.2 | "se pueden derivar de los ítems o cargarse" — ambiguo |
| S-3 | Códigos de reserva: **array de strings de texto libre** (UI con chips add/remove). Sin validación de formato. Máx. 10 códigos por ítem. | Sección 6.5 | "código(s) de reserva" — cantidad y formato no definidos |
| S-4 | Supabase por defecto no envía email para emails no registrados al solicitar magic link. La UI siempre muestra "Revisá tu correo" sin lógica adicional. | RN-7 | Implementación técnica de no-revelación |
| S-5 | Ordenamiento cronológico de la agenda se implementa en el MVP (clasificado como **Should de alta prioridad**). | Sección 9 MoSCoW | "Ordenar la agenda por fecha/hora" aparece como Should, pero los CAs de E3/E4 lo describen como comportamiento esperado |
| S-6 | Viajes sin fechas se agrupan en **"Futuros"** como fallback en el dashboard. | HU-4, Sección 6.2 | ¿Qué estado tiene un viaje sin fechas? |
| S-7 | Destinos: **texto libre sin lista predefinida** (UI de chips). Sin límite formal, máx. sugerido 20. | HU-3, Sección 6.2 | Formato y límite de destinos no definidos |
| S-8 | **Supabase** como backend en lugar de un servidor custom, dado que el AF no define stack técnico y la funcionalidad de magic link + OTP está disponible out-of-the-box. | AF general | AF no especifica backend |
