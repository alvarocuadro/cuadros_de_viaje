/* Cuadros de viaje — Tweaks panel UI. window.TweaksUI */
const ACCENT_HEX = ["#1E7FA8", "#2FA39E", "#123A5C"];
const HEX_TO_ACCENT = { "#1e7fa8": "azure", "#2fa39e": "teal", "#123a5c": "navy" };
const ACCENT_TO_HEX = { azure: "#1E7FA8", teal: "#2FA39E", navy: "#123A5C" };

function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Apariencia" />
      <TweakToggle label="Modo oscuro" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      <TweakColor
        label="Color de acento" value={ACCENT_TO_HEX[t.accent] || ACCENT_HEX[0]} options={ACCENT_HEX}
        onChange={(hex) => setTweak("accent", HEX_TO_ACCENT[String(hex).toLowerCase()] || "azure")}
      />
      <TweakRadio
        label="Densidad" value={t.density}
        options={[{ value: "compact", label: "Compacta" }, { value: "regular", label: "Normal" }, { value: "comfy", label: "Cómoda" }]}
        onChange={(v) => setTweak("density", v)}
      />
      <TweakSlider label="Radio de tarjetas" value={t.cardRadius} min={8} max={24} step={1} unit="px" onChange={(v) => setTweak("cardRadius", v)} />

      <TweakSection label="Pantalla de inicio" />
      <TweakRadio
        label="Tarjetas de viaje" value={t.homeVariant}
        options={[{ value: "default", label: "Estándar" }, { value: "compact", label: "Compacta" }]}
        onChange={(v) => setTweak("homeVariant", v)}
      />

      <TweakSection label="Contenido" />
      <TweakRadio
        label="Vista" value={t.device}
        options={[{ value: "mobile", label: "Teléfono" }, { value: "desktop", label: "Escritorio" }]}
        onChange={(v) => setTweak("device", v)}
      />
      <TweakRadio
        label="Datos" value={t.data}
        options={[{ value: "seed", label: "Ejemplo" }, { value: "empty", label: "Vacío" }]}
        onChange={(v) => setTweak("data", v)}
      />
    </TweaksPanel>
  );
}

window.TweaksUI = TweaksUI;
