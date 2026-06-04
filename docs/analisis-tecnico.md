# Análisis Técnico — Cuadros de Viaje
**Generado:** 2026-06-04
**Basado en:** Análisis Funcional – Cuadros de viaje (docs/public/Analisis_Funcional-Cuadros_de_viaje.md)
**Versión:** 1.0

---

## 1. RESUMEN EJECUTIVO

### Propósito del sistema

Cuadros de Viaje es una aplicación web responsive (mobile-first) que centraliza la información de los itinerarios de un viajero en un único lugar. Resuelve el problema de la dispersión de datos (vuelos en el correo, hoteles en otra app, reservas en capturas de pantalla) mediante la carga manual de ítems de transporte y hospedaje, agrupados por viaje y clasificados automáticamente como pasados, actuales o futuros.

El acceso es sin contraseña: registro con verificación de email por código OTP y login mediante magic link. El MVP apunta a validar que la carga manual aporta suficiente valor para que el usuario use la app como fuente única de verdad de sus viajes, sin integraciones externas ni automatizaciones.

### Stack tecnológico recomendado

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework frontend | React 18 + Vite 5 + TypeScript | HMR rápido, type safety para modelos complejos, ecosistema maduro |
| UI Library | MUI v5 (Material UI) | Componentes mobile-first listos, DatePicker integrado, theming robusto |
| Routing | React Router v6 | Estándar de industria, soporte de rutas protegidas y layouts anidados |
| Fechas | DayJS | Ligero, API fluida, comparación y formateo sin overhead |
| Estado global | Context API + useReducer | Suficiente para MVP; evita complejidad de Redux/Zustand |
| Backend / Auth / DB | Supabase | Magic link y OTP email out-of-the-box; PostgreSQL + RLS; PostgREST auto-generado |
| Hosting | Vercel (frontend) + Supabase Cloud | Zero-config deploy, free tier suficiente para MVP |
| Testing | Vitest + React Testing Library + Playwright | Unitarios rápidos + E2E para flujos críticos de auth y CRUD |

### Principales decisiones arquitectónicas

1. **Supabase como BaaS:** Proporciona auth sin contraseña (magic link nativo), PostgreSQL con Row Level Security para aislamiento de datos por usuario y PostgREST auto-generado. Elimina la necesidad de backend custom para el MVP, reduciendo TTM significativamente.

2. **SPA con rutas protegidas:** La app es una Single Page Application con React Router. Todas las rutas de negocio están envueltas en un `PrivateRoute` que verifica `AuthContext`. La seguridad real reside en RLS del lado del servidor.

3. **Estado `pasado/actual/futuro` calculado en cliente:** Se computa con DayJS al momento del render, a partir de las fechas derivadas de los ítems del viaje, sin persistirlo en base de datos. Esto garantiza coherencia automática sin jobs de actualización.

4. **Horarios en hora local (sin UTC):** Siguiendo RN-8, las fechas/horas de transporte se almacenan como strings en el horario local que el usuario ingresa, sin ninguna conversión de zona horaria.

5. **`DatosReserva` como campos planos en cada tabla:** Los campos comunes (agencia, códigos, URL, comentarios) se modelan como columnas directas en `items_transporte` e `items_hospedaje`, evitando JOINs innecesarios para el MVP.

6. **Fechas del viaje derivadas automáticamente:** `fecha_inicio` y `fecha_fin` se recalculan a partir de la fecha mínima y máxima de sus ítems de transporte y hospedaje. El usuario no las carga manualmente en el MVP.

---

## 2. ACTORES Y ROLES

### Tabla de actores

| Actor | Rol | Permisos principales |
|-------|-----|---------------------|
| Visitante (no autenticado) | Usuario sin sesión activa | Registrarse, solicitar magic link, verificar email con OTP |
| Viajero (autenticado) | Usuario con sesión activa y email verificado | CRUD sobre sus viajes actuales/futuros; solo lectura sobre viajes pasados |
| Sistema (Supabase) | Backend / Auth service | Enviar emails de verificación y magic links, validar tokens JWT, aplicar RLS |

### Flujos críticos por actor

**Visitante:**
- Registro → verificación de email con código OTP → activación de cuenta → dashboard
- Solicitud de magic link → confirmación "revisá tu correo" → clic en link → dashboard

**Viajero:**
- Ver dashboard → viaje actual/próximo más visible
- Crear / editar / eliminar viaje actual o futuro (con múltiples destinos)
- Agregar / editar / eliminar ítem de transporte (avión, tren, micro) en viajes actuales/futuros
- Agregar / editar / eliminar ítem de hospedaje en viajes actuales/futuros
- Consultar detalle de ítem (código de reserva, URL, comentarios)
- Logout

---

## 3. ARQUITECTURA DEL SISTEMA

### Diagrama de arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  React Router v6                     │   │
│  │  /login  /register  /verify  /dashboard             │   │
│  │  /trips/new  /trips/:id  /trips/:id/transport/new   │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │                      Pages                           │   │
│  │  LoginPage · RegisterPage · VerifyEmailPage          │   │
│  │  DashboardPage · TripDetailPage                      │   │
│  │  TripFormPage · TransportFormPage · AccomFormPage    │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │               Components (MUI v5)                    │   │
│  │  TripCard · TripGroup · TransportItem                │   │
│  │  AccommodationItem · BookingDataFields               │   │
│  │  ConfirmDialog · EmptyState · AppBar                 │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │          Context (AuthContext · TripsContext)         │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼─────────────────────────────┐   │
│  │              Services (Supabase JS client)           │   │
│  │          authService · tripsService · itemsService   │   │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTPS (REST API + Auth API)
                            ▼
┌────────────────────────────────────────────────────────────┐
│                         Supabase                            │
│                                                              │
│  ┌───────────────────┐    ┌──────────────────────────┐     │
│  │   Auth Service    │    │      PostgreSQL DB         │     │
│  │  - OTP email      │    │  - profiles (usuario)      │     │
│  │  - Magic link     │    │  - viajes                  │     │
│  │  - JWT tokens     │    │  - items_transporte        │     │
│  │  - Refresh tokens │    │  - items_hospedaje         │     │
│  └───────────────────┘    └──────────────────────────┘     │
│                                                              │
│  ┌───────────────────┐    ┌──────────────────────────┐     │
│  │  PostgREST API    │    │   Row Level Security      │     │
│  │  (auto-generada)  │    │   (aislamiento por user)  │     │
│  └───────────────────┘    └──────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
```

### Patrón de capas y ubicación de archivos

```
src/
├── main.tsx                       # Entry point + React.StrictMode
├── App.tsx                        # Router raíz + Providers
├── supabase.ts                    # Supabase client init (singleton)
│
├── context/
│   ├── AuthContext.tsx             # user, loading, logout
│   └── TripsContext.tsx            # lista de viajes, CRUD + estado optimista
│
├── services/
│   ├── authService.ts              # register, verifyOtp, requestMagicLink, logout
│   ├── tripsService.ts             # getViajes, getViajeById, createViaje, update, delete
│   └── itemsService.ts             # CRUD transporte + CRUD hospedaje
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── DashboardPage.tsx
│   ├── TripDetailPage.tsx
│   ├── TripFormPage.tsx            # Crear y editar viajes
│   ├── TransportFormPage.tsx       # Crear y editar transporte
│   └── AccommodationFormPage.tsx   # Crear y editar hospedaje
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── VerifyCodeForm.tsx
│   ├── trips/
│   │   ├── TripGroup.tsx           # Sección "Actuales / Futuros / Pasados"
│   │   ├── TripCard.tsx            # Card resumen del viaje
│   │   ├── TripForm.tsx            # Formulario crear/editar
│   │   └── TripDeleteDialog.tsx
│   ├── items/
│   │   ├── TransportItem.tsx       # Vista detalle ítem transporte
│   │   ├── AccommodationItem.tsx   # Vista detalle ítem hospedaje
│   │   ├── TransportForm.tsx
│   │   ├── AccommodationForm.tsx
│   │   └── BookingDataFields.tsx   # Sección compartida: agencia/códigos/URL/comentarios
│   └── shared/
│       ├── PrivateRoute.tsx
│       ├── AppBar.tsx
│       ├── ConfirmDialog.tsx
│       └── EmptyState.tsx
│
├── types/
│   ├── auth.ts
│   ├── trips.ts
│   └── items.ts
│
├── utils/
│   ├── tripClassifier.ts           # Lógica pasado/actual/futuro
│   ├── dateValidation.ts           # RN-5, RN-11, rango hoy a +2 años
│   └── formatters.ts               # Fechas, horarios, display strings
│
└── mocks/
    ├── users.json
    ├── viajes.json
    ├── items_transporte.json
    └── items_hospedaje.json
```

---

## 4. MODELOS DE DATOS

### Interfaces TypeScript

```typescript
// types/auth.ts

interface Usuario {
  id: string;                    // UUID (Supabase auth.users)
  email: string;                 // único, verificado, máx 50 chars
  nombre: string;                // obligatorio, máx 40 chars
  apellido: string;              // obligatorio, máx 40 chars
  pais: string;                  // obligatorio, máx 50 chars
  email_verificado: boolean;
  fecha_alta: string;            // ISO 8601
}

// types/trips.ts

type EstadoViaje = 'pasado' | 'actual' | 'futuro';

interface Viaje {
  id: string;                    // UUID
  usuario_id: string;            // FK → Usuario.id
  nombre: string;                // obligatorio, máx 50 chars
  destinos: string[];            // obligatorio, min 1 elemento, max 25; máx 50 chars por destino
  fecha_inicio: string | null;   // YYYY-MM-DD, derivada de los ítems
  fecha_fin: string | null;      // YYYY-MM-DD, derivada de los ítems
  estado?: EstadoViaje;          // calculado en cliente, no persiste
  created_at: string;
  updated_at: string;
}

// types/items.ts

type TipoTransporte = 'avion' | 'tren' | 'micro';

type TipoHospedaje =
  | 'hotel'
  | 'airbnb'
  | 'posada'
  | 'hostel'
  | 'casa_familia'
  | 'otro';

interface DatosReserva {
  por_agencia: boolean;          // obligatorio
  nombre_agencia?: string;       // obligatorio si por_agencia === true, máx 50 chars
  codigos_reserva: string[];     // array de texto libre, máx 10 caracteres por código
  url_reserva?: string;          // URL válida, opcional, máx 300 chars
  comentarios?: string;          // texto libre, opcional, máx 500 chars
}

interface ItemTransporte extends DatosReserva {
  id: string;
  viaje_id: string;              // FK → Viaje.id
  tipo: TipoTransporte;          // obligatorio
  compania?: string;             // aerolínea / empresa ferroviaria / micro, máx 50 chars
  origen: string;                // obligatorio, máx 50 chars
  destino: string;               // obligatorio, máx 50 chars
  fecha_salida: string;          // obligatorio, YYYY-MM-DD (hora local)
  hora_salida: string;           // obligatorio, HH:mm (hora local origen)
  fecha_llegada: string;         // obligatorio, YYYY-MM-DD (hora local)
  hora_llegada: string;          // obligatorio, HH:mm (hora local destino)
  numero_servicio?: string;      // N° de vuelo / tren / servicio, máx 50 chars
  asiento?: string;              // opcional, máx 50 chars
  created_at: string;
  updated_at: string;
}

interface ItemHospedaje extends DatosReserva {
  id: string;
  viaje_id: string;              // FK → Viaje.id
  tipo: TipoHospedaje;           // obligatorio
  nombre: string;                // obligatorio, máx 50 chars
  fecha_checkin: string;         // obligatorio, YYYY-MM-DD
  fecha_checkout: string;        // obligatorio, YYYY-MM-DD, > fecha_checkin
  direccion?: string;            // máx 50 chars
  telefono?: string;             // máx 50 chars
  email_contacto?: string;       // formato email si presente, máx 50 chars
  created_at: string;
  updated_at: string;
}

// Vista enriquecida para TripDetailPage
interface ViajeConItems extends Viaje {
  items_transporte: ItemTransporte[];
  items_hospedaje: ItemHospedaje[];
  estado: EstadoViaje;           // calculado, siempre presente en esta vista
}
```

### Relaciones entre entidades

```
Usuario     1 ──────< N  Viaje
Viaje       1 ──────< N  ItemTransporte
Viaje       1 ──────< N  ItemHospedaje
```

### Reglas de validación por campo

Reglas transversales:

- Todos los campos tienen restricciones explícitas de obligatoriedad, formato, longitud y/o rango.
- Todo campo de texto se normaliza con `trim()` antes de validar y guardar.
- Los campos obligatorios no pueden quedar vacíos ni contener solamente espacios.
- Los textos cortos (nombres de aerolíneas, aeropuertos/ciudades, estaciones, terminales, alojamientos, agencias, destinos, servicios, asientos, direcciones, teléfonos y país) tienen un máximo de 50 caracteres, salvo excepciones indicadas.
- Las fechas de ítems nuevos o editados deben estar entre la fecha de creación/edición del ítem (hoy) y dos años en el futuro. Las fechas derivadas del viaje heredan ese rango desde sus ítems.

| Campo | Obligatorio | Regla |
|-------|------------|-------|
| `Usuario.email` | Sí | Formato email válido (`@`, dominio y `.`); único en sistema; máx 50 caracteres |
| `Usuario.nombre / apellido` | Sí | No vacío ni solo espacios; máx 40 caracteres cada uno |
| `Usuario.pais` | Sí | No vacío ni solo espacios; máx 50 caracteres |
| `Viaje.nombre` | Sí | No vacío ni solo espacios; máx 50 caracteres |
| `Viaje.destinos` | Sí | Array con al menos 1 elemento no vacío; máximo 25 destinos; máx 50 caracteres por destino |
| `Viaje.fecha_inicio / fecha_fin` | No | Derivadas automáticamente desde los ítems; no editables manualmente |
| `ItemTransporte.tipo` | Sí | Enum obligatorio: `avion`, `tren`, `micro` |
| `ItemTransporte.compania` | No | Máx 50 caracteres |
| `ItemTransporte.origen / destino` | Sí | No vacíos ni solo espacios; máx 50 caracteres |
| `ItemTransporte.numero_servicio / asiento` | No | Máx 50 caracteres |
| `ItemTransporte.fecha_salida / llegada` | Sí | llegada >= salida; fecha desde hoy hasta hoy + 2 años en create/edit |
| `ItemTransporte.hora_salida / llegada` | Sí | Formato HH:mm (00:00 – 23:59) |
| `ItemHospedaje.tipo` | Sí | Enum obligatorio: `hotel`, `airbnb`, `posada`, `hostel`, `casa_familia`, `otro` |
| `ItemHospedaje.nombre` | Sí | No vacío ni solo espacios; máx 50 caracteres |
| `ItemHospedaje.fecha_checkin / checkout` | Sí | checkout > checkin; fecha desde hoy hasta hoy + 2 años en create/edit |
| `ItemHospedaje.direccion / telefono` | No | Máx 50 caracteres |
| `ItemHospedaje.email_contacto` | No | Formato email si está presente; máx 50 caracteres |
| `DatosReserva.por_agencia` | Sí | Boolean obligatorio: `true` o `false`; no admite `null` |
| `DatosReserva.nombre_agencia` | Condicional | Obligatorio si `por_agencia === true`; no vacío ni solo espacios; máx 50 caracteres |
| `DatosReserva.codigos_reserva` | No | Texto libre; máximo 10 caracteres por código |
| `DatosReserva.url_reserva` | No | URL válida (https://) si está presente; máx 300 caracteres |
| `DatosReserva.comentarios` | No | Texto libre; máx 500 caracteres |

---

## 5. APIs Y SERVICIOS

El stack usa el cliente Supabase JS (PostgREST + Auth SDK). Se listan como contratos de servicio.

### Auth Service

| Operación | Método Supabase | Descripción |
|-----------|----------------|-------------|
| `register` | `auth.signUp` + `INSERT profiles` | Crea cuenta + envía OTP al email |
| `verifyEmail` | `auth.verifyOtp({ type: 'email' })` | Valida código de 6 dígitos |
| `resendVerification` | `auth.resend` | Reenvía OTP |
| `requestMagicLink` | `auth.signInWithOtp({ type: 'email' })` | Envía magic link al email |
| `logout` | `auth.signOut` | Invalida sesión |
| `getSession` | `auth.getSession` | Obtiene sesión y user activos |
| `onAuthStateChange` | `auth.onAuthStateChange` | Listener para cambios de sesión (usado en AuthContext) |

### Trips Service

| Operación | Descripción | RLS |
|-----------|-------------|-----|
| `getViajes(userId)` | Lista todos los viajes del usuario | SELECT WHERE usuario_id = auth.uid() |
| `getViajeById(id)` | Viaje + ítems de transporte + ítems de hospedaje | SELECT WHERE id AND usuario_id |
| `createViaje(input)` | Inserta viaje nuevo sin fechas manuales | INSERT con usuario_id auto = auth.uid() |
| `updateViaje(id, input)` | Actualiza datos del viaje si no es pasado | UPDATE WHERE id AND usuario_id |
| `deleteViaje(id)` | Elimina viaje si no es pasado (CASCADE a ítems) | DELETE WHERE id AND usuario_id |

### Items Service

| Operación | Descripción |
|-----------|-------------|
| `createTransporte(input)` | Inserta ítem de transporte |
| `updateTransporte(id, input)` | Actualiza transporte |
| `deleteTransporte(id)` | Elimina transporte |
| `createHospedaje(input)` | Inserta ítem de hospedaje |
| `updateHospedaje(id, input)` | Actualiza hospedaje |
| `deleteHospedaje(id)` | Elimina hospedaje |

Toda operación de alta, edición o eliminación de ítems recalcula `fecha_inicio` y `fecha_fin` del viaje asociado usando la fecha mínima y máxima de sus ítems.

### Contratos de entrada/salida (ejemplos clave)

```typescript
// authService.register
interface RegisterInput {
  email: string;
  nombre: string;
  apellido: string;
  pais: string;
}
// Output: { error: AuthError | null }

// tripsService.createViaje
interface CreateViajeInput {
  nombre: string;
  destinos: string[];
}
// Output: { data: Viaje | null; error: PostgrestError | null }

// itemsService.createTransporte
interface CreateTransporteInput {
  viaje_id: string;
  tipo: TipoTransporte;
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_llegada: string;
  hora_llegada: string;
  compania?: string;
  numero_servicio?: string;
  asiento?: string;
  por_agencia: boolean;
  nombre_agencia?: string;
  codigos_reserva?: string[];
  url_reserva?: string;
  comentarios?: string;
}
// Output: { data: ItemTransporte | null; error: PostgrestError | null }
```

---

## 6. ESTRUCTURA DE COMPONENTES

### Árbol de componentes React

```
App
├── AuthProvider
│   └── TripsProvider
│       └── Router
│           ├── /login ──────────────→ LoginPage
│           │                            └── LoginForm
│           │
│           ├── /register ───────────→ RegisterPage
│           │                            └── RegisterForm
│           │
│           ├── /verify ─────────────→ VerifyEmailPage
│           │                            └── VerifyCodeForm
│           │
│           └── PrivateRoute (auth requerida)
│               │
│               ├── /dashboard ──────→ DashboardPage
│               │                       ├── AppBar
│               │                       ├── TripGroup [Actuales]
│               │                       │    └── TripCard[]
│               │                       ├── TripGroup [Futuros]
│               │                       │    └── TripCard[]
│               │                       ├── TripGroup [Pasados]
│               │                       │    └── TripCard[]
│               │                       └── EmptyState (si no hay viajes)
│               │
│               ├── /trips/new ──────→ TripFormPage (crear)
│               │                       └── TripForm
│               │
│               ├── /trips/:id ──────→ TripDetailPage
│               │                       ├── AppBar
│               │                       ├── TripHeader (nombre, destinos, fechas)
│               │                       ├── AgendaList (ordenada cronológicamente)
│               │                       │    ├── TransportItem[]
│               │                       │    └── AccommodationItem[]
│               │                       ├── EmptyState (sin ítems)
│               │                       └── FAB (Agregar ítem)
│               │
│               ├── /trips/:id/edit ─→ TripFormPage (editar)
│               │
│               ├── /trips/:id/transport/new
│               ├── /trips/:id/transport/:itemId/edit → TransportFormPage
│               │                       ├── TransportForm
│               │                       └── BookingDataFields
│               │
│               ├── /trips/:id/accommodation/new
│               └── /trips/:id/accommodation/:itemId/edit → AccommodationFormPage
│                                       ├── AccommodationForm
│                                       └── BookingDataFields
```

### Props interfaces de componentes clave

```typescript
interface TripCardProps {
  viaje: Viaje;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface TripGroupProps {
  label: 'Actuales' | 'Futuros' | 'Pasados';
  viajes: Viaje[];
  defaultExpanded?: boolean;
}

interface TransportItemProps {
  item: ItemTransporte;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface AccommodationItemProps {
  item: ItemHospedaje;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface BookingDataFieldsProps {
  value: DatosReserva;
  onChange: (data: Partial<DatosReserva>) => void;
  disabled?: boolean;
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### Estado global vs estado local

| Estado | Ubicación | Justificación |
|--------|-----------|---------------|
| Sesión de usuario (`user`, `loading`) | `AuthContext` | Necesario en toda la app (rutas protegidas, AppBar) |
| Lista de viajes | `TripsContext` | Accedido desde Dashboard, TripCard, formularios |
| Viaje activo con ítems | `TripDetailPage` (local + fetch) | Solo necesario en esa página |
| Estado de formularios | `useState` local | Scope reducido, sin necesidad de compartir |
| Loading / error de operaciones | `useState` local por componente | Granularidad fina por operación |
| Dialogs de confirmación (`open`) | `useState` local | Estado UI efímero |

---

## 7. FLUJOS DE NEGOCIO CRÍTICOS

### Flujo 1: Registro y verificación de email

```
[Visitante] → /register
      │
      ▼ Completa: nombre, apellido, país, email
      │
      ▼ [Validación frontend]
      │   ├─ Campos vacíos → errores inline
      │   └─ Email inválido → error inline
      │
      ▼ [authService.register()]
      │   ├─ Email ya registrado → alerta + sugerencia /login
      │   └─ Error genérico → snackbar error
      │
      ▼ Email enviado con código OTP
      │
      → /verify
           │
           ▼ Ingresa código de 6 dígitos
           │
           ▼ [authService.verifyEmail()]
               ├─ Código incorrecto → error inline + "Reenviar"
               ├─ Código expirado → error inline + "Reenviar"
               └─ Correcto → sesión activa → /dashboard
```

**Estados de UI:**
- Vacío: formulario en blanco, botón deshabilitado
- Cargando: botón con spinner, campos deshabilitados
- Error campos: mensajes inline bajo cada campo
- Error email duplicado: alerta con link a /login
- Éxito registro: redirect automático a /verify

### Flujo 2: Login con magic link

```
[Visitante] → /login
      │
      ▼ Ingresa email
      │
      ▼ [authService.requestMagicLink()]
      │   ├─ Email registrado → backend envía magic link
      │   ├─ Email no registrado → backend no envía email
      │   └─ UI siempre muestra "Revisá tu correo, si es un correo registrado habrás recibido un email. Revisá la carpeta spam" (RN-7)
      │
[Usuario abre email → clic en magic link]
      │
      ▼ Supabase valida token
          ├─ Expirado / ya usado → /login con mensaje de error
          └─ Válido → sesión activa → /dashboard
```

**Estados de UI:**
- Vacío: campo email
- Cargando: botón con spinner
- Enviado: pantalla "Revisá tu correo, si es un correo registrado habrás recibido un email. Revisá la carpeta spam" (independiente de si existe la cuenta)
- Error token: alerta "El enlace expiró o ya fue usado" + botón "Solicitar nuevo"

### Flujo 3: Crear viaje

```
[Dashboard] → FAB "Nuevo viaje" → /trips/new
      │
      ▼ Completa: nombre (obligatorio), destinos (1+, máximo 25)
      │
      ▼ [Validación]
      │   ├─ Nombre vacío → error inline
      │   ├─ Sin destinos → error inline
      │   └─ Más de 25 destinos → error inline
      │
      ▼ [tripsService.createViaje()]
          ├─ Error → snackbar
          └─ Éxito → /trips/:id (detalle del viaje nuevo, aún sin fechas derivadas hasta cargar ítems)
```

### Flujo 4: Agregar ítem de transporte

```
[TripDetail] → "Agregar" → selecciona "Transporte" → /trips/:id/transport/new
      │
      ▼ [Validación de viaje]
      │   └─ Si el viaje es pasado → no muestra acción de agregar y rechaza la ruta directa
      │
      ▼ Selecciona tipo (avión / tren / micro)
      │
      ▼ Completa campos obligatorios: origen, destino, fecha/hora salida, fecha/hora llegada
      │
      ▼ Completa campos opcionales: compañía, N° servicio, asiento
      │
      ▼ Completa DatosReserva: agencia (condicional), códigos, URL, comentarios
      │
      ▼ [Validación]
      │   ├─ Campos obligatorios vacíos → errores inline
      │   ├─ llegada < salida → error RN-5
      │   ├─ Fechas fuera de rango (hoy a hoy + 2 años) → error RN-11
      │   ├─ por_agencia = true sin nombre_agencia → error RN-4
      │   └─ URL inválida → error inline
      │
      ▼ [itemsService.createTransporte()]
          ├─ Error → snackbar
          └─ Éxito → recalcula fechas del viaje → /trips/:id con nuevo ítem en agenda ordenada cronológicamente
```

### Flujo 5: Eliminar un viaje

```
[TripCard] → menú "Eliminar"
      │
      ▼ [Validación de viaje]
      │   └─ Si el viaje es pasado → no muestra acción de eliminar y rechaza la operación
      │
      ▼ [TripDeleteDialog]
        "¿Eliminar '{nombre del viaje}'?
         Se eliminarán también todos sus ítems de transporte y hospedaje."
      │
      ├─ Cancelar → sin cambios
      │
      └─ Confirmar → [tripsService.deleteViaje(id)]
            ├─ Error → snackbar error
            └─ Éxito → viaje removido del listado (optimistic update) → /dashboard
```

---

## 8. SEGURIDAD Y PERMISOS

### Matriz de permisos

| Rol | Recurso | Operaciones permitidas |
|-----|---------|----------------------|
| Visitante | Rutas `/login`, `/register`, `/verify` | Acceso libre |
| Visitante | Cualquier ruta privada (`/dashboard`, `/trips/*`) | Redirigido a `/login` |
| Viajero | Sus propios viajes actuales/futuros | Leer, crear, editar, eliminar |
| Viajero | Sus propios viajes pasados | Leer únicamente |
| Viajero | Ítems de sus viajes actuales/futuros | Leer, crear, editar, eliminar |
| Viajero | Ítems de sus viajes pasados | Leer únicamente |
| Viajero | Viajes de otros usuarios | Sin acceso (bloqueado por RLS en BD) |

### Manejo de autenticación

- **JWT Tokens:** Supabase emite access token (corta duración) + refresh token. El cliente JS los gestiona automáticamente en `localStorage` y los renueva antes de expirar.
- **Row Level Security (RLS):** Políticas en cada tabla que restringen todas las operaciones al `auth.uid()` del token activo. Es la capa de seguridad real: el servidor rechaza cualquier operación cross-user aunque el cliente intente bypass.
- **`PrivateRoute`:** Capa de UX que verifica `AuthContext.user !== null`. No es seguridad real, pero previene renders de páginas privadas para usuarios no autenticados.
- **Magic link:** Single-use, TTL recomendado 1 hora. Supabase lo invalida automáticamente tras primer uso.
- **OTP de verificación:** 6 dígitos, TTL recomendado 15 minutos, reenvío disponible.

### Datos sensibles

| Dato | Tratamiento |
|------|-------------|
| Email del usuario | Almacenado en `auth.users` (gestionado por Supabase), cifrado en tránsito (HTTPS) |
| JWT tokens | En `localStorage`; riesgo XSS bajo con CSP configurado correctamente |
| Tokens de magic link | Single-use y TTL corto; Supabase no los expone al cliente |
| OTP de verificación | Generado y validado internamente por Supabase Auth |
| URLs de reservas | Texto plano; pueden contener tokens de terceros (advertir al usuario) |

---

## 9. PERFORMANCE Y ESCALABILIDAD

### Puntos de posible cuello de botella

1. **Carga del dashboard con muchos viajes:** Para usuarios con 50+ viajes, la query inicial puede ser lenta. Mitigación: ordenar por fecha decreciente + paginación por grupo (futuros first).
2. **Viaje con muchos ítems:** Un viaje muy denso (20+ ítems) podría ser lento de renderizar. Mitigación: virtualización de lista si supera 30 ítems.
3. **Clasificación en cliente (pasado/actual/futuro):** O(n) sobre el array de viajes con DayJS. Aceptable para MVP (esperado: < 100 viajes por usuario).
4. **Re-fetch en cada navegación:** Sin caché, cada visita al dashboard dispara una query. Mitigación: React Query o estado en `TripsContext` con invalidación selectiva.
5. **Destinos por viaje:** Sin límite funcional estricto, pero se restringe a 25 destinos por viaje como resguardo de performance y UX.

### Estrategias para el MVP

- **Fetch on navigation:** Cargar viajes al entrar al dashboard; cargar ítems al entrar al detalle del viaje. No pre-cargar todo al inicio.
- **Optimistic updates:** En create/edit/delete, actualizar el estado local en `TripsContext` antes de confirmar con Supabase para UX fluida sin spinners.
- **Supabase Realtime (opcional v2):** Si se agrega colaboración futura, el cliente ya soporta subscripciones en tiempo real.

### Estimación de volumen de datos (MVP)

| Entidad | Estimación por usuario | Total (1.000 usuarios) |
|---------|----------------------|----------------------|
| Viajes | 5–20 | 5.000–20.000 |
| Ítems transporte | 2–10 por viaje | 10.000–200.000 |
| Ítems hospedaje | 1–5 por viaje | 5.000–100.000 |

Volumen totalmente dentro del free tier de Supabase (500 MB base de datos).

---

## 10. ESTRATEGIA DE TESTING

### Tipos de tests recomendados

| Tipo | Herramienta | Foco |
|------|------------|------|
| Unitarios | Vitest | `tripClassifier`, `dateValidation`, `formatters`, lógica de negocio pura |
| Componentes | React Testing Library | Formularios (validación inline), TripCard, TripGroup, ConfirmDialog |
| Integración | RTL + MSW (mock Supabase) | Flujos de auth (register, verify, magic link), CRUD viajes |
| E2E | Playwright | Flujo completo: registro → verificar → crear viaje → agregar ítem → eliminar |

### Casos de prueba críticos (must have)

1. `tripClassifier`: viaje actual (hoy = fecha_inicio), viaje actual (hoy = fecha_fin), viaje sin ítems/fechas derivadas
2. `dateValidation`: rechazar fechas fuera del rango hoy a hoy + 2 años en ítems (RN-11), rechazar fin < inicio (RN-5)
3. `deriveTripDates`: recalcular fecha mínima y máxima del viaje al crear, editar o eliminar ítems
4. Viajes pasados: acciones de editar, eliminar y agregar ítems no visibles; rutas directas rechazadas
5. Agencia condicional: `nombre_agencia` requerido cuando `por_agencia = true` (RN-4)
6. Códigos de reserva: rechazar códigos de más de 10 caracteres
7. Restricciones de texto: rechazar campos obligatorios con solo espacios y textos que excedan sus máximos
8. Registro: nombre/apellido máximo 40 caracteres; email máximo 50 y formato válido
9. Registro con email duplicado: muestra mensaje correcto
10. Magic link expirado: redirige a login con mensaje
11. Login con email no registrado: no envía email y la UI muestra el mismo mensaje genérico
12. Eliminar viaje: dialog muestra advertencia de ítems asociados
13. Verificación OTP: código incorrecto muestra error + reenviar; código correcto redirige a dashboard
14. Formulario transporte: origen/destino obligatorios, fechas/horas obligatorias, hora formato HH:mm
15. Agenda del viaje: ítems ordenados cronológicamente como requisito Must

### Herramientas

```json
{
  "devDependencies": {
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@testing-library/user-event": "^14.x",
    "@playwright/test": "^1.x",
    "msw": "^2.x"
  }
}
```

---

## 11. DECISIONES DEL PO SOBRE PUNTOS ABIERTOS

**1. ¿Se pueden editar datos no-fecha en viajes/ítems pasados?**

No. Los viajes pasados son solo lectura.

- **Decisión:** No se puede editar, eliminar ni agregar ítems en viajes pasados.
- **Impacto técnico:** La UI debe ocultar acciones de modificación en viajes pasados y los servicios deben rechazar rutas directas u operaciones manuales sobre esos recursos.

---

**2. ¿Las fechas del viaje se derivan automáticamente de los ítems o el usuario las carga manualmente?**

Las fechas del viaje derivan automáticamente de sus ítems.

- **Decisión:** `fecha_inicio` se calcula con la fecha mínima de los ítems y `fecha_fin` con la fecha máxima.
- **Impacto técnico:** Se recalculan al crear, editar o eliminar ítems de transporte u hospedaje. El formulario de viaje no permite cargar fechas manuales en el MVP.

---

**3. ¿Cuál es el formato y límite de "códigos de reserva" (múltiples)?**

Para el MVP, los códigos de reserva son texto libre.

- **Decisión:** Cada código admite hasta 10 caracteres.
- **Impacto técnico:** Se valida longitud máxima de 10 caracteres por código. Se mantiene soporte para múltiples códigos mediante array de strings.

---

**4. ¿Qué sucede al solicitar magic link con email no registrado?**

La UI siempre debe mostrar el mismo mensaje.

- **Decisión:** Mostrar: "Revisá tu correo, si es un correo registrado habrás recibido un email. Revisá la carpeta spam".
- **Impacto técnico:** El backend no envía email si el correo no está registrado, pero la respuesta de la UI no revela existencia de cuenta.

---

**5. ¿La ordenación cronológica de la agenda del viaje es Must o Should?**

Es Must.

- **Decisión:** La agenda del viaje debe mostrarse ordenada cronológicamente en el MVP.
- **Impacto técnico:** `AgendaList` ordena transporte y hospedaje por fecha/hora de inicio antes del render.

---

**6. ¿Qué estado tiene un viaje sin fechas en la clasificación pasado/actual/futuro?**

Las fechas son obligatorias para cargar ítems y luego se derivan automáticamente en el viaje.

- **Decisión:** Todo ítem debe tener sus fechas obligatorias; un viaje obtiene sus fechas desde esos ítems.
- **Impacto técnico:** Un viaje recién creado sin ítems puede existir temporalmente sin fechas derivadas. Al cargar el primer ítem, el viaje queda clasificable como pasado/actual/futuro.

---

**7. ¿Existe un límite máximo de destinos por viaje?**

No hay límite funcional estricto, pero puede restringirse por performance.

- **Decisión:** Se restringe a 25 destinos por viaje como límite técnico/UX.
- **Impacto técnico:** `destinos` se mantiene como array de strings con texto libre y validación de máximo 25 elementos.

---

**8. ¿Qué restricciones generales aplican a los campos?**

Todos los campos deben tener restricciones explícitas.

- **Decisión:** Nombre y apellido admiten hasta 40 caracteres cada uno y no pueden contener solamente espacios. Email admite hasta 50 caracteres y debe validar formato. Las fechas de ítems deben estar entre hoy y dos años en el futuro. Los textos cortos del dominio admiten hasta 50 caracteres.
- **Impacto técnico:** Los formularios y servicios deben aplicar `trim()`, validar obligatoriedad real, formato, longitud y rango antes de guardar. Los comentarios y URLs tienen límites propios porque no son textos cortos de dominio.
