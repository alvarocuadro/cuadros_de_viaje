/* Cuadros de viaje — main app: state store, router, CRUD, tweaks.
   Renders the phone (mobile) or desktop shell. window mounts at #root. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "data": "seed",
  "accent": "azure",
  "density": "regular",
  "cardRadius": 16,
  "homeVariant": "default",
  "device": "mobile"
}/*EDITMODE-END*/;

const ACCENTS = {
  azure: { brand: "#1E7FA8", b700: "#186A8C", b800: "#14536E", tint: "#ECF4F9" },
  teal:  { brand: "#2FA39E", b700: "#237E7A", b800: "#1C635F", tint: "#E3F4F2" },
  navy:  { brand: "#123A5C", b700: "#0E2B44", b800: "#0A2236", tint: "#E7EEF5" },
};
const DENSITY = { compact: 0.78, regular: 1, comfy: 1.22 };

/* ---- persistence ---- */
function loadTrips(mode) {
  try {
    const raw = localStorage.getItem("cv_trips_" + mode);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return mode === "seed" ? CV.seedTrips() : [];
}
function saveTrips(mode, trips) {
  try { localStorage.setItem("cv_trips_" + mode, JSON.stringify(trips)); } catch (e) {}
}
function loadUser() {
  try { return JSON.parse(localStorage.getItem("cv_user") || "null"); } catch (e) { return null; }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = t.dark ? "dark" : "light";
  const dataMode = t.data;

  const [user, setUser] = React.useState(loadUser);
  const [trips, setTrips] = React.useState(() => loadTrips(dataMode));
  const [tab, setTab] = React.useState("viajes");
  const [route, setRoute] = React.useState({ name: "list", tripId: null, itemId: null });
  const [form, setForm] = React.useState(null);      // {type, mode, tripId, itemId, initial}
  const [chooser, setChooser] = React.useState(null); // tripId
  const [confirm, setConfirm] = React.useState(null); // {type, tripId, itemId}
  const [toast, setToast] = React.useState("");

  // reload trips when data mode changes
  const firstData = React.useRef(true);
  React.useEffect(() => {
    if (firstData.current) { firstData.current = false; return; }
    setTrips(loadTrips(dataMode));
    setRoute({ name: "list", tripId: null, itemId: null });
    setTab("viajes");
  }, [dataMode]);
  React.useEffect(() => { saveTrips(dataMode, trips); }, [trips, dataMode]);
  React.useEffect(() => { try { localStorage.setItem("cv_user", JSON.stringify(user)); } catch (e) {} }, [user]);

  // apply theme + tweak knobs to :root
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.setProperty("--cv-card-radius", t.cardRadius + "px");
    root.style.setProperty("--cv-density", DENSITY[t.density] || 1);
    const a = ACCENTS[t.accent] || ACCENTS.azure;
    if (theme === "light") {
      root.style.setProperty("--brand", a.brand);
      root.style.setProperty("--brand-600", a.brand);
      root.style.setProperty("--brand-700", a.b700);
      root.style.setProperty("--brand-hover", a.b700);
      root.style.setProperty("--brand-press", a.b800);
      root.style.setProperty("--brand-tint", a.tint);
      root.style.setProperty("--brand-50", a.tint);
    } else {
      ["--brand","--brand-600","--brand-700","--brand-hover","--brand-press","--brand-tint","--brand-50"].forEach((p) => root.style.removeProperty(p));
    }
  }, [theme, t.accent, t.density, t.cardRadius]);

  React.useEffect(() => {
    if (!toast) return;
    const x = setTimeout(() => setToast(""), 2300);
    return () => clearTimeout(x);
  }, [toast]);

  const trip = trips.find((x) => x.id === route.tripId) || null;
  const item = trip && trip.items.find((x) => x.id === route.itemId);

  // ---- navigation ----
  function openTrip(id) { setRoute({ name: "trip", tripId: id, itemId: null }); }
  function openItem(tripId, itemId) { setRoute({ name: "item", tripId, itemId }); }
  function back() {
    setRoute((r) => r.name === "item" ? { name: "trip", tripId: r.tripId, itemId: null } : { name: "list", tripId: null, itemId: null });
  }

  // ---- CRUD ----
  function saveTrip(draft) {
    if (form.mode === "new") {
      const id = CV.uid("trip");
      setTrips((ts) => [...ts, { id, ...draft, items: [] }]);
      setForm(null);
      setRoute({ name: "trip", tripId: id, itemId: null });
      setTab("viajes");
      setToast("Viaje creado");
    } else {
      setTrips((ts) => ts.map((x) => x.id === form.tripId ? { ...x, name: draft.name, destinations: draft.destinations, start: draft.start, end: draft.end } : x));
      setForm(null);
      setToast("Viaje actualizado");
    }
  }
  function deleteTrip(id) {
    setTrips((ts) => ts.filter((x) => x.id !== id));
    setConfirm(null);
    setRoute({ name: "list", tripId: null, itemId: null });
    setToast("Viaje eliminado");
  }
  function saveItem(tripId, draft) {
    setTrips((ts) => ts.map((x) => {
      if (x.id !== tripId) return x;
      const exists = x.items.some((it) => it.id === draft.id);
      const items = exists ? x.items.map((it) => it.id === draft.id ? draft : it) : [...x.items, draft];
      return { ...x, items };
    }));
    const wasNew = form && form.mode === "new";
    setForm(null);
    setRoute({ name: "trip", tripId, itemId: null });
    setToast(wasNew ? "Ítem agregado" : "Ítem actualizado");
  }
  function deleteItem(tripId, itemId) {
    setTrips((ts) => ts.map((x) => x.id === tripId ? { ...x, items: x.items.filter((it) => it.id !== itemId) } : x));
    setConfirm(null);
    setRoute({ name: "trip", tripId, itemId: null });
    setToast("Ítem eliminado");
  }

  function resetAll() {
    ["cv_trips_seed", "cv_trips_empty"].forEach((k) => localStorage.removeItem(k));
    setTrips(loadTrips(dataMode));
    setRoute({ name: "list", tripId: null, itemId: null });
    setTab("viajes");
    setConfirm(null);
    setToast("Prototipo restablecido");
  }
  function logout() { setUser(null); setRoute({ name: "list", tripId: null, itemId: null }); setTab("viajes"); }

  const ctl = {
    user: user || { name: "Lucía", surname: "Méndez", email: "lucia.m@gmail.com" },
    trips, theme, dataMode, tab, route, trip, item, t,
    setTab, openTrip, openItem, back,
    createTrip: () => setForm({ type: "trip", mode: "new" }),
    editTrip: (id) => { const tr = trips.find((x) => x.id === id); setForm({ type: "trip", mode: "edit", tripId: id, initial: { name: tr.name, destinations: tr.destinations, start: tr.start, end: tr.end } }); },
    addItem: (tripId) => setChooser(tripId),
    editItem: (tripId, it) => setForm({ type: it.kind, mode: "edit", tripId, itemId: it.id, initial: it }),
    saveTrip, saveItem, deleteTrip, deleteItem,
    askDeleteTrip: (id) => setConfirm({ type: "trip", tripId: id }),
    askDeleteItem: (tripId, itemId) => setConfirm({ type: "item", tripId, itemId }),
    toggleTheme: (v) => setTweak("dark", v),
    toggleData: (v) => setTweak("data", v ? "seed" : "empty"),
    reset: resetAll, logout,
    cancelForm: () => setForm(null),
  };

  // ---- render ----
  if (!user) {
    return (
      <div className="stage">
        <div className="phone">
          <StatusBar />
          <AuthFlow theme={theme} onAuth={(u) => { setUser(u); setRoute({ name: "list", tripId: null, itemId: null }); setTab("viajes"); }} />
        </div>
        <TweaksUI t={t} setTweak={setTweak} />
      </div>
    );
  }

  const overlays = (
    <>
      {chooser && (
        <AddItemChooser
          onClose={() => setChooser(null)}
          onPick={(kind) => { setForm({ type: kind, mode: "new", tripId: chooser }); setChooser(null); }}
        />
      )}
      {confirm && confirm.type === "item" && (
        <DeleteItemModal
          item={(trips.find((x) => x.id === confirm.tripId) || {}).items.find((it) => it.id === confirm.itemId)}
          onCancel={() => setConfirm(null)}
          onConfirm={() => deleteItem(confirm.tripId, confirm.itemId)}
        />
      )}
      {confirm && confirm.type === "trip" && (
        <DeleteTripModal
          trip={trips.find((x) => x.id === confirm.tripId)}
          onCancel={() => setConfirm(null)}
          onConfirm={() => deleteTrip(confirm.tripId)}
        />
      )}
      <Toast msg={toast} />
    </>
  );

  if (t.device === "desktop") {
    return (
      <div className="stage">
        <DesktopApp ctl={ctl} form={form} overlays={overlays} />
        <TweaksUI t={t} setTweak={setTweak} />
      </div>
    );
  }

  return (
    <div className="stage">
      <div className="phone">
        <StatusBar />
        <MobileApp ctl={ctl} form={form} />
        {overlays}
      </div>
      <TweaksUI t={t} setTweak={setTweak} />
    </div>
  );
}

/* ================= MOBILE ================= */
function MobileApp({ ctl, form }) {
  const { tab, route, trip, item, theme } = ctl;

  // form view (full screen)
  if (form) {
    const titles = { trip: form.mode === "edit" ? "Editar viaje" : "Nuevo viaje", transport: form.mode === "edit" ? "Editar transporte" : "Nuevo transporte", lodging: form.mode === "edit" ? "Editar alojamiento" : "Nuevo alojamiento" };
    return (
      <>
        <AppBar title={titles[form.type]} onBack={ctl.cancelForm} />
        {form.type === "trip" && <TripForm initial={form.initial} onSave={ctl.saveTrip} onCancel={ctl.cancelForm} />}
        {form.type === "transport" && <TransportForm initial={form.initial} onSave={(d) => ctl.saveItem(form.tripId, d)} onCancel={ctl.cancelForm} />}
        {form.type === "lodging" && <LodgingForm initial={form.initial} onSave={(d) => ctl.saveItem(form.tripId, d)} onCancel={ctl.cancelForm} />}
      </>
    );
  }

  let title = "Tus viajes", right = null, onBack = null, brand = false;
  let content;

  const topLevel = (tab === "viajes" && route.name === "list") || tab === "agenda" || tab === "cuenta";

  if (tab === "viajes") {
    if (route.name === "list") {
      content = <TripsListScreen trips={ctl.trips} user={ctl.user} variant={ctl.t.homeVariant} onOpenTrip={ctl.openTrip} onCreate={ctl.createTrip} />;
      right = <button className="pillbtn" onClick={ctl.createTrip}><Icon name="plus" size={16} />Nuevo</button>;
    } else if (route.name === "trip" && trip) {
      title = "Viaje"; onBack = ctl.back;
      content = <TripDetailScreen trip={trip} onOpenItem={(id) => ctl.openItem(trip.id, id)} onAdd={() => ctl.addItem(trip.id)} onEdit={() => ctl.editTrip(trip.id)} onDelete={() => ctl.askDeleteTrip(trip.id)} />;
    } else if (route.name === "item" && item) {
      title = item.kind === "transport" ? "Transporte" : "Alojamiento"; onBack = ctl.back;
      content = <ItemDetailScreen item={item} onEdit={() => ctl.editItem(trip.id, item)} onDelete={() => ctl.askDeleteItem(trip.id, item.id)} />;
    } else {
      content = <TripsListScreen trips={ctl.trips} user={ctl.user} variant={ctl.t.homeVariant} onOpenTrip={ctl.openTrip} onCreate={ctl.createTrip} />;
      right = <button className="pillbtn" onClick={ctl.createTrip}><Icon name="plus" size={16} />Nuevo</button>;
    }
  } else if (tab === "agenda") {
    content = <AgendaScreen trips={ctl.trips} onOpenItem={(tid, iid) => { ctl.setTab("viajes"); ctl.openItem(tid, iid); }} />;
  } else {
    content = <AccountScreen user={ctl.user} theme={theme} dataMode={ctl.dataMode} onToggleTheme={ctl.toggleTheme} onToggleData={ctl.toggleData} onReset={ctl.reset} onLogout={ctl.logout} />;
  }

  const showFab = tab === "viajes" && route.name === "list";
  const fabAction = ctl.createTrip;

  return (
    <>
      <AppBar title={topLevel ? null : title} brand={topLevel} onBack={onBack} right={right} theme={theme} />
      {content}
      {showFab && <Fab onClick={fabAction} label={route.name === "trip" ? "Agregar ítem" : "Crear viaje"} />}
      <TabBar active={tab} onChange={(id) => { ctl.setTab(id); }} />
    </>
  );
}

/* ================= DELETE MODALS ================= */
function DeleteItemModal({ item, onCancel, onConfirm }) {
  const isT = item && item.kind === "transport";
  const name = item ? (isT ? `${item.origin.place} → ${item.destination.place}` : item.name) : "este ítem";
  return (
    <Modal icon="trash-2" title="¿Eliminar este ítem?" onClose={onCancel}>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 18px", lineHeight: 1.5 }}>
        Vas a eliminar <strong style={{ color: "var(--fg1)" }}>{name}</strong>. Esta acción no se puede deshacer.
      </p>
      <div className="row gap10">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" icon="trash-2" onClick={onConfirm}>Eliminar</Button>
      </div>
    </Modal>
  );
}
function DeleteTripModal({ trip, onCancel, onConfirm }) {
  const n = trip ? trip.items.length : 0;
  return (
    <Modal icon="trash-2" title="¿Eliminar este viaje?" onClose={onCancel}>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 18px", lineHeight: 1.5 }}>
        Vas a eliminar <strong style={{ color: "var(--fg1)" }}>{trip ? trip.name : ""}</strong>
        {n > 0 ? <> y sus <strong style={{ color: "var(--fg1)" }}>{n} {n === 1 ? "ítem" : "ítems"}</strong> (transporte y alojamiento).</> : "."} Esta acción no se puede deshacer.
      </p>
      <div className="row gap10">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" icon="trash-2" onClick={onConfirm}>Eliminar viaje</Button>
      </div>
    </Modal>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
