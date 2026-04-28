import { useEffect, useRef, useState } from "react";
import {
  Phone, PhoneIncoming, Mic, PauseCircle, MoreHorizontal,
  TrendingUp, AlertCircle, Sparkles, FileText, ArrowUpRight,
  Calendar, Wallet, Home, Briefcase, ChevronRight, CheckCircle2,
  Search, Database, UserCheck, Loader2
} from "lucide-react";

const transcriptScript = [
  { who: "client", text: "Guten Tag, hier spricht Marina Keller. Ich hätte eine kurze Frage zu meiner Hypothek." },
  { who: "advisor", text: "Frau Keller, schön Sie zu hören — Sie meinen die Festhypothek, die im März ausläuft?" },
  { who: "client", text: "Genau, ich überlege, ob ich verlängern oder umschulden soll." },
  { who: "advisor", text: "Ich habe gerade Ihre aktuelle Konditionsübersicht vor mir. Lassen Sie uns das durchgehen." },
];

const insights = [
  { icon: AlertCircle, tone: "warning", title: "Hypothek läuft in 47 Tagen aus", body: "CHF 680'000 · 1.45% · Verlängerungsfenster offen" },
  { icon: TrendingUp, tone: "accent", title: "Cross-Sell Opportunität", body: "Vorsorge 3a noch nicht ausgeschöpft (CHF 4'200 möglich)" },
  { icon: Sparkles, tone: "primary", title: "Empfohlener Gesprächseinstieg", body: "Auf SARON-Modell verweisen — Profil passt (langfr. Horizont)" },
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
    <section id="demo" className="relative max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Live-Simulation</div>
        <h2 className="font-display text-4xl md:text-5xl font-medium">Sehen Sie den Copilot in Aktion</h2>
        <p className="mt-3 text-muted-foreground">Klicken Sie auf "Eingehender Anruf" — sehen Sie zu, wie Aurea die Nummer erkennt und das Dossier aufbaut.</p>
      </div>

      <div className="glass rounded-3xl p-3 md:p-5 shadow-[var(--shadow-elegant)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.65_0.22_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.15_75)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.16_155)]" />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">aurea.bank · advisor workspace</div>
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
    <div className="rounded-2xl bg-secondary/40 border border-border/60 p-5">
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
            ? "bg-secondary/60 border-border/60"
            : callActive
            ? "bg-gradient-to-br from-primary/30 to-accent/30 border-primary/40"
            : "bg-secondary border-primary/30 pulse-ring"
        }`}>
          {idle || ringing ? (
            <Phone className={`h-7 w-7 ${ringing ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
          ) : (
            <span className="font-display text-2xl gold-text" style={{ animation: "fade-up 0.5s ease-out" }}>MK</span>
          )}
        </div>

        {/* Number & identity */}
        <div className="font-mono text-sm tracking-wider">+41 79 412 88 03</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {idle ? "Keine Verbindung" : ringing ? "Nummer wird erkannt…" : "Identität verifiziert"}
        </div>

        <div className="mt-3 min-h-[44px]">
          {callActive && (
            <div style={{ animation: "fade-up 0.4s ease-out" }}>
              <div className="font-display text-lg">Marina Keller</div>
              <div className="text-xs text-muted-foreground mt-0.5">Premium · Kundin seit 2014</div>
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
                    done ? "bg-secondary/30 border-border/40 text-muted-foreground" :
                    active ? "bg-primary/10 border-primary/30 text-foreground" :
                    "bg-transparent border-transparent text-muted-foreground/40"
                  }`}
                >
                  <span className="h-5 w-5 rounded-md flex items-center justify-center shrink-0">
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "oklch(0.72 0.16 155)" }} /> :
                     active ? <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" /> :
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
            <button className="h-11 w-11 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/70">
              <Mic className="h-4 w-4" />
            </button>
            <button className="h-11 w-11 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/70">
              <PauseCircle className="h-4 w-4" />
            </button>
            <button onClick={() => setPhase("idle")} className="h-11 px-5 rounded-full bg-[oklch(0.6_0.22_25)] text-white text-sm font-medium hover:opacity-90">
              Auflegen
            </button>
          </div>
        ) : idle ? (
          <button
            onClick={() => setPhase("ringing")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[oklch(0.72_0.16_155)] text-white text-sm font-medium hover:opacity-90 shadow-lg pulse-ring"
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
                className="w-0.5 bg-primary/70 rounded-full"
                style={{
                  height: "100%",
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
    <div className="rounded-2xl bg-secondary/30 border border-border/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Live-Transkript</span>
        {active && <span className="text-[10px] font-mono text-success" style={{ color: "oklch(0.72 0.16 155)" }}>● REC</span>}
      </div>
      <div className="space-y-3 min-h-[140px] text-sm">
        {!active && <div className="text-xs text-muted-foreground italic">Wird aktiv, sobald der Anruf beginnt.</div>}
        {transcriptScript.slice(0, visible).map((line, i) => (
          <div key={i} className="flex gap-2" style={{ animation: "fade-up 0.4s ease-out" }}>
            <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 shrink-0 w-14 ${line.who === "client" ? "text-accent" : "text-primary"}`}>
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
      <div className="rounded-2xl bg-card/40 border border-dashed border-border/60 p-8 h-full flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-12 w-12 rounded-2xl bg-secondary/60 border border-border/60 flex items-center justify-center mb-4">
          {active ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> : <Database className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="font-display text-lg text-muted-foreground">Wartet auf Anruf</div>
        <div className="text-xs text-muted-foreground/70 mt-2 max-w-xs">Sobald eine Nummer erkannt ist, erscheint hier das vollständige Kundendossier — automatisch und in Echtzeit.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card/60 border border-border/60 p-5 h-full" style={{ animation: "fade-up 0.5s ease-out" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kundendossier</div>
          <h3 className="font-display text-2xl mt-1">Marina Keller</h3>
          <div className="text-xs text-muted-foreground mt-1">Selbstständig · 42 Jahre · Zürich · Risikoprofil: ausgewogen</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-[10px] font-medium text-primary uppercase tracking-wider">
          Premium
        </span>
      </div>

      {/* Net worth strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KPI label="Vermögen gesamt" value="CHF 1.24M" trend="+4.2%" tone="success" />
        <KPI label="Verbindlichkeiten" value="CHF 680k" trend="Hypothek" tone="muted" />
        <KPI label="Liquidität" value="CHF 84.5k" trend="3 Konten" tone="muted" />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <DossierRow icon={Home} title="Hypothek Lindenstrasse 14" meta="Festhypothek · Auslauf 14.03.2026" value="CHF 680'000" badge="47 Tage" badgeTone="warning" pulse={active} />
        <DossierRow icon={Wallet} title="Privatkonto + 3a" meta="UBS Key4 · letzte Bewegung gestern" value="CHF 84'520" />
        <DossierRow icon={Briefcase} title="Wertschriftendepot" meta="42% Aktien · 38% Obligationen · 20% Alt." value="CHF 478'200" badge="+4.2%" badgeTone="success" />
        <DossierRow icon={Calendar} title="Letzte Beratung" meta="07.11.2025 · Vorsorgeplanung mit C. Müller" value="vor 4 Mt." />
        <DossierRow icon={FileText} title="Offene Aufgaben" meta="Steuerauszug 2025 · Anlagestrategie-Review" value="2 offen" badgeTone="accent" />
      </div>

      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "oklch(0.72 0.16 155)" }} />
          Synchronisiert · Avaloq · Salesforce · Genesys
        </span>
        <span className="font-mono">aktualisiert vor 0.4s</span>
      </div>
    </div>
  );
}

function KPI({ label, value, trend, tone }: { label: string; value: string; trend?: string; tone?: "success" | "muted" }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg mt-1">{value}</div>
      {trend && (
        <div className={`text-[10px] mt-0.5 ${tone === "success" ? "" : "text-muted-foreground"}`} style={tone === "success" ? { color: "oklch(0.72 0.16 155)" } : undefined}>
          {trend}
        </div>
      )}
    </div>
  );
}

function DossierRow({ icon: Icon, title, meta, value, badge, badgeTone, pulse }: { icon: any; title: string; meta: string; value: string; badge?: string; badgeTone?: "warning" | "success" | "accent"; pulse?: boolean }) {
  const badgeColor =
    badgeTone === "warning" ? "bg-[oklch(0.78_0.15_75)]/15 text-[oklch(0.85_0.15_75)] border-[oklch(0.78_0.15_75)]/30" :
    badgeTone === "success" ? "bg-[oklch(0.72_0.16_155)]/15 text-[oklch(0.78_0.16_155)] border-[oklch(0.72_0.16_155)]/30" :
    "bg-accent/15 text-accent border-accent/30";
  return (
    <div className={`group flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors ${pulse && badge === "47 Tage" ? "ring-1 ring-primary/40" : ""}`}>
      <div className="h-9 w-9 rounded-lg bg-secondary border border-border/60 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{meta}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-mono">{value}</div>
        {badge && (
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${badgeColor}`}>{badge}</span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function AIInsights({ active, recognized }: { active: boolean; recognized: boolean }) {
  if (!recognized) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-5 h-full flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-10 w-10 rounded-xl bg-secondary/60 border border-border/60 flex items-center justify-center mb-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">Aurea Insights</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">
          {active ? "analysiert…" : "inaktiv"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-5 h-full" style={{ animation: "fade-up 0.5s ease-out" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium">Aurea Insights</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Echtzeit · GPT-Banking</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          const color =
            ins.tone === "warning" ? "oklch(0.85 0.15 75)" :
            ins.tone === "accent" ? "oklch(0.7 0.18 195)" :
            "oklch(0.85 0.13 80)";
          return (
            <div
              key={i}
              className="rounded-xl bg-card/60 border border-border/60 p-3"
              style={{ animation: active ? `fade-up 0.5s ease-out ${i * 0.4}s both` : undefined }}
            >
              <div className="flex items-start gap-2.5">
                <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color }} />
                <div className="flex-1">
                  <div className="text-sm font-medium leading-snug">{ins.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{ins.body}</div>
                </div>
              </div>
              <button className="mt-3 w-full inline-flex items-center justify-between text-[11px] text-foreground/80 hover:text-foreground px-2.5 py-1.5 rounded-md bg-secondary/50 border border-border/40 transition-colors">
                <span>Im Gespräch nutzen</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border/40">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Vorgeschlagene nächste Aktion</div>
        <button className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 hover:from-primary/30 transition-colors">
          <div className="text-sm font-medium">Termin "Hypothek-Verlängerung" vorschlagen</div>
          <div className="text-xs text-muted-foreground mt-0.5">Mi 04.03 · 14:00 · Filiale Bahnhofstrasse</div>
        </button>
      </div>
    </div>
  );
}