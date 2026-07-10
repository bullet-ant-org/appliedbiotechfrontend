import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import {
  ArrowRight, ChevronRight, Sparkles, FlaskConical, ShoppingBag, GraduationCap,
  BrainCircuit, Play, Shield, Cpu, Award, Microscope, CheckCircle2, Calendar,
  Globe, Users, ClipboardCheck, LineChart,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import heroVirus from "@/assets/image-c.jpg";
import profPortrait from "@/assets/prof-portrait.jpg";
import biotechGrid from "@/assets/biotech-grid.jpg";

export const Route = createFileRoute("/")(  {
  component: Index,
  head: () => ({
    meta: [
      { title: "Applied Biotech — Leading the Biotechnology Revolution in Africa" },
      { name: "description", content: "Shop lab supplies, rent a lab, learn biotechnology, consult experts and advance your science with Applied Biotech." },
    ],
  }),
});

function Index() {
  useReveal();
  const { fetchData } = useFetch();
  useEffect(() => {
    fetchData("/api/v1/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "landing" }),
    }).catch(() => {});
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      
      <Pillars />
      <ConsultSection />
      <QuickDoors />
      <PetalNavigator />
      <DiasporaBridge />
      <Welcome />
      <CTA />
      <Footer />
    </div>
  );
}


function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full gradient-brand opacity-[0.12] blur-3xl animate-float-slow" />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-[0.2em]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-ring" />
          Advancing Biotechnology Research & Solutions
        </span>
        <h1 className="mt-6 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
          Welcome to <span className="gradient-text">Applied Biotech International Nigeria LTD</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Applied Biotech International Nigeria Limited is a leading provider of accredited molecular laboratory services, technical training and strategic biotechnology consultancy equipping African institutions with validated infrastructure and evidence-based scientific capability.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3.5 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
            Our Services <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-card border border-border text-foreground px-6 py-3.5 font-semibold hover:bg-accent transition-colors">
            Learn More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mt-14 relative rounded-[2rem] overflow-hidden shadow-brand aspect-[16/8]">
        <img src={heroVirus} alt="Applied Biotech laboratory research" width={1600} height={800} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062011]/70 via-transparent to-transparent" />
        <div className="hidden md:block absolute bottom-6 left-6 rounded-2xl bg-card/95 backdrop-blur border border-border shadow-soft p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Scientists Trained</div>
          <div className="font-display text-2xl font-bold text-brand">1000+</div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Shop Lab Supplies", "Rent a Lab", "Consult Our Experts", "Acquire a Skill", "Apply for a Job", "View Our Gallery", "Enroll in Academy", "Build Your Career"];
  return (
    <div className="border-y border-border bg-card/50 overflow-hidden">
      <div className="flex gap-12 py-5 animate-[marquee_14s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="text-sm uppercase tracking-[0.25em] text-muted-foreground font-medium flex items-center gap-12">
            {it} <span className="text-brand">◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee {0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}`}</style>
    </div>
  );
}

const EXPLORE_CARDS = [
  { I: FlaskConical, t: "Molecular Lab Services", d: "Accredited sample analysis, rent-a-lab access and specialty diagnostic testing performed under validated protocols.", cta: "View Services", to: "/services" as const, img: heroVirus },
  { I: GraduationCap, t: "Academy & Training", d: "Certified hands-on cohorts in PCR, sequencing and bioinformatics, delivered by practicing molecular scientists.", cta: "Explore Academy", to: "/academy" as const, img: biotechGrid },
  { I: ShoppingBag, t: "Reagents & Instrumentation", d: "Calibrated instruments and validated consumables for the modern African molecular laboratory, shipped with technical support.", cta: "Visit Shop", to: "/shop" as const, img: "https://res.cloudinary.com/djzi0scln/image/upload/v1782488582/dvep9dxrin7np6a8b4u6.png" },
];

function QuickDoors() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What We Offer</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Dedicated pathways into <span className="gradient-text">our work.</span></h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EXPLORE_CARDS.map((c, idx) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-3xl overflow-hidden shadow-soft aspect-[4/5]"
            >
              <img src={c.img} alt={c.t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-brand/30 mix-blend-color" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062011] via-[#062011]/60 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end text-background">
                <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center mb-4">
                  <c.I className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">{c.t}</h3>
                <p className="mt-2 text-sm text-background/80 leading-relaxed">{c.d}</p>
                <Link to={c.to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-glow hover:gap-2.5 transition-all">
                  {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PetalNavigator() {
  const petals = [
    { label: "Sample Analysis", sub: "Accredited testing", to: "/services" as const, hash: "sample-analysis", bg: "from-emerald-600 to-emerald-800", I: ClipboardCheck },
    { label: "Rent a Lab", sub: "World-class facilities", to: "/services" as const, hash: "rent-a-lab-card", bg: "from-green-600 to-green-800", I: FlaskConical },
    { label: "Build Your Lab", sub: "Design & equipment", to: "/services" as const, hash: "lab-design", bg: "from-teal-600 to-teal-800", I: ShoppingBag },
    { label: "Acquire a Skill", sub: "Certified training", to: "/services" as const, hash: "courses", bg: "from-lime-600 to-lime-800", I: GraduationCap },
    { label: "Consult Us", sub: "Strategic guidance", to: "/services" as const, hash: "strategic-consultancy", bg: "from-green-700 to-emerald-900", I: BrainCircuit },
    { label: "Reagents", sub: "Instrumentation supply", to: "/services" as const, hash: "reagents", bg: "from-emerald-500 to-teal-700", I: Microscope },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What Can You Do Here?</span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Pick your path into <span className="gradient-text">Applied Biotech</span></h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Six ways to take action. Choose what matters to you and step right in.</p>
      </div>

      {/* Larger screens: circular petal layout */}
      <div className="relative mx-auto mt-14 h-[420px] sm:h-[420px] w-full max-w-[300px] sm:max-w-[420px]">
        {petals.map((p, idx) => {
          const angle = (idx / petals.length) * Math.PI * 2 - Math.PI / 2;
          const radius = window.innerWidth < 640 ? 130 : 185;
          const size = window.innerWidth < 640 ? 100 : 144;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={p.label}
              className="absolute left-1/2 top-1/2"
              style={{ x: x - size/2, y: y - size/2 }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 110 }}
            >
              <Link
                to={p.to}
                hash={p.hash}
                className={`group relative grid place-items-center rounded-full text-white font-semibold shadow-brand transition-transform hover:scale-110 bg-gradient-to-br ${p.bg}`}
                style={{ width: size, height: size }}
              >
                <div className="flex flex-col items-center gap-1 px-2 text-center">
                  <p.I className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] sm:text-xs font-bold leading-tight">{p.label}</span>
                  <span className="text-[7px] sm:text-[9px] text-white/70 leading-tight hidden sm:block">{p.sub}</span>
                </div>
                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/60 transition" />
              </Link>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="h-[80px] w-[80px] sm:h-[110px] sm:w-[110px] rounded-full gradient-brand grid place-items-center shadow-brand relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-brand/30" style={{ animationDuration: "3s" }} />
            <div className="relative h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] rounded-full bg-card grid place-items-center border border-border">
              <div className="font-display font-extrabold text-brand text-center leading-tight text-[8px] sm:text-xs">
                Engage<br />Us
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
}
const CONSULT_PILLARS = [
  { t: "Lab Design & Setup", d: "We design and build fully equipped, accredited molecular facilities tailored to your institution's needs and budget." },
  { t: "Grant Writing & Policy", d: "Our team has secured millions in research grants. We put that expertise to work for your next application." },
  { t: "Research Commercialization", d: "We map your research to market opportunities, identify the right partnerships and build the commercialization pathway your science deserves." },
  { t: "Strategic Direction", d: "From funding strategy to organizational positioning, we give you the roadmap to grow with clarity and confidence." },
  
];

function ConsultSection() {
  const checks = [
    "Identify opportunities others miss",
    "Connect research with real-world applications",
    "Access expert guidance on biotech innovation",
    "Build stronger commercialization strategies",
    "Navigate challenges with confidence",
    "Position your organization at the forefront",
  ];

  return (
    <section id="consult" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#062011] text-background">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-glow font-semibold">Consulting Services</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
              Turn Your Biotechnology Vision<br />
              <span className="text-brand-glow">Into Reality</span>
            </h2>
            <p className="mt-5 text-background/80 text-lg leading-relaxed max-w-xl">
              Translational impact in biotechnology is rarely a product of ideas alone; it results from rigorous methodology applied by organizations equipped to convert research into measurable outcomes.
            </p>
            <p className="mt-4 text-background/70 leading-relaxed max-w-xl">
              Whether you are a researcher pursuing a commercialization pathway, a startup requiring strategic direction, or an institution evaluating a biotechnology opportunity, our consulting practice applies structured, evidence-based methods to accelerate decision-making and de-risk your next step.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {checks.map((c) => (
                <div key={c} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-glow shrink-0 mt-0.5" />
                  <span className="text-sm text-background/85">{c}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-background/[0.07] border border-background/10">
              <p className="text-background/85 text-sm leading-relaxed italic">
                "As a leading biotechnology consultancy on the continent, we apply structured methodology and technical rigor to help innovators, institutions and businesses convert research potential into validated, measurable results."
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-4 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
                Book a Consultation <Calendar className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-background/20 text-background px-7 py-4 font-semibold hover:bg-background/10 transition-colors">
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {CONSULT_PILLARS.map((item, idx) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="rounded-2xl border border-background/10 bg-background/[0.06] backdrop-blur-sm p-5 hover:bg-background/[0.1] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-brand-glow font-display font-bold text-lg shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display font-bold text-background">{item.t}</h3>
                    <p className="mt-1.5 text-sm text-background/65 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


const DIASPORA_MANDATE = [
  { icon: ClipboardCheck, t: "Vetting", d: "Rigorous credential and competency screening of Diaspora-based STEMM experts against host-institution requirements." },
  { icon: Globe, t: "Mapping", d: "Systematic mapping of expertise to institutional need, aligning specialists with the departments and programs where their contribution is most consequential." },
  { icon: Users, t: "Coordination", d: "End-to-end coordination between returning experts and host institutions across teaching, research and capacity-building engagements." },
  { icon: LineChart, t: "Monitoring & Evaluation", d: "Structured M&E frameworks that track engagement outcomes and quantify impact against the program's stated objectives." },
];

function DiasporaBridge() {
  return (
    <section id="diaspora-bridge" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
          <div className="reveal">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Federal Ministry of Education Initiative</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
              The <span className="gradient-text">Diaspora Bridge</span> Program
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Applied Biotech was engaged as strategic consultant to the Diaspora Bridge program, an initiative of the Federal Ministry of Education designed to connect Nigerian STEMM experts based abroad with host institutions across the country.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The program facilitates structured collaboration between Diaspora-based specialists and Nigerian institutions through teaching appointments, joint research and capacity-building engagements, reinforcing the nation's scientific and technical base with globally distributed expertise.
            </p>
            <Link to="/services" className="mt-8 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-4 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
              Our Role as Strategic Consultant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {DIASPORA_MANDATE.map((item, idx) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center">
                  <item.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="mt-4 font-display font-bold">{item.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Welcome() {
  const [playing, setPlaying] = useState(false);
  const videoId = "dQw4w9WgXcQ";
  return (
    <section className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
        <div className="reveal">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Founder · CEO</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
            A message from <span className="gradient-text">Prof. Nwadiuto Esiobu</span>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Hear directly from our founder and CEO about why Applied Biotech exists, who we're building for and how you can be part of this movement.
          </p>
          <Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold hover:bg-accent transition-colors">
            Our full story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="reveal">
          <Link to="https://vm.tiktok.com/ZNRwBrCBY/">
          <div className="relative rounded-3xl overflow-hidden shadow-brand aspect-video bg-foreground group">
            {playing ? (
              <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title="Welcome from Prof. Nwadiuto Esiobu" allow="autoplay; encrypted-media" allowFullScreen className="absolute inset-0 w-full h-full" />
            ) : (
              <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full">
                <img src={profPortrait} alt="Prof. Nwadiuto Esiobu, Founder and CEO of Applied Biotech" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-20 w-20 rounded-full bg-background/95 grid place-items-center shadow-brand group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-brand ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <div className="text-xs uppercase tracking-[0.2em] text-background/75 font-semibold">Watch</div>
                  <div className="font-display font-bold text-background text-xl">Prof. Nwadiuto Esiobu · Founder & CEO</div>
                </div>
              </button>
            )}
          </div>
            </Link>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars = [
    { I: Sparkles, t: "Bench You Can Trust", d: "Calibrated assays, validated SOPs and zero contamination tolerance on every run." },
    { I: Cpu, t: "Labs That Show Up", d: "Designed, built and maintained end-to-end. No abandoned facilities, no broken kit." },
    { I: Award, t: "Certifications That Travel", d: "Train here, work anywhere. CMD-recognised curriculum trusted across the continent." },
    { I: Shield, t: "20 Years of Proven Results", d: "A scientific track record backed by two decades of peer-reviewed, field-proven research." },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Why Applied Biotech</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Four reasons to <span className="gradient-text">build with us.</span></h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div key={p.t} className="reveal group rounded-2xl border border-border bg-card p-7 hover:border-brand/40 hover:-translate-y-1 hover:shadow-soft transition-all" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground group-hover:scale-110 transition-transform">
                <p.I className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display font-bold text-lg">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricBanner() {
  const stats = [
    { k: "20+", v: "Years advancing African molecular science" },
    { k: "1000+", v: "Scientists and technicians certified" },
    { k: "5+", v: "World-class research hubs built end-to-end" },
  ];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] gradient-brand text-brand-foreground p-10 md:p-16 shadow-brand relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-background/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-background/5 blur-3xl" />
        <div className="relative grid sm:grid-cols-3 gap-10 text-center">
          {stats.map((s) => (
            <div key={s.v} className="reveal">
              <div className="font-display text-5xl md:text-7xl font-extrabold tracking-tight">{s.k}</div>
              <div className="mt-3 text-sm md:text-base text-brand-foreground/85 leading-snug">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="reveal mx-auto max-w-6xl rounded-3xl gradient-brand text-brand-foreground p-10 md:p-16 shadow-brand relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-background/10 blur-3xl" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Your next breakthrough starts with a conversation.</h2>
            <p className="mt-3 text-brand-foreground/85 max-w-xl">Book a discovery call and tell us about the project, the cohort or the lab you're trying to build. We'll meet you where you are.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-4 font-semibold hover:scale-105 transition-transform shadow-soft self-start md:self-center">
            Book your call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
