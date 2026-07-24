import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import {
  ArrowRight, ChevronRight, Sparkles, FlaskConical, ShoppingBag, GraduationCap,
  BrainCircuit, Play, Shield, Cpu, Award, Microscope, CheckCircle2, Calendar,
  ClipboardCheck, Briefcase, Building2, Rocket,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import heroVirus from "@/assets/image-c.jpg";
import heroTestTube from "@/assets/hero-test-tube.jpg";
import heroPetriGroup from "@/assets/hero-petri-group.jpg";
import heroFarmland from "@/assets/hero-farmland.jpg";
import absdipLogo from "@/assets/absdip-logo.png";
import consultingMeeting from "@/assets/consulting-meeting.jpg";
import profPortrait from "@/assets/prof-portrait.jpg";
import capacityBuildingLab from "@/assets/capacity-building-lab.jpg";
import covenantLetter from "@/assets/testimonials/covenant-university-letter.jpg";
import ebsuLetter from "@/assets/testimonials/ebsu-letter.jpg";

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
      <WhoWeAre />
      <PetalNavigator />
      <QuickDoors />
      <ConsultSection />
      <Pillars />
      <AbsdipTeaser />
      <CTA />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}


const HERO_CARDS = [
  { t: "Leading Cutting Edge Scientific Research.", hint: "Close-up of someone in the lab holding a test tube", img: heroVirus },
  { t: "Empowering the Next Generation of Scientists.", hint: "Hall demonstrating to trainees (faces blurred)", img: heroTestTube },
  { t: "Powering the Bioeconomy in Africa.", hint: "Lab / bioeconomy imagery", img: heroFarmland },
  { t: "Championing Indigenous Leadership and Innovation.", hint: "Leadership / innovation imagery", img: heroPetriGroup },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_CARDS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const card = HERO_CARDS[i];

  return (
    <section className="relative pt-28 lg:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full gradient-brand opacity-[0.12] blur-3xl animate-float-slow" />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-[0.2em]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-ring" />
          Powering the Next Frontiers of Life Science Solutions to Real Life Challenges
        </span>
        <h1 className="mt-6 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
          Welcome to <span className="gradient-text">Applied Biotech International Nigeria LTD</span>
        </h1>
      </div>

      {/* Rotating feature cards — crossfade + slow zoom, one card visible at a time */}
      <div className="mx-auto max-w-3xl mt-10 relative rounded-[2rem] overflow-hidden shadow-brand aspect-[16/9] bg-secondary">
        {HERO_CARDS.map((c, idx) => (
          <div key={c.t} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
            {c.img ? (
              <img src={c.img} alt={c.t} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${idx === i ? "scale-110" : "scale-100"}`} />
            ) : (
              /* TODO: replace placeholder image — {c.hint}, no full faces per client request */
              <div className={`absolute inset-0 bg-secondary flex items-center justify-center text-xs text-muted-foreground text-center px-6 transition-transform duration-[6000ms] ease-linear ${idx === i ? "scale-110" : "scale-100"}`}>
                [Image placeholder: {c.hint}]
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#052C54]/85 via-[#052C54]/20 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center p-8">
              <p className="text-background font-display font-bold text-xl md:text-2xl text-center max-w-lg">{c.t}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {HERO_CARDS.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand" : "w-3 bg-border hover:bg-muted-foreground"}`} />
        ))}
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center reveal">
        <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Who We Are</span>
        <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          Founded in 2006 by Prof. Nwadiuto Esiobu, Applied Biotech International Nigeria Limited (ABINL) is a premier biotechnology enterprise and a cornerstone of advanced scientific research in Africa. Headquartered in Abuja, ABINL was established to bridge the gap between theoretical academic knowledge and practical, cutting-edge laboratory execution.
        </p>
        <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
          We serve as a trusted hub for educational institutions, government agencies and independent researchers, providing the elite scientific expertise and modern tools needed to solve real-world challenges. By focusing on capacity building, we are committed to elevating Africa's scientific standing on the global stage and unlocking sustainable development through biotech innovation.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#what-we-offer" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3.5 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
            Our Services <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-card border border-border text-foreground px-6 py-3.5 font-semibold hover:bg-accent transition-colors">
            Learn More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "What laboratory services does Applied Biotech provide?", a: "We offer molecular sample analysis, rent-a-lab access, specialty diagnostic testing, lab design and equipping, and supply of validated reagents and instrumentation." },
  { q: "Can institutions rent laboratory space or equipment?", a: "Yes. Our rent-a-lab service gives researchers and institutions access to fully equipped molecular facilities without the overhead of building one." },
  { q: "Do you offer training for scientists and technicians?", a: "Yes. Our Academy runs certified hands-on courses and workshops covering PCR, sequencing, diagnostics and bioinformatics, plus institutional upskilling programs." },
  { q: "Who can access Applied Biotech's services?", a: "Scientists, hospitals, research institutions, universities, government agencies and private organizations across Nigeria and Africa." },
  { q: "How do I request a consultation or quote?", a: "Reach out through our Contact page or the Consult Us link, and our team will respond with a scoped proposal." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10 reveal">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">FAQs</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, idx) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold">
                {f.q}
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${open === idx ? "rotate-90 text-brand" : "text-muted-foreground"}`} />
              </button>
              {open === idx && <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


const EXPLORE_CARDS = [
  { I: FlaskConical, t: "Molecular Lab Services", d: "Accredited sample analysis, rent-a-lab access and specialty diagnostic testing performed under validated protocols.", cta: "View Services", to: "/molecular-lab-services" as const, img: heroVirus },
  { I: ShoppingBag, t: "Lab Equipment & Reagents", d: "Calibrated instruments and validated consumables for the modern African molecular laboratory, shipped with technical support.", cta: "Visit Shop", to: "/equipment-reagents" as const, img: "https://res.cloudinary.com/djzi0scln/image/upload/v1782488582/dvep9dxrin7np6a8b4u6.png" },
  { I: GraduationCap, t: "Capacity Building", d: "Hands-on workshops, certified cohorts and institutional upskilling delivered by practicing molecular scientists.", cta: "Explore Programs", to: "/capacity-building" as const, img: capacityBuildingLab },
  { I: BrainCircuit, t: "Consultancy", d: "Strategic and research consultancy for institutions, ventures and government biotechnology programs.", cta: "View Consultancy", to: "/consultancy" as const, img: consultingMeeting, cta2: "Our Projects", to2: "/consultancy" as const, hash2: "our-projects" },
];

function QuickDoors() {
  return (
    <section id="what-we-offer" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What We Offer</span>
      
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE_CARDS.map((c, idx) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-3xl overflow-hidden shadow-soft aspect-[4/5]"
            >
              <img src={c.img} alt={c.t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052C54] via-[#052C54]/60 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end text-background">
                <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center mb-4">
                  <c.I className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">{c.t}</h3>
                <p className="mt-2 text-sm text-background/80 leading-relaxed">{c.d}</p>
                <Link to={c.to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-glow hover:gap-2.5 transition-all">
                  {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {"cta2" in c && (
                  <Link to={c.to2} hash={c.hash2} className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-background/70 hover:text-background hover:gap-2.5 transition-all">
                    {c.cta2} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
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
    { label: "Sample Analysis", sub: "Accredited testing", to: "/molecular-lab-services" as const, hash: "sample-analysis", bg: "from-blue-600 to-blue-800", I: ClipboardCheck },
    { label: "Equipment & Reagents", sub: "Shop the essentials", to: "/equipment-reagents" as const, bg: "from-sky-600 to-sky-800", I: ShoppingBag },
    { label: "Rent-a-Lab", sub: "World-class facilities", to: "/molecular-lab-services" as const, hash: "rent-a-lab", bg: "from-blue-700 to-indigo-900", I: FlaskConical },
    { label: "Strategic Consultancy", sub: "Institutional guidance", to: "/consultancy" as const, hash: "strategic-consultancy", bg: "from-sky-500 to-blue-700", I: BrainCircuit },
    { label: "Research Consultation", sub: "Scientific guidance", to: "/consultancy" as const, hash: "research-consultancy", bg: "from-blue-800 to-[#052C54]", I: Microscope },
    { label: "Acquire a Skill", sub: "Certified training", to: "/capacity-building" as const, bg: "from-blue-600 to-sky-800", I: GraduationCap },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What Can You Do Here?</span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Pick your path into <span className="gradient-text">Applied Biotech</span></h2>
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
          <Link to="/contact" className="block h-[80px] w-[80px] sm:h-[110px] sm:w-[110px] rounded-full gradient-brand grid place-items-center shadow-brand relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-brand/30" style={{ animationDuration: "3s" }} />
            <div className="relative h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] rounded-full bg-card grid place-items-center border border-border">
              <div className="font-display font-extrabold text-brand text-center leading-tight text-[8px] sm:text-xs">
                Contact<br />Us
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
const CONSULT_PILLARS = [
  { t: "Project Management", d: "End-to-end oversight of biotechnology projects, from scoping and funding to delivery and evaluation." },
  { t: "Lab Design", d: "We design and build fully equipped, accredited molecular facilities tailored to your institution's needs and budget." },
  { t: "Bio Enterprise Incubation", d: "Structured support for biotech ventures moving from concept to a viable, investable enterprise." },
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
    <section id="consult" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#052C54] text-background">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
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
              <Link to="/consultancy" className="inline-flex items-center gap-2 rounded-full border border-background/20 text-background px-7 py-4 font-semibold hover:bg-background/10 transition-colors">
                View Consultancy <ArrowRight className="h-4 w-4" />
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



function Pillars() {
  const pillars = [
    { I: Shield, t: "20 Years of Impact", d: "Two decades of scientific leadership, capacity building and powering the bioeconomy across Africa." },
    { I: Award, t: "Trusted Faculty", d: "Qualified and experienced researchers bringing deep scientific expertise to every engagement." },
    { I: Sparkles, t: "Quality Laboratories", d: "Verified, up-to-date reagents and equipment, backed by rigorous quality assurance on every bench." },
    { I: CheckCircle2, t: "Verifiable Partnership", d: "Our partnerships with organizations across Africa are verifiable, credible and built on a trustworthy track record." },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Why Applied Biotech</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Four Reasons to <span className="gradient-text">Partner With Us.</span></h2>
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

const ABSDIP_PILLARS = [
  { t: "Science Discovery Dome", d: "An immersive public exhibition space bringing cutting-edge science to life for students, families and visitors from across the continent.", I: Sparkles },
  { t: "Research & Residencies", d: "Purpose-built labs and residency programs for scientists, research fellows and innovators working at the frontier of biotechnology.", I: Microscope },
  { t: "Advanced Facilities", d: "State-of-the-art laboratories, venture incubation space and campus infrastructure built to global standards.", I: Building2 },
];

const ABSDIP_WHY = [
  { t: "Proven Licensing", d: "A licensing model built on validated intellectual property and a track record of institutional delivery." },
  { t: "About-Ready Assets", d: "Facilities and infrastructure designed for near-term deployment, minimizing time to first revenue." },
  { t: "Multiple Revenue Streams", d: "Admissions, merchandise, events and rentals diversify income beyond research and licensing." },
  { t: "Premium Facility", d: "A campus-grade science park positioned to attract global research and investment partners." },
];

const ABSDIP_STATS = [
  { n: "₦11.2B", label: "Total Investment Value" },
  { n: "10–15%", label: "Projected Annual ROI" },
  { n: "₦560M", label: "Estimated Annual Revenue" },
  { n: "150+", label: "Partner Institutions" },
];

function AbsdipTeaser() {
  return (
    <section id="absdip" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="reveal flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left">
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl border border-border bg-card p-3 shadow-soft shrink-0">
            <img src={absdipLogo} alt="ABSDIP logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">ABSDIP · A Standalone Project</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold leading-tight">
              Applied Biotech Science, Discovery & Innovation Park
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              ABSDIP is a world-class innovation ecosystem where breakthrough research, public discovery and transformative scientific innovation converge — Africa's science discovery and innovation park, and a global hub for the future of science.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {ABSDIP_PILLARS.map((p, idx) => (
            <motion.div key={p.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6">
              <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center"><p.I className="h-5 w-5 text-brand-foreground" /></div>
              <h3 className="mt-4 font-display font-bold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] gradient-brand text-brand-foreground p-8 md:p-12 shadow-brand relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-background/10 blur-3xl" />
          <div className="relative">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-foreground/70 font-semibold">A De-Risked Investment</span>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-extrabold">Why ABSDIP?</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ABSDIP_WHY.map((w) => (
                <div key={w.t} className="rounded-2xl bg-background/10 border border-background/20 p-5">
                  <h4 className="font-display font-bold">{w.t}</h4>
                  <p className="mt-2 text-sm text-brand-foreground/85 leading-relaxed">{w.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-background/20 pt-6">
              {ABSDIP_STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-2xl md:text-3xl font-extrabold">{s.n}</div>
                  <div className="mt-1 text-xs text-brand-foreground/75 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a href="https://absdip.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-3.5 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
            Explore ABSDIP <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Testimonials — sourced from client screenshots; two are scanned letters (kept as images), three are transcribed text
const TESTIMONIALS_TEXT = [
  {
    quote: "I am writing to testify about the capabilities of Applied Biotechnology Limited (ABL). I have known ABL since 2005 when I assumed office as the DG/CEO of the National Biotechnology Development Agency (NABDA) in Abuja and I worked intimately with the company until 2013 when I completed my tenure.",
    name: "Prof. Solomon Bamidele",
    role: "Former DG, NABDA",
  },
  {
    quote: "This is to certify that the Molecular Biology and Tissue Culture laboratory located at the South-East Zonal Biotechnology Centre, University of Nigeria, Nsukka, a centre under the National Biotechnology Development Agency (NABDA), Abuja was satisfactorily designed by the Applied Biotech Nigeria Limited. We are highly impressed with the design layout and space management. Please, accept the assurances of my highest esteem.",
    name: "Dr. Christie Oby Onyia",
    role: "For: Director General, NABDA",
  },
  {
    quote: "I first met Prof Diuto Esiobu (CEO, Applied Biotech International Nigeria Limited) in 2009 during the biotech training organized at the SE Zonal Biotech Centre, University of Nigeria, Nsukka. A second training followed in quick succession at Biotechnology Centre, University of Agriculture, Abeokuta Nigeria, 5th–11th July, 2009, supported by Step-B. It was during a training organized at NACGRAB, Ibadan, Oyo State, that I had a third contact with her. I was overwhelmed and there and then decided that if ever I get funding to equip the Biotechnology R&D Centre at Ebonyi State University (EBSU), I would go for ABINL to equip the laboratory — to ensure qualitative and durable equipment vis a vis service delivery. Fortunately, in 2010, I got a special TETFund grant of N50m to upgrade the Biotechnology R&D Centre of the University. I ensured (although not easy at the time) that ABINL supplied the equipment and helped us redesign the laboratory. In 2013, there was a grand opening/commissioning of the lab. Incidentally, Prof Diuto Esiobu and Prof Richard Litz of University of Florida were the two international resource persons for the training. Since then, Diuto has been a regular resource person at EBSU Biotech R&D Centre during her biotech trainings, which became an annual event, sometimes supported by the Carnegie African Diaspora Fellowship Program. She was the 1st Carnegie African Diaspora Fellow to Ebonyi State University. Throughout these periods, we have used consumables from ABINL and it has always been perfect for our programs. Several mentees are on the string of Prof Diuto of ABINL including colleagues, early career academics and undergraduate students. Her impact on all cannot be overemphasized. Collaborative projects have also been forged between her home University, EBSU and ABINL and we hope to take these to higher grounds.",
    name: "Happiness Ogba Oselebe",
    role: "Ebonyi State University",
  },
];

const TESTIMONIAL_SLIDES = [
  ...TESTIMONIALS_TEXT.map((t) => ({ type: "text" as const, ...t })),
  { type: "image" as const, src: covenantLetter, alt: "Testimonial letter from Covenant University" },
  { type: "image" as const, src: ebsuLetter, alt: "Testimonial letter from Ebonyi State University Faculty of Sciences" },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIAL_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10 reveal">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Testimonials</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold">Our Commitment to Excellence, Past Works & Testimonials</h2>
        </div>

        <div className="relative min-h-[420px] md:min-h-[380px]">
          {TESTIMONIAL_SLIDES.map((s, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {s.type === "text" ? (
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft h-full max-h-[420px] md:max-h-[380px] overflow-y-auto">
                  <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed">"{s.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
              ) : (
                <img src={s.src} alt={s.alt} className="w-full max-h-[420px] object-contain rounded-2xl border border-border shadow-soft" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {TESTIMONIAL_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Testimonial ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand" : "w-3 bg-border hover:bg-muted-foreground"}`} />
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
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Let's Meet You Where You Are. Interested in Anything?</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-4 font-semibold hover:scale-105 transition-transform shadow-soft self-start md:self-center">
            Book a Call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
