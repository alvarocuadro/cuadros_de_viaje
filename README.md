# cuadros_de_viaje

Esta es una aplicación familiar no comercial, para viudas de TripCase que no encontramos dónde cargar los datos de nuestros viajes.
Fue hecha con vibe coding con Claude y Codex.
Todo lo necesario para desplegarla está en `/docs/README.md`.
Validar `.env.local.example` para las variables de entorno locales y las cuentas externas necesarias.

## Licencia

Copyright 2026 Álvaro Cuadro.

El código fuente se publica bajo la
[PolyForm Noncommercial License 1.0.0](LICENSE). Se permite usar, modificar,
clonar y redistribuir el software únicamente para fines no comerciales,
manteniendo los archivos `LICENSE` y `NOTICE`.

Esta licencia no convierte al proyecto en software de código abierto según la
definición de Open Source Initiative, debido a la restricción de uso comercial.
Para cualquier uso comercial se requiere una licencia separada otorgada por el
titular.

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
clasificado como _bounce tracker_ al abrir un magic link. Es un aviso de
privacidad del navegador por la redirección intermedia y no un error de la
aplicación.
