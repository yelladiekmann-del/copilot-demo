import { Clock, Layers, Brain, Zap, Smile, Award } from "lucide-react";

const items = [
  {
    icon: Smile,
    title: "Souverän in jedes Gespräch",
    body: "Nie wieder das Gefühl, schlecht vorbereitet zu sein. Sie kennen Ihren Kunden in dem Moment, in dem Sie abnehmen — Name, Anliegen, Historie. Das gibt Sicherheit.",
  },
  {
    icon: Clock,
    title: "Kein Vor- und Nachbereiten mehr",
    body: "Bis zu 90 Minuten täglich, die Sie heute mit Suchen in sieben Systemen verbringen, gewinnen Sie zurück — für echte Beratung statt Klick-Arbeit.",
  },
  {
    icon: Layers,
    title: "Ein Workspace, kein Tab-Chaos",
    body: "Telefonie, CRM, Kernbank und Notizen in einer fokussierten Oberfläche. Schluss mit zehn offenen Fenstern und der ständigen Angst, etwas zu übersehen.",
  },
  {
    icon: Brain,
    title: "Der Copilot, der mitdenkt",
    body: "Aurea schlägt Themen vor, die Sie sonst übersehen würden: auslaufende Verträge, ungenutzte Vorsorge, passende Anlässe. Sie entscheiden — der Copilot erinnert.",
  },
  {
    icon: Award,
    title: "Bessere Abschlüsse, weniger Zufall",
    body: "Wer den Kunden kennt, verkauft passender. Der Copilot erinnert an Anlässe, die im Alltag oft untergehen — und macht Cross-Sell zur natürlichen Folge guter Beratung.",
  },
  {
    icon: Zap,
    title: "Endlich legitime KI im Arbeitsalltag",
    body: "Schluss mit dem heimlichen Wechsel zu privaten Tools. Aurea ist im offiziellen Stack — Sie nutzen modernste KI, ohne Compliance-Bauchschmerzen.",
  },
];

export function ValueProps() {
  return (
    <section id="value" className="relative bg-secondary/40 py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] font-bold mb-3" style={{ color: "var(--vb-orange)" }}>Mehrwert für Berater</div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: "var(--vb-navy)" }}>
            Was sich für Sie im Arbeitsalltag ändert.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Der Copilot wurde nicht für das Management gebaut, sondern für die Menschen, die jeden Tag mit Kunden sprechen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="group vb-card rounded-xl p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--vb-navy)" }}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--vb-navy)" }}>{it.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}