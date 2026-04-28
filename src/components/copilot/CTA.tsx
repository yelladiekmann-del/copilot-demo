import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative max-w-5xl mx-auto px-6 py-24 text-center">
      <h2 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: "var(--vb-navy)" }}>
        Bereit für den <span style={{ color: "var(--vb-orange)" }}>Pilot?</span>
      </h2>
      <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
        Lassen Sie uns gemeinsam evaluieren, wie der Berater-Copilot in Ihre bestehende Systemlandschaft passt — unverbindlich und in einem ersten Gespräch.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a className="vb-pill vb-pill-orange inline-flex items-center gap-2" href="#">
          Gespräch vereinbaren <ArrowRight className="h-4 w-4" />
        </a>
        <a className="vb-pill vb-pill-primary inline-flex items-center gap-2" href="#">
          Mehr Informationen
        </a>
      </div>
    </section>
  );
}