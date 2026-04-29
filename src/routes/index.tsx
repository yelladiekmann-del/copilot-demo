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
      <Metrics />
      <ValueProps />
      <CTA />
      <footer className="vb-navy py-10">
        <div className="max-w-7xl mx-auto px-6 text-xs text-white/70">
          Demo-Mockup · Volksbank Kurpfalz eG
        </div>
      </footer>
    </main>
  );
}
