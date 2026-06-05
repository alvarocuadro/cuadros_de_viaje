# Fase 6 — Checklist de Verificación Manual

**Generado:** 2026-06-05  
**Estado:** En progreso

---

## 1. Responsive Design

### Viewport 375px (iPhone SE)

- [ ] Dashboard: sin scroll horizontal
- [ ] TripDetail: sin scroll horizontal
- [ ] Formularios: inputs legibles, sin zoom
- [ ] FAB: visible en position correcta (80px desde abajo en mobile)
- [ ] Cards: responsive, sin truncado

**Comandos:**
```bash
npm run dev
# Abrir DevTools > Device Emulation > iPhone SE
```

### Viewport 390px (iPhone 14)

- [ ] Todos los elementos anteriores
- [ ] Grid de 2 columnas se comporta correctamente

### Viewport 768px (iPad)

- [ ] Layout se ajusta a ancho
- [ ] Inputs más anchos aprovechan espacio
- [ ] FAB en position correcta (32px desde abajo)

### Viewport 1440px (Desktop)

- [ ] Container max-width respetado
- [ ] Espaciado horizontal adecuado
- [ ] No hay UI distorsionada

---

## 2. Accesibilidad

- [ ] Todos los inputs tienen labels asociados (htmlFor)
- [ ] Dialogs tienen rol="dialog" y aria-labelledby
- [ ] Contrastes de color cumplen WCAG AA (MUI por defecto lo cumple)
- [ ] Focus visible en todos los botones
- [ ] Nombres de botones descriptivos (no solo "Ok")

---

## 3. Loading States

- [ ] Dashboard: muestra skeletons mientras carga
- [ ] TripDetail: muestra skeletons mientras carga items
- [ ] Formularios: botón submit deshabilitado durante envío
- [ ] No hay flickering (skeleton → contenido debe ser suave)

---

## 4. Snackbar y Feedback

- [ ] Crear viaje → muestra "Viaje creado correctamente" (verde)
- [ ] Actualizar viaje → muestra "Viaje actualizado correctamente"
- [ ] Eliminar item → muestra "Ítem eliminado correctamente"
- [ ] Error en creación → muestra mensaje de error (rojo)
- [ ] Snackbars desaparecen después de 4-6 segundos automáticamente
- [ ] Múltiples snackbars se apilan sin overlapearse

---

## 5. Seguridad - RLS Verification

### Escenario A: Usuario A intenta acceder a viaje de Usuario B

1. Crear dos cuentas de test en Supabase (user_a@test.com, user_b@test.com)
2. Usuario A crea un viaje
3. Usuario B abre DevTools > Network
4. Usuario B intenta URL directa: `/trips/<VIAJE_ID_DE_A>`
5. **Esperado:** Redirección a dashboard o "Viaje no encontrado", sin exponer datos

### Escenario B: SQL injection attempt

1. Inspeccionar solicitud GET `/rest/v1/viajes?eq(id,'xxx')`
2. Intentar inyectar SQL: `?eq(id,'xxx')'OR'1'='1`
3. **Esperado:** Supabase rechaza la query (no es válida)

### Escenario C: Verificar CASCADE delete

1. Usuario A crea viaje con 3 items (2 transporte, 1 hospedaje)
2. Usuario A elimina el viaje
3. Abirir Supabase console > SQL editor
4. Query: `SELECT COUNT(*) FROM items_transporte WHERE viaje_id = '<ID_BORRADO>';`
5. **Esperado:** Resultado = 0 (items fueron eliminados)

---

## 6. Estados de UI

- [ ] Dashboard vacío: muestra EmptyState "Sin viajes planificados"
- [ ] TripDetail sin items: muestra EmptyState "Sin ítems"
- [ ] Grupo vacío en Dashboard (ej. sin actuales): no muestra header, colapsable, ni vacío redundante
- [ ] Error en carga: muestra Alert roja con mensaje
- [ ] Form con error de validación: destaca campo rojo + mensaje helper

---

## 7. Validaciones de Fechas

### Caso límite: Inicio = Hoy, Fin = Hoy

1. Crear viaje con fecha inicio = hoy, fin = hoy
2. **Esperado:** Viaje clasificado como "Actual"

### Caso límite: Viaje sin fechas

1. Crear viaje SIN llenar fecha_inicio ni fecha_fin
2. **Esperado:** Viaje clasificado como "Futuro" (fallback del supuesto #6)

### Caso límite: Fecha pasada en ítem

1. Crear transporte con fecha_salida en el pasado
2. **Esperado:** Form rechaza (validación isFutureOrToday)

---

## 8. Edición de Ítems Existentes

- [ ] Transporte: pre-carga todos los campos (tipo, compañía, origen, destino, fechas, horas, números, asiento, booking data)
- [ ] Hospedaje: pre-carga todos los campos (tipo, nombre, fechas, dirección, teléfono, email, N° reserva, booking data)
- [ ] Campos de fecha deshabilitados para edición (solo crear)
- [ ] Botón cambia de "Crear" a "Actualizar"

---

## 9. Eliminación en Cascada

- [ ] Crear viaje con múltiples items
- [ ] Eliminar viaje desde dashboard
- [ ] Confirmar en dialog
- [ ] **Esperado:** Viaje + todos sus items se eliminan

---

## 10. Performance (React DevTools)

- [ ] Dashboard: no hay re-renders innecesarios al navegar
- [ ] TripDetail: lista de items no re-renderiza item completo solo por hover
- [ ] Inputs: no disparan re-render de toda la form

**Instrucciones:**
1. Instalar React DevTools
2. Activar "Highlight updates when components render"
3. Navegar entre páginas
4. Observar que solo se renderiza lo que cambió

---

## 11. Console Errors

- [ ] `npm run dev` en terminal sin errores
- [ ] DevTools Console: sin warnings relacionados al app (ignorar third-party)
- [ ] Network tab: todos los requests exitosos (200, 201, 204, 401 para logout)

---

## 12. Smoke Test - Producción (Vercel)

1. Deploy en Vercel
2. Verificar URL: `https://cuadros-de-viaje.vercel.app`
3. Abrir DevTools Console: sin errores
4. Login: funciona magic link
5. Crear viaje: responde en < 2s
6. Agregar transporte: responde en < 2s
7. Eliminar ítem: responde instantáneamente (optimistic update)
8. Red lenta (DevTools Network > "Slow 3G"): app aún usable, no cuelga

---

## 13. Datos Mock vs Reales

- [ ] En desarrollo: usar datos reales de Supabase (no mocks)
- [ ] En tests: MSW mock de Supabase (si aplicable)
- [ ] En producción: datos reales de Supabase

---

## Requisitos Completados

- [x] Snackbar global para errores/éxito
- [x] Loading skeletons en Dashboard y TripDetail
- [x] AppBar con avatar + logout (implementado en Fase 2)
- [ ] E2E tests con Playwright (básico implementado)
- [ ] RLS cross-user verification (manual)
- [ ] Smoke test en producción (pendiente)
- [ ] Variables de entorno en Vercel (pendiente)

---

## Notas para Futuro

- Considerar agregar soft-delete (campo `deleted_at`) para recuperar datos
- Agregar drag-and-drop para reordenar items en agenda
- Agregar búsqueda de viajes por destino/fecha
- Integración con Google Calendar
