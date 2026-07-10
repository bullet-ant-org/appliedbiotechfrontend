import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/ip-publications")({
  component: IpPublicationsPage,
  head: () => ({
    meta: [
      { title: "IP & Publications · Applied Biotech" },
      { name: "description", content: "Patents, peer-reviewed publications and protected indigenous biotechnologies. Coming soon." },
    ],
  }),
});

function IpPublicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="IP & Publications" title={<>Protected science, <span className="gradient-text">open knowledge.</span></>} subtitle="Patents, peer-reviewed papers and sovereign biological assets." />
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center rounded-3xl border border-border bg-card p-12 shadow-soft">
          <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl gradient-brand text-brand-foreground"><Sparkles className="h-6 w-6" /></div>
          <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold">Coming Soon</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Our registry of patents, protected indigenous biotechnologies and peer-reviewed publications is currently being compiled and will be published here shortly.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
