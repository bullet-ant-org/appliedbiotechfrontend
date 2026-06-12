import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { ShieldCheck, Activity, FlaskConical, Users } from "lucide-react";

export const Route = createFileRoute("/covid-19")({
  component: CovidPage,
  head: () => ({ meta: [{ title: "Covid-19 Response · Applied Biotech" }, { name: "description", content: "Our Covid-19 testing, training and community response programs." }] }),
});

function CovidPage() {
  useReveal();
  const items = [
    { I: FlaskConical, t: "PCR Testing", d: "Validated RT-PCR diagnostics with rapid turnaround." },
    { I: ShieldCheck, t: "Safety Training", d: "Biosafety level training for healthcare and lab workers." },
    { I: Activity, t: "Surveillance", d: "Variant surveillance and reporting partnerships." },
    { I: Users, t: "Community Outreach", d: "Awareness, sample collection and vaccination support." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Covid-19" title={<>Our pandemic <span className="gradient-text">response</span></>} subtitle="From rapid diagnostics to training and community outreach: what we did, and what we continue to do." />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {items.map(({ I, t, d }) => (
            <div key={t} className="reveal rounded-2xl border border-border bg-card p-7 hover:shadow-soft hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><I className="h-6 w-6" /></div>
              <h3 className="mt-5 font-display font-bold text-xl">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}