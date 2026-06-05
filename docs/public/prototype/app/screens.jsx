/* Cuadros de viaje — trip list, trip detail, item detail. window.* */

/* ---------- TRIPS LIST (Home) ---------- */
function TripsListScreen({ trips, user, variant, onOpenTrip, onCreate }) {
  if (trips.length === 0) {
    return (
      <div className="screen">
        <div className="pad pad-b">
          <Greeting user={user} />
          <div style={{ marginTop: 8 }}>
            <EmptyState
              icon="luggage" title="Todavía no tenés viajes"
              text="Creá tu primer viaje y empezá a sumar tus vuelos, trenes y alojamientos en un solo lugar."
              action={<Button icon="plus" onClick={onCreate} style={{ maxWidth: 240 }}>Crear viaje</Button>}
            />
          </div>
        </div>
      </div>
    );
  }

  const actual = trips.filter((t) => CV.statusOf(t) === "actual");
  const futuro = trips.filter((t) => CV.statusOf(t) === "futuro").sort((a, b) => (a.start < b.start ? -1 : 1));
  const pasado = trips.filter((t) => CV.statusOf(t) === "pasado").sort((a, b) => (a.start > b.start ? -1 : 1));
  const next = actual.length === 0 && futuro.length > 0 ? futuro[0] : null;

  return (
    <div className="screen">
      <div className="pad pad-b">
        <Greeting user={user} />

        {actual.length > 0 && (
          <>
            <SectionHeader title="Tu viaje actual" icon="circle-dot" />
            {actual.map((t) => (
              <TripCard key={t.id} trip={t} variant="hero" overline="Sucediendo ahora" onOpen={() => onOpenTrip(t.id)} />
            ))}
          </>
        )}

        {next && (
          <>
            <SectionHeader title="Tu próximo viaje" icon="arrow-up-right" />
            <TripCard trip={next} variant={variant} overline="Lo que se viene" onOpen={() => onOpenTrip(next.id)} />
          </>
        )}

        {futuro.length > (next ? 1 : 0) && (
          <>
            <div style={{ height: 8 }} />
            <SectionHeader title="Próximos viajes" count={(futuro.length - (next ? 1 : 0)) + " por venir"} />
            {futuro.slice(next ? 1 : 0).map((t) => (
              <TripCard key={t.id} trip={t} variant={variant} onOpen={() => onOpenTrip(t.id)} />
            ))}
          </>
        )}

        {pasado.length > 0 && (
          <>
            <div style={{ height: 8 }} />
            <SectionHeader title="Viajes pasados" count={pasado.length} />
            {pasado.map((t) => (
              <TripCard key={t.id} trip={t} variant={variant === "hero" ? "default" : variant} onOpen={() => onOpenTrip(t.id)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Greeting({ user }) {
  return (
    <div style={{ margin: "4px 2px 18px" }}>
      <div className="overline">Hola, {user.name}</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "4px 0 0" }}>Tus viajes</h1>
    </div>
  );
}

/* ---------- TRIP DETAIL (timeline) ---------- */
function TripDetailScreen({ trip, onOpenItem, onAdd, onEdit, onDelete }) {
  const m = tripMeta(trip);
  const past = m.status === "pasado";
  const [menu, setMenu] = React.useState(false);
  const items = CV.sortItems(trip.items);

  // group items by their start day
  const groups = [];
  items.forEach((it) => {
    const day = it.kind === "transport" ? it.depart.date : it.checkin.date;
    let g = groups.find((x) => x.day === day);
    if (!g) { g = { day, items: [] }; groups.push(g); }
    g.items.push(it);
  });

  return (
    <div className="screen" onClick={() => menu && setMenu(false)}>
      <div className="pad pad-b">
        <div className="row" style={{ justifyContent: "space-between", margin: "2px 2px 6px" }}>
          <StatusBadge status={m.status} label={m.label} />
          <span className="row gap8" style={{ fontSize: 12.5, color: "var(--fg3)" }}>
            <Icon name="calendar" size={14} color="var(--fg3)" /><span className="mono-num">{m.range}</span>
          </span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "0 2px 12px" }}>{trip.name}</h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "0 2px 20px" }}>
          {trip.destinations.map((d, i) => <Chip key={i} icon="map-pin">{d}</Chip>)}
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: 8 }}>
            <EmptyState
              icon="map-pinned" title="Este viaje está vacío"
              text="Todavía no agregaste nada a este viaje. Empezá por tu vuelo o tu alojamiento."
              action={!past && <Button icon="plus" onClick={onAdd} style={{ maxWidth: 220 }}>Agregar ítem</Button>}
            />
          </div>
        ) : (
          <>
            <SectionHeader title="Itinerario" count={items.length + (items.length === 1 ? " ítem" : " ítems")} />
            <div className="tl">
              {groups.map((g) => (
                <React.Fragment key={g.day}>
                  <div className="tl-day">{CV.fmtDay(g.day)}</div>
                  {g.items.map((it) => (
                    <ItemRow key={it.id} item={it} past={past} onOpen={() => onOpenItem(it.id)} />
                  ))}
                </React.Fragment>
              ))}
            </div>
            {!past && (
              <button className="btn btn-secondary" style={{ marginTop: 4 }} onClick={onAdd}>
                <Icon name="plus" size={18} />Agregar ítem a este viaje
              </button>
            )}
          </>
        )}

        {/* trip actions */}
        <div style={{ position: "relative", marginTop: 22 }}>
          <div className="row gap10">
            <Button variant="secondary" icon="pencil" onClick={onEdit} className="btn-sm">Editar viaje</Button>
            <button className="pillbtn danger" onClick={onDelete} style={{ flex: "none" }}>
              <Icon name="trash-2" size={16} />Eliminar
            </button>
          </div>
          {past && (
            <p className="muted" style={{ fontSize: 12, marginTop: 12, textAlign: "center" }}>
              Viaje finalizado · se conserva como archivo de tu itinerario.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- RESERVATION (display) ---------- */
function ReservationView({ r }) {
  if (!r) return null;
  const codes = (r.codes || []).filter(Boolean);
  return (
    <div className="card" style={{ padding: 16, marginTop: 14 }}>
      <div className="row gap8" style={{ marginBottom: 14 }}>
        <Icon name="ticket" size={17} color="var(--fg3)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg2)" }}>Datos de reserva</span>
      </div>
      {r.byAgency && (
        <div style={{ marginBottom: 14 }}>
          <LV label="Reservado por agencia" value={r.agencyName} />
        </div>
      )}
      <div className="overline" style={{ marginBottom: 7 }}>{codes.length > 1 ? "Códigos de reserva" : "Código de reserva"}</div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: codes.length ? 14 : 0 }}>
        {codes.length ? codes.map((c, i) => <Chip key={i} code>{c}</Chip>) : <span className="muted" style={{ fontSize: 14 }}>—</span>}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        <LV label="Página de la reserva" value={r.url} link={r.url ? "Abrir reserva" : null} />
        {r.comments && <LV label="Comentarios" value={r.comments} />}
      </div>
    </div>
  );
}

/* ---------- ITEM DETAIL ---------- */
function ItemDetailScreen({ item, onEdit, onDelete }) {
  const isT = item.kind === "transport";
  return (
    <div className="screen">
      <div className="pad pad-b">
        <div className="row gap12" style={{ margin: "4px 2px 18px" }}>
          <span className={"typeic" + (item.kind === "lodging" ? " lodging" : "")} style={{ width: 48, height: 48 }}>
            <Icon name={ICON_FOR[item.sub]} size={26} />
          </span>
          <div className="grow">
            <h1 className="nowrap" style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.01em", color: "var(--fg1)", margin: 0, lineHeight: 1.2 }}>
              {isT ? `${item.origin.place} → ${item.destination.place}` : item.name}
            </h1>
            <div style={{ fontSize: 13, color: "var(--fg3)", marginTop: 3 }}>
              {isT ? `${CV.SUB_LABEL[item.sub]} · ${item.carrier}` : `${CV.SUB_LABEL[item.sub]} · ${CV.nights(item.checkin.date, item.checkout.date)} noches`}
            </div>
          </div>
        </div>

        {isT ? <TransportHero item={item} /> : <LodgingHero item={item} />}

        <div className="card" style={{ padding: 16, marginTop: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 16px" }}>
            {isT ? (
              <>
                <LV label="Servicio" value={item.service} mono />
                <LV label="Asiento" value={item.seat} />
                <LV label="Salida" value={`${CV.fmtDay(item.depart.date)} · ${item.depart.time}`} />
                <LV label="Llegada" value={`${CV.fmtDay(item.arrive.date)} · ${item.arrive.time}`} />
              </>
            ) : (
              <>
                <LV label="Check-in" value={`${CV.fmtDay(item.checkin.date)} · ${item.checkin.time}`} />
                <LV label="Check-out" value={`${CV.fmtDay(item.checkout.date)} · ${item.checkout.time}`} />
                <LV label="Dirección" value={item.address} full />
                <LV label="Teléfono" value={item.phone} mono />
                <LV label="Correo" value={item.email} mono />
              </>
            )}
          </div>
        </div>

        <ReservationView r={item.reservation} />

        <div className="row gap10" style={{ marginTop: 16 }}>
          <Button variant="secondary" icon="pencil" onClick={onEdit} className="btn-sm">Editar</Button>
          <button className="pillbtn danger" onClick={onDelete} style={{ flex: "none" }}>
            <Icon name="trash-2" size={16} />Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function TransportHero({ item }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row gap12">
        <div className="grow">
          <div className="mono mono-num" style={{ fontSize: 26, fontWeight: 600, color: "var(--fg1)", lineHeight: 1 }}>{item.depart.time}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg2)", marginTop: 4 }}>{item.origin.code || item.origin.place}</div>
          <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>{item.origin.place}</div>
        </div>
        <div className="center-col" style={{ color: "var(--fg3)", flex: "none", gap: 3 }}>
          <Icon name={ICON_FOR[item.sub]} size={18} />
          <div style={{ width: 46, height: 1, background: "var(--border)" }} />
        </div>
        <div className="grow" style={{ textAlign: "right" }}>
          <div className="mono mono-num" style={{ fontSize: 26, fontWeight: 600, color: "var(--fg1)", lineHeight: 1 }}>{item.arrive.time}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg2)", marginTop: 4 }}>{item.destination.code || item.destination.place}</div>
          <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>
            {item.destination.place}{item.arrive.date !== item.depart.date ? " · +1 día" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function LodgingHero({ item }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="overline" style={{ marginBottom: 5 }}>Check-in</div>
          <div className="mono mono-num" style={{ fontSize: 19, fontWeight: 600, color: "var(--fg1)" }}>{item.checkin.time}</div>
          <div style={{ fontSize: 12.5, color: "var(--fg3)", marginTop: 2 }}>{CV.fmtDay(item.checkin.date)}</div>
        </div>
        <div className="center-col" style={{ justifyContent: "center", color: "var(--fg3)" }}>
          <Icon name="moon" size={16} />
          <span style={{ fontSize: 11, marginTop: 3 }}>{CV.nights(item.checkin.date, item.checkout.date)} noches</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="overline" style={{ marginBottom: 5 }}>Check-out</div>
          <div className="mono mono-num" style={{ fontSize: 19, fontWeight: 600, color: "var(--fg1)" }}>{item.checkout.time}</div>
          <div style={{ fontSize: 12.5, color: "var(--fg3)", marginTop: 2 }}>{CV.fmtDay(item.checkout.date)}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TripsListScreen, TripDetailScreen, ItemDetailScreen, ReservationView });
