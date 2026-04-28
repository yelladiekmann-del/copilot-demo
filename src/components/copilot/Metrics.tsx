const stats = [
  { value: "−87%", label: "Vorbereitungszeit pro Gespräch", sub: "von 6 min auf <1 min" },
  { value: "+34%", label: "Cross-Sell-Erfolgsquote", sub: "in Pilotbanken (n=4)" },
  { value: "4.8★", label: "Net Promoter Score Berater", sub: "internes Feedback" },
  { value: "<200ms", label: "Latenz Dossier-Aufbau", sub: "p99 inkl. Kernbank" },
];

export function Metrics() {
  return (
    <section id="metrics" className="relative max-w-7xl mx-auto px-6 py-20">
      <div className="glass rounded-3xl p-10 md:p-14 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Messbar</div>
          <h2 className="font-display text-3xl md:text-4xl font-medium max-w-xl mb-12">
            Wirkung, die im ersten Quartal sichtbar wird.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl md:text-5xl gold-text mb-2">{s.value}</div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}