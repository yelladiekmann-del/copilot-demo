const steps = [
  {
    num: "01",
    title: "Anruf trifft ein",
    body: "Die Telefonanlage übergibt die Rufnummer an den Copilot — noch bevor Sie abheben.",
  },
  {
    num: "02",
    title: "Identität wird erkannt",
    body: "Abgleich mit CRM und Kernbankensystem in wenigen hundert Millisekunden — ohne manuelles Suchen.",
  },
  {
    num: "03",
    title: "Dossier baut sich auf",
    body: "Konten, Verträge, letzte Interaktionen und offene Aufgaben erscheinen automatisch in einer Oberfläche.",
  },
  {
    num: "04",
    title: "KI schlägt Themen vor",
    body: "Auslaufende Verträge, Beratungsanlässe und passende Produkte — kontextsensitiv und im Hintergrund.",
  },
];

export function Metrics() {
  return (
    <section id="metrics" className="relative py-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-xs uppercase tracking-[0.25em] font-bold mb-3" style={{ color: "var(--vb-orange)" }}>So funktioniert's</div>
        <h2 className="text-3xl md:text-5xl font-extrabold max-w-2xl mb-14 text-white leading-tight">
          Vom Klingeln bis zum Dossier — in wenigen Sekunden.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="border-l-4 pl-5" style={{ borderColor: "var(--vb-orange)" }}>
              <div className="text-sm font-mono font-bold mb-3" style={{ color: "var(--vb-orange)" }}>{s.num}</div>
              <div className="text-xl font-bold text-white mb-2">{s.title}</div>
              <div className="text-sm text-white/70 leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}