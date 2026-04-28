import { Search, Sparkles, ChevronDown } from "lucide-react";

export function LandingHero() {
  return (
    <>
      {/* Top utility bar — dark navy */}
      <div className="vb-navy">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-11 text-sm">
          <div className="flex items-center gap-7">
            {["Privatkunden", "Firmenkunden", "Private Banking", "Banking & Verträge", "Meine Bank", "Service & Mehrwerte", "Karriere"].map((l, i) => (
              <a key={l} href="#" className={`hover:text-white/90 transition-colors ${i === 1 ? "text-white font-semibold" : "text-white/85"}`}>{l}</a>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-white/90 hover:text-white">
            <Search className="h-4 w-4" />
            <span>Suchen</span>
          </button>
        </div>
      </div>

      {/* Logo / Login bar — white */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <a href="#" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: "var(--vb-navy)" }}>
              <Sparkles className="h-5 w-5" style={{ color: "var(--vb-orange)" }} />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--vb-navy)" }}>
              Volksbank Kurpfalz
            </span>
          </a>
          <button className="vb-pill vb-pill-primary inline-flex items-center gap-2">
            Login OnlineBanking
          </button>
        </div>
      </div>

      {/* Hero banner — dark image-style block */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.7 0.17 48 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.4 0.1 258 / 0.5), transparent 50%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/90 mb-6 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" style={{ background: "var(--vb-orange)" }} />
              Neu für unsere Beraterinnen und Berater
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight">
              KUNDE ANRUFT:<br />
              <span style={{ color: "var(--vb-orange)" }}>SIE WISSEN BESCHEID.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Mit dem KI-Berater-Copilot erkennen Sie jeden Anrufer sofort — inklusive Kontoübersicht,
              offenen Themen und passenden Beratungsanlässen. Direkt im Gespräch. Genossenschaftlich. Sicher.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#demo" className="vb-pill vb-pill-orange inline-flex items-center gap-2">
                Live-Demo starten
              </a>
              <a href="#value" className="vb-pill bg-white/10 text-white border border-white/20 hover:bg-white/15 inline-flex items-center gap-2">
                Mehr erfahren <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-10 text-xs text-white/60">
              * Pilotprojekt der Volksbank Kurpfalz · entwickelt mit Aurea Intelligence · BaFin- &amp; DSGVO-konform
            </p>
          </div>
        </div>

        {/* Decorative orange "JETZT KONTAKT AUFNEHMEN" badge — Volksbank-style sticker */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 h-32 w-32 rounded-full items-center justify-center text-center text-white text-xs font-bold uppercase tracking-wider rotate-12 shadow-2xl" style={{ background: "var(--gradient-orange)" }}>
          <div className="leading-tight">
            Jetzt<br />Pilot<br />sichern!
          </div>
        </div>
      </section>
    </>
  );
}