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
      <footer className="border-t border-border/40 py-10 text-center text-xs text-muted-foreground">
        © 2026 Aurea Intelligence · Enterprise-Grade · ISO 27001 · FINMA-konform
      </footer>
    </main>
  );
}
