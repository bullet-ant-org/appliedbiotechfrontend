import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import {
  ArrowRight, ChevronRight, Sparkles, FlaskConical, ShoppingBag, GraduationCap,
  BrainCircuit, Play, Shield, Cpu, Award, Microscope, CheckCircle2, Calendar,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import heroVirus from "@/assets/image-c.jpg";
import heroPipette from "@/assets/image-a.jpg";
import heroBioeconomy from "@/assets/image-b.jpg";
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
      <QuickDoors />
      <PetalNavigator />
      <ConsultSection />
      <Welcome />
      <DealSection />
      <Pillars />
      <MetricBanner />
      <CTA />
      <Footer />
    </div>
  );
}

const HERO_SLIDES = [
  {
    headline: "Leading the Biotechnology Revolution in Africa",
    sub: "Step into the lab. Earn your certification, run your research and build your career on a continent ready for its scientific breakthrough.",
    img: heroVirus,
    alt: "Abstract virus morphology with DNA strands",
    cta: { label: "Start Learning", to: "/academy" as const },
  },
  {
    headline: "Powering the Bioeconomy in Africa",
    sub: "Source reagents, equip your facility and deploy diagnostics from a team that has been building Africa's lab infrastructure since 2006.",
    img: heroPipette,
    alt: "Gloved hand pipetting into a microfuge tube",
    cta: { label: "Shop Now", to: "/shop" as const },
  },
  {
    headline: "Championing Biotechnology Solutions in Africa",
    sub: "From R&D strategy to lab design and commercialization, we help innovators, institutions and businesses turn ideas into measurable results.",
    img: heroBioeconomy,
    alt: "Glowing DNA helix with bio-circuit patterns",
    cta: { label: "Consult Us", to: "/#consult" as const },
  },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[i];
  return (
    <section className="relative pt-28 lg:pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full gradient-brand opacity-[0.12] blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent-cyan opacity-[0.10] blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      </div>
      <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-ring" />
            Be a part of the breakthrough
          </span>
          <div className="relative min-h-[280px] md:min-h-[340px] mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.22, 0.9, 0.3, 1] }}
              >
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground leading-[1.02]">
                  {slide.headline.split(" ").slice(0, -3).join(" ")}{" "}
                  <span className="gradient-text">{slide.headline.split(" ").slice(-3).join(" ")}</span>
                </h1>
                <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">{slide.sub}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={slide.cta.to} className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3.5 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
                    {slide.cta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-card border border-border text-foreground px-6 py-3.5 font-semibold hover:bg-accent transition-colors">
                    Partner With Us
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-brand" : "w-4 bg-border hover:bg-muted-foreground"}`} />
            ))}
          </div>
        </div>
        <div className="relative order-first lg:order-none">
          <div className="relative rounded-[2rem] overflow-hidden shadow-brand aspect-square bg-[#0a1838]">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.img}
                src={slide.img}
                alt={slide.alt}
                width={1024}
                height={1024}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1838]/40 via-transparent to-transparent" />
            <div className="absolute top-5 left-5 rounded-full bg-background/85 backdrop-blur-xl border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" /> Live R&D
            </div>
          </div>
          <div className="hidden lg:block absolute -bottom-6 -left-6 rounded-2xl bg-card border border-border shadow-soft p-4 animate-float-slow">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Scientists Trained</div>
            <div className="font-display text-2xl font-bold text-brand">1000+</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Shop Lab Supplies", "Rent a Lab", "Consult Our Experts", "Acquire a Skill", "Apply for a Job", "View Our Gallery", "Enroll in Academy", "Build Your Career"];
  return (
    <div className="border-y border-border bg-card/50 overflow-hidden">
      <div className="flex gap-12 py-5 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
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

function QuickDoors() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-8 md:p-10 shadow-brand"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[10px] uppercase tracking-[0.2em] font-bold">
            <GraduationCap className="h-3.5 w-3.5" /> Academy
          </span>
          <h3 className="mt-4 font-display text-3xl md:text-4xl font-extrabold leading-tight">Train with working scientists.</h3>
          <p className="mt-3 text-white/85 max-w-md">Hands-on cohorts in molecular diagnostics, PCR, sequencing and bioinformatics. Learn at your pace, book the practical, earn your certification.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["Self-paced reading", "1:1 coaching", "Practical labs", "Certificates"].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-white/15">{t}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/academy" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-emerald-700 font-bold text-sm shadow-soft hover:scale-[1.03] transition-transform">
              Explore courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/academy/dashboard" className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              My dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-10 shadow-brand"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[10px] uppercase tracking-[0.2em] font-bold">
            <ShoppingBag className="h-3.5 w-3.5" /> Shop
          </span>
          <h3 className="mt-4 font-display text-3xl md:text-4xl font-extrabold leading-tight">Stock your bench in days.</h3>
          <p className="mt-3 text-white/85 max-w-md">Tier-1 reagents, calibrated instruments, sovereign consumables backed by local warranty and live technical support. Order today, ship tomorrow.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["PCR & RT-qPCR", "Cell culture", "NGS consumables", "Lab plasticware"].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-white/15">{t}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-blue-700 font-bold text-sm shadow-soft hover:scale-[1.03] transition-transform">
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop/deals" className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              See deals
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PetalNavigator() {
  const petals = [
    { label: "Shop With Us", sub: "Lab supplies & reagents", to: "/shop" as const, color: "#2563eb", bg: "from-blue-600 to-blue-800", I: ShoppingBag },
    { label: "Rent a Lab", sub: "World-class facilities", to: "/rent-a-lab" as const, color: "#16a34a", bg: "from-green-600 to-green-800", I: FlaskConical },
    { label: "Consult Us", sub: "Strategic biotech guidance", to: "/#consult" as const, color: "#dc2626", bg: "from-red-600 to-red-800", I: BrainCircuit },
    { label: "Acquire a Skill", sub: "Certified training", to: "/academy" as const, color: "#7c3aed", bg: "from-violet-600 to-violet-800", I: GraduationCap },
    { label: "Apply for a Job", sub: "Join our team", to: "/careers" as const, color: "#b45309", bg: "from-yellow-600 to-amber-700", I: Award },
    { label: "Gallery", sub: "Labs we've built", to: "/gallery" as const, color: "#0891b2", bg: "from-cyan-600 to-cyan-800", I: Microscope },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">What Can You Do Here?</span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">Pick your path into <span className="gradient-text">Applied Biotech</span></h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Six ways to take action. Choose what matters to you and step right in.</p>
      </div>

      {/* Mobile / small screens: simple responsive grid */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto md:hidden">
        {petals.map((p, idx) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              to={p.to}
              className={`group flex flex-col items-center justify-center gap-1.5 text-center rounded-2xl p-4 aspect-square text-white font-semibold shadow-brand transition-transform hover:scale-105 bg-gradient-to-br ${p.bg}`}
            >
              <p.I className="h-6 w-6" />
              <span className="text-xs font-bold leading-tight">{p.label}</span>
              <span className="text-[9px] text-white/70 leading-tight">{p.sub}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Larger screens: circular petal layout */}
      <div className="relative mx-auto mt-14 h-[520px] sm:h-[560px] w-full max-w-[560px] hidden md:block">
        {petals.map((p, idx) => {
          const angle = (idx / petals.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 185;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={p.label}
              className="absolute left-1/2 top-1/2"
              style={{ x: x - 72, y: y - 72 }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 110 }}
            >
              <Link
                to={p.to}
                className={`group relative grid h-[144px] w-[144px] place-items-center rounded-full text-white font-semibold shadow-brand transition-transform hover:scale-110 bg-gradient-to-br ${p.bg}`}
              >
                <div className="flex flex-col items-center gap-1.5 px-3 text-center">
                  <p.I className="h-6 w-6 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold leading-tight">{p.label}</span>
                  <span className="text-[9px] text-white/70 leading-tight">{p.sub}</span>
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
          <div className="h-[110px] w-[110px] rounded-full gradient-brand grid place-items-center shadow-brand relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-brand/30" style={{ animationDuration: "3s" }} />
            <div className="relative h-[100px] w-[100px] rounded-full bg-card grid place-items-center border border-border">
              <div className="font-display font-extrabold text-brand text-center leading-tight text-xs">
                Engage<br />Us
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
}

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
    <section id="consult" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#06122c] text-background">
      <div className="absolute inset-0 opacity-25">
        <img src={biotechGrid} alt="" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#06122c]/60 via-[#06122c]/80 to-[#06122c]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-accent-cyan font-semibold">Consulting Services</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold leading-[1.05]">
              Turn Your Biotechnology Vision<br />
              <span className="text-accent-cyan">Into Reality</span>
            </h2>
            <p className="mt-5 text-background/80 text-lg leading-relaxed max-w-xl">
              The next breakthrough in biotechnology won't come from ideas alone. It will come from the organizations that know how to turn innovation into impact.
            </p>
            <p className="mt-4 text-background/70 leading-relaxed max-w-xl">
              Whether you're a researcher seeking commercialization pathways, a startup looking for strategic direction, or an organization exploring biotechnology opportunities, our consulting services help you move faster, make smarter decisions, and unlock greater value from your innovations.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {checks.map((c) => (
                <div key={c} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span className="text-sm text-background/85">{c}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-background/[0.07] border border-background/10">
              <p className="text-background/85 text-sm leading-relaxed italic">
                "As one of Africa's leading biotechnology champions, we are committed to helping innovators, institutions and businesses transform ambitious ideas into measurable results. Your next breakthrough deserves more than potential — it deserves a strategy."
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
            {[
              { n: "01", t: "Research Commercialization", d: "We map your research to market opportunities, identify the right partnerships and build the commercialization pathway your science deserves." },
              { n: "02", t: "Strategic Direction", d: "From funding strategy to organizational positioning, we give you the roadmap to grow with clarity and confidence." },
              { n: "03", t: "Lab Design & Setup", d: "We design and build fully equipped, accredited molecular facilities tailored to your institution's needs and budget." },
              { n: "04", t: "Grant Writing & Policy", d: "Our team has secured millions in research grants. We put that expertise to work for your next application." },
            ].map((item) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-background/10 bg-background/[0.06] backdrop-blur-sm p-5 hover:bg-background/[0.1] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-accent-cyan font-display font-bold text-lg shrink-0">{item.n}</span>
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

function DealSection() {
  const { fetchData } = useFetch();
  const [deal, setDeal] = useState<any>(null);

  useEffect(() => {
    fetchData("/api/v1/shop/deal-of-the-week").then((res) => {
      if (res && res.product) setDeal(res);
    }).catch(() => {});
  }, [fetchData]);

  if (!deal || !deal.product) return null;

  const product = deal.product;
  const productId = product._id || product;
  const productImg = product.productImage;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Limited Time</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold">Deal of the Week</h2>
        </div>
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-foreground text-background relative shadow-brand">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full gradient-brand opacity-20 blur-3xl" />
          <div className="p-10 md:p-14 relative flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold">{deal.eyebrow}</div>
            <h3 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-tight">
              <span className="gradient-text">{deal.headline}</span>
            </h3>
            <p className="mt-4 text-background/70 max-w-md">{deal.blurb}</p>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <div className="font-display text-3xl font-bold text-accent-cyan">₦{(deal.salePrice || 0).toLocaleString()}</div>
              <div className="text-background/50 line-through text-xl">₦{(deal.oldPrice || 0).toLocaleString()}</div>
              <span className="px-3 py-1 rounded-full bg-accent-cyan text-foreground text-xs font-bold">{deal.discountLabel}</span>
            </div>
            <Link to="/shop/product/$id" params={{ id: productId }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3.5 text-sm font-bold hover:scale-105 transition-transform self-start">
              Shop This Deal <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[300px]">
            {productImg && <img src={productImg} alt={product.productName} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
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
