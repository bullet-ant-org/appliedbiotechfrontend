import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { GraduationCap, Users, Building2, ArrowRight, Mail } from "lucide-react";

export const Route = createFileRoute("/capacity-building")({
  component: CapacityBuildingPage,
  head: () => ({
    meta: [
      { title: "Capacity Building · Applied Biotech" },
      { name: "description", content: "Hands-on biotechnology workshops, certified courses and institutional upskilling programs." },
    ],
  }),
});

const OFFERINGS = [
  { id: "courses", I: GraduationCap, t: "Modular Hands-On Courses", d: "Career-focused masterclasses covering foundational extractions to primer design and data interpretation." },
  { id: "workshops", I: Users, t: "Hands-On Workshops", d: "Immersive multi-day cohorts covering real-time PCR diagnostics, metagenomics and bioinformatics." },
  { id: "upskilling", I: Building2, t: "Institutional Upskilling", d: "Partnering with institutes, organizations and ministries to onboard cohorts and embed long-term competency." },
];

function CapacityBuildingPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Capacity Building" title={<>Building Africa's next generation of <span className="gradient-text">molecular scientists.</span></>} subtitle="Hands-on workshops and certificate programs in molecular biology, lab safety and bioinformatics." />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14 reveal">
          <p className="text-muted-foreground leading-relaxed text-lg">
            Africa's scientific future depends on the scientists we train today. Our capacity-building programs move beyond theory into the lab bench itself, giving researchers, technicians and institutions real, hands-on competency in the techniques that drive modern biotechnology — from PCR diagnostics to full institutional upskilling.
          </p>
        </div>
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-3 mb-14">
          {[
            { n: "1000+", label: "Scientists and technicians trained" },
            { n: "20+", label: "Years running certified training programs" },
            { n: "5+", label: "Institutions upskilled end-to-end" },
          ].map((s) => (
            <div key={s.label} className="reveal rounded-2xl border border-border bg-card p-6 text-center hover:border-brand/40 hover:shadow-soft transition-all">
              <div className="font-display text-3xl font-extrabold text-brand">{s.n}</div>
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
            {/* TODO: confirm capacity building inquiry email */}
            <p className="mt-1 text-sm text-brand-foreground/85">TODO: academy@appliedbiotech.ng</p>
          </div>
          <Link to="/academy" className="inline-flex items-center gap-2 rounded-full bg-brand-foreground text-brand px-6 py-3 font-semibold shadow-soft hover:scale-[1.03] transition-transform">
            Explore Academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
