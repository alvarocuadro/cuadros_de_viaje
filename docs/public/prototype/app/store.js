/* Cuadros de viaje — data model, seed, date utils, status logic, validation.
   Plain JS. Exposes window.CV (no JSX). Deterministic "hoy" so the
   automatic trip classification is stable and demonstrable. */
(function () {
  "use strict";

  // Fixed demo "today" — keeps futuro/actual/pasado stable across runs.
  const NOW = new Date("2026-06-04T10:20:00");
  const TODAY_ISO = "2026-06-04";

  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // ---- date helpers (treat ISO yyyy-mm-dd as local, no TZ math) ----
  function parse(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function dayDiff(aIso, bIso) {
    // whole days from a to b (b - a)
    const a = parse(aIso), b = parse(bIso);
    return Math.round((b - a) / 86400000);
  }
  function fmtDay(iso) {
    // "Mié 4 jun"
    const d = parse(iso);
    if (!d) return "—";
    return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
  }
  function fmtRange(startIso, endIso) {
    const a = parse(startIso), b = parse(endIso);
    if (!a || !b) return "—";
    const sameYear = a.getFullYear() === b.getFullYear();
    const sameMonth = sameYear && a.getMonth() === b.getMonth();
    if (sameMonth) return `${a.getDate()} – ${b.getDate()} ${MESES[b.getMonth()]} ${b.getFullYear()}`;
    if (sameYear) return `${a.getDate()} ${MESES[a.getMonth()]} – ${b.getDate()} ${MESES[b.getMonth()]} ${b.getFullYear()}`;
    return `${a.getDate()} ${MESES[a.getMonth()]} ${a.getFullYear()} – ${b.getDate()} ${MESES[b.getMonth()]} ${b.getFullYear()}`;
  }
  function nights(aIso, bIso) {
    return Math.max(0, dayDiff(aIso, bIso));
  }

  // ---- automatic status (vs NOW, not editable) ----
  function statusOf(trip) {
    const start = parse(trip.start), end = parse(trip.end);
    if (!start || !end) return "futuro";
    const endOfDay = new Date(end); endOfDay.setHours(23, 59, 59);
    if (NOW < start) return "futuro";
    if (NOW > endOfDay) return "pasado";
    return "actual";
  }
  function statusLabel(trip) {
    const s = statusOf(trip);
    if (s === "pasado") return "Finalizado";
    if (s === "actual") {
      const total = dayDiff(trip.start, trip.end) + 1;
      const cur = dayDiff(trip.start, TODAY_ISO) + 1;
      return `En curso · día ${cur} de ${total}`;
    }
    const d = dayDiff(TODAY_ISO, trip.start);
    if (d === 0) return "Empieza hoy";
    if (d === 1) return "Falta 1 día";
    return `Faltan ${d} días`;
  }
  function shortStatusLabel(trip) {
    const s = statusOf(trip);
    if (s === "pasado") return "Finalizado";
    if (s === "actual") return "En curso";
    const d = dayDiff(TODAY_ISO, trip.start);
    if (d === 0) return "Hoy";
    if (d === 1) return "Mañana";
    return `Faltan ${d}`;
  }

  // chronological key for an item ("YYYY-MM-DDTHH:MM")
  function itemStart(it) {
    if (it.kind === "transport") return `${it.depart.date}T${it.depart.time || "00:00"}`;
    return `${it.checkin.date}T${it.checkin.time || "00:00"}`;
  }
  function sortItems(items) {
    return [...items].sort((a, b) => (itemStart(a) < itemStart(b) ? -1 : 1));
  }

  // ---- validation ----
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function isPast(iso) { return iso && dayDiff(TODAY_ISO, iso) < 0; }

  function validateTrip(v) {
    const e = {};
    if (!v.name || !v.name.trim()) e.name = "Poné un nombre para el viaje.";
    if (!v.destinations || v.destinations.length === 0) e.destinations = "Agregá al menos un destino.";
    if (!v.start) e.start = "Elegí la fecha de inicio.";
    if (!v.end) e.end = "Elegí la fecha de fin.";
    if (v.start && isPast(v.start)) e.start = "No se admiten fechas pasadas.";
    if (v.end && isPast(v.end)) e.end = "No se admiten fechas pasadas.";
    if (v.start && v.end && dayDiff(v.start, v.end) < 0) e.end = "El fin no puede ser anterior al inicio.";
    return e;
  }
  function validateReservation(r) {
    const e = {};
    if (r && r.byAgency && !(r.agencyName || "").trim()) e.agencyName = "Indicá el nombre de la agencia.";
    return e;
  }
  function validateTransport(v) {
    const e = {};
    if (!v.carrier || !v.carrier.trim()) e.carrier = "Indicá la compañía u operador.";
    if (!v.origin || !v.origin.place.trim()) e.origin = "Indicá el origen.";
    if (!v.destination || !v.destination.place.trim()) e.destination = "Indicá el destino.";
    if (!v.depart.date) e.departDate = "Falta la fecha de salida.";
    if (!v.arrive.date) e.arriveDate = "Falta la fecha de llegada.";
    if (v.depart.date && v.arrive.date) {
      const a = `${v.depart.date}T${v.depart.time || "00:00"}`;
      const b = `${v.arrive.date}T${v.arrive.time || "00:00"}`;
      if (b < a) e.arriveDate = "La llegada no puede ser anterior a la salida.";
    }
    Object.assign(e, validateReservation(v.reservation));
    return e;
  }
  function validateLodging(v) {
    const e = {};
    if (!v.name || !v.name.trim()) e.name = "Indicá el nombre del alojamiento.";
    if (!v.checkin.date) e.checkinDate = "Falta el check-in.";
    if (!v.checkout.date) e.checkoutDate = "Falta el check-out.";
    if (v.checkin.date && v.checkout.date) {
      const a = `${v.checkin.date}T${v.checkin.time || "00:00"}`;
      const b = `${v.checkout.date}T${v.checkout.time || "00:00"}`;
      if (b < a) e.checkoutDate = "El check-out no puede ser anterior al check-in.";
    }
    if (v.email && !emailRe.test(v.email)) e.email = "Revisá el correo.";
    Object.assign(e, validateReservation(v.reservation));
    return e;
  }

  function uid(p) { return (p || "id") + "-" + Math.random().toString(36).slice(2, 8); }

  function emptyReservation() {
    return { byAgency: false, agencyName: "", codes: [""], url: "", comments: "" };
  }
  function newTransport() {
    return {
      id: uid("t"), kind: "transport", sub: "plane", carrier: "",
      origin: { place: "", code: "" }, destination: { place: "", code: "" },
      depart: { date: "", time: "" }, arrive: { date: "", time: "" },
      service: "", seat: "", reservation: emptyReservation(),
    };
  }
  function newLodging() {
    return {
      id: uid("l"), kind: "lodging", sub: "hotel", name: "",
      checkin: { date: "", time: "15:00" }, checkout: { date: "", time: "11:00" },
      address: "", phone: "", email: "", reservation: emptyReservation(),
    };
  }

  // ---- seed data (around NOW = 2026-06-04) ----
  function seedTrips() {
    return [
      {
        id: "europa",
        name: "Europa de junio",
        destinations: ["Madrid", "Lisboa", "Roma"],
        start: "2026-05-30", end: "2026-06-12",
        items: [
          {
            id: "ar1430", kind: "transport", sub: "plane", carrier: "Aerolíneas Argentinas",
            origin: { place: "Buenos Aires", code: "EZE" }, destination: { place: "Madrid", code: "MAD" },
            depart: { date: "2026-05-30", time: "14:35" }, arrive: { date: "2026-05-31", time: "06:05" },
            service: "AR1430", seat: "23A",
            reservation: { byAgency: false, agencyName: "", codes: ["4XT9K2"], url: "https://aerolineas.com.ar/reserva/4XT9K2", comments: "Equipaje 23kg incluido." },
          },
          {
            id: "riu", kind: "lodging", sub: "hotel", name: "Hotel Riu Plaza España",
            checkin: { date: "2026-05-31", time: "15:00" }, checkout: { date: "2026-06-03", time: "11:00" },
            address: "Gran Vía 84, Madrid", phone: "+34 911 23 45 67", email: "",
            reservation: { byAgency: true, agencyName: "Despegar", codes: ["HX-92K4"], url: "https://booking.com/riu-plaza", comments: "" },
          },
          {
            id: "train-lis", kind: "transport", sub: "train", carrier: "Renfe",
            origin: { place: "Madrid", code: "Atocha" }, destination: { place: "Lisboa", code: "Oriente" },
            depart: { date: "2026-06-03", time: "09:30" }, arrive: { date: "2026-06-03", time: "19:42" },
            service: "IB-208", seat: "Coche 4 · 12D",
            reservation: { byAgency: false, agencyName: "", codes: ["RN77820"], url: "", comments: "" },
          },
          {
            id: "airbnb-lis", kind: "lodging", sub: "airbnb", name: "Apartamento en Alfama",
            checkin: { date: "2026-06-03", time: "18:00" }, checkout: { date: "2026-06-07", time: "10:00" },
            address: "Rua dos Remédios 12, Lisboa", phone: "", email: "host.alfama@email.pt",
            reservation: { byAgency: false, agencyName: "", codes: ["ABNB-5521"], url: "https://airbnb.com/h/alfama", comments: "Las llaves están en la caja de seguridad, código 4490." },
          },
        ],
      },
      {
        id: "bariloche",
        name: "Bariloche finde",
        destinations: ["Bariloche"],
        start: "2026-07-10", end: "2026-07-13",
        items: [
          {
            id: "bus-bar", kind: "transport", sub: "bus", carrier: "Vía Bariloche",
            origin: { place: "Buenos Aires", code: "Retiro" }, destination: { place: "Bariloche", code: "Terminal" },
            depart: { date: "2026-07-10", time: "12:00" }, arrive: { date: "2026-07-11", time: "08:30" },
            service: "VB-90", seat: "Cama 7",
            reservation: { byAgency: false, agencyName: "", codes: ["VB30021"], url: "", comments: "" },
          },
          {
            id: "posada-bar", kind: "lodging", sub: "posada", name: "Posada del Lago",
            checkin: { date: "2026-07-11", time: "14:00" }, checkout: { date: "2026-07-13", time: "10:00" },
            address: "Av. Bustillo km 8.5, Bariloche", phone: "+54 294 444 1122", email: "reservas@posadalago.com",
            reservation: { byAgency: false, agencyName: "", codes: ["PL-2024"], url: "", comments: "" },
          },
        ],
      },
      {
        id: "japon",
        name: "Japón en primavera",
        destinations: ["Tokio", "Kioto", "Osaka"],
        start: "2026-10-02", end: "2026-10-18",
        items: [
          {
            id: "nh880", kind: "transport", sub: "plane", carrier: "ANA",
            origin: { place: "Buenos Aires", code: "EZE" }, destination: { place: "Tokio", code: "HND" },
            depart: { date: "2026-10-02", time: "23:50" }, arrive: { date: "2026-10-04", time: "06:30" },
            service: "NH880", seat: "",
            reservation: { byAgency: true, agencyName: "Almundo", codes: ["JP-7781", "JP-7782"], url: "", comments: "Escala en Houston, 2h." },
          },
        ],
      },
      {
        id: "ny",
        name: "Nueva York 2025",
        destinations: ["Nueva York"],
        start: "2025-12-18", end: "2025-12-27",
        items: [
          {
            id: "aa950", kind: "transport", sub: "plane", carrier: "American Airlines",
            origin: { place: "Buenos Aires", code: "EZE" }, destination: { place: "Nueva York", code: "JFK" },
            depart: { date: "2025-12-18", time: "22:10" }, arrive: { date: "2025-12-19", time: "07:45" },
            service: "AA950", seat: "31C",
            reservation: { byAgency: false, agencyName: "", codes: ["JKL902"], url: "", comments: "" },
          },
          {
            id: "marriott", kind: "lodging", sub: "hotel", name: "Marriott Times Square",
            checkin: { date: "2025-12-19", time: "15:00" }, checkout: { date: "2025-12-27", time: "11:00" },
            address: "1535 Broadway, New York", phone: "+1 212 398 1900", email: "",
            reservation: { byAgency: false, agencyName: "", codes: ["MR-55120"], url: "", comments: "" },
          },
        ],
      },
    ];
  }

  const COUNTRIES = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba",
    "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", "Honduras",
    "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Portugal", "Puerto Rico",
    "República Dominicana", "Uruguay", "Venezuela",
  ];

  const SUBS = {
    transport: [
      { id: "plane", icon: "plane", label: "Avión" },
      { id: "train", icon: "train-front", label: "Tren" },
      { id: "bus", icon: "bus", label: "Micro" },
    ],
    lodging: [
      { id: "hotel", icon: "hotel", label: "Hotel" },
      { id: "airbnb", icon: "house", label: "Airbnb" },
      { id: "posada", icon: "bed-double", label: "Posada" },
      { id: "otro", icon: "bed", label: "Otro" },
    ],
  };
  const SUB_LABEL = {
    plane: "Avión", train: "Tren", bus: "Micro",
    hotel: "Hotel", airbnb: "Airbnb", posada: "Posada", otro: "Alojamiento",
  };

  window.CV = {
    NOW, TODAY_ISO, MESES, MESES_LARGO, DIAS, COUNTRIES, SUBS, SUB_LABEL,
    parse, dayDiff, fmtDay, fmtRange, nights,
    statusOf, statusLabel, shortStatusLabel, itemStart, sortItems,
    isPast, validateTrip, validateTransport, validateLodging, validateReservation,
    uid, emptyReservation, newTransport, newLodging, seedTrips,
    emailRe,
  };
})();
