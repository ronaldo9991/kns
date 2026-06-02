import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { registerFn } from "@/lib/api/auth.functions";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Kovai Nadar Sangam" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const a = t.auth;
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error(a.passwordMismatch); return; }
    if (form.password.length < 6) { toast.error(a.passwordTooShort); return; }
    setLoading(true);
    try {
      const res = await registerFn({ data: { name: form.name, email: form.email, password: form.password, phone: form.phone || undefined } });
      login(res.token, res.user);
      toast.success(a.createSuccess);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message?.includes("registered") ? a.emailRegistered : (err.message ?? "Registration failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-deep via-primary to-[#1a4d35] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <Logo light />
            <div className="text-white text-left">
              <div className="font-display text-lg font-semibold">{t.org}</div>
              <div className="text-xs text-white/60 uppercase tracking-widest">Est. 1952 · Coimbatore</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl text-primary-deep">{a.createAccount}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{a.createAccountSub}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: a.fullName, key: "name" as const, type: "text", placeholder: "Your full name", required: true },
              { label: a.email, key: "email" as const, type: "email", placeholder: "you@example.com", required: true },
              { label: a.phoneOptional, key: "phone" as const, type: "tel", placeholder: "+91 98765 43210" },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} required={required}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep transition-colors" />
              </div>
            ))}

            {[
              { label: a.password, key: "password" as const },
              { label: a.confirm, key: "confirm" as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={form[key]} onChange={set(key)} placeholder="••••••••" required minLength={6}
                    className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep transition-colors" />
                  {key === "password" && (
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-primary-deep text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><UserPlus size={16} /> {a.createAccount}</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {a.alreadyHaveAccount}{" "}
              <Link to="/login" className="text-primary-deep font-medium hover:underline">{a.signIn}</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          <Link to="/" className="hover:text-white/80">{a.backToHome}</Link>
        </p>
      </div>
    </div>
  );
}
