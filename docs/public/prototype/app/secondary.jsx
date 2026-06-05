/* Cuadros de viaje — secondary screens: Agenda (cross-trip), Cuenta,
   and the "elegir tipo" chooser sheet. window.* */

/* ---------- AGENDA: next items across actual + future trips ---------- */
function AgendaScreen({ trips, onOpenItem }) {
  const rows = [];
  trips.forEach((t) => {
    const s = CV.statusOf(t);
    if (s === "pasado") return;
    CV.sortItems(t.items).forEach((it) => {
      const day = it.kind === "transport" ? it.depart.date : it.checkin.date;
      rows.push({ trip: t, item: it, day, status: s });
    });
  });
  rows.sort((a, b) => (CV.itemStart(a.item) < CV.itemStart(b.item) ? -1 : 1));

  // group by day
  const groups = [];
  rows.forEach((r) => {
    let g = groups.find((x) => x.day === r.day);
    if (!g) { g = { day: r.day, rows: [] }; groups.push(g); }
    g.rows.push(r);
  });

  return (
    <div className="screen">
      <div className="pad pad-b">
        <div style={{ margin: "4px 2px 18px" }}>
          <div className="overline">Lo que se viene</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "4px 0 0" }}>Agenda</h1>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon="calendar-clock" title="Nada en la agenda" text="Cuando tengas viajes en curso o próximos, sus vuelos y alojamientos aparecen acá, día por día." />
        ) : (
          <div className="tl">
            {groups.map((g) => (
              <React.Fragment key={g.day}>
                <div className="tl-day">{CV.fmtDay(g.day)}</div>
                {g.rows.map((r) => (
                  <div key={r.item.id} className="card card-tap" style={{ padding: 13, marginBottom: 12, position: "relative", zIndex: 1 }} onClick={() => onOpenItem(r.trip.id, r.item.id)}>
                    <div className="row gap12">
                      <span className={"typeic" + (r.item.kind === "lodging" ? " lodging" : "")}>
                        <Icon name={ICON_FOR[r.item.sub]} size={21} />
                      </span>
                      <div className="grow">
                        <div className="nowrap" style={{ fontSize: 15.5, fontWeight: 700, color: "var(--fg1)", lineHeight: 1.2 }}>
                          {r.item.kind === "transport" ? `${r.item.origin.place} → ${r.item.destination.place}` : r.item.name}
                        </div>
                        <div className="nowrap row gap8" style={{ fontSize: 12, color: "var(--fg3)", marginTop: 3 }}>
                          <span style={{ color: "var(--brand-700)", fontSize: 11.5, fontWeight: 600 }}>{r.trip.name}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flex: "none" }}>
                        <div className="mono mono-num" style={{ fontSize: 16, fontWeight: 600, color: "var(--fg1)" }}>
                          {r.item.kind === "transport" ? r.item.depart.time : r.item.checkin.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- CUENTA ---------- */
function AccountScreen({ user, theme, onToggleTheme, dataMode, onToggleData, onReset, onLogout }) {
  const initials = (user.name || "U").slice(0, 1).toUpperCase() + (user.surname ? user.surname.slice(0, 1).toUpperCase() : "");
  return (
    <div className="screen">
      <div className="pad pad-b">
        <div className="row gap12" style={{ margin: "8px 2px 22px" }}>
          <div className="avatar">{initials}</div>
          <div className="grow">
            <div style={{ fontSize: 19, fontWeight: 700, color: "var(--fg1)" }}>{user.name}{user.surname ? " " + user.surname : ""}</div>
            <div className="nowrap muted" style={{ fontSize: 13.5 }}>{user.email}</div>
          </div>
        </div>

        <SectionHeader title="Preferencias" />
        <div className="rowgroup" style={{ marginBottom: 20 }}>
          <div className="rowlink" style={{ cursor: "default" }}>
            <Icon name="moon" size={20} className="ri" />
            <span className="grow">Tema oscuro</span>
            <Switch checked={theme === "dark"} onChange={onToggleTheme} />
          </div>
          <div className="rowlink" style={{ cursor: "default" }}>
            <Icon name="database" size={20} className="ri" />
            <div className="grow">
              <div>Datos de ejemplo</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{dataMode === "seed" ? "Mostrando viajes de muestra" : "Empezando desde cero"}</div>
            </div>
            <Switch checked={dataMode === "seed"} onChange={onToggleData} />
          </div>
        </div>

        <SectionHeader title="Cuenta" />
        <div className="rowgroup">
          <button className="rowlink" onClick={onReset}>
            <Icon name="rotate-ccw" size={20} className="ri" />
            <span className="grow">Restablecer prototipo</span>
            <Icon name="chevron-right" size={18} color="var(--fg-disabled)" />
          </button>
          <button className="rowlink" onClick={onLogout}>
            <Icon name="log-out" size={20} className="ri" style={{ color: "var(--error)" }} />
            <span className="grow" style={{ color: "var(--error-strong)" }}>Cerrar sesión</span>
          </button>
        </div>

        <p className="muted" style={{ fontSize: 11.5, textAlign: "center", marginTop: 26, lineHeight: 1.5 }}>
          Cuadros de viaje · prototipo interactivo<br />Acceso sin contraseña · datos guardados en este dispositivo
        </p>
      </div>
    </div>
  );
}

/* ---------- elegir tipo de ítem ---------- */
function AddItemChooser({ onPick, onClose }) {
  const Opt = ({ icon, kind, title, sub, tint }) => (
    <button
      className="card card-tap" onClick={() => onPick(kind)}
      style={{ padding: 16, display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", border: "1px solid var(--border-subtle)", marginBottom: 10, background: "var(--surface)", cursor: "pointer" }}
    >
      <span className="typeic" style={{ width: 46, height: 46, background: tint.bg, color: tint.fg }}>
        <Icon name={icon} size={24} />
      </span>
      <div className="grow">
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg1)" }}>{title}</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{sub}</div>
      </div>
      <Icon name="chevron-right" size={20} color="var(--fg-disabled)" />
    </button>
  );
  return (
    <Sheet title="Agregar ítem" onClose={onClose}>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 }}>¿Qué querés sumar a este viaje?</p>
      <Opt icon="plane" kind="transport" title="Transporte" sub="Avión, tren o micro" tint={{ bg: "var(--brand-tint)", fg: "var(--brand-700)" }} />
      <Opt icon="bed-double" kind="lodging" title="Alojamiento" sub="Hotel, Airbnb, posada…" tint={{ bg: "var(--teal-tint)", fg: "var(--teal-strong)" }} />
    </Sheet>
  );
}

Object.assign(window, { AgendaScreen, AccountScreen, AddItemChooser });
