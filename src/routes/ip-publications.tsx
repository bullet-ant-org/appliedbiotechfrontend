import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { Sparkles, GraduationCap, FileText } from "lucide-react";

export const Route = createFileRoute("/ip-publications")({
  component: IpPublicationsPage,
  head: () => ({
    meta: [
      { title: "IP & Publications · Applied Biotech" },
      { name: "description", content: "Intellectual property and Prof. Nwadiuto Esiobu's peer-reviewed publications." },
    ],
  }),
});

function IpPublicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="IP & Publications" title={<>Protected science, <span className="gradient-text">open knowledge.</span></>} subtitle="Intellectual property and Prof. Nwadiuto Esiobu's peer-reviewed publications." />
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
          <div className="text-center rounded-3xl border border-border bg-card p-12 shadow-soft">
            <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl gradient-brand text-brand-foreground"><Sparkles className="h-6 w-6" /></div>
            <h2 className="mt-6 font-display text-2xl font-bold">Intellectual Property</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">Coming Soon</p>
          </div>
          <div className="text-center rounded-3xl border border-border bg-card p-12 shadow-soft">
            <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl gradient-brand text-brand-foreground"><FileText className="h-6 w-6" /></div>
            <h2 className="mt-6 font-display text-2xl font-bold">Publications</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">Peer-reviewed work by Prof. Nwadiuto Esiobu.</p>
            <div className="mt-6 flex flex-col gap-3">
              {/* TODO: replace with final Google Scholar profile URL */}
              <a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors">
                <GraduationCap className="h-4 w-4" /> View on Google Scholar
              </a>
              {/* TODO: replace with final publication link */}
              <a href="#" className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-5 py-2.5 text-sm font-semibold shadow-brand hover:scale-[1.03] transition-transform">
                <FileText className="h-4 w-4" /> Read Publication
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
