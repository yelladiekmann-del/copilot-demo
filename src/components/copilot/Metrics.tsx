const stats = [
  { value: "−87 %", label: "Vorbereitungszeit pro Gespräch", sub: "von 6 min auf < 1 min" },
  { value: "+34 %", label: "Cross-Sell-Erfolgsquote", sub: "in Pilotbanken (n=4)" },
  { value: "4,8 ★", label: "Zufriedenheit Beraterteam", sub: "internes Feedback" },
  { value: "< 200 ms", label: "Latenz Dossier-Aufbau", sub: "p99 inkl. Kernbank" },
];

export function Metrics() {
  return (
    <section id="metrics" className="relative py-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-xs uppercase tracking-[0.25em] font-bold mb-3" style={{ color: "var(--vb-orange)" }}>Messbar</div>
        <h2 className="text-3xl md:text-5xl font-extrabold max-w-xl mb-14 text-white leading-tight">
          Wirkung, die im ersten Quartal sichtbar wird.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="border-l-4 pl-5" style={{ borderColor: "var(--vb-orange)" }}>
              <div className="text-4xl md:text-6xl font-extrabold mb-2 text-white tracking-tight">{s.value}</div>
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="text-xs text-white/60 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}