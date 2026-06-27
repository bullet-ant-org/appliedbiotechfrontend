import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Target, Lightbulb, Mail, ChevronRight, ArrowRight, FlaskConical, Microscope, Building2, Award, CheckCircle2, Users, Calendar, Beaker } from "lucide-react";
import profPortrait from "@/assets/prof-portrait.jpg";
import biotechGrid from "@/assets/biotech-grid.jpg";
import heroLab from "@/assets/image-6.jpg";
import heroPipette from "@/assets/image-7.jpg";
import mobileLab from "@/assets/image-2.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us · Applied Biotech" },
      { name: "description", content: "Meet Prof. Nwadiuto Esiobu and the Applied Biotech team — our story, our labs and our mission for Africa." },
    ],
  }),
});

const units = [
  { id: "capacity", t: "Capacity Building", mandate: "Short and long-term modular professional certifications in biotechnology techniques. We train scientists who can immediately add value to their institutions.", email: "info@appliedbiotech.ng" },
  { id: "equipment", t: "Equipment Supplies", mandate: "Turnkey procurement, vendor management and cold-chain logistics for labs across West Africa. Quality reagents, delivered on time.", email: "sales@appliedbiotech.ng" },
  { id: "consultancy", t: "Consultancy, Contracts & Grants", mandate: "Grant writing and strategy, bio-economy policy advisory and multi-institutional project management. We help your ideas get funded and executed.", email: "info@appliedbiotech.ng" },
  { id: "lab", t: "Molecular Laboratory Services", mandate: "DNA/RNA sequencing, diagnostic assays, parentage testing and molecular identification. Trusted by research institutions, hospitals and agribusiness.", email: "lab_analyst@appliedbiotech.ng" },
  { id: "bio-mfg", t: "Bio-Manufacturing", mandate: "Our ongoing research into supplements, probiotics, bioinoculants and oral care formulations — building Africa's sovereign biotechnology supply chain from the bench up. See our current R&D below.", email: "president@appliedbiotech.ng" },
];

const labProjects = [
  {
    title: "BIOTECH MOBILE LABS BUILT AND EQUIPPED FOR NATIONAL BIOSAFETY MANAGEMENT AGENCY (NBMA), AIRPORT ROAD, LUGBE; FOR DETECTION OF GENETICALLY MODIFIED ORGANISMS. Capacity  automated extraction of DNA / RNA, PCR, electrophoresis, GMO detection",
    location: "Nigeria",
    year: "2017",
    desc: "",
    tags: ["PCR", "RNA", "electrophoresis"],
    img: mobileLab,
  },
  {
    title: "THIS IS A MULTI-PURPOSE MOLECULAR BIO LABORATORY DESIGNED, BUILT OWNED AND OPERATED BY APPLIED BIOTECH NIGERIA IN WUYE NIGERIA",
    location: "Port Harcourt",
    year: "2018",
    desc: "",
    tags: ["NGS", "BSL-2", "Accredited"],
    img: heroLab,
  },
  {
    title: "THIS IS THE UNIVERSITY OF MAIDUGURI BIOTECH CENTER OF EXCELLENCE DESIGNED AND EQUIPPED BY APPLIED BIOTECH NIGERIA. WE ALSO TRAINED THE SEVERAL TRAINERS WHO HAVE BECOME A REGIONAL FORCE TO BE RECKONED WITH!",
    location: "Maiduguri",
    year: "2016",
    desc: "",
    tags: ["Training", "24 workstations", "Cell culture"],
    img: heroPipette,
  },
];

function AboutPage() {
  useReveal();
  const [activeUnit, setActiveUnit] = useState(units[0].id);
  const current = units.find((u) => u.id === activeUnit)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* CEO Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 via-background to-background" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div className="reveal order-2 lg:order-1">
            <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.25em] rounded-full bg-brand/10 text-brand font-semibold">Founded 2006</span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
              Meet <span className="gradient-text">Prof. Nwadiuto Esiobu</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Founder and CEO of Applied Biotech International. For nearly two decades, Prof. Esiobu has worked to dismantle the structural barriers limiting life science research in developing economies by integrating high-caliber technical services, elite capacity building and reliable procurement to empower African scientists.
            </p>
            <blockquote className="mt-6 border-l-4 border-brand pl-5 text-foreground italic leading-relaxed">
              "We empower African scientists to drive global biological innovations right from home soil."
            </blockquote>
            <div className="mt-3 text-sm font-semibold text-brand">Prof. Nwadiuto Esiobu, Founder & CEO</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold hover:scale-[1.03] transition-transform">
                Work with us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/rd-portfolio" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold hover:bg-accent transition-colors">
                See our research
              </Link>
            </div>
          </div>
          <div className="reveal order-1 lg:order-2 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-brand aspect-[4/5]">
              <img src={profPortrait} alt="Prof. Nwadiuto Esiobu" width={1024} height={1280} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            </div>
            <div className="hidden lg:block absolute -bottom-6 -left-6 rounded-2xl bg-card border border-border shadow-soft p-4 animate-float-slow">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Est.</div>
              <div className="font-display text-2xl font-bold text-brand">2006</div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Welcome */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-4xl">
          <div className="reveal rounded-3xl border border-border bg-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="h-16 w-16 rounded-2xl gradient-brand grid place-items-center text-brand-foreground shrink-0 text-2xl font-bold font-display">PE</div>
            <div>
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                "Welcome to Applied Biotech International. Since our establishment in 2006, our mission has been to dismantle the structural and infrastructural barriers limiting life science research in developing economies. By integrating high-caliber technical services, elite capacity building, and reliable procurement, we empower African scientists to drive global biological innovations right from home soil."
              </p>
              <div className="mt-5 font-semibold text-foreground">Prof. Nwadiuto Esiobu</div>
              <div className="text-sm text-muted-foreground">Founder & Chief Executive Officer, Applied Biotech International</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "20+", v: "Years in operation", I: Calendar },
            { k: "1000+", v: "Scientists trained", I: Users },
            { k: "5+", v: "Labs designed & built", I: Building2 },
          ].map((s) => (
            <div key={s.v} className="reveal">
              <s.I className="h-6 w-6 text-brand mx-auto mb-2" />
              <div className="font-display text-3xl md:text-4xl font-extrabold text-foreground">{s.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#06122c] text-background">
        <div className="absolute inset-0 opacity-30">
          <img src={biotechGrid} alt="" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
          {[
            {
              I: Lightbulb, t: "Our Vision",
              d: "To serve as Africa's premier gateway for advanced biotechnology application, transforming regional scientific capacity through global partnerships, structural precision and accessible innovation."
            },
            {
              I: Target, t: "Our Mission",
              d: "To advance the life sciences by equipping research institutions with state-of-the-art laboratory assets, delivering uncompromised analytical testing services, and building an elite technical workforce capable of solving critical food security, healthcare, and environmental challenges across the continent."
            },
          ].map((b, i) => (
            <div key={b.t} className="reveal rounded-3xl border border-background/10 bg-background/[0.04] backdrop-blur-sm p-8 lg:p-10 hover:bg-background/[0.08] transition-colors" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="h-12 w-12 grid place-items-center rounded-2xl gradient-brand text-brand-foreground"><b.I className="h-5 w-5" /></div>
              <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold">{b.t}</h2>
              <p className="mt-4 text-background/75 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lab Design Portfolio */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="reveal max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Lab Design Portfolio</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
              Labs we have <span className="gradient-text">designed and built</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              From mobile diagnostic units to full research facilities, we have delivered end-to-end laboratory infrastructure across West Africa. Here are some of our proudest builds.
            </p>
          </div>

          <div className="space-y-16">
            {labProjects.map((project, idx) => (
              <div
                key={project.title}
                className={`reveal grid lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                <div className={`relative rounded-3xl overflow-hidden shadow-brand aspect-[4/3] ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <img src={project.img} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-xs font-semibold">
                    <Beaker className="h-3.5 w-3.5" /> {project.location} · {project.year}
                  </div>
                </div>
                <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Project {String(idx + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">{project.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{project.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 reveal rounded-3xl bg-gradient-to-br from-brand/10 via-transparent to-accent-cyan/10 border border-border p-8 md:p-12 text-center">
            <FlaskConical className="h-10 w-10 text-brand mx-auto mb-4" />
            <h3 className="font-display text-2xl md:text-3xl font-bold">Ready to build your lab?</h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Whether you need a training facility, a diagnostic hub or a full research center, we handle everything from design to accreditation.
            </p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-4 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
              Brief our lab designers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="reveal text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What We Stand For</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold">Our core commitments</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { I: CheckCircle2, t: "Scientific Integrity", d: "Every service, product and course we deliver is held to the highest scientific standards." },
              { I: Microscope, t: "African Innovation", d: "We champion locally developed solutions, sourced from African biodiversity and designed for African contexts." },
              { I: Users, t: "Capacity First", d: "We believe the best investment is in people. Training African scientists is at the heart of everything we do." },
              { I: Building2, t: "Infrastructure That Lasts", d: "We don't just build labs. We maintain them, support them and stand behind them for the long term." },
              { I: Award, t: "Global Standards", d: "Our certifications, our reagents and our facilities meet international benchmarks. No compromises." },
              { I: Target, t: "Measurable Impact", d: "We track outcomes, not just outputs. Our success is measured by what our clients achieve." },
            ].map((v, i) => (
              <div key={v.t} className="reveal group rounded-2xl border border-border bg-card p-6 hover:border-brand/40 hover:-translate-y-1 hover:shadow-soft transition-all" style={{ transitionDelay: `${i * 40}ms` }}>
                <div className="h-10 w-10 grid place-items-center rounded-xl gradient-brand text-brand-foreground group-hover:scale-110 transition-transform">
                  <v.I className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="reveal max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Our Units</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
              Specialized teams, <span className="gradient-text">direct access.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Each unit is led by a specialist. Select one to see its mandate and contact.</p>
          </div>
          <div className="reveal mt-10 grid md:grid-cols-[1fr_1.3fr] gap-6">
            <div className="flex flex-col gap-2">
              {units.map((u, i) => (
                <button
                  key={u.id}
                  onClick={() => setActiveUnit(u.id)}
                  className={`text-left rounded-2xl border p-4 transition-all ${activeUnit === u.id ? "border-brand bg-brand/5 shadow-soft" : "border-border bg-card hover:border-brand/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Unit 0{i + 1}</div>
                      <div className="font-display font-bold mt-1">{u.t}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeUnit === u.id ? "text-brand translate-x-1" : "text-muted-foreground"}`} />
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-soft min-h-[280px]">
              <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Core Mandate</span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold">{current.t}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{current.mandate}</p>
              <div className="mt-7 flex items-center gap-3 rounded-2xl bg-secondary/60 p-4">
                <div className="h-10 w-10 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Contact this unit</div>
                  <a href={`mailto:${current.email}`} className="font-semibold text-foreground hover:text-brand transition-colors">{current.email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio-Manufacturing — company narrative */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal">
              <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Bio-Manufacturing</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold leading-[1.05]">
                Building Africa's sovereign biotechnology supply chain
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Bio-Manufacturing is one of our most deliberate strategic bets. Applied Biotech has spent years building the technical capacity, the institutional relationships and the formulation know-how to start producing locally what African labs currently import at a premium.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From nuclease-free water and nucleic acid purification media already in circulation, to a pipeline of bioinoculants, probiotics and oral care formulations currently in active development — this unit represents our conviction that Africa should not just be a consumer of biotechnology, but a producer of it.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Every product we manufacture is grounded in the same rigorous molecular science that powers our lab services and training programs. We are not formulating for trend — we are formulating for impact, for food security, for health equity and for the long-term competitiveness of African science.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/rd-portfolio" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold hover:scale-[1.03] transition-transform shadow-brand">
                  View our R&D portfolio <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold hover:bg-accent transition-colors">
                  Partner with us
                </Link>
              </div>
            </div>

            <div className="reveal grid grid-cols-2 gap-4">
              {[
                { label: "Available Now", n: "2", desc: "Products already in active supply to Nigerian labs" },
                { label: "In Development", n: "4+", desc: "Formulations currently in active R&D across our pipeline" },
                { label: "Since", n: "2006", desc: "Years building the capacity behind every product we make" },
                { label: "Local First", n: "100%", desc: "All manufacturing designed around African raw materials" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center hover:border-brand/40 hover:shadow-soft transition-all">
                  <div className="font-display text-3xl font-extrabold text-brand">{s.n}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider text-foreground">{s.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground leading-snug">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ABSDIP */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="reveal grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">ABSDIP</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold leading-tight">
                Africa's Biotechnology & Science Discovery Investment Portal
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                ABSDIP is a world-class ecosystem where breakthrough discoveries in science, public discourse and transformative scientific innovation converge — shaping the future of science across the African continent.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From Science Discovery Dome events and Research & Residencies, to Innovation & Venture initiatives and a State-of-the-Art Science Ecosystem — ABSDIP is the infrastructure for the next generation of African scientists, researchers and innovators. By year 5, ABSDIP is projected to generate ₦13.9B in annual revenue from growth and investments in research and innovation.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  { n: "₦11.2B", label: "Projected global revenue streams" },
                  { n: "10–15%", label: "Projected annual growth" },
                  { n: "₦560M", label: "Projected domestic revenue annually" },
                  { n: "₦13.9B", label: "Projected annual revenue by year 5" },
                ].map((s) => (
                  <div key={s.n} className="rounded-2xl border border-border bg-card p-5 text-center hover:border-brand/30 transition-colors">
                    <div className="font-display text-2xl font-extrabold text-brand">{s.n}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://absdip.com/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-3.5 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
                  Explore ABSDIP <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="reveal space-y-4">
              {[
                { t: "Science Discovery Dome", d: "A globally connected hub for science knowledge sharing, public discourse and frontier research communication." },
                { t: "Research & Residencies", d: "Structured residency programs embedding scientists in world-class facilities to accelerate breakthrough discoveries." },
                { t: "Innovation & Venture", d: "Supporting biotech startups, spinouts and investment-ready science ventures from incubation to commercialisation." },
                { t: "Campus-Smart Herb-Guest Lodge", d: "A de-risked investment model combining hospitality infrastructure with scientific community co-location." },
              ].map((p) => (
                <div key={p.t} className="rounded-2xl border border-border bg-card p-5 hover:border-brand/40 hover:shadow-soft transition-all">
                  <div className="font-display font-bold">{p.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COVID-19 Response */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="reveal text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Our COVID-19 Response</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold leading-tight">
              When it mattered most, we acted
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              During the COVID-19 pandemic, Applied Biotech partnered with Bluestone USA to bring FDA-authorised saliva-based testing to Nigeria — one of the most accessible, accurate and scalable diagnostic approaches available at the time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="reveal space-y-5">
              <div className="rounded-2xl border border-border bg-card p-7">
                <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold mb-3">The BlueStoneTM Saliva Test</div>
                <h3 className="font-display text-xl font-bold">A de-risked, accurate alternative</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  The FDA-authorised BlueStoneTM saliva test for COVID-19 requires no nasopharyngeal swab — making it safe, comfortable and practical for wide deployment. The sample is self-administered by the person inserting the swab to lip-long depth, removing the risk of deep nasal insertion entirely.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {[
                    "Impressively accurate — no PPE-gowned medical staff required",
                    "Barcoded results integrated directly with the Health Portal",
                    "Results available by end of next day",
                    "Validated by the New England Journal of Medicine",
                    "Close to 100% accurate with 24-hour turnaround",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal space-y-5">
              <div className="rounded-2xl border border-border bg-card p-7">
                <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold mb-3">Evidence on Accuracy</div>
                <h3 className="font-display text-xl font-bold">Saliva testing vs nasopharyngeal swabs</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Research published in the New England Journal of Medicine demonstrated that saliva tests matched or outperformed nasopharyngeal swabs for early COVID-19 diagnosis. Among 70 healthcare workers who tested positive via nasopharyngeal swab, 81% also tested positive via saliva — providing a non-invasive, self-administered alternative that doesn't require trained personnel or special collection kits.
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Early data showed that saliva samples were more likely to test positive in the days immediately following symptom onset, making them more sensitive for early-stage detection.
                </p>
              </div>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  ABI partnered with Bluestone USA to offer this FDA-authorised system to Nigerian institutions. For further information contact: <a href="mailto:abi_nigeria2016@comcast.net" className="text-brand font-semibold hover:underline">abi_nigeria2016@comcast.net</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-6xl rounded-3xl gradient-brand text-brand-foreground p-10 md:p-16 shadow-brand relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-background/10 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Ready to take the next step?</h2>
              <p className="mt-3 text-brand-foreground/85 max-w-xl">Whether you want to train, equip your lab, consult our experts or explore a partnership, we'd love to hear from you.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-4 font-semibold hover:scale-105 transition-transform shadow-soft self-start md:self-center">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
