import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { ClipboardCheck, FlaskConical, Microscope, Leaf, ArrowRight, Mail, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/molecular-lab-services")({
  component: MolecularLabPage,
  head: () => ({
    meta: [
      { title: "Molecular Lab Services · Applied Biotech" },
      { name: "description", content: "Accredited molecular sample analysis, rent-a-lab access, specialty diagnostic testing and environmental impact assessment." },
    ],
  }),
});

const OFFERINGS = [
  { id: "sample-analysis", I: ClipboardCheck, t: "Sample Analysis", d: "Accredited molecular testing performed under validated protocols, including RT-PCR/qPCR diagnostics and pathogen identification.", items: ["Accreditation-ready written reports", "Research, clinical and commercial pipelines", "Fast, trackable turnaround times"] },
  { id: "rent-a-lab", I: FlaskConical, t: "Rent-a-Lab", d: "Access fully equipped, validated molecular facilities without the overhead of building your own — calibrated thermocyclers, biosafety cabinets and gel-doc systems by the hour or day.", items: ["Calibrated thermocyclers and biosafety cabinets", "Perfect for thesis work and corporate validations", "Premium Abuja hub, hourly or daily slots"] },
  { id: "specialty-testing", I: Microscope, t: "Specialty Testing", d: "Genomics prep, forensic and genetic fidelity testing, and eco-microbiome/metagenomics services.", items: ["Molecular pathogen ID & typing, AMR strain tracking", "Genomics & sequencing prep, NGS library preparation", "Forensic STR profiling & livestock breeding fidelity", "Eco-microbiome, soil biodiversity & water quality assays"] },
  { id: "eia", I: Leaf, t: "Environmental Impact Assessment", d: "Structured environmental and biodiversity impact assessments supporting regulatory compliance and sustainable development planning." },
];

function MolecularLabPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Molecular Lab Services" title={<>Diagnostics-grade <span className="gradient-text">molecular laboratory</span> operations.</>} subtitle="Accurate, validated results for human, plant and animal samples." />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14 reveal">
          <p className="text-muted-foreground leading-relaxed text-lg">
            Our molecular laboratory has supported hospitals, universities, government agencies and agribusinesses across Nigeria since 2006. Every service runs on validated protocols, calibrated instrumentation and a team of practicing molecular scientists — so the results you get back are ones you can build a diagnosis, a publication or a regulatory filing on.
          </p>
        </div>
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {OFFERINGS.map((o) => (
            <div key={o.id} id={o.id} className="reveal scroll-mt-24 rounded-3xl border border-border bg-card p-7 hover:border-brand/40 hover:shadow-brand transition-all">
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><o.I className="h-5 w-5" /></div>
              <h3 className="mt-5 font-display font-bold text-xl">{o.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{o.d}</p>
              {o.items && (
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {o.items.map((it) => (
                    <li key={it} className="flex gap-2"><span className="text-brand mt-0.5">›</span>{it}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-6xl mt-6 flex justify-center">
          <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent transition-colors">
            <ImageIcon className="h-4 w-4" /> View Lab Gallery
          </Link>
        </div>

        <div className="mx-auto max-w-6xl mt-10 rounded-3xl gradient-brand text-brand-foreground p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl font-bold flex items-center gap-2 justify-center md:justify-start"><Mail className="h-5 w-5" /> Service Contact</h3>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-foreground text-brand px-6 py-3 font-semibold shadow-soft hover:scale-[1.03] transition-transform">
            Request a Service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
