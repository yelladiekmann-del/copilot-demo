import { ChevronDown, PlayCircle } from "lucide-react";

export function LandingHero() {
  return (
    <>
      {/* Logo bar — white */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <div className="flex items-center gap-3">
            <img
              src="https://atruvia.scene7.com/is/image/atruvia/vbkp%20logo%201200x113"
              alt="Volksbank Kurpfalz"
              className="h-10 w-auto"
            />
            <span className="hidden md:inline-block ml-3 pl-3 border-l border-border text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">
              Berater-Copilot · Demo
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "var(--vb-navy)" }}>
            <a href="#demo" className="hover:opacity-70">Live-Simulator</a>
            <a href="#metrics" className="hover:opacity-70">So funktioniert's</a>
            <a href="#value" className="hover:opacity-70">Mehrwert</a>
          </nav>
        </div>
      </div>

      {/* Hero banner — dark with aurora */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 grid-bg-dark opacity-50" />
        <div className="aurora-blob h-[520px] w-[520px] -top-32 -right-32 animate-aurora" style={{ background: "oklch(0.7 0.17 48 / 0.55)" }} />
        <div className="aurora-blob h-[420px] w-[420px] bottom-[-60px] -left-32 animate-aurora" style={{ background: "oklch(0.45 0.12 258 / 0.7)", animationDelay: "-6s" }} />
        <div className="aurora-blob h-[300px] w-[300px] top-1/3 left-1/2 animate-aurora" style={{ background: "oklch(0.7 0.17 48 / 0.25)", animationDelay: "-12s" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/90 mb-6 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" style={{ background: "var(--vb-orange)" }} />
              Konzept-Demo für Beraterinnen und Berater
            </div>
            <h1 className="font-display text-white text-5xl md:text-7xl font-semibold leading-[1.04]">
              KUNDE RUFT AN:<br />
              <span style={{ color: "var(--vb-orange)" }}>SIE WISSEN BESCHEID.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Der Berater-Copilot erkennt den Anrufer noch vor dem Abheben und legt
              Ihnen Konten, offene Themen und Beratungsanlässe direkt ins Gespräch.
              Kein Suchen mehr in sieben Systemen.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#demo" className="vb-pill vb-pill-orange inline-flex items-center gap-2">
                <PlayCircle className="h-4 w-4" /> Live-Simulator öffnen
              </a>
              <a href="#metrics" className="vb-pill bg-white/10 text-white border border-white/20 hover:bg-white/15 inline-flex items-center gap-2">
                In 4 Schritten erklärt <ChevronDown className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <span>✓ Erkennt Anrufer in &lt; 1 Sekunde</span>
              <span>✓ Ein Workspace statt sieben Tabs</span>
              <span>✓ KI schlägt Gesprächsthemen vor</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}