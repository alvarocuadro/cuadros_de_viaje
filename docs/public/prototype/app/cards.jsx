/* Cuadros de viaje — composite cards: TripCard, ItemRow. window.* */

function tripMeta(trip) {
  const status = CV.statusOf(trip);
  return {
    status,
    label: CV.statusLabel(trip),
    short: CV.shortStatusLabel(trip),
    range: CV.fmtRange(trip.start, trip.end),
    days: CV.dayDiff(trip.start, trip.end) + 1,
  };
}

/* Trip card — supports layout variants: "default" | "hero" | "compact" */
function TripCard({ trip, onOpen, overline, variant = "default", flat }) {
  const m = tripMeta(trip);
  const isActual = m.status === "actual";
  const mb = flat ? 0 : undefined;

  if (variant === "compact") {
    return (
      <div className="card card-tap" style={{ padding: "12px 14px", marginBottom: flat ? 0 : 10 }} onClick={onOpen}>
        <div className="row gap12">
          <span className={"typeic" + (m.status === "pasado" ? " pasado" : "")} style={{ width: 38, height: 38 }}>
            <Icon name={m.status === "pasado" ? "check" : isActual ? "circle-dot" : "arrow-up-right"} size={19} />
          </span>
          <div className="grow">
            <div className="nowrap" style={{ fontSize: 16, fontWeight: 700, color: "var(--fg1)", lineHeight: 1.25 }}>{trip.name}</div>
            <div className="nowrap" style={{ fontSize: 12.5, color: "var(--fg3)", marginTop: 2 }}>
              {trip.destinations.join(" · ")}
            </div>
          </div>
          <div style={{ textAlign: "right", flex: "none" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg2)" }} className="mono-num">{m.range.split(" ").slice(0, 3).join(" ")}</div>
            <span className={"badge badge-" + m.status} style={{ marginTop: 5, padding: "3px 9px", fontSize: 11.5 }}>
              <span className="dot" />{m.short}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const hero = variant === "hero" && isActual;
  return (
    <div
      className="card card-tap"
      style={{
        padding: hero ? "18px 18px 16px" : "15px 16px", marginBottom: flat ? 0 : 12,
        ...(isActual
          ? { borderColor: "var(--actual)", boxShadow: "0 0 0 1px var(--actual), var(--shadow-md)" }
          : {}),
        ...(hero ? { background: "linear-gradient(180deg, var(--actual-tint), var(--surface) 70%)" } : {}),
      }}
      onClick={onOpen}
    >
      <div className="row" style={{ justifyContent: "space-between", marginBottom: hero ? 12 : 9 }}>
        {overline ? <span className="overline" style={isActual ? { color: "var(--actual-strong)" } : null}>{overline}</span> : <span />}
        <StatusBadge status={m.status} label={hero ? m.label : m.short} />
      </div>
      <h3 style={{ margin: "0 0 9px", fontSize: hero ? 23 : 20, fontWeight: 700, letterSpacing: "-.015em", color: "var(--fg1)" }}>
        {trip.name}
      </h3>
      <div className="row gap8" style={{ fontSize: 13.5, color: "var(--fg2)" }}>
        <Icon name="calendar" size={15} color="var(--fg3)" />
        <span className="mono-num">{m.range}</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 11, flexWrap: "wrap", alignItems: "center" }}>
        {trip.destinations.slice(0, 4).map((d, i) => <Chip key={i} icon="map-pin">{d}</Chip>)}
        <span className="row gap8" style={{ marginLeft: 2, fontSize: 12.5, color: "var(--fg3)" }}>
          <Icon name="layers" size={14} color="var(--fg3)" />{trip.items.length} {trip.items.length === 1 ? "ítem" : "ítems"}
        </span>
      </div>
    </div>
  );
}

/* one item row in a trip timeline */
function ItemRow({ item, past, onOpen, hideConnector }) {
  const isT = item.kind === "transport";
  const right = isT ? item.depart.time : item.checkin.time;
  const rightSub = isT ? item.origin.code || item.origin.place : "check-in";
  return (
    <div
      className="card card-tap"
      style={{ padding: 13, marginBottom: 12, position: "relative", zIndex: 1 }}
      onClick={onOpen}
    >
      <div className="row gap12">
        <span className={"typeic" + (past ? " pasado" : item.kind === "lodging" ? " lodging" : "")}>
          <Icon name={ICON_FOR[item.sub]} size={21} />
        </span>
        <div className="grow">
          <div className="nowrap" style={{ fontSize: 16, fontWeight: 700, color: "var(--fg1)", lineHeight: 1.2 }}>
            {isT ? `${item.origin.place} → ${item.destination.place}` : item.name}
          </div>
          <div className="nowrap" style={{ fontSize: 12.5, color: "var(--fg3)", marginTop: 2 }}>
            {isT ? (
              <>
                {item.carrier}
                {item.service && <> · <span className="mono">{item.service}</span></>}
              </>
            ) : (
              <>{CV.SUB_LABEL[item.sub]} · {CV.nights(item.checkin.date, item.checkout.date)} noches</>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div className="mono mono-num" style={{ fontSize: 17, fontWeight: 600, color: "var(--fg1)" }}>{right || "—"}</div>
          <div style={{ fontSize: 10.5, color: "var(--fg3)", marginTop: 1 }}>{rightSub}</div>
        </div>
        <Icon name="chevron-right" size={18} color="var(--fg-disabled)" />
      </div>
    </div>
  );
}

Object.assign(window, { TripCard, ItemRow, tripMeta });
