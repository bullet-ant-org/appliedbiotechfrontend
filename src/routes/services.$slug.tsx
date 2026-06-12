import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Check, ArrowRight } from "lucide-react";

const data: Record<string, { title: string; subtitle: string; eyebrow: string; intro: string; bullets: string[] }> = {
  "molecular-lab": {
    eyebrow: "Service",
    title: "Molecular Lab Services",
    subtitle: "Diagnostics-grade molecular laboratory operations.",
    intro: "Our laboratory specialises in molecular diagnostics, delivering accurate results for human, plant and animal samples. Equipped for high-throughput PCR, sequencing and assay development.",
    bullets: ["RT-PCR & qPCR diagnostics", "DNA / RNA extraction", "Pathogen identification", "Custom assay development", "Validated SOPs & QC"],
  },
  "equipment": {
    eyebrow: "Service",
    title: "Lab Equipment & Reagents",
    subtitle: "Trusted suppliers of calibrated lab essentials.",
    intro: "We distribute laboratory equipment and reagents from leading global brands, offering installation, training and after-sales support.",
    bullets: ["Microscopes & centrifuges", "PCR & sequencing instruments", "Consumables & plasticware", "Calibration & maintenance", "Bulk reagent supply"],
  },
  "training": {
    eyebrow: "Service",
    title: "Training & Applied Biotech Institute",
    subtitle: "Internationally certified biotech training.",
    intro: "Hands-on workshops and certificate programs in molecular biology, lab safety and bioinformatics, built for students, researchers and clinicians.",
    bullets: ["Molecular biology bootcamps", "Bioinformatics short courses", "Lab safety & GLP", "Equipment operation", "Custom institutional cohorts"],
  },
  "consulting": {
    eyebrow: "Service",
    title: "Consulting",
    subtitle: "Strategy and implementation for biotech projects.",
    intro: "We help institutions design, equip and operate laboratories, and advance biotech research strategy from concept to delivery.",
    bullets: ["Lab design & setup", "Regulatory & accreditation support", "R&D strategy", "Procurement advisory", "Capacity building"],
  },
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const item = data[params.slug];
    if (!item) throw notFound();
    return item;
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center">
      <div><h1 className="text-3xl font-bold">Service not found</h1></div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} · Applied Biotech` },
      { name: "description", content: loaderData?.subtitle ?? "" },
    ],
  }),
});

function ServicePage() {
  const d = Route.useLoaderData();
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow={d.eyebrow} title={<>{d.title.split(" ").slice(0, -1).join(" ")} <span className="gradient-text">{d.title.split(" ").slice(-1)}</span></>} subtitle={d.subtitle} />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 reveal">
            <p className="text-lg text-muted-foreground leading-relaxed">{d.intro}</p>
            <ul className="mt-8 space-y-3">
              {d.bullets.map((b: string) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full grid place-items-center gradient-brand text-brand-foreground"><Check className="h-3.5 w-3.5" /></span>
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="lg:col-span-2 reveal">
            <div className="rounded-2xl gradient-brand p-8 text-brand-foreground shadow-brand">
              <h3 className="font-display font-bold text-2xl">Talk to our team</h3>
              <p className="mt-2 text-brand-foreground/85 text-sm">Get tailored guidance on your project. We respond within 24 hours.</p>
              <a href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-semibold hover:scale-105 transition-transform">
                Request a quote <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}