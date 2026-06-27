import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { FileText, Award, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/ip-publications")({
  component: IpPublicationsPage,
  head: () => ({
    meta: [
      { title: "IP & Publications · Applied Biotech" },
      { name: "description", content: "Patents, peer-reviewed publications and protected indigenous biotechnologies." },
    ],
  }),
});

const publications = [
  { y: "2025", t: "Multiplex PCR Panel for Regional Pathogen Surveillance", j: "African Journal of Molecular Diagnostics" },
  { y: "2024", t: "Microbial Bioinoculants for Climate-Resilient Yam Cultivation", j: "Journal of Applied Microbiology" },
  { y: "2024", t: "Validation of Locally Manufactured Nuclease-Free Water for qPCR", j: "BMC Research Notes" },
  { y: "2023", t: "Soil Metagenomics across the Nigerian Savannah Belt", j: "Frontiers in Microbiology" },
];

const patents = [
  { t: "Solar-Powered Mobile Molecular Laboratory Container", status: "Granted" },
  { t: "Bioinoculant Formulation for Cassava Yield Resilience", status: "Pending" },
  { t: "Rapid Antigen Assay Kit — Tropical Indications", status: "Granted" },
];

function IpPublicationsPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="IP & Publications" title={<>Protected science, <span className="gradient-text">open knowledge.</span></>} subtitle="Patents, peer-reviewed papers and sovereign biological assets." />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-8">
          <div className="reveal rounded-3xl border border-border bg-card p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><Award className="h-5 w-5" /></div>
              <h2 className="font-display text-2xl font-bold">Patents & IP</h2>
            </div>
            <ul className="mt-6 divide-y divide-border">
              {patents.map((p) => (
                <li key={p.t} className="py-4 flex items-start justify-between gap-4">
                  <div className="font-medium">{p.t}</div>
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${p.status === "Granted" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}>{p.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-3xl border border-border bg-card p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><FileText className="h-5 w-5" /></div>
              <h2 className="font-display text-2xl font-bold">Peer-Reviewed Publications</h2>
            </div>
            <ul className="mt-6 divide-y divide-border">
              {publications.map((p) => (
                <li key={p.t} className="py-4 flex items-start justify-between gap-4 group">
                  <div>
                    <div className="font-medium leading-snug">{p.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.j} · {p.y}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors flex-shrink-0 mt-1" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}