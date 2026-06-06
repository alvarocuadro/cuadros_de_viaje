# cuadros_de_viaje

Esta es una aplicación familiar no comercial, para viudas de Trip Case que no encontramos dónde cargar los datos de nuestros viajes.
Fue hecha con vibe coding con Claude y Codex
Todo lo necesario para deployarlo está en /docs/README.md
Validar .env.local.example para las variables de entorno locales y las cuentas externas necesarias.

## Consulta de vuelos

La carga de transporte puede completar un vuelo por número y fecha mediante
AeroDataBox. La clave de RapidAPI se usa exclusivamente desde la Supabase Edge
Function `flight-lookup`, para que nunca quede expuesta en el navegador.

Configurar los secretos y desplegar la función:

```powershell
supabase secrets set --env-file .env.local
supabase functions deploy flight-lookup
```

La suscripción de RapidAPI debe tener habilitado el endpoint **Flight status
(specific date) / TIER 2**.

## Autenticación

En Supabase, configurar en **Authentication → URL Configuration**:

- `Site URL`: la URL pública de la aplicación.
- `Redirect URLs`: la URL pública seguida de `/dashboard` y, para desarrollo,
  `http://localhost:5173/dashboard`.

Firefox puede mostrar un aviso indicando que el dominio de Supabase fue
clasificado como *bounce tracker* al abrir un magic link. Es un aviso de
privacidad del navegador por la redirección intermedia y no un error de la
aplicación.
