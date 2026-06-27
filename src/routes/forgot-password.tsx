import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { Navbar } from "@/components/site/Navbar";
import { ArrowLeft, Mail, KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({ meta: [{ title: "Reset password — Applied Biotech" }] }),
});

type Step = "email" | "verify" | "done";

function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const otpFilled = otp.every((d) => d.length === 1);

  function submitEmail(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("verify");
      toast.success(`OTP sent to ${email} (demo: enter any 6 digits)`);
    }, 700);
  }

  function setDigit(i: number, v: string) {
    const c = v.replace(/\D/g, "").slice(-1);
    setOtp((p) => { const n = [...p]; n[i] = c; return n; });
    if (c && i < 5) inputs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  }

  function submitReset(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords do not match");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
      toast.success("Password reset successfully");
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 lg:pt-36 pb-20 px-4 max-w-xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-soft">
          <Stepper step={step} />

          {step === "email" && (
            <form onSubmit={submitEmail}>
              <div className="h-12 w-12 rounded-2xl gradient-brand grid place-items-center text-brand-foreground mb-4">
                <Mail className="h-5 w-5" />
              </div>
              <h1 className="font-display text-2xl font-bold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter the email associated with your account and we'll send you a 6-digit code.</p>
              <label className="block mt-6 text-sm font-medium">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button disabled={loading} className="mt-6 w-full h-11 rounded-xl gradient-brand text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-brand disabled:opacity-70">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send reset code
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={submitReset}>
              <div className="h-12 w-12 rounded-2xl gradient-brand grid place-items-center text-brand-foreground mb-4">
                <KeyRound className="h-5 w-5" />
              </div>
              <h1 className="font-display text-2xl font-bold">Verify & set new password</h1>
              <p className="text-sm text-muted-foreground mt-1">We sent a code to <span className="font-medium text-foreground">{email}</span>. Enter any 6 digits.</p>

              <div className="mt-6 flex gap-2 justify-between" onPaste={onPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKey(i, e)}
                    className="h-14 w-12 text-center text-xl font-bold rounded-xl border-2 border-input bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring"
                  />
                ))}
              </div>

              <div className={`grid gap-3 mt-6 transition-all duration-300 ${otpFilled ? "opacity-100 max-h-[400px]" : "opacity-50 max-h-[400px]"}`}>
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} disabled={!otpFilled}
                    className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm password</label>
                  <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} disabled={!otpFilled}
                    className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
                </div>
              </div>

              <button disabled={!otpFilled || loading} className="mt-6 w-full h-11 rounded-xl gradient-brand text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-brand disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Reset password
              </button>
              <button type="button" onClick={() => toast.success("New code sent (demo)")} className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground">
                Didn't get it? Resend code
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 grid place-items-center text-emerald-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold">Password reset!</h1>
              <p className="text-sm text-muted-foreground mt-2">You can now sign in with your new password.</p>
              <button onClick={() => navigate({ to: "/login" })} className="mt-6 h-11 px-8 rounded-xl gradient-brand text-brand-foreground font-semibold shadow-brand">
                Continue to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = ["email", "verify", "done"] as const;
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          <div className={`h-2 flex-1 rounded-full ${i <= idx ? "gradient-brand" : "bg-muted"}`} />
        </div>
      ))}
    </div>
  );
}