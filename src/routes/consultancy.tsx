import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Briefcase, FlaskConical, ArrowRight, Mail, Beaker, ClipboardCheck, Globe, Users, LineChart } from "lucide-react";
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
    t: "Research Consultancy",
    d: "Consult us to help you standardize your research projects. We can help you with:",
    items: ["Developing your research proposal", "Research workflow and structure", "Grant writing", "Manuscript optimization for publication"],
    I: FlaskConical,
  },
  {
    t: "Strategic Consultancy",
    d: "Leverage our expertise across the full lifecycle of your institution or venture:",
    items: ["Project management", "Leadership and management training", "Innovation and bio enterprise incubation", "Lab design and outfitting", "Global policy advisory"],
    I: Briefcase,
  },
];

const DIASPORA_MANDATE = [
  { icon: ClipboardCheck, t: "Vetting", d: "Rigorous credential and competency screening of Diaspora-based STEMM experts against host-institution requirements." },
  { icon: Globe, t: "Mapping", d: "Systematic mapping of expertise to institutional need, aligning specialists with the departments and programs where their contribution is most consequential." },
  { icon: Users, t: "Coordination", d: "End-to-end coordination between returning experts and host institutions across teaching, research and capacity-building engagements." },
  { icon: LineChart, t: "Monitoring & Evaluation", d: "Structured M&E frameworks that track engagement outcomes and quantify impact against the program's stated objectives." },
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
        <div className="mx-auto max-w-3xl text-center mb-14 reveal">
          <p className="text-muted-foreground leading-relaxed text-lg">
            Biotechnology breakthroughs rarely happen by accident. Behind every successful lab, research grant or bio-enterprise is a structured, evidence-based process. Applied Biotech's consultancy practice brings two decades of institutional and scientific experience to bear on your specific challenge — whether that's getting a manuscript published, standing up a new laboratory, or positioning your organization for the next stage of growth.
          </p>
        </div>
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

        {/* Diaspora Bridge — relocated from homepage, strategic consultancy engagement */}
        <div className="mx-auto max-w-6xl mt-10 rounded-3xl border border-border bg-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-full">
              <img src="https://diaspora-bridge.ng/attachment/83dc0cd1-90d7-4f0e-9824-0373329b72f6" alt="Diaspora Bridge program launch" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent lg:bg-gradient-to-r" />
              <img src="https://diaspora-bridge.ng/attachment/e5357a3b-24f5-4475-ad66-0d33445596e8" alt="Diaspora Bridge logo" className="absolute top-5 left-5 h-12 rounded-lg bg-background/90 p-1.5 shadow-soft" />
            </div>
            <div className="p-8 md:p-12">
              <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Federal Ministry of Education Initiative</span>
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold leading-tight">
                The <span className="gradient-text">Diaspora Bridge</span> Program
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Applied Biotech was engaged as strategic consultant to the Diaspora Bridge program, an initiative of the Federal Ministry of Education designed to connect Nigerian STEMM experts based abroad with host institutions across the country.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                The program facilitates structured collaboration between Diaspora-based specialists and Nigerian institutions through teaching appointments, joint research and capacity-building engagements, reinforcing the nation's scientific and technical base with globally distributed expertise.
              </p>
              <a href="https://diaspora-bridge.ng" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
                Visit Diaspora Bridge <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 p-8 md:p-12 pt-0">
            {DIASPORA_MANDATE.map((item) => (
              <div key={item.t} className="rounded-2xl border border-border bg-background/60 p-5">
                <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center">
                  <item.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="mt-4 font-display font-bold">{item.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Design Portfolio — relocated from About Us, under Strategic Consultancy */}
        <div id="our-projects" className="mx-auto max-w-6xl mt-16 scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold whitespace-nowrap">Our Projects</span>
            <div className="h-px flex-1 bg-border" />
          </div>
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
