import { Navbar } from "./Navbar";

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <>
      <Navbar />
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/60 via-background to-background relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full gradient-brand opacity-[0.08] blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] rounded-full bg-brand/10 text-brand font-semibold">{eyebrow}</span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">{title}</h1>
          {subtitle && <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      </section>
    </>
  );
}