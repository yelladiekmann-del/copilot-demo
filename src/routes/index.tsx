import { createFileRoute } from "@tanstack/react-router";
import { CopilotDemo } from "@/components/copilot/CopilotDemo";
import { LandingHero } from "@/components/copilot/LandingHero";
import { ValueProps } from "@/components/copilot/ValueProps";
import { Metrics } from "@/components/copilot/Metrics";
import { CTA } from "@/components/copilot/CTA";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
      <LandingHero />
      <CopilotDemo />
      <ValueProps />
      <Metrics />
      <CTA />
      <footer className="vb-navy py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
          <div>© 2026 Volksbank Kurpfalz eG · Berater-Copilot Pilotprogramm</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Impressum</a>
            <a href="#" className="hover:text-white">Datenschutz</a>
            <a href="#" className="hover:text-white">BaFin-Compliance</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
