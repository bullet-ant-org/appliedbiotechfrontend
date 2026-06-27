import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Send, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/rent-a-lab")({
  component: RentALabPage,
  head: () => ({
    meta: [
      { title: "Rent-A-Lab · Applied Biotech" },
      { name: "description", content: "Rent fully-equipped bench space at our premium Abuja molecular lab for thesis work, independent studies and corporate validations." },
    ],
  }),
});

function RentALabPage() {
  useReveal();
  const { loading, fetchData } = useFetch();
  const [done, setDone] = useState(false);
  const [info, setInfo] = useState({
    email: "info@appliedbiotech.ng"
  });

  const loadContact = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res && Array.isArray(res)) {
        const data = res.find((i: any) => i.key === "contact_info");
        if (data?.value?.email) setInfo({ email: data.value.email });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadContact(); }, [loadContact]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name");
    const email = fd.get("email");
    const org = fd.get("org") || "N/A";
    const scope = fd.get("scope");
    const duration = fd.get("duration");
    const reporting = fd.get("reporting") === "on" ? "Yes" : "No";
    const notes = fd.get("message") || "None";

    // Professional message arrangement for the Lab Management team
    const bodyText = `APPLIED BIOTECH INTERNATIONAL - RENT-A-LAB REQUEST\n` +
      `==================================================\n\n` +
      `STUDENT / RESEARCHER DETAILS\n` +
      `----------------------------\n` +
      `Full Name:    ${name}\n` +
      `Email:        ${email}\n` +
      `Organization: ${org}\n\n` +
      `PROJECT SPECIFICATIONS\n` +
      `----------------------------\n` +
      `Research Scope:    ${scope}\n` +
      `Intended Duration: ${duration}\n` +
      `Reporting Support: ${reporting}\n\n` +
      `ADDITIONAL NOTES\n` +
      `----------------------------\n` +
      `${notes}\n\n` +
      `==================================================\n` +
      `Submission Source: ${window.location.origin}/rent-a-lab`;

    const subject = `Rent-A-Lab Enquiry: ${name} (${org})`;
    const mailtoUrl = `mailto:${info.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
    
    toast.success("Opening your email client...");
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Rent-A-Lab" title={<>Secure <span className="gradient-text">bench space.</span></>} subtitle="Tell us about your project: research scope, duration and whether you need reporting or data-analytics support." />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {done ? (
            <div className="reveal rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-full gradient-brand text-brand-foreground"><Check className="h-6 w-6" /></div>
              <h2 className="mt-5 font-display text-2xl font-bold">Request received</h2>
              <p className="mt-2 text-muted-foreground">Our lab management team will reach out within 1 business day.</p>
              <button onClick={() => setDone(false)} className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors">Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reveal rounded-3xl border border-border bg-card p-8 shadow-soft space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name"><input name="name" required className={ip} placeholder="Dr. Jane Doe" /></Field>
                <Field label="Email"><input name="email" required type="email" className={ip} placeholder="you@institution.org" /></Field>
              </div>
              <Field label="Organization / Institution"><input name="org" className={ip} placeholder="e.g. University of Abuja" /></Field>
              <Field label="Research scope" hint="What kind of research will you carry out?">
                <textarea name="scope" required rows={4} className={ip} placeholder="Describe your assays, sample types, throughput expectations…" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Intended duration">
                  <select name="duration" required className={ip}>
                    <option value="">Select…</option>
                    <option>1 week</option>
                    <option>2–4 weeks</option>
                    <option>1–3 months</option>
                    <option>3+ months</option>
                  </select>
                </Field>
                <Field label="Reporting / data analytics support">
                  <label className="flex items-center gap-2 mt-3 text-sm">
                    <input name="reporting" type="checkbox" className="h-4 w-4 rounded border-input" />
                    Yes, I'll need help with reporting
                  </label>
                </Field>
              </div>
              <Field label="Additional notes (optional)">
                <textarea name="message" rows={3} className={ip} placeholder="Anything else we should know?" />
              </Field>
              <button disabled={loading} className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3.5 font-semibold shadow-brand hover:scale-[1.02] transition-transform disabled:opacity-70">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit request
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const ip = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">{label}</div>
      {hint && <div className="text-xs text-muted-foreground -mt-1 mb-1.5">{hint}</div>}
      {children}
    </label>
  );
}