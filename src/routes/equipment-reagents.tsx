import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Cpu, FlaskConical, Building2, ArrowRight, Mail } from "lucide-react";

export const Route = createFileRoute("/equipment-reagents")({
  component: EquipmentPage,
  head: () => ({
    meta: [
      { title: "Lab Equipment & Reagents · Applied Biotech" },
      { name: "description", content: "Calibrated instrumentation, validated reagents and deployable lab infrastructure." },
    ],
  }),
});

const OFFERINGS = [
  { id: "instrumentation", I: Cpu, t: "Analytical Instrumentation", d: "Real-time PCR platforms, microcentrifuges, gel-doc imaging stations, biosafety cabinets and more." },
  { id: "reagents", I: FlaskConical, t: "Molecular Reagents & Bio-Chemicals", d: "Validated, cold-chain-managed reagents and bio-chemicals sourced from trusted global manufacturers." },
  { id: "infrastructure", I: Building2, t: "Deployable Infrastructure", d: "Turnkey lab infrastructure — modular builds, containment systems and utility integration." },
];

function EquipmentPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Lab Equipment & Reagents" title={<>Trusted suppliers of <span className="gradient-text">calibrated lab essentials.</span></>} subtitle="Laboratory equipment and reagents from leading global brands, with installation, training and after-sales support." />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14 reveal">
          <p className="text-muted-foreground leading-relaxed text-lg">
            Sourcing the wrong reagent or instrument can set a project back weeks. We work directly with trusted global manufacturers to bring calibrated, cold-chain-managed equipment and reagents to African labs — with installation, staff training and after-sales support included, not bolted on as an afterthought.
          </p>
        </div>
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-3 mb-14">
          {[
            { n: "20+", label: "Years distributing lab equipment across Nigeria" },
            { n: "Cold-chain", label: "Managed logistics for temperature-sensitive reagents" },
            { n: "Local", label: "Installation, training and after-sales support" },
          ].map((s) => (
            <div key={s.label} className="reveal rounded-2xl border border-border bg-card p-6 text-center hover:border-brand/40 hover:shadow-soft transition-all">
              <div className="font-display text-2xl font-extrabold text-brand">{s.n}</div>
              <div className="mt-2 text-sm text-muted-foreground leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
          {OFFERINGS.map((o) => (
            <div key={o.id} id={o.id} className="reveal scroll-mt-24 rounded-3xl border border-border bg-card p-7 hover:border-brand/40 hover:shadow-brand transition-all">
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><o.I className="h-5 w-5" /></div>
              <h3 className="mt-5 font-display font-bold text-xl">{o.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{o.d}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-6xl mt-10 rounded-3xl gradient-brand text-brand-foreground p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl font-bold flex items-center gap-2 justify-center md:justify-start"><Mail className="h-5 w-5" /> Service Contact</h3>
            {/* TODO: confirm equipment & reagents inquiry email */}
            <p className="mt-1 text-sm text-brand-foreground/85">TODO: equipment@appliedbiotech.ng</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-brand-foreground text-brand px-6 py-3 font-semibold shadow-soft hover:scale-[1.03] transition-transform">
            Visit Shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
