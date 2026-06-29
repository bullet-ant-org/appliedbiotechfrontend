import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { ArrowRight, FlaskConical, Leaf, Dna, ShieldPlus, Microscope } from "lucide-react";

export const Route = createFileRoute("/rd-portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "R&D Portfolio · Applied Biotech" },
      { name: "description", content: "Selected research and development programs spanning diagnostics, agriculture, environment and bio-innovation." },
    ],
  }),
});

const bioMfgProducts = [
  {
    t: "Nuclease-Free Water",
    status: "Available",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693680/ak9vxrfoxwiiiiae9ttn.png",
    d: "Produced and supplied to molecular labs across our network. A foundational input for every PCR and sequencing workflow we run.",
  },
  {
    t: "Locally Manufactured Nucleic Acid Purification Kits & Media",
    status: "Available",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693671/b1c4xb3vqznfsra0hdmk.png",
    d: "Built to reduce dependency on imported consumables, without compromising the precision our diagnostics work demands.",
  },
  {
    t: "Bioinoculants & Mycorrhizae",
    status: "In Development",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693672/tvfe3h56btfodeswjdwv.png",
    d: "Our work on biofertilisers and mycorrhizal inoculants is aimed at agriculture, land restoration and bioremediation — helping soil recover and farms produce more, sustainably.",
  },
  {
    t: "Probiotics",
    status: "In Development",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693672/fwc6apyejwxfv0gidbuu.png",
    d: "Research into functional microbial strains for gut and metabolic health, formulated with the same rigor we apply to our diagnostic work.",
  },
  {
    t: "Indigenously Formulated Oral Care Products",
    status: "In Development",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693670/jacfv2kosxuwp7ufaduq.png",
    d: "Exploring locally sourced, microbially-informed formulations for oral health — built from the ground up, not adapted from someone else's supply chain.",
  },
  {
    t: "Nutritional Supplements",
    status: "In Development",
    image: "https://res.cloudinary.com/djzi0scln/image/upload/v1782693671/aezsyo76m80kph9ologx.png",
    d: "Early-stage formulation work grounded in the same molecular science we use across our lab services — supplements designed with evidence, not just trend.",
  },
];

const projects = [
  { I: Microscope, tag: "Diagnostics", t: "Regional Pathogen Surveillance Network", d: "Multiplex PCR panels deployed across 4 states for real-time outbreak monitoring." },
  { I: Leaf, tag: "AgriBiotech", t: "Climate-Resilient Microbial Bioinoculants", d: "Locally isolated rhizobacterial strains boosting cassava and yam yields by 18–24%." },
  { I: Dna, tag: "Genomics", t: "Indigenous Cattle Lineage Mapping", d: "STR genotyping of West African Ndama and Bunaji breeds for conservation genetics." },
  { I: ShieldPlus, tag: "Public Health", t: "Mobile Lab for Epidemic Response", d: "Solar-powered diagnostic units pre-positioned for cholera and Lassa fever responses." },
  { I: FlaskConical, tag: "Reagents", t: "AquaPure™ Sovereign Reagents", d: "100% locally manufactured nuclease-free water, validated against international references." },
  { I: Leaf, tag: "Environment", t: "Soil Metagenomics Atlas", d: "Continental-scale soil microbiome database supporting bioremediation strategies." },
];

function PortfolioPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="R&D Portfolio" title={<>Research with <span className="gradient-text">measurable</span> impact.</>} subtitle="Selected programs across diagnostics, agriculture, environment and bio-innovation." />

      {/* Bio-Manufacturing product pipeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-7xl">
          <div className="reveal text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Bio-Manufacturing Pipeline</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold">What we are making</h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              These are not catalogue listings — they are active development programs. Two are already in supply; the rest are in the lab now.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bioMfgProducts.map((p) => (
              <div key={p.t} className="reveal group rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/40 hover:-translate-y-1 hover:shadow-soft transition-all duration-300">
                
                {/* Clean Image Container wrapping the product imagery */}
                <div className="aspect-[16/9] bg-secondary/50 relative overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.t}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Card details */}
                <div className="p-5">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.status === "Available" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {p.status}
                  </span>
                  <h3 className="mt-3 font-display font-bold leading-snug">{p.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>

              </div>
            ))}
          </div>

          <div className="reveal mt-10 text-center rounded-3xl border border-border bg-card p-8 max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed">
              If you see something that aligns with what you're building, investing in, or want to bring to market together, we would like to talk.
            </p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold shadow-brand hover:scale-[1.03] transition-transform">
              Partner with our Bio-Manufacturing team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Research programs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="reveal text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-brand font-semibold">Research Programs</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold">Active & recent programs</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <div key={p.t} className="reveal group rounded-3xl border border-border bg-card p-7 hover:-translate-y-2 hover:shadow-brand hover:border-brand/40 transition-all duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 grid place-items-center rounded-xl gradient-brand text-brand-foreground group-hover:scale-110 transition-transform">
                    <p.I className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold">{p.tag}</span>
                </div>
                <h3 className="mt-5 font-display font-bold text-lg leading-tight">{p.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-14 mx-auto max-w-3xl text-center rounded-3xl gradient-brand text-brand-foreground p-10 shadow-brand">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Want to collaborate?</h2>
            <p className="mt-3 text-brand-foreground/85">We welcome co-investigator proposals, grant partnerships and institutional collaborations.</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-semibold hover:scale-105 transition-transform">
              Submit a brief <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
