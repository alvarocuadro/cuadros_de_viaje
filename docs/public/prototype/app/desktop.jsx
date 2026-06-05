/* Cuadros de viaje — desktop shell: sidebar nav + grid list + detail.
   Reuses the mobile screen components inside a wider chrome. window.DesktopApp */

function DesktopApp({ ctl, form, overlays }) {
  const { tab, route, trip, item, theme, t } = ctl;
  const wm = theme === "dark" ? "app/assets/logo-wordmark-dark.svg" : "app/assets/logo-wordmark.svg";
  const initials = (ctl.user.name || "U").slice(0, 1).toUpperCase() + (ctl.user.surname ? ctl.user.surname.slice(0, 1).toUpperCase() : "");

  function goTab(id) { ctl.setTab(id); if (id === "viajes") ctl.back && ctl.openTrip && null; }
  function navTo(id) { ctl.setTab(id); ctl.openTrip && ctl.openItem; }

  const nav = [
    { id: "viajes", icon: "luggage", label: "Viajes" },
    { id: "agenda", icon: "calendar-clock", label: "Agenda" },
    { id: "cuenta", icon: "user-round", label: "Cuenta" },
  ];

  return (
    <div className="desktop">
      <aside className="dk-side">
        <img src={wm} height="30" alt="Cuadros de viaje" style={{ alignSelf: "flex-start", marginLeft: 6 }} />
        <div style={{ marginTop: 20 }}>
          <Button icon="plus" onClick={ctl.createTrip}>Nuevo viaje</Button>
        </div>
        <div className="dk-nav">
          {nav.map((n) => (
            <button key={n.id} className={tab === n.id ? "on" : ""} onClick={() => { ctl.setTab(n.id); if (n.id === "viajes") ctl.back(); }}>
              <Icon name={n.icon} size={19} />{n.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto" }}>
          <div className="dk-userchip">
            <div className="av">{initials}</div>
            <div className="grow">
              <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fg1)" }}>{ctl.user.name}{ctl.user.surname ? " " + ctl.user.surname : ""}</div>
              <div className="nowrap muted" style={{ fontSize: 12 }}>{ctl.user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="dk-main">
        <DesktopContent ctl={ctl} />
      </main>

      {form && (
        <div className="scrim center" onClick={ctl.cancelForm}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 580, maxWidth: "calc(100% - 48px)", height: "min(82%, 720px)", background: "var(--surface)", borderRadius: "var(--radius-xl)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-lg)" }}>
            <div className="appbar" style={{ background: "var(--surface)" }}>
              <span className="title">{form.type === "trip" ? (form.mode === "edit" ? "Editar viaje" : "Nuevo viaje") : form.type === "transport" ? (form.mode === "edit" ? "Editar transporte" : "Nuevo transporte") : (form.mode === "edit" ? "Editar alojamiento" : "Nuevo alojamiento")}</span>
              <span className="spacer" />
              <button className="iconbtn" onClick={ctl.cancelForm}><Icon name="x" size={22} /></button>
            </div>
            {form.type === "trip" && <TripForm initial={form.initial} onSave={ctl.saveTrip} onCancel={ctl.cancelForm} />}
            {form.type === "transport" && <TransportForm initial={form.initial} onSave={(d) => ctl.saveItem(form.tripId, d)} onCancel={ctl.cancelForm} />}
            {form.type === "lodging" && <LodgingForm initial={form.initial} onSave={(d) => ctl.saveItem(form.tripId, d)} onCancel={ctl.cancelForm} />}
          </div>
        </div>
      )}

      {overlays}
    </div>
  );
}

function DesktopTopbar({ children, back }) {
  return (
    <div className="dk-topbar">
      {back && <button className="iconbtn" onClick={back}><Icon name="arrow-left" size={20} /></button>}
      {children}
    </div>
  );
}

function DesktopContent({ ctl }) {
  const { tab, route, trip, item, theme } = ctl;

  if (tab === "agenda") {
    return (
      <>
        <DesktopTopbar><span className="title">Agenda</span></DesktopTopbar>
        <div className="dk-content" style={{ maxWidth: 680 }}>
          <AgendaScreenDesktop trips={ctl.trips} onOpenItem={(tid, iid) => { ctl.setTab("viajes"); ctl.openItem(tid, iid); }} />
        </div>
      </>
    );
  }

  if (tab === "cuenta") {
    return (
      <>
        <DesktopTopbar><span className="title">Cuenta</span></DesktopTopbar>
        <div className="dk-content" style={{ maxWidth: 560 }}>
          <AccountScreen user={ctl.user} theme={theme} dataMode={ctl.dataMode} onToggleTheme={ctl.toggleTheme} onToggleData={ctl.toggleData} onReset={ctl.reset} onLogout={ctl.logout} />
        </div>
      </>
    );
  }

  // viajes
  if (route.name === "trip" && trip) {
    return (
      <>
        <DesktopTopbar back={ctl.back}>
          <span className="title nowrap">{trip.name}</span>
        </DesktopTopbar>
        <div className="dk-content" style={{ maxWidth: 620 }}>
          <TripDetailScreen trip={trip} onOpenItem={(id) => ctl.openItem(trip.id, id)} onAdd={() => ctl.addItem(trip.id)} onEdit={() => ctl.editTrip(trip.id)} onDelete={() => ctl.askDeleteTrip(trip.id)} />
        </div>
      </>
    );
  }
  if (route.name === "item" && item) {
    return (
      <>
        <DesktopTopbar back={ctl.back}>
          <span className="title nowrap">{item.kind === "transport" ? "Transporte" : "Alojamiento"}</span>
        </DesktopTopbar>
        <div className="dk-content" style={{ maxWidth: 620 }}>
          <ItemDetailScreen item={item} onEdit={() => ctl.editItem(trip.id, item)} onDelete={() => ctl.askDeleteItem(trip.id, item.id)} />
        </div>
      </>
    );
  }

  // list (grid)
  return (
    <>
      <DesktopTopbar>
        <span className="title">Tus viajes</span>
        <span className="spacer" style={{ flex: 1 }} />
        <Button icon="plus" onClick={ctl.createTrip} style={{ width: "auto" }} className="btn-sm">Nuevo viaje</Button>
      </DesktopTopbar>
      <div className="dk-content">
        <DesktopTripsGrid trips={ctl.trips} variant={ctl.t.homeVariant} onOpenTrip={ctl.openTrip} onCreate={ctl.createTrip} />
      </div>
    </>
  );
}

function DesktopTripsGrid({ trips, variant, onOpenTrip, onCreate }) {
  if (trips.length === 0) {
    return (
      <div className="card" style={{ padding: 12, maxWidth: 520, margin: "20px auto" }}>
        <EmptyState
          icon="luggage" title="Todavía no tenés viajes"
          text="Creá tu primer viaje y empezá a sumar tus vuelos, trenes y alojamientos en un solo lugar."
          action={<Button icon="plus" onClick={onCreate} style={{ maxWidth: 240 }}>Crear viaje</Button>}
        />
      </div>
    );
  }
  const actual = trips.filter((t) => CV.statusOf(t) === "actual");
  const futuro = trips.filter((t) => CV.statusOf(t) === "futuro").sort((a, b) => (a.start < b.start ? -1 : 1));
  const pasado = trips.filter((t) => CV.statusOf(t) === "pasado").sort((a, b) => (a.start > b.start ? -1 : 1));

  const Group = ({ title, icon, count, list, v }) => list.length > 0 && (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader title={title} icon={icon} count={count} />
      <div className="dk-grid">
        {list.map((t) => <TripCard key={t.id} trip={t} variant={v} flat onOpen={() => onOpenTrip(t.id)} />)}
      </div>
    </div>
  );

  return (
    <div>
      {actual.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionHeader title="Tu viaje actual" icon="circle-dot" />
          <div className="dk-grid">{actual.map((t) => <TripCard key={t.id} trip={t} variant="hero" overline="Sucediendo ahora" flat onOpen={() => onOpenTrip(t.id)} />)}</div>
        </div>
      )}
      <Group title="Próximos viajes" icon="arrow-up-right" count={futuro.length + " por venir"} list={futuro} v={variant} />
      <Group title="Viajes pasados" icon="check" count={pasado.length} list={pasado} v={variant === "hero" ? "default" : variant} />
    </div>
  );
}

/* Agenda reused, but EmptyState/timeline already responsive; thin wrapper */
function AgendaScreenDesktop({ trips, onOpenItem }) {
  return <AgendaScreen trips={trips} onOpenItem={onOpenItem} />;
}

Object.assign(window, { DesktopApp });
