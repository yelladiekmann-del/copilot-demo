import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight">
        Bereit für den <span className="display-text italic">Pilot?</span>
      </h2>
      <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
        Wir integrieren Aurea in 6 Wochen in Ihr Avaloq- oder Finnova-Setup — mit zwei Beratern, einem Use-Case, messbarem ROI.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.15_60)] text-primary-foreground font-medium text-sm shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform" href="#">
          Pilot vereinbaren <ArrowRight className="h-4 w-4" />
        </a>
        <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-secondary/40 text-sm hover:bg-secondary transition-colors" href="#">
          Architektur-Whitepaper
        </a>
      </div>
    </section>
  );
}