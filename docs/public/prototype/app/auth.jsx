/* Cuadros de viaje — passwordless auth flow.
   Welcome → Registro → Verificación  |  Login → Enlace → Magic link.
   window.AuthFlow */
const DEMO_CODE = "204815";

function Brandblock({ theme, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 8px 0" }}>
      <img src="app/assets/logo-mark.svg" width="58" height="58" alt="" />
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "16px 0 8px" }}>
        Tu viaje, todo a mano
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--fg2)", margin: 0, maxWidth: 290, marginInline: "auto" }}>
        {sub || "Transporte y alojamiento en un solo lugar. Sin contraseñas."}
      </p>
    </div>
  );
}

/* ---- code field: value is a clean string of up to 6 digits ---- */
function CodeField({ value, onChange, error }) {
  const refs = React.useRef([]);
  const cells = [0, 1, 2, 3, 4, 5].map((i) => value[i] || "");
  function setDigit(i, raw) {
    const d = raw.replace(/\D/g, "").slice(-1);
    const arr = cells.slice();
    arr[i] = d;
    onChange(arr.join("").slice(0, 6));
    if (d && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  }
  function onKey(i, e) {
    if (e.key === "Backspace" && !cells[i] && i > 0) {
      const arr = cells.slice(); arr[i - 1] = ""; onChange(arr.join(""));
      refs.current[i - 1].focus();
    }
  }
  function onPaste(e) {
    const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (t) { e.preventDefault(); onChange(t); const n = Math.min(t.length, 5); refs.current[n] && refs.current[n].focus(); }
  }
  return (
    <div className={"code-inputs" + (error ? " err" : "")} onPaste={onPaste}>
      {cells.map((c, i) => (
        <input
          key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" maxLength={1}
          value={c} autoFocus={i === 0}
          onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
        />
      ))}
    </div>
  );
}

function AuthFlow({ onAuth, theme }) {
  const [step, setStep] = React.useState("welcome");
  const [reg, setReg] = React.useState({ name: "", surname: "", country: "", email: "" });
  const [regErr, setRegErr] = React.useState({});
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginErr, setLoginErr] = React.useState("");

  function go(s) { setStep(s); }
  const email = step === "verify" ? reg.email : loginEmail;

  return (
    <div className="screen">
      <div className="authwrap pad" style={{ padding: "24px 22px 26px" }}>
        {step === "welcome" && (
          <div className="fadeup" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ paddingTop: 36 }}><Brandblock theme={theme} /></div>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <Button icon="user-plus" onClick={() => { setReg({ name: "", surname: "", country: "", email: "" }); setRegErr({}); go("register"); }}>
                Crear cuenta
              </Button>
              <Button variant="secondary" onClick={() => go("login")}>Ya tengo cuenta</Button>
              <p className="muted" style={{ fontSize: 12, textAlign: "center", margin: "8px 0 0", lineHeight: 1.5 }}>
                Acceso sin contraseña. Te identificás con tu correo.
              </p>
            </div>
          </div>
        )}

        {step === "register" && (
          <RegisterForm
            reg={reg} setReg={setReg} err={regErr}
            onBack={() => go("welcome")}
            onSubmit={() => {
              const e = {};
              if (!reg.name.trim()) e.name = "Ingresá tu nombre.";
              if (!reg.surname.trim()) e.surname = "Ingresá tu apellido.";
              if (!reg.country) e.country = "Elegí tu país.";
              if (!CV.emailRe.test(reg.email)) e.email = "Ingresá un correo válido.";
              setRegErr(e);
              if (Object.keys(e).length === 0) go("verify");
            }}
          />
        )}

        {step === "verify" && (
          <VerifyForm
            email={email} name={reg.name}
            onBack={() => go("register")}
            onVerified={() => onAuth({ name: reg.name || "Lucía", surname: reg.surname, email })}
          />
        )}

        {step === "login" && (
          <LoginForm
            email={loginEmail} setEmail={setLoginEmail} error={loginErr} setError={setLoginErr}
            onBack={() => go("welcome")}
            onSent={() => go("sent")}
          />
        )}

        {step === "sent" && (
          <SentScreen
            email={loginEmail}
            onBack={() => go("login")}
            onOpen={() => go("magic")}
            onExpired={() => go("expired")}
          />
        )}

        {step === "magic" && <MagicLink onDone={() => onAuth({ name: "Lucía", email: loginEmail || "lucia.m@gmail.com" })} />}

        {step === "expired" && (
          <div className="fadeup center-col" style={{ minHeight: "100%", justifyContent: "center", textAlign: "center", gap: 4 }}>
            <div className="modal-ic danger" style={{ width: 54, height: 54 }}><Icon name="link-2-off" size={26} /></div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg1)", margin: "8px 0 8px" }}>Este enlace expiró</h2>
            <p className="muted" style={{ fontSize: 14.5, margin: "0 0 22px", lineHeight: 1.5, maxWidth: 280 }}>
              Por seguridad, los enlaces vencen a los pocos minutos. Pedí uno nuevo y revisá tu correo.
            </p>
            <div style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>
              <Button icon="rotate-cw" onClick={() => go("sent")}>Enviar un nuevo enlace</Button>
              <Button variant="secondary" onClick={() => go("login")}>Usar otro correo</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RegisterForm({ reg, setReg, err, onBack, onSubmit }) {
  const set = (k) => (v) => setReg({ ...reg, [k]: v });
  return (
    <div className="fadeup">
      <button className="iconbtn" onClick={onBack} style={{ marginLeft: -8, marginBottom: 6 }}><Icon name="chevron-left" size={24} /></button>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "0 0 4px" }}>Crear tu cuenta</h1>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 22px", lineHeight: 1.5 }}>Con estos datos te reconocemos. Sin contraseñas.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Nombre" required error={err.name}>
          <TextInput value={reg.name} onChange={set("name")} placeholder="Lucía" icon="user-round" error={err.name} />
        </Field>
        <Field label="Apellido" required error={err.surname}>
          <TextInput value={reg.surname} onChange={set("surname")} placeholder="Méndez" error={err.surname} />
        </Field>
      </div>
      <Field label="País" required error={err.country}>
        <SelectInput value={reg.country} onChange={set("country")} options={CV.COUNTRIES} placeholder="Elegí tu país" icon="globe" error={err.country} />
      </Field>
      <Field label="Correo" required error={err.email} hint="Te enviaremos un código para verificarlo.">
        <TextInput value={reg.email} onChange={set("email")} placeholder="nombre@correo.com" icon="mail" type="email" inputMode="email" error={err.email} onEnter={onSubmit} />
      </Field>

      <Button icon="arrow-right" onClick={onSubmit} style={{ marginTop: 6 }}>Continuar</Button>
    </div>
  );
}

function VerifyForm({ email, name, onBack, onVerified }) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [left, setLeft] = React.useState(180); // seconds to expiry
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const expired = left <= 0;
  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");

  function submit() {
    if (expired) { setError("El código expiró. Reenvialo para recibir uno nuevo."); return; }
    const c = code.replace(/\D/g, "");
    if (c.length < 6) { setError("Ingresá los 6 dígitos del código."); return; }
    if (c === "000000") { setError("Ese código no es válido. Revisalo y probá de nuevo."); return; }
    onVerified();
  }
  function resend() {
    setLeft(180); setResendIn(30); setError(""); setCode("");
  }

  return (
    <div className="fadeup">
      <button className="iconbtn" onClick={onBack} style={{ marginLeft: -8, marginBottom: 6 }}><Icon name="chevron-left" size={24} /></button>
      <div className="center-col" style={{ textAlign: "center" }}>
        <div className="modal-ic" style={{ width: 54, height: 54, background: "var(--brand-tint)", color: "var(--brand-700)" }}>
          <Icon name="mail-check" size={26} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", color: "var(--fg1)", margin: "12px 0 8px" }}>Verificá tu correo</h1>
        <p className="muted" style={{ fontSize: 14, margin: "0 0 20px", lineHeight: 1.5, maxWidth: 290 }}>
          Te enviamos un código de 6 dígitos a<br /><strong style={{ color: "var(--fg1)" }}>{email}</strong>
        </p>
      </div>

      <CodeField value={code} onChange={(v) => { setCode(v); setError(""); }} error={!!error} />
      {error ? (
        <div className="fielderr" style={{ justifyContent: "center", marginTop: 12 }}><Icon name="alert-circle" size={14} />{error}</div>
      ) : (
        <p className="muted" style={{ fontSize: 12.5, textAlign: "center", marginTop: 12 }}>
          {expired ? "El código venció." : <>El código vence en <span className="mono" style={{ color: "var(--fg2)" }}>{mm}:{ss}</span></>}
        </p>
      )}

      <Button icon="check" onClick={submit} disabled={code.replace(/\D/g, "").length < 6} style={{ marginTop: 16 }}>
        Verificar y entrar
      </Button>

      <div className="row" style={{ justifyContent: "center", gap: 6, marginTop: 14, fontSize: 13 }}>
        <span className="muted">¿No te llegó?</span>
        <button className="addline" style={{ padding: 0 }} disabled={resendIn > 0} onClick={resend}>
          {resendIn > 0 ? `Reenviar en ${resendIn}s` : "Reenviar código"}
        </button>
      </div>

      <div className="demohint">
        <Icon name="flask-conical" size={14} />
        <span>Demo: usá <b>{DEMO_CODE}</b> o cualquier código de 6 dígitos.</span>
      </div>
      <p className="muted" style={{ fontSize: 11, textAlign: "center", marginTop: 8 }}>
        Probá <b className="mono">000000</b> para ver el error, o esperá a que venza.
      </p>
    </div>
  );
}

function LoginForm({ email, setEmail, error, setError, onBack, onSent }) {
  const valid = CV.emailRe.test(email);
  function submit() {
    if (!valid) { setError("Ingresá un correo válido."); return; }
    onSent();
  }
  return (
    <div className="fadeup" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <button className="iconbtn" onClick={onBack} style={{ marginLeft: -8, marginBottom: 6 }}><Icon name="chevron-left" size={24} /></button>
      <div style={{ paddingTop: 20 }}><Brandblock theme="light" sub="Iniciá sesión con tu correo. Te mandamos un enlace y entrás directo." /></div>
      <div style={{ marginTop: "auto" }}>
        <Field label="Tu correo" error={error}>
          <TextInput value={email} onChange={(v) => { setEmail(v); setError(""); }} placeholder="nombre@correo.com" icon="mail" type="email" inputMode="email" error={!!error} onEnter={submit} />
        </Field>
        <Button icon="send" disabled={!valid} onClick={submit}>Enviarme un enlace de acceso</Button>
        <p className="muted" style={{ fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
          Te enviamos un enlace mágico al correo. Tocalo y entrás directo.
        </p>
      </div>
    </div>
  );
}

function SentScreen({ email, onBack, onOpen, onExpired }) {
  const [resendIn, setResendIn] = React.useState(0);
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);
  return (
    <div className="fadeup center-col" style={{ minHeight: "100%", justifyContent: "center", textAlign: "center" }}>
      <div className="modal-ic" style={{ width: 60, height: 60, background: "var(--brand-tint)", color: "var(--brand-700)" }}>
        <Icon name="mail-check" size={28} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg1)", margin: "16px 0 8px" }}>Revisá tu correo</h2>
      <p className="muted" style={{ fontSize: 14.5, margin: "0 0 22px", lineHeight: 1.5, maxWidth: 290 }}>
        Enviamos un enlace de acceso a<br /><strong style={{ color: "var(--fg1)" }}>{email || "tu correo"}</strong>. Tocalo desde este dispositivo.
      </p>
      <div style={{ width: "100%", maxWidth: 290, display: "flex", flexDirection: "column", gap: 10 }}>
        <Button icon="external-link" onClick={onOpen}>Abrir enlace (demo)</Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" disabled={resendIn > 0} onClick={() => setResendIn(30)}>{resendIn > 0 ? `Reenviar (${resendIn})` : "Reenviar"}</Button>
          <Button variant="secondary" onClick={onBack}>Otro correo</Button>
        </div>
      </div>
      <button className="addline" style={{ marginTop: 18 }} onClick={onExpired}>Simular enlace vencido</button>
    </div>
  );
}

function MagicLink({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="magiclink fadeup">
      <div className="spinner" />
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--fg1)", margin: "0 0 6px" }}>Verificando tu enlace…</h2>
      <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.5 }}>Un segundo, estamos abriendo tu sesión.</p>
    </div>
  );
}

window.AuthFlow = AuthFlow;
