import { Clock, Layers, Shield, Brain, Zap, Users } from "lucide-react";

const items = [
  { icon: Clock, title: "Vorbereitung in 0 Sekunden", body: "Kein Suchen, kein Wechseln zwischen Systemen. Das Dossier ist da, bevor das Telefon zum zweiten Mal klingelt." },
  { icon: Layers, title: "Eine Oberfläche statt sieben", body: "Telefonie, CRM, Kernbank, Kalender und Dokumente — vereint in einem fokussierten Berater-Workspace." },
  { icon: Brain, title: "Beratungsthemen vorgeschlagen", body: "Aurea erkennt Anlässe, Cross-Sell-Chancen und auslaufende Verträge — kontextsensitiv und proaktiv." },
  { icon: Shield, title: "On-Premise & FINMA-konform", body: "Daten verlassen Ihr Rechenzentrum nicht. Audit-Logs, RBAC, Verschlüsselung — Enterprise von Tag eins." },
  { icon: Zap, title: "Schluss mit Schatten-KI", body: "Mitarbeitende greifen nicht mehr zu privaten Tools. Eine sichere, integrierte Lösung im offiziellen Stack." },
  { icon: Users, title: "Konsistenz über alle Berater", body: "Jede Kundin erlebt das gleiche professionelle Niveau — unabhängig davon, wer am Telefon ist." },
];

export function ValueProps() {
  return (
    <section id="value" className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-14">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Mehrwert</div>
        <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">
          Aus reaktiv wird <span className="display-text italic">vorausschauend.</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Aurea verändert nicht nur, wie Berater arbeiten — es verändert, wie Kunden Ihre Bank erleben.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="group glass rounded-2xl p-6 hover:border-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/60 flex items-center justify-center mb-4 group-hover:from-primary/30 transition-colors">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}