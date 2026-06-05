/* Icon — robust Lucide wrapper. Builds the SVG imperatively so React
   never fights Lucide's DOM swap. window.Icon + window.ICON_FOR */
function Icon({ name, size = 20, stroke = 2, color, style, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = "";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    host.appendChild(i);
    window.lucide.createIcons({ attrs: { "stroke-width": stroke } });
  }, [name, stroke]);
  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, color: color || "currentColor", flex: "none", ...style,
      }}
    />
  );
}

/* sub-type -> Lucide name */
const ICON_FOR = {
  plane: "plane", train: "train-front", bus: "bus",
  hotel: "hotel", airbnb: "house", posada: "bed-double", otro: "bed",
};

Object.assign(window, { Icon, ICON_FOR });
