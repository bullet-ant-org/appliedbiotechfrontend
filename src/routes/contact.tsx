import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Mail, Phone, MapPin, Send, Clock, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact · Applied Biotech" }, { name: "description", content: "Get in touch with the Applied Biotech team." }] }),
});

function ContactPage() {
  useReveal();
  const { loading, fetchData } = useFetch();
  const [done, setDone] = useState(false);
  const [info, setInfo] = useState({
    address: "Applied Biotech Hub, Nigeria",
    phone: "+234 000 000 0000",
    email: "info@appliedbiotech.ng",
    hours: "Mon - Fri, 9am - 5pm"
  });

  const loadContact = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res && Array.isArray(res)) {
        const data = res.find((i: any) => i.key === "contact_info");
        if (data?.value) setInfo({
          address: data.value.address || "Applied Biotech Hub, Nigeria",
          phone: data.value.phone || "+234 000 000 0000",
          email: data.value.email || "info@appliedbiotech.ng",
          hours: data.value.workingHours || data.value.hours || "Mon - Fri, 9am - 5pm",
        });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => {
    // Page view analytics for tracking contact interest
    fetchData("/api/v1/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "contact" }),
    }).catch(() => {});

    loadContact();
  }, [fetchData, loadContact]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const first = fd.get("first");
    const last = fd.get("last");
    const senderEmail = fd.get("email");
    const subject = fd.get("subject") || "Applied Biotech Inquiry";
    const message = fd.get("message");

    // Construct the mailto URL with pre-filled fields
    const bodyText = `Sender Name: ${first} ${last}\nSender Email: ${senderEmail}\n\nMessage Content:\n${message}`;
    const mailtoUrl = `mailto:${info.email}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(bodyText)}`;
    
    // Redirect to the mailto link to open the local email app
    window.location.href = mailtoUrl;
    
    toast.success("Redirecting to your email client...");
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Contact" title={<>Let's <span className="gradient-text">talk</span></>} subtitle="Tell us about your project, training need or equipment request." />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">
          <div className="reveal space-y-6">
            {[
              { I: MapPin, t: "Visit", v: info.address },
              { I: Phone, t: "Call", v: info.phone },
              { I: Mail, t: "Email", v: info.email },
              { I: Clock, t: "Hours", v: info.hours },
            ].map(({ I, t, v }) => (
              <div key={t} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:shadow-soft transition-shadow">
                <div className="h-11 w-11 grid place-items-center rounded-xl gradient-brand text-brand-foreground"><I className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t}</div>
                  <div className="mt-1 font-semibold text-foreground">{v}</div>
                </div>
              </div>
            ))}
          </div>
          {done ? (
            <div className="reveal rounded-3xl border border-border bg-card p-10 text-center shadow-soft flex flex-col items-center justify-center">
              <div className="h-16 w-16 grid place-items-center rounded-full gradient-brand text-brand-foreground mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold">Message received</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Our team has received your enquiry. We typically respond to all scientific and commercial requests within 24 hours.
              </p>
              <button onClick={() => setDone(false)} className="mt-8 text-sm font-bold text-brand hover:underline">Send another message</button>
            </div>
          ) : (
            <form className="reveal rounded-2xl border border-border bg-card p-7 shadow-soft space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="first" required className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="First name" />
                <input name="last" required className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Last name" />
              </div>
              <input name="email" required type="email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Email" />
              <input name="subject" required className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Subject" />
              <textarea name="message" required rows={5} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Your message" />
              <button disabled={loading} className="inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 font-semibold shadow-brand hover:scale-[1.02] transition-transform disabled:opacity-70">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send message
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}