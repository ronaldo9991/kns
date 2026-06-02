import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X, Languages, LogIn, LogOut, User, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function Navbar() {
  const { lang, setLang, t } = useI18n();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/matrimony", label: t.nav.matrimony },
    { to: "/members", label: t.nav.members },
    { to: "/events", label: t.nav.events },
    { to: "/scholarships", label: t.nav.scholarships },
  ];

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setOpen(false);
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 bg-primary-deep text-white shadow-lg">
      <div className="container-page flex items-center justify-between h-16 gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)}>
          <Logo light />
          <div className="leading-tight">
            <div className="font-display text-[14px] font-semibold hidden sm:block">{t.org}</div>
            <div className="font-display text-[13px] font-semibold sm:hidden">KNS</div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/60 hidden sm:block">Est. 1952 · Coimbatore</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  active ? "bg-white/15 text-white font-medium" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin" className={`px-3 py-2 rounded-full text-sm transition-colors ${path.startsWith("/admin") ? "bg-white/15 text-white font-medium" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
              {t.nav.admin}
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Language toggle — always visible */}
          <button
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
            className="flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors"
            aria-label="Toggle language"
          >
            <Languages size={13} />
            <span className="hidden xs:inline">{lang === "en" ? "தமிழ்" : "EN"}</span>
            <span className="xs:hidden">{lang === "en" ? "த" : "EN"}</span>
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors"
              >
                <User size={13} />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown size={11} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-deep hover:bg-primary-soft transition-colors">
                      <ShieldCheck size={14} /> Admin panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors">
              <LogIn size={13} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-primary-deep/98 backdrop-blur-sm">
          <div className="container-page py-4 flex flex-col gap-1">
            {links.map((l) => {
              const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-sm transition-colors ${active ? "bg-white/15 text-white font-medium" : "text-white/85 hover:bg-white/10"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 px-3 rounded-lg text-sm text-white/85 hover:bg-white/10 flex items-center gap-2">
                <ShieldCheck size={14} /> {t.nav.admin}
              </Link>
            )}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => { setLang(lang === "en" ? "ta" : "en"); }}
                className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Languages size={14} />
                {lang === "en" ? "தமிழில் மாற்று" : "Switch to English"}
              </button>
              {!user && (
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-full bg-white text-primary-deep px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
                  Join
                </Link>
              )}
              {user && (
                <button onClick={handleLogout} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors flex items-center gap-1.5">
                  <LogOut size={14} /> Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
