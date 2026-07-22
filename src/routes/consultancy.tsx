import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Briefcase, FlaskConical, ArrowRight, Mail, Beaker } from "lucide-react";
import heroLab from "@/assets/image-6.jpg";
import heroPipette from "@/assets/image-7.jpg";
import mobileLab from "@/assets/image-2.jpg";

export const Route = createFileRoute("/consultancy")({
  component: ConsultancyPage,
  head: () => ({
    meta: [
      { title: "Consultancy · Applied Biotech" },
      { name: "description", content: "Strategic and research consultancy for biotechnology institutions, ventures and government programs." },
    ],
  }),
});

const CATEGORIES = [
  {
    t: "Strategic Consultancy",
    d: "High-level advisory for institutions, ventures and government programs navigating biotechnology strategy, policy and growth — including lab design and the ABSDIP Innovation Park initiative.",
    items: ["Project Management", "Laboratory Design", "Bio Enterprise Incubation"],
    I: Briefcase,
  },
  {
    t: "Research Consultancy",
    d: "Technical and scientific guidance for research design, execution and translation into real-world application.",
    // TODO: confirm final list of research consultancy offerings
    items: ["Research Design & Methodology", "Grant & Proposal Support", "Research Commercialization"],
    I: FlaskConical,
  },
];

const labProjects = [
  { title: "Biotech mobile labs built and equipped for the National Biosafety Management Agency (NBMA), Airport Road, Lugbe — for detection of genetically modified organisms.", location: "Nigeria", year: "2017", tags: ["PCR", "RNA", "Electrophoresis"], img: mobileLab },
  { title: "A multi-purpose molecular biology laboratory designed, built, owned and operated by Applied Biotech Nigeria in Wuye, Abuja.", location: "Abuja", year: "2018", tags: ["NGS", "BSL-2", "Accredited"], img: heroLab },
  { title: "University of Maiduguri Biotech Center of Excellence, designed and equipped by Applied Biotech Nigeria — including training of trainers now a regional force.", location: "Maiduguri", year: "2016", tags: ["Training", "24 workstations", "Cell culture"], img: heroPipette },
];

function ConsultancyPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Consultancy" title={<>Turn your biotechnology vision <span className="gradient-text">into reality.</span></>} subtitle="Structured, evidence-based consultancy for institutions, ventures and government programs across Africa." />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <div key={c.t} id={c.t === "Strategic Consultancy" ? "strategic-consultancy" : "research-consultancy"} className="reveal scroll-mt-24 rounded-3xl border border-border bg-card p-8 hover:border-brand/40 hover:shadow-brand transition-all">
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><c.I className="h-5 w-5" /></div>
              <h2 className="mt-5 font-display text-2xl font-bold">{c.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              <ul className="mt-5 space-y-2">
                {c.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ABSDIP — relocated from About Us */}
        <div className="mx-auto max-w-6xl mt-10 rounded-3xl border border-border bg-card p-8 md:p-12">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">ABSDIP</span>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold leading-tight">
            Africa's Biotechnology & Science Discovery Innovation Park
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            ABSDIP is Applied Biotech's Innovation Park — a world-class ecosystem where breakthrough discoveries in science, applied research and transformative innovation converge, shaping the future of science across the African continent.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://absdip.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
              Explore ABSDIP <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Lab Design Portfolio — relocated from About Us, under Strategic Consultancy */}
        <div className="mx-auto max-w-6xl mt-10">
          <h3 className="font-display text-xl font-bold mb-6">Labs We Have Designed & Built</h3>
          <div className="space-y-10">
            {labProjects.map((project, idx) => (
              <div key={project.title} className="reveal grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative rounded-3xl overflow-hidden shadow-brand aspect-[4/3]">
                  <img src={project.img} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-xs font-semibold">
                    <Beaker className="h-3.5 w-3.5" /> {project.location} · {project.year}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">{project.title}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl mt-10 rounded-3xl gradient-brand text-brand-foreground p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl font-bold flex items-center gap-2 justify-center md:justify-start"><Mail className="h-5 w-5" /> Service Contact</h3>
            {/* TODO: confirm consultancy inquiry email */}
            <p className="mt-1 text-sm text-brand-foreground/85">TODO: consultancy@appliedbiotech.ng</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-foreground text-brand px-6 py-3 font-semibold shadow-soft hover:scale-[1.03] transition-transform">
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
