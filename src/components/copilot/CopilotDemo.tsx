import { useEffect, useRef, useState } from "react";
import {
  Phone, PhoneIncoming, Mic, PauseCircle, MoreHorizontal,
  TrendingUp, AlertCircle, Sparkles, FileText, ArrowUpRight,
  Calendar, Wallet, Home, Briefcase, ChevronRight, CheckCircle2,
  Search, Database, UserCheck, Loader2
} from "lucide-react";

const transcriptScript = [
  { who: "client", text: "Guten Tag, hier spricht Marina Keller. Ich hätte eine kurze Frage zu meiner Baufinanzierung." },
  { who: "advisor", text: "Frau Keller, schön Sie zu hören — Sie meinen die Festzinsbindung, die im März ausläuft?" },
  { who: "client", text: "Genau, ich überlege, ob ich verlängern oder umschulden soll." },
  { who: "advisor", text: "Ich habe gerade Ihre aktuelle Konditionsübersicht vor mir. Lassen Sie uns das durchgehen." },
];

const insights = [
  { icon: AlertCircle, tone: "warning", title: "Zinsbindung läuft in 47 Tagen aus", body: "EUR 320.000 · 1,45 % · Forward-Darlehen jetzt sinnvoll" },
  { icon: TrendingUp, tone: "accent", title: "Cross-Sell-Chance", body: "VR Riester-Rente nicht voll ausgeschöpft (EUR 1.800 möglich)" },
  { icon: Sparkles, tone: "primary", title: "Empfohlener Gesprächseinstieg", body: "Festgeld 2,40 % erwähnen — passt zum Liquiditätsprofil" },
];

type CallPhase = "idle" | "ringing" | "active";

const recognitionSteps = [
  { icon: Search, label: "Nummer im CRM abgleichen", source: "Salesforce" },
  { icon: UserCheck, label: "Identität verifiziert", source: "Marina Keller · KundenID 884291" },
  { icon: Database, label: "Kernbankendaten laden", source: "Avaloq · 3 Konten · 1 Hypothek" },
  { icon: Sparkles, label: "Kontext aufbereitet", source: "Letzte Interaktion · offene Themen" },
];

export function CopilotDemo() {
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [recogStep, setRecogStep] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<number | null>(null);
  const callActive = phase === "active";
  const recognized = phase === "active";

  useEffect(() => {
    if (!callActive) {
      setDuration(0);
      setVisibleLines(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [callActive]);

  useEffect(() => {
    if (!callActive) return;
    if (visibleLines >= transcriptScript.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 2200);
    return () => clearTimeout(t);
  }, [callActive, visibleLines]);

  // Ringing → recognition cascade → active
  useEffect(() => {
    if (phase !== "ringing") {
      setRecogStep(0);
      return;
    }
    const timeouts: number[] = [];
    recognitionSteps.forEach((_, i) => {
      timeouts.push(window.setTimeout(() => setRecogStep(i + 1), 600 + i * 700));
    });
    timeouts.push(window.setTimeout(() => setPhase("active"), 600 + recognitionSteps.length * 700 + 400));
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [phase]);

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <section id="demo" className="relative max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "var(--vb-orange)" }}>Live-Simulation</div>
        <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--vb-navy)" }}>Sehen Sie den Copilot in Aktion</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Klicken Sie unten links auf <strong>„Eingehender Anruf"</strong>.
          Beobachten Sie, wie die Rufnummer erkannt, das Kundendossier aufgebaut
          und passende Themen vorgeschlagen werden — alles bevor Sie abheben.
        </p>
      </div>

      <div className="vb-card rounded-2xl p-3 md:p-5 shadow-[var(--shadow-elegant)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-3 pb-3 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.16_145)]" />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">copilot.volksbank-kurpfalz.de · advisor workspace</div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-12 gap-4 p-3 md:p-5">
          {/* LEFT: Call panel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <CallPanel
              phase={phase}
              setPhase={setPhase}
              recogStep={recogStep}
              duration={`${mm}:${ss}`}
            />
            <Transcript visible={visibleLines} active={callActive} />
          </div>

          {/* CENTER: Dossier */}
          <div className="col-span-12 lg:col-span-5">
            <Dossier active={callActive} recognized={recognized} />
          </div>

          {/* RIGHT: AI insights */}
          <div className="col-span-12 lg:col-span-3">
            <AIInsights active={callActive} recognized={recognized} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CallPanel({ phase, setPhase, recogStep, duration }: { phase: CallPhase; setPhase: (v: CallPhase) => void; recogStep: number; duration: string }) {
  const callActive = phase === "active";
  const ringing = phase === "ringing";
  const idle = phase === "idle";

  return (
    <div className="rounded-xl bg-secondary border border-border p-5">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <PhoneIncoming className="h-3.5 w-3.5" />
          {callActive ? "Aktiver Anruf" : ringing ? "Anruf eingehend…" : "Bereit"}
        </span>
        <span className="font-mono">{duration}</span>
      </div>

      <div className="flex flex-col items-center text-center py-3">
        <div className={`relative h-20 w-20 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 ${
          idle
            ? "bg-card border-border"
            : callActive
            ? "border-2"
            : "bg-card border-2 pulse-ring"
        }`}>
          {callActive && <div className="absolute inset-0 rounded-full" style={{ background: "var(--gradient-orange)", opacity: 0.15 }} />}
          {idle || ringing ? (
            <Phone className={`h-7 w-7 ${ringing ? "animate-pulse" : "text-muted-foreground"}`} style={ringing ? { color: "var(--vb-orange)" } : undefined} />
          ) : (
            <span className="text-2xl font-bold relative" style={{ color: "var(--vb-navy)", animation: "fade-up 0.5s ease-out" }}>MK</span>
          )}
        </div>

        {/* Number & identity */}
        <div className="font-mono text-sm tracking-wider" style={{ color: "var(--vb-navy)" }}>+49 6221 412 88 03</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {idle ? "Keine Verbindung" : ringing ? "Nummer wird erkannt…" : "Identität verifiziert"}
        </div>

        <div className="mt-3 min-h-[44px]">
          {callActive && (
            <div style={{ animation: "fade-up 0.4s ease-out" }}>
              <div className="text-lg font-bold" style={{ color: "var(--vb-navy)" }}>Marina Keller</div>
              <div className="text-xs text-muted-foreground mt-0.5">VR-Mitglied · Kundin seit 2014</div>
            </div>
          )}
          {ringing && (
            <div className="text-xs text-muted-foreground italic">Abgleich mit CRM & Kernbank läuft…</div>
          )}
        </div>

        {/* Recognition cascade */}
        {ringing && (
          <div className="mt-4 w-full space-y-1.5 text-left" style={{ animation: "fade-up 0.4s ease-out" }}>
            {recognitionSteps.map((s, i) => {
              const Icon = s.icon;
              const done = i < recogStep;
              const active = i === recogStep;
              const pending = i > recogStep;
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
                    {(done || active) && !pending && (
                      <div className="font-mono text-[9px] text-muted-foreground/80 truncate">{s.source}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {callActive ? (
          <div className="mt-5 flex items-center gap-2">
            <button className="h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary">
              <Mic className="h-4 w-4" />
            </button>
            <button className="h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary">
              <PauseCircle className="h-4 w-4" />
            </button>
            <button onClick={() => setPhase("idle")} className="h-11 px-5 rounded-full bg-[oklch(0.55_0.22_25)] text-white text-sm font-semibold hover:opacity-90">
              Auflegen
            </button>
          </div>
        ) : idle ? (
          <button
            onClick={() => setPhase("ringing")}
            className="mt-6 vb-pill vb-pill-orange inline-flex items-center gap-2 pulse-ring"
          >
            <Phone className="h-4 w-4" />
            Eingehender Anruf
          </button>
        ) : (
          <div className="mt-6 text-[11px] text-muted-foreground font-mono">
            verbinde…
          </div>
        )}

        {callActive && (
          <div className="mt-5 flex items-end gap-1 h-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height: "100%",
                  background: "var(--vb-orange)",
                  animation: `wave 1.${i % 9}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Transcript({ visible, active }: { visible: number; active: boolean }) {
  return (
    <div className="rounded-xl bg-secondary border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Live-Transkript</span>
        {active && <span className="text-[10px] font-mono font-bold" style={{ color: "var(--vb-orange)" }}>● REC</span>}
      </div>
      <div className="space-y-3 min-h-[140px] text-sm">
        {!active && <div className="text-xs text-muted-foreground italic">Wird aktiv, sobald der Anruf beginnt.</div>}
        {transcriptScript.slice(0, visible).map((line, i) => (
          <div key={i} className="flex gap-2" style={{ animation: "fade-up 0.4s ease-out" }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mt-0.5 shrink-0 w-14 font-bold" style={{ color: line.who === "client" ? "var(--vb-orange)" : "var(--vb-navy)" }}>
              {line.who === "client" ? "Kundin" : "Berater"}
            </div>
            <div className="text-foreground/90 leading-relaxed">{line.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dossier({ active, recognized }: { active: boolean; recognized: boolean }) {
  if (!recognized) {
    return (
      <div className="rounded-xl bg-secondary border border-dashed border-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
          {active ? <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--vb-orange)" }} /> : <Database className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="text-lg font-bold text-muted-foreground">Wartet auf Anruf</div>
        <div className="text-xs text-muted-foreground/70 mt-2 max-w-xs">Sobald eine Nummer erkannt ist, erscheint hier das vollständige Kundendossier — automatisch und in Echtzeit.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5 h-full" style={{ animation: "fade-up 0.5s ease-out" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kundendossier</div>
          <h3 className="text-2xl font-extrabold mt-1" style={{ color: "var(--vb-navy)" }}>Marina Keller</h3>
          <div className="text-xs text-muted-foreground mt-1">Selbstständig · 42 Jahre · Heidelberg · Risikoprofil: ausgewogen</div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: "var(--gradient-orange)" }}>
          VR-Mitglied
        </span>
      </div>

      {/* Net worth strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KPI label="Vermögen gesamt" value="EUR 612k" trend="+4,2 %" tone="success" />
        <KPI label="Verbindlichkeiten" value="EUR 320k" trend="Baufi." tone="muted" />
        <KPI label="Liquidität" value="EUR 38,5k" trend="3 Konten" tone="muted" />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <DossierRow icon={Home} title="Baufinanzierung Hauptstr. 14, HD" meta="Festzinsbindung · Auslauf 14.03.2026" value="EUR 320.000" badge="47 Tage" badgeTone="warning" pulse={active} />
        <DossierRow icon={Wallet} title="VR-Privatkonto + Tagesgeld" meta="VR-Bank · letzte Bewegung gestern" value="EUR 38.520" />
        <DossierRow icon={Briefcase} title="Wertpapierdepot Union Invest." meta="42 % Aktien · 38 % Renten · 20 % Misch" value="EUR 254.200" badge="+4,2 %" badgeTone="success" />
        <DossierRow icon={Calendar} title="Letzte Beratung" meta="07.11.2025 · Altersvorsorge mit C. Müller" value="vor 4 Mt." />
        <DossierRow icon={FileText} title="Offene Aufgaben" meta="Steuerbescheinigung 2025 · Depot-Review" value="2 offen" badgeTone="accent" />
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

function KPI({ label, value, trend, tone }: { label: string; value: string; trend?: string; tone?: "success" | "muted" }) {
  return (
    <div className="rounded-lg bg-secondary border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-bold mt-1" style={{ color: "var(--vb-navy)" }}>{value}</div>
      {trend && (
        <div className={`text-[10px] mt-0.5 ${tone === "success" ? "font-semibold" : "text-muted-foreground"}`} style={tone === "success" ? { color: "var(--vb-orange)" } : undefined}>
          {trend}
        </div>
      )}
    </div>
  );
}

function DossierRow({ icon: Icon, title, meta, value, badge, badgeTone, pulse }: { icon: any; title: string; meta: string; value: string; badge?: string; badgeTone?: "warning" | "success" | "accent"; pulse?: boolean }) {
  const badgeColor =
    badgeTone === "warning" ? "text-white border-transparent" :
    badgeTone === "success" ? "text-white border-transparent" :
    "text-white border-transparent";
  const badgeStyle =
    badgeTone === "warning" ? { background: "var(--gradient-orange)" } :
    badgeTone === "success" ? { background: "var(--vb-navy)" } :
    { background: "var(--vb-navy)" };
  return (
    <div className={`group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary transition-colors ${pulse && badge === "47 Tage" ? "ring-2" : ""}`} style={pulse && badge === "47 Tage" ? { boxShadow: "0 0 0 2px var(--vb-orange)" } : undefined}>
      <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--vb-navy)" }}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "var(--vb-navy)" }}>{title}</div>
        <div className="text-xs text-muted-foreground truncate">{meta}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-mono font-semibold">{value}</div>
        {badge && (
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeColor}`} style={badgeStyle}>{badge}</span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function AIInsights({ active, recognized }: { active: boolean; recognized: boolean }) {
  if (!recognized) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-secondary p-5 h-full flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center mb-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm font-bold text-muted-foreground">KI-Insights</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">
          {active ? "analysiert…" : "inaktiv"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 p-5 h-full" style={{ borderColor: "var(--vb-orange)", background: "linear-gradient(180deg, oklch(0.99 0.01 50), oklch(1 0 0))", animation: "fade-up 0.5s ease-out" }}>
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
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          const color =
            ins.tone === "warning" ? "var(--vb-orange)" :
            ins.tone === "accent" ? "var(--vb-navy)" :
            "var(--vb-orange)";
          return (
            <div
              key={i}
              className="rounded-lg bg-card border border-border p-3"
              style={{ animation: active ? `fade-up 0.5s ease-out ${i * 0.4}s both` : undefined }}
            >
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

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Vorgeschlagene nächste Aktion</div>
        <button className="w-full text-left p-3 rounded-lg text-white hover:opacity-95 transition-opacity" style={{ background: "var(--vb-navy)" }}>
          <div className="text-sm font-semibold">Termin "Anschlussfinanzierung" vorschlagen</div>
          <div className="text-xs text-white/70 mt-0.5">Mi 04.03 · 14:00 · Filiale Heidelberg Hauptstraße</div>
        </button>
      </div>
    </div>
  );
}