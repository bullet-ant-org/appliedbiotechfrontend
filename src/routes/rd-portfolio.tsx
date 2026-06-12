import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { ArrowRight, FlaskConical, Leaf, Dna, ShieldPlus, Microscope } from "lucide-react";

export const Route = createFileRoute("/rd-portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "R&D Portfolio · Applied Biotech" },
      { name: "description", content: "Selected research and development programs spanning diagnostics, agriculture, environment and bio-innovation." },
    ],
  }),
});

const projects = [
  { I: Microscope, tag: "Diagnostics", t: "Regional Pathogen Surveillance Network", d: "Multiplex PCR panels deployed across 4 states for real-time outbreak monitoring." },
  { I: Leaf, tag: "AgriBiotech", t: "Climate-Resilient Microbial Bioinoculants", d: "Locally isolated rhizobacterial strains boosting cassava and yam yields by 18–24%." },
  { I: Dna, tag: "Genomics", t: "Indigenous Cattle Lineage Mapping", d: "STR genotyping of West African Ndama and Bunaji breeds for conservation genetics." },
  { I: ShieldPlus, tag: "Public Health", t: "Mobile Lab for Epidemic Response", d: "Solar-powered diagnostic units pre-positioned for cholera and Lassa fever responses." },
  { I: FlaskConical, tag: "Reagents", t: "AquaPure™ Sovereign Reagents", d: "100% locally manufactured nuclease-free water, validated against international references." },
  { I: Leaf, tag: "Environment", t: "Soil Metagenomics Atlas", d: "Continental-scale soil microbiome database supporting bioremediation strategies." },
];

function PortfolioPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="R&D Portfolio" title={<>Research with <span className="gradient-text">measurable</span> impact.</>} subtitle="Selected programs across diagnostics, agriculture, environment and bio-innovation." />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div key={p.t} className="reveal group rounded-3xl border border-border bg-card p-7 hover:-translate-y-2 hover:shadow-brand hover:border-brand/40 transition-all duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground group-hover:scale-110 transition-transform"><p.I className="h-5 w-5" /></div>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold">{p.tag}</span>
              </div>
              <h3 className="mt-5 font-display font-bold text-lg leading-tight">{p.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-14 mx-auto max-w-3xl text-center rounded-3xl gradient-brand text-brand-foreground p-10 shadow-brand">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Want to collaborate?</h2>
          <p className="mt-3 text-brand-foreground/85">We welcome co-investigator proposals, grant partnerships and institutional collaborations.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-semibold hover:scale-105 transition-transform">
            Submit a brief <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}