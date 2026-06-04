# Análisis Funcional – Cuadros de viaje

<aside>
🎯

**Propósito del documento:** definir el *qué* y el *por qué* de una aplicación web responsive (mobile-first) que permita a una persona llevar la agenda completa de sus viajes (transporte y hospedaje), con registro por email y login mediante *magic link*. No se incluyen definiciones técnicas de arquitectura o implementación (eso es decisión del equipo técnico).

</aside>

## 1. Contexto y problema

Las personas que viajan suelen tener la información de cada viaje **dispersa**: confirmaciones de vuelos en el mail, reservas de hotel en otra app, datos de Airbnb en mensajes, códigos de reserva en capturas de pantalla, etc. Esto genera fricción y estrés justo en los momentos en que se necesita la información a mano (en el aeropuerto, al llegar al alojamiento, ante un cambio de planes).

La aplicación de referencia, **TripCase** (de Sabre), resolvía esto dando *un único lugar para gestionar los viajes*: itinerarios con vuelos, hoteles y autos, datos de reserva y línea de tiempo del viaje. TripCase dejó de operar el 1 de abril de 2025, dejando a sus usuarios buscando alternativas.

> **Oportunidad:** ofrecer una herramienta simple, mobile-first, que centralice la agenda de un viaje y dé tranquilidad al viajero de tener todo en un solo lugar.
> 

## 2. Objetivo del producto

Permitir que una persona **organice y consulte la agenda de sus viajes** —transporte y hospedaje— de forma centralizada, clara y accesible desde el celular, agrupando los viajes según su momento (pasados, actuales y futuros).

### Objetivos del MVP

- Validar que la carga **manual** de un itinerario aporta valor suficiente para que la persona use la app como su "fuente única de verdad" del viaje.
- Validar el flujo de **alta de cuenta sin contraseña** (registro con confirmación de email + login con magic link) como experiencia de acceso de baja fricción.

## 3. Alcance

### Dentro del alcance (MVP)

- Registro de usuario con verificación de email mediante código.
- Login mediante magic link enviado al email registrado.
- Creación y gestión de **viajes**.
- Carga **manual** de ítems de **transporte** (avión, tren, micro).
- Carga **manual** de ítems de **hospedaje** (hotel, Airbnb, posada, etc.).
- Indicar si la reserva se hizo **por agencia** y cuál.
- Códigos de reserva y comentarios por ítem.
- Edición y eliminación de viajes e ítems.
- Agrupación de viajes en **pasados, actuales y futuros**.
- Experiencia **responsive, mobile-first**.

### Fuera del alcance (MVP) — *Won't have ahora*

- Importación automática de reservas (reenvío de mails / parsing de confirmaciones).
- Alertas en tiempo real de estado de vuelos, cambios de puerta o demoras.
- Compartir itinerario con terceros / seguidores.
- Integraciones con aerolíneas, GDS, hoteles o agencias.
- Renta de autos, actividades, vuelos con escalas como entidad propia, equipaje, gastos.
- App nativa iOS/Android (se aborda como web responsive).
- Notificaciones push y modo offline.

## 4. Usuarios y supuestos

**Usuario principal — El Viajero:** persona que organiza sus propios viajes (placer o trabajo), quiere tener todos los datos a mano desde el celular y registrar manualmente cada reserva.

Supuestos:

- En el MVP cada usuario gestiona **sus propios** viajes (sin colaboración ni viajes compartidos).
- La carga es manual; la calidad del dato depende del usuario.
- Se asume un único idioma y una moneda no relevante para el MVP (no se gestionan pagos).

## 5. Mapa funcional (épicas)

| # | Épica | Descripción | Prioridad (MoSCoW) |
| --- | --- | --- | --- |
| E1 | Acceso sin contraseña | Registro con verificación de email + login con magic link | Must |
| E2 | Gestión de viajes | Crear, editar, ver y agrupar viajes (pasados/actuales/futuros) | Must |
| E3 | Transporte | Cargar y gestionar tramos de avión, tren y micro | Must |
| E4 | Hospedaje | Cargar y gestionar alojamientos | Must |
| E5 | Datos de reserva | Agencia, códigos de reserva y comentarios por ítem | Must |
| E6 | Experiencia mobile-first | Diseño responsive priorizando el uso en celular | Must |

## 6. Modelo de información (qué datos maneja el producto)

> Descripción funcional de las entidades y sus datos. No representa un modelo técnico de base de datos.
> 

### 6.1 Usuario

- Nombre
- Apellido
- País
- Email (único, verificado)
- Estado del email (pendiente de verificación / verificado)
- Fecha de alta

### 6.2 Viaje

- Nombre del viaje (ej.: "Vacaciones Bariloche")
- Destinos (uno o varios; un viaje puede incluir múltiples destinos)
- Fecha de inicio y fecha de fin (se pueden derivar de los ítems o cargarse)
- Estado calculado: **pasado / actual / futuro**
- Ítems asociados (transporte y hospedaje)

### 6.3 Ítem de Transporte

| Dato | Avión | Tren | Micro |
| --- | --- | --- | --- |
| Tipo de transporte | ✔ | ✔ | ✔ |
| Compañía / operador | Aerolínea | Empresa ferroviaria | Empresa de micros |
| Origen | Aeropuerto/ciudad | Estación/ciudad | Terminal/ciudad |
| Destino | Aeropuerto/ciudad | Estación/ciudad | Terminal/ciudad |
| Fecha y hora de salida | ✔ | ✔ | ✔ |
| Fecha y hora de llegada | ✔ | ✔ | ✔ |
| Identificador del servicio | N° de vuelo | N° de tren | N° de servicio |
| Número de reserva | ✔ | ✔ | ✔ |
| Asiento / butaca (opcional) | ✔ | ✔ | ✔ |

Datos comunes a todo ítem: reservado por agencia (sí/no + cuál), código(s) de reserva, URL de la página de la reserva, comentarios.

> **Horarios:** las fechas y horas de salida y llegada se registran y muestran en **horario local** del lugar correspondiente (sin conversión entre zonas horarias).
> 

### 6.4 Ítem de Hospedaje

- Tipo (Hotel, Airbnb, Posada, Hostel, Casa de familia, Otro)
- Nombre del alojamiento
- Fecha de inicio (check-in) y fecha de fin (check-out)
- Dirección
- Teléfono *(cuando exista)*
- Email *(cuando exista)*
- Número de reserva
- Datos comunes: reservado por agencia (sí/no + cuál), código(s) de reserva, URL de la página de la reserva, comentarios.

### 6.5 Datos comunes de reserva (transporte y hospedaje)

- ¿Reservado por agencia? (Sí / No)
- Nombre de la agencia (obligatorio sólo si "Sí")
- Código(s) de reserva
- URL de la página de la reserva (enlace a la confirmación/booking; opcional)
- Comentarios / notas libres

## 7. Historias de usuario y criterios de aceptación

### E1 — Acceso sin contraseña

**HU-1 — Registro con verificación de email**

> *Como* persona que quiere usar la app, *quiero* registrarme indicando mi email y confirmarlo con un código que recibo por correo, *para* asegurar que mi cuenta queda asociada a un email válido y propio.
> 

Criterios de aceptación:

- La pantalla de registro solicita **Nombre, Apellido, País y Email**.
- Nombre, Apellido, País y Email son obligatorios.
- Al enviar el registro, el sistema envía un email con un código de verificación.
- La persona debe ingresar el código para activar la cuenta.
- El código tiene una vigencia limitada y puede reenviarse.
- No se permite operar con la cuenta hasta que el email esté verificado.

```gherkin
Funcionalidad: Registro con verificación de email

  Escenario: Registro exitoso con código válido
    Dado que soy una persona no registrada
    Cuando completo nombre, apellido, país y un email válido en la pantalla de registro
    Y confirmo el registro
    Entonces el sistema me envía un email con un código de verificación
    Y se me solicita ingresar dicho código

  Escenario: Confirmación del email con el código correcto
    Dado que recibí un código de verificación en mi email
    Cuando ingreso el código correcto antes de que expire
    Entonces mi cuenta queda verificada
    Y puedo acceder a la aplicación

  Escenario: Código incorrecto o expirado
    Dado que recibí un código de verificación
    Cuando ingreso un código incorrecto o ya expirado
    Entonces el sistema muestra un mensaje de error
    Y me ofrece reenviar un nuevo código

  Escenario: Email ya registrado
    Dado que ya existe una cuenta con el email ingresado
    Cuando intento registrarme nuevamente con ese email
    Entonces el sistema me informa que el email ya está registrado
    Y me sugiere iniciar sesión

  Escenario: Faltan datos obligatorios del registro
    Dado que estoy en la pantalla de registro
    Cuando intento registrarme sin completar nombre, apellido o país
    Entonces el sistema impide continuar
    Y me indica qué datos faltan
```

**HU-2 — Login con magic link**

> *Como* usuario registrado, *quiero* iniciar sesión recibiendo un enlace mágico en mi email, *para* ingresar de forma rápida y segura sin recordar una contraseña.
> 

Criterios de aceptación:

- La pantalla de login solicita únicamente el email.
- Si el email corresponde a una cuenta verificada, el sistema envía un magic link.
- Al abrir el magic link, la persona queda autenticada.
- El magic link tiene vigencia limitada y es de un solo uso.
- Por seguridad, ante un email no registrado el sistema no revela si la cuenta existe o no.

```gherkin
Funcionalidad: Inicio de sesión con magic link

  Escenario: Solicitud de magic link con email registrado
    Dado que soy un usuario registrado y verificado
    Cuando ingreso mi email en la pantalla de login
    Entonces el sistema me envía un enlace de acceso a mi email
    Y me indica que revise mi correo

  Escenario: Acceso mediante el magic link
    Dado que recibí un magic link vigente
    Cuando abro el enlace
    Entonces ingreso a la aplicación autenticado

  Escenario: Magic link expirado o ya utilizado
    Dado que recibí un magic link
    Cuando intento usarlo luego de expirado o por segunda vez
    Entonces el sistema no me autentica
    Y me ofrece solicitar un nuevo enlace
```

### E2 — Gestión de viajes

**HU-3 — Crear un viaje**

> *Como* viajero, *quiero* crear un viaje con un nombre, sus destinos y fechas, *para* tener un contenedor donde organizar todos sus ítems.
> 

Criterios de aceptación:

- Se puede crear un viaje indicando al menos un nombre.
- Se pueden indicar **uno o varios destinos** para el viaje.
- Las fechas de inicio/fin pueden cargarse o derivarse de los ítems incluidos.
- El viaje queda visible en el listado del usuario.

**HU-4 — Agrupar viajes en pasados, actuales y futuros**

> *Como* viajero, *quiero* ver mis viajes agrupados según su momento, *para* encontrar rápidamente el viaje que estoy haciendo o el próximo.
> 

Criterios de aceptación:

- El sistema clasifica cada viaje como **futuro**, **actual** o **pasado** según sus fechas y la fecha actual.
- **Actual:** la fecha de hoy está entre el inicio y el fin del viaje.
- **Futuro:** el inicio del viaje es posterior a hoy.
- **Pasado:** el fin del viaje es anterior a hoy.
- El viaje actual / próximo es el más visible al ingresar.

```gherkin
Funcionalidad: Agrupación de viajes por momento

  Escenario: Clasificación de un viaje en curso
    Dado un viaje cuya fecha de inicio es anterior o igual a hoy
    Y cuya fecha de fin es posterior o igual a hoy
    Cuando consulto mi listado de viajes
    Entonces el viaje aparece en el grupo "Actuales"

  Escenario: Clasificación de un viaje próximo
    Dado un viaje cuya fecha de inicio es posterior a hoy
    Cuando consulto mi listado de viajes
    Entonces el viaje aparece en el grupo "Futuros"

  Escenario: Clasificación de un viaje finalizado
    Dado un viaje cuya fecha de fin es anterior a hoy
    Cuando consulto mi listado de viajes
    Entonces el viaje aparece en el grupo "Pasados"
```

**HU-9 — Editar y eliminar viajes e ítems**

> *Como* viajero, *quiero* poder editar y eliminar mis viajes y sus ítems, *para* mantener mi agenda actualizada cuando algo cambia o lo cargué con un error.
> 

Criterios de aceptación:

- Puedo editar los datos de un viaje y de cualquier ítem (transporte u hospedaje).
- **No se pueden editar fechas que ya pasaron:** solo se admiten fechas presentes o futuras; las fechas anteriores a hoy quedan bloqueadas para edición.
- Puedo eliminar un ítem de un viaje.
- Puedo eliminar un viaje completo; el sistema pide confirmación e informa que se eliminarán también sus ítems.
- Las ediciones se reflejan inmediatamente en la agenda del viaje y, si corresponde, recalculan su clasificación (pasado/actual/futuro).

```gherkin
Funcionalidad: Edición y eliminación de viajes e ítems

  Escenario: Edición de un ítem
    Dado que tengo un ítem cargado en un viaje
    Cuando edito uno o más de sus datos y guardo
    Entonces los cambios quedan reflejados en el detalle y en la agenda

  Escenario: Eliminación de un ítem
    Dado que tengo un ítem cargado en un viaje
    Cuando elijo eliminarlo y confirmo la acción
    Entonces el ítem deja de aparecer en el viaje

  Escenario: Eliminación de un viaje completo
    Dado que tengo un viaje con uno o más ítems
    Cuando elijo eliminar el viaje
    Entonces el sistema me pide confirmación e indica que se eliminarán sus ítems
    Y al confirmar, el viaje y sus ítems dejan de aparecer en mi listado

  Escenario: Intento de registrar una fecha en el pasado
    Dado que estoy editando las fechas de un viaje o de un ítem
    Cuando ingreso una fecha anterior a hoy
    Entonces el sistema no permite guardar esa fecha
    Y me indica que solo se admiten fechas presentes o futuras
```

### E3 — Transporte

**HU-5 — Agregar un tramo de transporte**

> *Como* viajero, *quiero* agregar un tramo de transporte (avión, tren o micro) con todos sus datos, *para* tener a mano origen, destino, horarios y reserva.
> 

Criterios de aceptación:

- Se puede elegir el tipo de transporte: avión, tren o micro.
- Se cargan, como mínimo: origen, destino, fecha y hora de salida y de llegada (en **horario local** de cada punto).
- Se puede registrar el número de reserva, la compañía y el identificador del servicio (vuelo/tren/servicio).
- Se pueden registrar datos comunes: agencia, código(s) de reserva y comentarios.
- El tramo queda asociado al viaje y ordenado cronológicamente en la agenda.

```gherkin
Funcionalidad: Carga de un tramo de transporte

  Escenario: Alta de un vuelo con datos mínimos
    Dado que estoy dentro de un viaje
    Cuando agrego un transporte de tipo "Avión"
    Y completo origen, destino, fecha y hora de salida y de llegada
    Entonces el tramo se guarda y aparece en la agenda del viaje
    Y se ubica según su fecha y hora de salida

  Escenario: Falta un dato obligatorio
    Dado que estoy cargando un tramo de transporte
    Cuando intento guardarlo sin completar el origen o el destino
    Entonces el sistema impide guardar
    Y me indica qué datos faltan
```

### E4 — Hospedaje

**HU-6 — Agregar un hospedaje**

> *Como* viajero, *quiero* agregar un alojamiento con sus fechas y datos de contacto, *para* saber dónde me hospedo y cómo contactarlo.
> 

Criterios de aceptación:

- Se puede elegir el tipo de hospedaje (Hotel, Airbnb, Posada, etc.).
- Se cargan, como mínimo: nombre del alojamiento, fecha de inicio (check-in) y fecha de fin (check-out).
- Se pueden cargar dirección, teléfono y email **cuando existan** (opcionales).
- Se pueden registrar datos comunes: agencia, código(s) de reserva y comentarios.
- El hospedaje queda asociado al viaje y ordenado cronológicamente.

```gherkin
Funcionalidad: Carga de un hospedaje

  Escenario: Alta de un hotel con datos mínimos
    Dado que estoy dentro de un viaje
    Cuando agrego un hospedaje de tipo "Hotel"
    Y completo el nombre, la fecha de inicio y la fecha de fin
    Entonces el hospedaje se guarda y aparece en la agenda del viaje

  Escenario: Datos de contacto opcionales
    Dado que estoy cargando un hospedaje
    Cuando no cuento con el teléfono ni el email del alojamiento
    Entonces puedo guardar el hospedaje igualmente
    Y esos campos quedan vacíos

  Escenario: Fechas inconsistentes
    Dado que estoy cargando un hospedaje
    Cuando la fecha de fin es anterior a la fecha de inicio
    Entonces el sistema impide guardar
    Y me solicita corregir las fechas
```

### E5 — Datos de reserva (agencia, códigos y comentarios)

**HU-7 — Indicar reserva por agencia, códigos y comentarios**

> *Como* viajero, *quiero* indicar si reservé por agencia y cuál, y agregar códigos de reserva y comentarios, *para* tener trazabilidad y notas útiles de cada reserva.
> 

Criterios de aceptación:

- En cualquier ítem (transporte u hospedaje) puedo indicar si fue reservado por agencia (Sí/No).
- Si indico "Sí", el nombre de la agencia es obligatorio.
- Puedo registrar uno o más códigos de reserva.
- Puedo registrar la URL de la página de la reserva (enlace a la confirmación/booking) y acceder a ella desde el detalle del ítem.
- Puedo agregar comentarios libres.

```gherkin
Funcionalidad: Datos de reserva por ítem

  Escenario: Reserva realizada por agencia
    Dado que estoy cargando un ítem de transporte u hospedaje
    Cuando indico que fue reservado por agencia
    Entonces el sistema me exige indicar el nombre de la agencia

  Escenario: Reserva directa sin agencia
    Dado que estoy cargando un ítem
    Cuando indico que NO fue reservado por agencia
    Entonces el campo de nombre de agencia no es requerido

  Escenario: Comentarios, códigos y URL opcionales
    Dado que estoy cargando un ítem
    Cuando agrego un código de reserva, una URL de la reserva y un comentario
    Entonces todos quedan asociados y visibles en el detalle del ítem
    Y la URL se puede abrir como un enlace
```

### E6 — Experiencia mobile-first

**HU-8 — Uso desde el celular (responsive)**

> *Como* viajero, *quiero* usar la aplicación cómodamente desde el celular, *para* consultar y cargar datos mientras estoy en movimiento.
> 

Criterios de aceptación:

- El diseño prioriza la pantalla del celular (mobile-first) y se adapta a tablet/desktop.
- Las acciones principales (ver viaje actual, agregar ítem) son accesibles con pocos toques.
- La información clave de cada ítem (horarios, dirección, código de reserva) se lee sin necesidad de hacer zoom.

## 8. Reglas de negocio

1. **RN-1 — Email único y verificado:** no puede existir más de una cuenta activa con el mismo email; sólo se opera con email verificado.
2. **RN-2 — Acceso sin contraseña:** el acceso se realiza siempre por código de verificación (registro) y magic link (login). El MVP no maneja contraseñas.
3. **RN-3 — Vigencia de códigos y enlaces:** tanto el código de verificación como el magic link tienen vigencia limitada; el magic link es de un solo uso.
4. **RN-4 — Agencia obligatoria condicional:** si un ítem se marca como reservado por agencia, el nombre de la agencia es obligatorio.
5. **RN-5 — Coherencia de fechas:** la fecha/hora de fin (o llegada/check-out) no puede ser anterior a la de inicio (o salida/check-in).
6. **RN-6 — Clasificación automática de viajes:** el estado pasado/actual/futuro se calcula a partir de las fechas del viaje y la fecha actual; no se edita manualmente.
7. **RN-7 — Privacidad de cuenta:** ante solicitudes de login con emails inexistentes, el sistema no revela si la cuenta existe.
8. **RN-8 — Horarios en hora local:** las fechas y horas de transporte se registran y muestran en el horario local del lugar correspondiente; el MVP no realiza conversión entre zonas horarias.
9. **RN-9 — Edición y borrado:** el usuario puede editar y eliminar sus viajes e ítems; eliminar un viaje elimina también sus ítems asociados, con confirmación previa.
10. **RN-10 — Datos obligatorios de registro:** Nombre, Apellido, País y Email son obligatorios para crear la cuenta.
11. **RN-11 — No edición de fechas pasadas:** al editar un viaje o un ítem no se admiten fechas anteriores a la fecha actual; solo pueden registrarse fechas presentes o futuras.

## 9. Priorización (MoSCoW) del MVP

| Prioridad | Funcionalidad |
| --- | --- |
| **Must** | Registro con verificación de email · Login con magic link · Crear viaje (con múltiples destinos) · Cargar transporte · Cargar hospedaje · Agencia/códigos/comentarios · Editar y eliminar viajes e ítems · Agrupación pasados/actuales/futuros · Responsive mobile-first |
| **Should** | Ordenar la agenda del viaje por fecha/hora · Buscar viajes por nombre |
| **Could** | Adjuntar archivos/imágenes a un ítem · Duplicar un viaje · Vista de "línea de tiempo" del viaje |
| **Won't (ahora)** | Importación automática de reservas · Alertas de estado de vuelo · Compartir itinerario · Integraciones con proveedores · App nativa · Notificaciones push · Modo offline |

## 10. Métricas de éxito sugeridas

- % de usuarios que verifican su email tras registrarse (activación).
- % de logins exitosos vía magic link (fricción de acceso).
- N° de viajes y de ítems cargados por usuario activo (adopción del valor central).
- Retención: usuarios que vuelven a cargar/consultar un viaje en los 30 días siguientes.

## 11. Decisiones tomadas

- **Editar y eliminar:** el MVP permite **editar y eliminar** tanto viajes como ítems; al editar fechas **no se admiten fechas pasadas** (solo presentes o futuras) (ver HU-9 y RN-11).
- **Datos de registro:** el alta solicita **Nombre, Apellido, País y Email** (ver HU-1).
- **Destinos:** un viaje admite **múltiples destinos** (ver HU-3).
- **Zonas horarias:** los horarios de transporte se registran y muestran en **horario local** del lugar correspondiente, sin conversión entre zonas (ver RN-8).