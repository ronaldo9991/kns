import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { loginFn } from "@/lib/api/auth.functions";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Kovai Nadar Sangam" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const a = t.auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginFn({ data: { email, password } });
      login(res.token, res.user);
      toast.success(`${a.welcomeBack}, ${res.user.name}!`);
      navigate({ to: res.user.role === "admin" ? "/admin" : "/" });
    } catch (err: any) {
      toast.error(err.message?.includes("Invalid") ? a.invalidCredentials : (err.message ?? a.invalidCredentials));
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl text-primary-deep">{a.signIn}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{a.signInSub}</p>
            </div>
            <button
              onClick={() => setLang(lang === "en" ? "ta" : "en")}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-primary-soft transition-colors"
            >
              {lang === "en" ? "தமிழ்" : "English"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{a.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{a.password}</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep transition-colors" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-deep text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><LogIn size={16} /> {a.signInBtn}</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {a.newToSangam}{" "}
              <Link to="/register" className="text-primary-deep font-medium hover:underline">{a.createAccount}</Link>
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-primary-soft/60 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-primary-deep mb-1">{a.demoCredentials}</div>
            <div>Admin: <span className="font-mono">admin@kns.org</span> / <span className="font-mono">admin123</span></div>
            <div>Member: <span className="font-mono">demo@kns.org</span> / <span className="font-mono">demo123</span></div>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          <Link to="/" className="hover:text-white/80">{a.backToHome}</Link>
        </p>
      </div>
    </div>
  );
}
