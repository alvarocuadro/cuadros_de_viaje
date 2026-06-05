/* Cuadros de viaje — shared primitives. Exposes on window. */

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="mono-num">9:41</span>
      <span className="sb-icons">
        <Icon name="signal" size={15} />
        <Icon name="wifi" size={15} />
        <Icon name="battery-full" size={18} />
      </span>
    </div>
  );
}

function AppBar({ title, onBack, right, brand, theme }) {
  const wm = theme === "dark" ? "app/assets/logo-wordmark-dark.svg" : "app/assets/logo-wordmark.svg";
  return (
    <div className="appbar">
      {brand ? (
        <img src={wm} height="30" alt="Cuadros de viaje" style={{ marginLeft: 4 }} />
      ) : onBack ? (
        <button className="iconbtn" onClick={onBack} aria-label="Volver">
          <Icon name="chevron-left" size={24} />
        </button>
      ) : (
        <img src="app/assets/logo-mark.svg" width="30" height="30" alt="" style={{ marginLeft: 4 }} />
      )}
      {!brand && <span className="title">{title}</span>}
      <span className="spacer" />
      {right}
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: "viajes", icon: "luggage", label: "Viajes" },
    { id: "agenda", icon: "calendar-clock", label: "Agenda" },
    { id: "cuenta", icon: "user-round", label: "Cuenta" },
  ];
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={"tab" + (active === t.id ? " on" : "")} onClick={() => onChange(t.id)}>
          <Icon name={t.icon} size={22} stroke={active === t.id ? 2.2 : 2} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Fab({ onClick, label = "Agregar ítem" }) {
  return (
    <button className="fab" onClick={onClick} aria-label={label}>
      <Icon name="plus" size={26} />
    </button>
  );
}

function StatusBadge({ status, label }) {
  return (
    <span className={"badge badge-" + status}>
      <span className="dot" />
      {label}
    </span>
  );
}

function Chip({ children, code, icon, onRemove }) {
  if (onRemove) {
    return (
      <span className="chip chip-rm">
        {icon && <Icon name={icon} size={14} />}
        {children}
        <button onClick={onRemove} aria-label="Quitar"><Icon name="x" size={13} /></button>
      </span>
    );
  }
  return (
    <span className={"chip" + (code ? " chip-code" : "")}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

function Button({ variant = "primary", icon, iconRight, children, onClick, disabled, style, className, type }) {
  return (
    <button
      className={"btn btn-" + variant + (className ? " " + className : "")}
      onClick={onClick} disabled={disabled} style={style} type={type || "button"}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
}

function LV({ label, value, mono, link, full }) {
  const empty = value == null || value === "";
  return (
    <div className="lv" style={full ? { gridColumn: "1 / -1" } : null}>
      <div className="overline l">{label}</div>
      <div className={"v" + (mono ? " mono" : "") + (empty ? " empty" : "")}>
        {empty ? "—" : link ? <a href={value} target="_blank" rel="noreferrer">{link === true ? value : link}</a> : value}
      </div>
    </div>
  );
}

function SectionHeader({ title, count, icon }) {
  return (
    <div className="sec-h">
      <span className="t">{icon && <Icon name={icon} size={15} color="var(--fg3)" />}{title}</span>
      {count != null && <span className="c">{count}</span>}
    </div>
  );
}

/* ---------- form controls ---------- */
function Field({ label, required, optional, hint, error, children }) {
  return (
    <div className="field">
      {label && (
        <label>
          {label}
          {required && <span className="req">*</span>}
          {optional && <span className="opt">(opcional)</span>}
        </label>
      )}
      {children}
      {error ? (
        <div className="fielderr"><Icon name="alert-circle" size={14} />{error}</div>
      ) : hint ? (
        <div className="fieldhint">{hint}</div>
      ) : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, icon, error, type = "text", inputMode, onEnter, autoFocus }) {
  return (
    <div className={"input" + (error ? " err" : "")}>
      {icon && <Icon name={icon} size={18} color="var(--fg3)" />}
      <input
        type={type} value={value} placeholder={placeholder} inputMode={inputMode} autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
      />
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, icon }) {
  return (
    <div className="input area">
      {icon && <Icon name={icon} size={18} color="var(--fg3)" style={{ marginTop: 2 }} />}
      <textarea value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DateInput({ value, onChange, min, error, icon = "calendar" }) {
  return (
    <div className={"input" + (error ? " err" : "")}>
      {icon && <Icon name={icon} size={18} color="var(--fg3)" />}
      <input type="date" value={value || ""} min={min} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TimeInput({ value, onChange, icon = "clock" }) {
  return (
    <div className="input">
      {icon && <Icon name={icon} size={18} color="var(--fg3)" />}
      <input type="time" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SelectInput({ value, onChange, options, placeholder, icon, error }) {
  return (
    <div className={"input" + (error ? " err" : "")}>
      {icon && <Icon name={icon} size={18} color="var(--fg3)" />}
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="" disabled hidden>{placeholder || "Elegir…"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icon name="chevron-down" size={18} color="var(--fg3)" />
    </div>
  );
}

function Segmented({ value, onChange, options, size }) {
  return (
    <div className="seg" style={size === "sm" ? { padding: 3 } : null}>
      {options.map((o) => (
        <button key={o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)} type="button">
          {o.icon && <Icon name={o.icon} size={16} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span className="knob" />
    </label>
  );
}

/* multi-value chip input (destinations) */
function ChipInput({ values, onChange, placeholder, icon = "map-pin", error }) {
  const [text, setText] = React.useState("");
  function add() {
    const v = text.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setText("");
  }
  return (
    <div>
      <div className={"input" + (error ? " err" : "")}>
        {icon && <Icon name={icon} size={18} color="var(--fg3)" />}
        <input
          value={text} placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
            if (e.key === "Backspace" && !text && values.length) onChange(values.slice(0, -1));
          }}
        />
        {text.trim() && (
          <button className="addline" style={{ padding: "4px 6px" }} onClick={add} type="button">
            <Icon name="corner-down-left" size={16} />
          </button>
        )}
      </div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 9 }}>
          {values.map((v, i) => (
            <Chip key={v + i} icon={icon} onRemove={() => onChange(values.filter((_, j) => j !== i))}>{v}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- overlays ---------- */
function Sheet({ title, onClose, children, maxHeight }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" style={maxHeight ? { maxHeight } : null} onClick={(e) => e.stopPropagation()}>
        <div className="grip" />
        {title && (
          <div className="sheet-h">
            <h2>{title}</h2>
            <button className="iconbtn" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={22} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function Modal({ icon, iconKind = "danger", title, children, onClose }) {
  return (
    <div className="scrim center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {icon && <div className={"modal-ic " + iconKind}><Icon name={icon} size={24} /></div>}
        {title && <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--fg1)", margin: "0 0 8px", letterSpacing: "-.01em" }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty fadeup">
      <div className="art"><Icon name={icon} size={42} stroke={1.75} /></div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toastwrap">
      <div className="toast">
        <span className="ok"><Icon name="check-circle-2" size={16} /></span>
        {msg}
      </div>
    </div>
  );
}

Object.assign(window, {
  StatusBar, AppBar, TabBar, Fab, StatusBadge, Chip, Button, LV, SectionHeader,
  Field, TextInput, TextArea, DateInput, TimeInput, SelectInput, Segmented, Switch, ChipInput,
  Sheet, Modal, EmptyState, Toast,
});
