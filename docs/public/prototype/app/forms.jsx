/* Cuadros de viaje — full-screen forms: Trip, Transport, Lodging + shared
   reservation block. Each returns a formscreen (body + sticky save bar).
   window.TripForm, TransportForm, LodgingForm */

/* ---------- shared: Datos de reserva ---------- */
function ReservationBlock({ value, onChange, err }) {
  const r = value;
  const set = (patch) => onChange({ ...r, ...patch });
  const codes = r.codes.length ? r.codes : [""];
  function setCode(i, v) { const c = codes.slice(); c[i] = v; set({ codes: c }); }
  function addCode() { set({ codes: [...codes, ""] }); }
  function rmCode(i) { const c = codes.filter((_, j) => j !== i); set({ codes: c.length ? c : [""] }); }

  return (
    <div className="resblock">
      <div className="row" style={{ justifyContent: "space-between", gap: 12, marginBottom: r.byAgency ? 14 : 0 }}>
        <div>
          <div className="lbl">¿Reservado por agencia?</div>
          <div className="sub">Activalo si lo gestionó una agencia de viajes.</div>
        </div>
        <Switch checked={r.byAgency} onChange={(v) => set({ byAgency: v })} />
      </div>

      {r.byAgency && (
        <div className="fadeup">
          <Field label="Nombre de la agencia" required error={err && err.agencyName}>
            <TextInput value={r.agencyName} onChange={(v) => set({ agencyName: v })} placeholder="Ej. Despegar" icon="building" error={err && err.agencyName} />
          </Field>
        </div>
      )}

      <Field label="Códigos de reserva">
        {codes.map((c, i) => (
          <div className="codeline" key={i}>
            <div className="input" style={{ flex: 1 }}>
              <Icon name="ticket" size={18} color="var(--fg3)" />
              <input value={c} placeholder="Ej. 4XT9K2" onChange={(e) => setCode(i, e.target.value)} />
            </div>
            {codes.length > 1 && (
              <button className="iconbtn" onClick={() => rmCode(i)} aria-label="Quitar código" style={{ width: 38, height: 38 }}>
                <Icon name="x" size={18} />
              </button>
            )}
          </div>
        ))}
        <button className="addline" onClick={addCode}><Icon name="plus" size={15} />Agregar otro código</button>
      </Field>

      <Field label="Página de la reserva" optional hint="Pegá el enlace para abrirlo después.">
        <TextInput value={r.url} onChange={(v) => set({ url: v })} placeholder="https://…" icon="link" type="url" inputMode="url" />
      </Field>

      <Field label="Comentarios" optional>
        <TextArea value={r.comments} onChange={(v) => set({ comments: v })} placeholder="Notas: instrucciones de check-in, equipaje, etc." icon="message-square" rows={3} />
      </Field>
    </div>
  );
}

/* ---------- TRIP form ---------- */
function TripForm({ initial, onSave, onCancel }) {
  const [v, setV] = React.useState(initial || { name: "", destinations: [], start: "", end: "" });
  const [err, setErr] = React.useState({});
  const set = (k) => (val) => setV({ ...v, [k]: val });

  function save() {
    const e = CV.validateTrip(v);
    setErr(e);
    if (Object.keys(e).length === 0) onSave(v);
  }

  return (
    <div className="formscreen">
      <div className="body">
        <Field label="Nombre del viaje" required error={err.name}>
          <TextInput value={v.name} onChange={set("name")} placeholder="Ej. Europa de junio" icon="luggage" error={err.name} autoFocus />
        </Field>

        <Field label="Destinos" required error={err.destinations} hint="Escribí y presioná Enter. Podés agregar varios.">
          <ChipInput values={v.destinations} onChange={set("destinations")} placeholder="Ej. Madrid" error={err.destinations} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Inicio" required error={err.start}>
            <DateInput value={v.start} onChange={set("start")} min={CV.TODAY_ISO} error={err.start} />
          </Field>
          <Field label="Fin" required error={err.end}>
            <DateInput value={v.end} onChange={set("end")} min={v.start || CV.TODAY_ISO} error={err.end} />
          </Field>
        </div>
        <div className="fieldhint" style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <Icon name="info" size={14} color="var(--fg3)" style={{ marginTop: 1 }} />
          No se admiten fechas pasadas. El estado (futuro, actual o pasado) se calcula solo según las fechas.
        </div>
      </div>
      <div className="formbar">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button icon="check" onClick={save}>{initial ? "Guardar cambios" : "Crear viaje"}</Button>
      </div>
    </div>
  );
}

/* ---------- TRANSPORT form ---------- */
function TransportForm({ initial, onSave, onCancel }) {
  const [v, setV] = React.useState(initial || CV.newTransport());
  const [err, setErr] = React.useState({});
  const set = (k) => (val) => setV({ ...v, [k]: val });
  const setNested = (k, sub) => (val) => setV({ ...v, [k]: { ...v[k], [sub]: val } });

  function save() {
    const e = CV.validateTransport(v);
    setErr(e);
    if (Object.keys(e).length === 0) onSave(v);
  }

  return (
    <div className="formscreen">
      <div className="body">
        <div className="subhead">Tipo de transporte</div>
        <Segmented value={v.sub} onChange={set("sub")} options={CV.SUBS.transport} />

        <div className="subhead">Datos del viaje</div>
        <Field label="Compañía / operador" required error={err.carrier}>
          <TextInput value={v.carrier} onChange={set("carrier")} placeholder="Ej. Aerolíneas Argentinas" icon="building-2" error={err.carrier} />
        </Field>

        <Field label="Origen" required error={err.origin}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 8 }}>
            <TextInput value={v.origin.place} onChange={setNested("origin", "place")} placeholder="Ciudad" icon="map-pin" error={err.origin} />
            <TextInput value={v.origin.code} onChange={setNested("origin", "code")} placeholder="EZE" />
          </div>
        </Field>
        <Field label="Destino" required error={err.destination}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 8 }}>
            <TextInput value={v.destination.place} onChange={setNested("destination", "place")} placeholder="Ciudad" icon="map-pin" error={err.destination} />
            <TextInput value={v.destination.code} onChange={setNested("destination", "code")} placeholder="MAD" />
          </div>
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Fecha de salida" required error={err.departDate}>
            <DateInput value={v.depart.date} onChange={setNested("depart", "date")} error={err.departDate} />
          </Field>
          <Field label="Hora de salida">
            <TimeInput value={v.depart.time} onChange={setNested("depart", "time")} />
          </Field>
          <Field label="Fecha de llegada" required error={err.arriveDate}>
            <DateInput value={v.arrive.date} onChange={setNested("arrive", "date")} min={v.depart.date} error={err.arriveDate} />
          </Field>
          <Field label="Hora de llegada">
            <TimeInput value={v.arrive.time} onChange={setNested("arrive", "time")} />
          </Field>
        </div>
        <div className="fieldhint" style={{ display: "flex", gap: 6, alignItems: "flex-start", marginTop: -6 }}>
          <Icon name="clock" size={14} color="var(--fg3)" style={{ marginTop: 1 }} />
          Siempre en hora local de cada lugar. No convertimos zonas horarias.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <Field label="Identificador del servicio" hint="Vuelo, tren o servicio.">
            <TextInput value={v.service} onChange={set("service")} placeholder="AR1430" icon="hash" />
          </Field>
          <Field label="Asiento" optional>
            <TextInput value={v.seat} onChange={set("seat")} placeholder="23A" icon="armchair" />
          </Field>
        </div>

        <div className="subhead">Datos de reserva</div>
        <ReservationBlock value={v.reservation} onChange={set("reservation")} err={err} />
      </div>
      <div className="formbar">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button icon="check" onClick={save}>{initial ? "Guardar" : "Agregar transporte"}</Button>
      </div>
    </div>
  );
}

/* ---------- LODGING form ---------- */
function LodgingForm({ initial, onSave, onCancel }) {
  const [v, setV] = React.useState(initial || CV.newLodging());
  const [err, setErr] = React.useState({});
  const set = (k) => (val) => setV({ ...v, [k]: val });
  const setNested = (k, sub) => (val) => setV({ ...v, [k]: { ...v[k], [sub]: val } });

  function save() {
    const e = CV.validateLodging(v);
    setErr(e);
    if (Object.keys(e).length === 0) onSave(v);
  }

  return (
    <div className="formscreen">
      <div className="body">
        <div className="subhead">Tipo de alojamiento</div>
        <Segmented value={v.sub} onChange={set("sub")} options={CV.SUBS.lodging} />

        <div className="subhead">Datos del alojamiento</div>
        <Field label="Nombre" required error={err.name}>
          <TextInput value={v.name} onChange={set("name")} placeholder="Ej. Hotel Riu Plaza España" icon="bed-double" error={err.name} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Check-in" required error={err.checkinDate}>
            <DateInput value={v.checkin.date} onChange={setNested("checkin", "date")} error={err.checkinDate} icon="log-in" />
          </Field>
          <Field label="Hora">
            <TimeInput value={v.checkin.time} onChange={setNested("checkin", "time")} />
          </Field>
          <Field label="Check-out" required error={err.checkoutDate}>
            <DateInput value={v.checkout.date} onChange={setNested("checkout", "date")} min={v.checkin.date} error={err.checkoutDate} icon="log-out" />
          </Field>
          <Field label="Hora">
            <TimeInput value={v.checkout.time} onChange={setNested("checkout", "time")} />
          </Field>
        </div>

        <Field label="Dirección" optional>
          <TextInput value={v.address} onChange={set("address")} placeholder="Calle, número, ciudad" icon="map" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Teléfono" optional>
            <TextInput value={v.phone} onChange={set("phone")} placeholder="+54 …" icon="phone" type="tel" inputMode="tel" />
          </Field>
          <Field label="Correo" optional error={err.email}>
            <TextInput value={v.email} onChange={set("email")} placeholder="reservas@…" icon="mail" type="email" inputMode="email" error={err.email} />
          </Field>
        </div>

        <div className="subhead">Datos de reserva</div>
        <ReservationBlock value={v.reservation} onChange={set("reservation")} err={err} />
      </div>
      <div className="formbar">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button icon="check" onClick={save}>{initial ? "Guardar" : "Agregar alojamiento"}</Button>
      </div>
    </div>
  );
}

Object.assign(window, { ReservationBlock, TripForm, TransportForm, LodgingForm });
