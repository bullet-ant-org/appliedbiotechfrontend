import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Lock, ArrowLeft, CheckCircle2, Loader2, GraduationCap, CalendarDays } from "lucide-react";
import { fmt } from "@/lib/products";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { usePaystackPayment } from "react-paystack";
import { z } from "zod";
import { useAcademy } from "@/lib/academy";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const academyCheckoutSearchSchema = z.object({
  courseId: z.string().optional(),
  practicalDate: z.string().optional(),
});

export const Route = createFileRoute("/academy/checkout")({
  component: AcademyCheckoutPage,
  validateSearch: (search) => academyCheckoutSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Academy Checkout · Applied Biotech" }] }),
});

function AcademyCheckoutPage() {
  const { fetchData, loading: apiLoading } = useFetch();
  const [paying, setPaying] = useState(false);
  const academy = useAcademy();
  const search = Route.useSearch();
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  // Paystack Configuration State
  const [paystackConfig, setPaystackConfig] = useState({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    email: "",
    amount: 0,
    reference: "",
  });

  const initializePayment = usePaystackPayment(paystackConfig);
  const [shouldTriggerPopup, setShouldTriggerPopup] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!search.courseId) return;
      try {
        const res = await fetchData("/api/v1/academy");
        if (!mounted || !res) return;
        const list = Array.isArray(res) ? res : (res.data || []);
        const found = list.find((c: any) => c._id === search.courseId);
        if (found) {
          setCourse({
            id: found._id,
            name: found.courseTitle,
            price: found.price,
            img: found.image,
            level: found.levelDescription,
          });
        }
      } catch (err) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [fetchData, search.courseId]);

  const practicalDates = useMemo(
    () => (search.practicalDate ? search.practicalDate.split("|").filter(Boolean) : []),
    [search.practicalDate]
  );

  const total = course?.price || 0;

  const onSuccess = useCallback((res: any) => {
    toast.success("Payment received! Finalizing your enrollment...");
    setPaying(false);
    setShouldTriggerPopup(false);
    const reference = res?.reference || paystackConfig.reference;
    navigate({ to: "/verify", search: { reference } });
  }, [navigate, paystackConfig.reference]);

  const onClose = useCallback(() => {
    setPaying(false);
    setShouldTriggerPopup(false);
    toast.error("Payment window closed");
  }, []);

  useEffect(() => {
    if (shouldTriggerPopup && paystackConfig.reference) {
      initializePayment(onSuccess, onClose);
      setShouldTriggerPopup(false);
    }
  }, [shouldTriggerPopup, paystackConfig, initializePayment, onSuccess, onClose]);

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paying) return;
    if (!course) return toast.error("Course details are still loading — please wait a moment.");
    setPaying(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();

    if (!email) {
      setPaying(false);
      return toast.error("Please provide an email");
    }
    if (total <= 0) {
      setPaying(false);
      return toast.error("Course price must be greater than 0");
    }

    try {
      const res = await fetchData("/api/v1/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "academy",
          email,
          phone,
          totalAmount: total,
          items: [],
          courseItems: [{
            course: course.id,
            practicalDate: search.practicalDate || "",
            price: course.price,
          }],
          academyUserId: academy.user?.id || academy.user?._id || null,
        })
      });

      const reference =
        res?.paystackData?.reference ||
        res?.paystackData?.data?.reference ||
        res?.order?.reference ||
        res?.data?.reference ||
        res?.reference;

      if (reference) {
        setPaystackConfig({
          publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
          email,
          amount: total * 100,
          reference,
        });
        setShouldTriggerPopup(true);
      } else {
        const errorMsg = res?.message || "Could not initialize transaction with Paystack";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      setPaying(false);
      toast.error(err?.message || "Payment initialization failed");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-md text-center bg-card border border-border rounded-3xl p-10">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center mb-4"><CheckCircle2 className="h-9 w-9" /></div>
            <h1 className="font-display text-3xl font-bold">Enrollment confirmed</h1>
            <p className="mt-2 text-muted-foreground">Thanks! A confirmation email with your account details is on its way.</p>
            <Link to="/academy" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand">Back to Academy</Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!search.courseId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground">No course selected.</p>
          <Link to="/academy" className="mt-4 inline-block text-brand font-semibold">Browse courses →</Link>
        </section>
        <Footer />
      </div>
    );
  }

  if (apiLoading && !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-40 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-4xl">
          <Link to="/academy" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Academy
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-brand" /> Academy Checkout
          </h1>

          <form onSubmit={handlePay} className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <h3 className="font-display font-bold text-lg">Student contact</h3>
                <Field label="Email"><input name="email" required type="email" defaultValue={academy.user?.email || ""} className={input} /></Field>
                <Field label="Phone"><input name="phone" required type="tel" defaultValue={academy.user?.phone || ""} className={input} /></Field>
                <p className="text-xs text-muted-foreground">
                  We'll send your enrollment confirmation, login access and practical scheduling details to this email.
                </p>
              </div>

              {practicalDates.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                  <h3 className="font-display font-bold text-lg flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand" /> Preferred practical dates</h3>
                  <p className="text-sm text-muted-foreground">Our team will confirm one of these dates with you after enrollment.</p>
                  <div className="flex flex-wrap gap-2">
                    {practicalDates.map((d) => (
                      <span key={d} className="px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                        {new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-36">
              <h3 className="font-display font-bold text-lg">Summary</h3>
              {course ? (
                <div className="mt-4 flex gap-3 text-sm">
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                    {course.img ? <img src={course.img} alt={course.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-2">{course.name}</div>
                    {course.level && <div className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{course.level}</div>}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              )}
              <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Course fee</span><span className="font-semibold">{fmt(total)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-display font-bold text-brand">{fmt(total)}</span></div>
              </div>
              <button
                type="submit"
                disabled={paying || !course}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {paying ? "Processing..." : `Pay with Paystack · ${fmt(total)}`}
              </button>
            </aside>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const input = "w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }: any) { return <label className="block text-sm"><span className="font-medium">{label}</span><div className="mt-1.5">{children}</div></label>; }
