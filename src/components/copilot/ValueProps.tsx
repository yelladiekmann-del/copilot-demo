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
    title: "Mehr Erfolg, mehr Bonus",
    body: "Berater im Pilot erreichen +34% Cross-Sell-Quote. Bessere Vorbereitung führt zu besseren Abschlüssen — und das wirkt sich direkt auf Ihre Zielerreichung aus.",
  },
  {
    icon: Zap,
    title: "Endlich legitime KI im Arbeitsalltag",
    body: "Schluss mit dem heimlichen Wechsel zu privaten Tools. Aurea ist im offiziellen Stack — Sie nutzen modernste KI, ohne Compliance-Bauchschmerzen.",
  },
];

export function ValueProps() {
  return (
    <section id="value" className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-14">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Mehrwert</div>
        <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">
          Was sich für Sie als <span className="display-text italic">Berater</span> ändert.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Aurea wurde nicht für das Management gebaut, sondern für die Menschen, die jeden Tag mit Kunden sprechen. Hier ist, was das für Ihren Arbeitsalltag bedeutet.
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