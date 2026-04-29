import { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone, PhoneIncoming, Mic, PauseCircle, Play, RotateCcw,
  TrendingUp, AlertCircle, Sparkles, FileText, ArrowUpRight,
  Calendar, Wallet, Home, Briefcase, ChevronRight, CheckCircle2,
  Search, Database, UserCheck, Loader2, PiggyBank, Building2,
} from "lucide-react";

// ---------- Types ----------
type Tag = "amount" | "product" | "compliance" | "followup" | "risk";
type Speaker = "advisor" | "client";
type FieldKey = "kunde" | "anliegen" | "konto" | "vertrag" | "empfehlung" | "naechster";

interface Line {
  t: number;
  who: Speaker;
  text: string;
  highlights?: { phrase: string; tag: Tag }[];
  emits?: FieldKey;
}
interface Insight { t: number; tone: "warning" | "accent" | "primary"; title: string; body: string; icon: any }
interface Field { key: FieldKey; label: string; value: string; t: number; icon: any }
interface Scenario {
  id: string;
  label: string;
  blurb: string;
  icon: any;
  number: string;
  initials: string;
  name: string;
  meta: string;
  badge: string;
  netWorth: { label: string; value: string; trend?: string }[];
  duration: number;
  script: Line[];
  fields: Field[];
  insights: Insight[];
  nextAction: { title: string; sub: string };
}

// ---------- Scenarios ----------
const sBaufi: Scenario = {
  id: "baufi",
  label: "Anschlussfinanzierung",
  blurb: "Bestandskundin · Hypothek läuft aus",
  icon: Home,
  number: "+49 6221 412 88 03",
  initials: "MK",
  name: "Marina Keller",
  meta: "Selbstständig · 42 J. · Heidelberg · ausgewogen",
  badge: "VR-Mitglied",
  netWorth: [
    { label: "Vermögen", value: "612 T€", trend: "+4,2 %" },
    { label: "Verbindlichkeiten", value: "320 T€", trend: "Baufi." },
    { label: "Liquidität", value: "38,5 T€", trend: "3 Konten" },
  ],
  duration: 30,
  script: [
    { t: 0.5, who: "client", text: "Guten Tag, hier Marina Keller. Eine kurze Frage zu meiner Baufinanzierung." },
    { t: 5.0, who: "advisor", text: "Frau Keller, schön Sie zu hören — Sie meinen die Festzinsbindung, die im März ausläuft?",
      highlights: [{ phrase: "Festzinsbindung", tag: "compliance" }, { phrase: "März", tag: "amount" }], emits: "vertrag" },
    { t: 10.0, who: "client", text: "Genau. Ich überlege, ob ich verlängern oder umschulden soll.", emits: "anliegen" },
    { t: 14.5, who: "advisor", text: "Aktuell laufen 320.000 € zu 1,45 % — ein Forward-Darlehen wäre jetzt sinnvoll.",
      highlights: [{ phrase: "320.000 €", tag: "amount" }, { phrase: "1,45 %", tag: "amount" }, { phrase: "Forward-Darlehen", tag: "product" }], emits: "empfehlung" },
    { t: 21.0, who: "client", text: "Können Sie mir das durchrechnen und Varianten schicken?" },
    { t: 25.0, who: "advisor", text: "Sehr gerne. Ich schlage einen Termin nächste Woche vor — drei Varianten bis dahin.",
      highlights: [{ phrase: "Termin nächste Woche", tag: "followup" }, { phrase: "drei Varianten", tag: "followup" }], emits: "naechster" },
  ],
  fields: [
    { key: "kunde", label: "Kunde", value: "Marina Keller · #884291", t: 0.3, icon: UserCheck },
    { key: "konto", label: "Beziehung", value: "Kundin seit 2014 · VR-Mitglied", t: 0.3, icon: Database },
    { key: "vertrag", label: "Auslaufende Bindung", value: "320.000 € · 14.03.2026", t: 5.0, icon: Home },
    { key: "anliegen", label: "Anliegen", value: "Anschlussfinanzierung", t: 10.0, icon: FileText },
    { key: "empfehlung", label: "Empfehlung", value: "Forward-Darlehen prüfen", t: 14.5, icon: Sparkles },
    { key: "naechster", label: "Nächster Schritt", value: "Termin · 3 Varianten", t: 25.0, icon: Calendar },
  ],
  insights: [
    { t: 6, tone: "warning", icon: AlertCircle, title: "Zinsbindung läuft in 47 Tagen aus", body: "320 T€ · 1,45 % · Forward-Darlehen jetzt sinnvoll" },
    { t: 12, tone: "accent", icon: TrendingUp, title: "Cross-Sell-Chance", body: "VR Riester nicht voll ausgeschöpft (ca. 1.800 € möglich)" },
    { t: 18, tone: "primary", icon: Sparkles, title: "Gesprächseinstieg", body: "Festgeld 2,40 % erwähnen — passt zum Liquiditätsprofil" },
  ],
  nextAction: { title: "Termin „Anschlussfinanzierung" vorschlagen", sub: "Mi 04.03 · 14:00 · Filiale Heidelberg" },
};

const sVorsorge: Scenario = {
  id: "vorsorge",
  label: "Altersvorsorge",
  blurb: "Erstkontakt · Lebenssituation geändert",
  icon: PiggyBank,
  number: "+49 6221 779 42 11",
  initials: "TS",
  name: "Thomas Sauer",
  meta: "Angestellter · 38 J. · Mannheim · neu im Portfolio",
  badge: "Neukunde",
  netWorth: [
    { label: "Vermögen", value: "94 T€", trend: "Aufbau" },
    { label: "Sparrate", value: "320 €/Mo", trend: "regelmäßig" },
    { label: "Vorsorge", value: "—", trend: "Lücke" },
  ],
  duration: 28,
  script: [
    { t: 0.5, who: "client", text: "Hallo, mein Name ist Thomas Sauer. Wir haben gerade unser zweites Kind bekommen." },
    { t: 6.0, who: "advisor", text: "Herzlichen Glückwunsch! Geht es um Vorsorge für die Familie?", emits: "anliegen" },
    { t: 10.0, who: "client", text: "Ja, ich mache mir Sorgen wegen der Rente. 250 € im Monat wären drin.",
      highlights: [{ phrase: "Rente", tag: "risk" }, { phrase: "250 € im Monat", tag: "amount" }], emits: "vertrag" },
    { t: 16.0, who: "advisor", text: "Ein ETF-Sparplan ausgewogen mit Riester-Förderung passt sehr gut.",
      highlights: [{ phrase: "ETF-Sparplan ausgewogen", tag: "product" }, { phrase: "Riester-Förderung", tag: "product" }], emits: "empfehlung" },
    { t: 22.0, who: "advisor", text: "Ich schicke das Produktblatt und schlage einen Folgetermin in 2 Wochen vor.",
      highlights: [{ phrase: "Produktblatt", tag: "followup" }, { phrase: "Folgetermin in 2 Wochen", tag: "followup" }], emits: "naechster" },
  ],
  fields: [
    { key: "kunde", label: "Kunde", value: "Thomas Sauer · #921044", t: 0.3, icon: UserCheck },
    { key: "konto", label: "Beziehung", value: "Girokonto · Sparbuch · Neukunde", t: 0.3, icon: Database },
    { key: "anliegen", label: "Anliegen", value: "Familienvorsorge / Rente", t: 6.0, icon: FileText },
    { key: "vertrag", label: "Sparrate", value: "250 € / Monat", t: 10.0, icon: Wallet },
    { key: "empfehlung", label: "Empfehlung", value: "ETF-Sparplan + Riester", t: 16.0, icon: Sparkles },
    { key: "naechster", label: "Nächster Schritt", value: "Folgetermin · 14 Tage", t: 22.0, icon: Calendar },
  ],
  insights: [
    { t: 7, tone: "warning", icon: AlertCircle, title: "Vorsorgelücke erkannt", body: "Keine private Rente · Familienzuwachs verstärkt Bedarf" },
    { t: 13, tone: "accent", icon: TrendingUp, title: "Riester voll förderfähig", body: "2 Kinder · max. Zulage 925 €/Jahr möglich" },
    { t: 19, tone: "primary", icon: Sparkles, title: "Tipp", body: "Risikolebensversicherung ergänzend anbieten" },
  ],
  nextAction: { title: "Termin „Vorsorge & Familienschutz"", sub: "Di 10.03 · 17:30 · Filiale Mannheim" },
};

const sFirma: Scenario = {
  id: "firma",
  label: "Firmenkunde",
  blurb: "Mittelstand · Investitionsbedarf",
  icon: Building2,
  number: "+49 6202 935 78 00",
  initials: "RB",
  name: "Rainer Becker",
  meta: "Becker GmbH · Geschäftsführer · 12 Jahre Kunde",
  badge: "Premium-Firma",
  netWorth: [
    { label: "Geschäftsguthaben", value: "412 T€", trend: "stabil" },
    { label: "Linie", value: "200 T€", trend: "55 % belegt" },
    { label: "Umsatz p.a.", value: "8,4 Mio €", trend: "+6 %" },
  ],
  duration: 26,
  script: [
    { t: 0.5, who: "client", text: "Becker hier. Wir wollen in zwei neue CNC-Maschinen investieren — 320.000 €.",
      highlights: [{ phrase: "320.000 €", tag: "amount" }, { phrase: "CNC-Maschinen", tag: "product" }], emits: "anliegen" },
    { t: 7.0, who: "advisor", text: "Verstanden. Nutzungsdauer und Förderoptionen gecheckt?",
      highlights: [{ phrase: "Förderoptionen", tag: "compliance" }] },
    { t: 12.0, who: "client", text: "8 Jahre Nutzung. KfW wäre interessant.",
      highlights: [{ phrase: "KfW", tag: "product" }], emits: "vertrag" },
    { t: 17.0, who: "advisor", text: "KfW-Programm 295 passt genau. Ich brauche noch BWA und Liquiditätsplanung.",
      highlights: [{ phrase: "KfW-Programm 295", tag: "product" }, { phrase: "BWA", tag: "compliance" }, { phrase: "Liquiditätsplanung", tag: "compliance" }], emits: "empfehlung" },
    { t: 23.0, who: "advisor", text: "Checkliste schicke ich heute, Termin Donnerstag.",
      highlights: [{ phrase: "Checkliste heute", tag: "followup" }, { phrase: "Donnerstag", tag: "followup" }], emits: "naechster" },
  ],
  fields: [
    { key: "kunde", label: "Firma", value: "Becker GmbH · #F-2104", t: 0.3, icon: UserCheck },
    { key: "konto", label: "Beziehung", value: "Premium-Firma · seit 2013", t: 0.3, icon: Database },
    { key: "anliegen", label: "Vorhaben", value: "2 CNC-Maschinen · 320 T€", t: 0.5, icon: Briefcase },
    { key: "vertrag", label: "Nutzungsdauer", value: "8 Jahre", t: 12.0, icon: Calendar },
    { key: "empfehlung", label: "Empfehlung", value: "KfW 295 + Hausbank-Anteil", t: 17.0, icon: Sparkles },
    { key: "naechster", label: "Nächster Schritt", value: "Checkliste · Termin Do.", t: 23.0, icon: FileText },
  ],
  insights: [
    { t: 4, tone: "accent", icon: TrendingUp, title: "Förderfähig", body: "KfW 295 für Investitionen — bis 80 % refinanzierbar" },
    { t: 10, tone: "warning", icon: AlertCircle, title: "Linie zu 55 % belegt", body: "Erweiterung sinnvoll vor neuer Investition" },
    { t: 16, tone: "primary", icon: Sparkles, title: "Cross-Sell", body: "Leasing als Alternative — schont Liquidität" },
  ],
  nextAction: { title: "Unterlagen anfordern + Termin Do. 14:00", sub: "BWA 2 J. · Liquiditätsplan · KfW-Antrag" },
};

const SCENARIOS = [sBaufi, sVorsorge, sFirma];

const tagStyles: Record<Tag, string> = {
  amount: "tag-chip bg-[oklch(0.95_0.05_48)] text-[oklch(0.45_0.18_42)]",
  product: "tag-chip bg-[oklch(0.94_0.04_155)] text-[oklch(0.4_0.13_155)]",
  compliance: "tag-chip bg-[oklch(0.94_0.03_258)] text-[oklch(0.32_0.09_258)]",
  followup: "tag-chip bg-[oklch(0.95_0.05_48)] text-[oklch(0.45_0.18_42)]",
  risk: "tag-chip bg-[oklch(0.94_0.06_60)] text-[oklch(0.5_0.15_50)]",
};

const recognitionSteps = [
  { icon: Search, label: "Nummer im CRM abgleichen", source: "Salesforce VR-CRM" },
  { icon: UserCheck, label: "Identität verifiziert", source: "" },
  { icon: Database, label: "Kernbankendaten laden", source: "agree21 · Konten · Verträge" },
  { icon: Sparkles, label: "Kontext aufbereitet", source: "Letzte Interaktionen · KI-Themen" },
];

type Phase = "idle" | "ringing" | "active" | "ended";

// ---------- Helpers ----------
function renderHighlighted(text: string, highlights?: { phrase: string; tag: Tag }[]) {
  if (!highlights || highlights.length === 0) return text;
  let parts: (string | { phrase: string; tag: Tag })[] = [text];
  for (const h of highlights) {
    const next: typeof parts = [];
    for (const p of parts) {
      if (typeof p !== "string") { next.push(p); continue; }
      const idx = p.indexOf(h.phrase);
      if (idx === -1) { next.push(p); continue; }
      next.push(p.slice(0, idx), { phrase: h.phrase, tag: h.tag }, p.slice(idx + h.phrase.length));
    }
    parts = next.filter((p) => p !== "");
  }
  return parts.map((p, i) =>
    typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} className={tagStyles[p.tag]}>{p.phrase}</span>
  );
}

// ---------- Main ----------
export function CopilotDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = SCENARIOS[scenarioIdx];
  const [phase, setPhase] = useState<Phase>("idle");
  const [recogStep, setRecogStep] = useState(0);
  const [time, setTime] = useState(0); // seconds elapsed in active call
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  const recognized = phase === "active" || phase === "ended";

  const switchScenario = (i: number) => {
    setScenarioIdx(i);
    setPhase("idle");
    setTime(0);
    setPlaying(false);
    setRecogStep(0);
  };

  // Recognition cascade
  useEffect(() => {
    if (phase !== "ringing") { setRecogStep(0); return; }
    const timeouts: number[] = [];
    recognitionSteps.forEach((_, i) => {
      timeouts.push(window.setTimeout(() => setRecogStep(i + 1), 500 + i * 600));
    });
    timeouts.push(window.setTimeout(() => { setPhase("active"); setPlaying(true); }, 500 + recognitionSteps.length * 600 + 300));
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [phase]);

  // Play loop
  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (last.current == null) last.current = ts;
      const dt = (ts - last.current) / 1000;
      last.current = ts;
      setTime((prev) => {
        const next = prev + dt;
        if (next >= scenario.duration) { setPlaying(false); setPhase("ended"); return scenario.duration; }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, scenario.duration]);

  const visibleLines = useMemo(() => scenario.script.filter((l) => l.t <= time), [time, scenario]);
  const visibleFields = useMemo(() => scenario.fields.filter((f) => f.t <= time), [time, scenario]);
  const visibleInsights = useMemo(() => scenario.insights.filter((i) => i.t <= time), [time, scenario]);

  const progress = Math.min(100, (time / scenario.duration) * 100);
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(Math.floor(time % 60)).padStart(2, "0");
  const filledCount = visibleFields.length;
  const totalFields = scenario.fields.length;
  // Estimated time saved: assume ~12 min manual prep + wrap-up per call
  const savedSec = Math.round((time / scenario.duration) * 720);
  const savedMin = Math.floor(savedSec / 60);

  return (
    <section id="demo" className="relative max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "var(--vb-orange)" }}>Live-Simulation</div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "var(--vb-navy)" }}>
          Drücken Sie <span style={{ color: "var(--vb-orange)" }}>Anruf annehmen</span>.<br />
          Schauen Sie zu, wie sich Ihr Dossier selbst aufbaut.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Wählen Sie ein Szenario aus dem Beratungsalltag. Links Anruf & Live-Transkript,
          in der Mitte das Kundendossier — füllt sich Feld für Feld. Rechts: KI-Hinweise, die im Gespräch zählen.
        </p>
      </div>

      {/* Scenario switcher */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {SCENARIOS.map((s, i) => {
          const Icon = s.icon;
          const active = i === scenarioIdx;
          return (
            <button
              key={s.id}
              onClick={() => switchScenario(i)}
              className={`group flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5 text-left transition-all ${
                active ? "bg-card shadow-[var(--shadow-glow)]" : "border-border bg-card/60 hover:bg-card"
              }`}
              style={active ? { borderColor: "var(--vb-orange)" } : undefined}
            >
              <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: active ? "var(--gradient-orange)" : "var(--vb-navy)" }}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: active ? "var(--vb-orange)" : "var(--vb-navy)" }}>{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.blurb}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Studio control bar */}
      {phase !== "idle" && (
        <div className="vb-card rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => { if (phase === "ended") { setTime(0); setPhase("active"); setPlaying(true); } else setPlaying((p) => !p); }}
            className="h-11 w-11 rounded-full text-white flex items-center justify-center shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-orange)" }}
            disabled={phase === "ringing"}
          >
            {playing ? <PauseCircle className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button
            onClick={() => { setTime(0); setPlaying(false); setPhase("idle"); }}
            className="h-11 w-11 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-card"
            title="Zurücksetzen"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-[200px]">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full transition-all duration-200" style={{ width: `${progress}%`, background: "var(--gradient-orange)" }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>{mm}:{ss} / 00:{String(scenario.duration).padStart(2, "0")}</span>
              <span>{filledCount}/{totalFields} Felder gefüllt</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">KI-Konfidenz</div>
              <div className="font-bold" style={{ color: "var(--vb-navy)" }}>{time === 0 ? 0 : Math.min(99, 88 + Math.round(progress * 0.11))} %</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Zeit gespart</div>
              <div className="font-bold" style={{ color: "var(--vb-orange)" }}>~{savedMin}:{String(savedSec % 60).padStart(2, "0")} min</div>
            </div>
          </div>
        </div>
      )}

      <div className="vb-card rounded-2xl p-3 md:p-5 shadow-[var(--shadow-elegant)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-3 pb-3 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.16_145)]" />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">copilot.volksbank-kurpfalz.de · advisor workspace</div>
          <div className="text-[11px] text-muted-foreground">{phase === "active" ? "● live" : phase === "ended" ? "beendet" : "bereit"}</div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-3 md:p-5">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <CallPanel scenario={scenario} phase={phase} setPhase={setPhase} recogStep={recogStep} duration={`${mm}:${ss}`} />
            <Transcript lines={visibleLines} active={phase === "active"} caretAfterT={time} />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Dossier scenario={scenario} recognized={recognized} visibleFields={visibleFields} active={phase === "active"} />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <AIInsights scenario={scenario} recognized={recognized} visibleInsights={visibleInsights} ended={phase === "ended"} />
          </div>
        </div>
      </div>

      {/* Wrap-up after call ends */}
      {phase === "ended" && (
        <div className="mt-6 vb-card rounded-2xl p-6 animate-pop-in" style={{ borderColor: "var(--vb-orange)", borderWidth: 2 }}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-orange)" }}>
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "var(--vb-orange)" }}>Auto-Wrap-up</div>
              <h4 className="font-display text-2xl font-semibold" style={{ color: "var(--vb-navy)" }}>Gespräch beendet — alles bereits dokumentiert.</h4>
              <p className="text-sm text-muted-foreground mt-1">Notizen, CRM-Eintrag und Folgeaufgaben wurden automatisch erstellt. Sie müssen nichts mehr tippen.</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <WrapItem icon={FileText} title="Notiz im CRM" sub="Strukturierter Bogen abgelegt" />
                <WrapItem icon={Calendar} title="Folgetermin vorgemerkt" sub={scenario.nextAction.sub} />
                <WrapItem icon={Sparkles} title="2 Aufgaben angelegt" sub="Unterlagen + Rückruf" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function WrapItem({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="rounded-xl bg-secondary border border-border p-3 flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5" style={{ color: "var(--vb-navy)" }} />
      <div>
        <div className="text-sm font-semibold" style={{ color: "var(--vb-navy)" }}>{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function CallPanel({ scenario, phase, setPhase, recogStep, duration }: { scenario: Scenario; phase: Phase; setPhase: (p: Phase) => void; recogStep: number; duration: string }) {
  const callActive = phase === "active" || phase === "ended";
  const ringing = phase === "ringing";
  const idle = phase === "idle";

  return (
    <div className="rounded-xl bg-secondary border border-border p-5">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <PhoneIncoming className="h-3.5 w-3.5" />
          {phase === "active" ? "Aktiver Anruf" : phase === "ended" ? "Anruf beendet" : ringing ? "Anruf eingehend…" : "Bereit"}
        </span>
        <span className="font-mono">{duration}</span>
      </div>

      <div className="flex flex-col items-center text-center py-3">
        <div className={`relative h-20 w-20 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 ${
          idle ? "bg-card border-border" :
          callActive ? "border-2" :
          "bg-card border-2 pulse-ring"
        }`}>
          {callActive && <div className="absolute inset-0 rounded-full" style={{ background: "var(--gradient-orange)", opacity: 0.15 }} />}
          {idle || ringing ? (
            <Phone className={`h-7 w-7 ${ringing ? "animate-pulse" : "text-muted-foreground"}`} style={ringing ? { color: "var(--vb-orange)" } : undefined} />
          ) : (
            <span className="text-2xl font-bold relative animate-pop-in" style={{ color: "var(--vb-navy)" }}>{scenario.initials}</span>
          )}
        </div>

        <div className="font-mono text-sm tracking-wider" style={{ color: "var(--vb-navy)" }}>{scenario.number}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {idle ? "Keine Verbindung" : ringing ? "Nummer wird erkannt…" : "Identität verifiziert"}
        </div>

        <div className="mt-3 min-h-[44px]">
          {callActive && (
            <div className="animate-pop-in">
              <div className="text-lg font-bold" style={{ color: "var(--vb-navy)" }}>{scenario.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{scenario.meta}</div>
            </div>
          )}
          {ringing && (
            <div className="text-xs text-muted-foreground italic">Abgleich mit CRM & Kernbank läuft…</div>
          )}
        </div>

        {ringing && (
          <div className="mt-4 w-full space-y-1.5 text-left">
            {recognitionSteps.map((s, i) => {
              const Icon = s.icon;
              const done = i < recogStep;
              const active = i === recogStep;
              const source = i === 1 ? `${scenario.name} · #${scenario.number.replace(/\D/g, "").slice(-6)}` : s.source;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border text-[11px] transition-all ${
                    done ? "bg-card border-border text-muted-foreground" :
                    active ? "bg-card border-2 text-foreground" :
                    "bg-transparent border-transparent text-muted-foreground/40"
                  }`}
                  style={active ? { borderColor: "var(--vb-orange)" } : undefined}
                >
                  <span className="h-5 w-5 rounded-md flex items-center justify-center shrink-0">
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--vb-navy)" }} /> :
                     active ? <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "var(--vb-orange)" }} /> :
                     <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{s.label}</div>
                    {(done || active) && source && (
                      <div className="font-mono text-[9px] text-muted-foreground/80 truncate">{source}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {phase === "active" ? (
          <div className="mt-5 flex items-center gap-2">
            <button className="h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary">
              <Mic className="h-4 w-4" />
            </button>
            <button onClick={() => setPhase("ended")} className="h-11 px-5 rounded-full bg-[oklch(0.55_0.22_25)] text-white text-sm font-semibold hover:opacity-90">
              Auflegen
            </button>
          </div>
        ) : idle ? (
          <button
            onClick={() => setPhase("ringing")}
            className="mt-6 vb-pill vb-pill-orange inline-flex items-center gap-2 pulse-ring"
          >
            <Phone className="h-4 w-4" />
            Anruf annehmen
          </button>
        ) : phase === "ended" ? (
          <div className="mt-5 text-[11px] text-muted-foreground">Wrap-up unten ↓</div>
        ) : (
          <div className="mt-6 text-[11px] text-muted-foreground font-mono">verbinde…</div>
        )}
      </div>
    </div>
  );
}

function Transcript({ lines, active, caretAfterT }: { lines: Line[]; active: boolean; caretAfterT: number }) {
  return (
    <div className="rounded-xl bg-secondary border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Live-Transkript</span>
        {active && <span className="text-[10px] font-mono font-bold flex items-center gap-1.5" style={{ color: "var(--vb-orange)" }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--vb-orange)" }} /> REC
        </span>}
      </div>
      <div className="space-y-3 min-h-[180px] max-h-[280px] overflow-y-auto text-sm">
        {lines.length === 0 && <div className="text-xs text-muted-foreground italic">Wird aktiv, sobald der Anruf beginnt.</div>}
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2 animate-pop-in">
            <div className="text-[10px] font-mono uppercase tracking-wider mt-0.5 shrink-0 w-14 font-bold" style={{ color: line.who === "client" ? "var(--vb-orange)" : "var(--vb-navy)" }}>
              {line.who === "client" ? "Kunde" : "Berater"}
            </div>
            <div className="text-foreground/90 leading-relaxed flex-1">
              {renderHighlighted(line.text, line.highlights)}
              {active && i === lines.length - 1 && caretAfterT - line.t < 2.5 && (
                <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle" style={{ background: "var(--vb-orange)", animation: "pulse-ring 1s infinite" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dossier({ scenario, recognized, visibleFields, active }: { scenario: Scenario; recognized: boolean; visibleFields: Field[]; active: boolean }) {
  if (!recognized) {
    return (
      <div className="rounded-xl bg-secondary border border-dashed border-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
          <Database className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-lg font-bold text-muted-foreground">Wartet auf Anruf</div>
        <div className="text-xs text-muted-foreground/70 mt-2 max-w-xs">Sobald die Nummer erkannt ist, erscheint hier das Kundendossier — Feld für Feld, in Echtzeit.</div>
      </div>
    );
  }

  const fieldKeys = scenario.fields.map((f) => f.key);
  const filledKeys = new Set(visibleFields.map((f) => f.key));

  return (
    <div className="rounded-xl bg-card border border-border p-5 h-full animate-pop-in">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kundendossier</div>
          <h3 className="font-display text-2xl font-semibold mt-1" style={{ color: "var(--vb-navy)" }}>{scenario.name}</h3>
          <div className="text-xs text-muted-foreground mt-1">{scenario.meta}</div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shrink-0" style={{ background: "var(--gradient-orange)" }}>
          {scenario.badge}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {scenario.netWorth.map((k) => (
          <div key={k.label} className="rounded-lg bg-secondary border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="text-lg font-bold mt-1" style={{ color: "var(--vb-navy)" }}>{k.value}</div>
            {k.trend && <div className="text-[10px] mt-0.5 text-muted-foreground">{k.trend}</div>}
          </div>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Beratungsbogen — füllt sich live</div>
      <div className="space-y-2">
        {fieldKeys.map((key) => {
          const field = scenario.fields.find((f) => f.key === key)!;
          const filled = filledKeys.has(key);
          const Icon = field.icon;
          return (
            <div
              key={key}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                filled ? "bg-card border-border" : "bg-secondary/40 border-dashed border-border"
              }`}
              style={filled ? undefined : { opacity: 0.55 }}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: filled ? "var(--vb-navy)" : "transparent", border: filled ? "none" : "1px dashed currentColor", color: filled ? "white" : "oklch(0.6 0.02 255)" }}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{field.label}</div>
                {filled ? (
                  <div className="text-sm font-semibold animate-pop-in" style={{ color: "var(--vb-navy)" }}>{field.value}</div>
                ) : (
                  <div className="text-sm text-muted-foreground/50 italic">— wird im Gespräch erfasst —</div>
                )}
              </div>
              {filled && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--vb-orange)" }} />}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--vb-navy)" }} />
          Datenquellen: Telefonie · CRM · Kernbank
        </span>
        <span className="font-mono">Demo-Daten</span>
      </div>
    </div>
  );
}

function AIInsights({ scenario, recognized, visibleInsights, ended }: { scenario: Scenario; recognized: boolean; visibleInsights: Insight[]; ended: boolean }) {
  if (!recognized) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-secondary p-5 h-full flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center mb-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm font-bold text-muted-foreground">KI-Insights</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">inaktiv</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 p-5 h-full animate-pop-in" style={{ borderColor: "var(--vb-orange)", background: "linear-gradient(180deg, oklch(0.99 0.01 50), oklch(1 0 0))" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-orange)" }}>
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--vb-navy)" }}>KI-Insights</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Echtzeit · VR-Banking-KI</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visibleInsights.length === 0 && (
          <div className="text-xs text-muted-foreground italic">Analysiert das Gespräch …</div>
        )}
        {visibleInsights.map((ins, i) => {
          const Icon = ins.icon;
          const color = ins.tone === "warning" ? "var(--vb-orange)" : ins.tone === "accent" ? "var(--vb-navy)" : "var(--vb-orange)";
          return (
            <div key={i} className="rounded-lg bg-card border border-border p-3 animate-pop-in">
              <div className="flex items-start gap-2.5">
                <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold leading-snug" style={{ color: "var(--vb-navy)" }}>{ins.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{ins.body}</div>
                </div>
              </div>
              <button className="mt-3 w-full inline-flex items-center justify-between text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-secondary border border-border hover:bg-card transition-colors" style={{ color: "var(--vb-navy)" }}>
                <span>Im Gespräch nutzen</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {(ended || visibleInsights.length === scenario.insights.length) && (
        <div className="mt-4 pt-4 border-t border-border animate-pop-in">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Vorgeschlagene nächste Aktion</div>
          <button className="w-full text-left p-3 rounded-lg text-white hover:opacity-95 transition-opacity" style={{ background: "var(--vb-navy)" }}>
            <div className="text-sm font-semibold">{scenario.nextAction.title}</div>
            <div className="text-xs text-white/70 mt-0.5">{scenario.nextAction.sub}</div>
          </button>
        </div>
      )}
    </div>
  );
}