import { Phone, Sparkles, ShieldCheck } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Aurea</span>
          <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Copilot for Advisors</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a className="hover:text-foreground transition-colors" href="#demo">Live-Demo</a>
          <a className="hover:text-foreground transition-colors" href="#value">Mehrwert</a>
          <a className="hover:text-foreground transition-colors" href="#metrics">ROI</a>
        </div>
        <button className="text-xs px-4 py-2 rounded-full border border-border bg-secondary/40 hover:bg-secondary transition-colors">
          Pilot anfragen
        </button>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/40 text-xs text-muted-foreground mb-8">
          <ShieldCheck className="h-3.5 w-3.5 text-success" style={{ color: "oklch(0.72 0.16 155)" }} />
          On-Premise · FINMA-ready · DSGVO-konform
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight max-w-4xl mx-auto">
          Jedes Gespräch beginnt mit <span className="display-text italic">vollem Kontext.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Aurea bündelt Telefonie, CRM und Kernbankensystem in Echtzeit — und stellt Ihren
          Beratern in der Sekunde, in der das Telefon klingelt, ein vollständiges Kundendossier zur Seite.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#demo" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.15_60)] text-primary-foreground font-medium text-sm shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform">
            <Phone className="h-4 w-4" />
            Live-Anruf simulieren
          </a>
          <a href="#value" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Mehrwert verstehen →
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-10 opacity-60 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span>Avaloq</span>
          <span>·</span>
          <span>Finnova</span>
          <span>·</span>
          <span>Salesforce</span>
          <span>·</span>
          <span>Genesys</span>
          <span>·</span>
          <span>MS Teams</span>
        </div>
      </div>
    </section>
  );
}