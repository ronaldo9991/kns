import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useI18n } from "@/lib/i18n";
import { PROFILES, EVENTS } from "@/lib/mockData";
import {
  Heart, Users, GraduationCap, Calendar, Briefcase, HandHeart,
  ArrowRight, MapPin, Phone, Mail, Sparkles, ShieldCheck, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import kamarajPortrait from "@/assets/kamraj.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kovai Nadar Sangam — Community Trust, Coimbatore" },
      { name: "description", content: "Matrimony, our school, events and business network for Hindu & Christian Nadar families of Coimbatore." },
    ],
  }),
  component: Home,
});

const SERVICE_ICONS = [Heart, Users, GraduationCap, Calendar, Briefcase, HandHeart];
const SERVICE_LINKS = ["/matrimony", "/members", "/school", "/events", "/members", "/about"];

function Home() {
  const { t } = useI18n();
  const h = t.home;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-deep text-white">
        <div className="absolute inset-0 dot-grid opacity-25" aria-hidden />
        <div className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full bg-white/[0.04] blur-3xl" aria-hidden />
        <div className="container-page relative py-20 md:py-28">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="max-w-3xl">
              <span className="chip !bg-white/10 !text-white/90">
                <Sparkles size={12} /> Est. 1952 · Coimbatore
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">{t.org}</h1>
              <p className="mt-5 text-lg text-white/80 max-w-2xl leading-relaxed">{t.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/matrimony/register" className="btn-primary !bg-white !text-primary-deep hover:!bg-white/90">
                  <Heart size={16} /> {t.cta.register}
                </Link>
                <Link to="/members" className="btn-outline">
                  {t.cta.member} <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Kamaraj portrait */}
            <div className="relative mx-auto lg:mx-0 w-full max-w-sm">
              <div className="absolute -inset-3 border border-white/15 rounded-2xl" aria-hidden />
              <div className="absolute -top-3 -left-3 chip !bg-white !text-primary-deep z-10">
                <Sparkles size={12} /> {h.inspiration}
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/15">
                <img
                  src={kamarajPortrait}
                  alt="Perunthalaivar K. Kamaraj"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="font-display text-lg text-white leading-tight">Perunthalaivar K. Kamaraj</div>
                  <div className="text-xs text-white/80 mt-0.5">{h.kamarajCaption}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl">
            {[
              { n: 4280, s: "+", label: t.stats.members },
              { n: 1150, s: "+", label: t.stats.matches },
              { n: 73,   s: "",  label: t.stats.years },
            ].map((stat, i) => (
              <div key={i} className="reveal" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="font-display text-3xl sm:text-5xl text-white">
                  <AnimatedCounter to={stat.n} suffix={stat.s} />
                </div>
                <div className="mt-1 text-xs sm:text-sm uppercase tracking-[0.15em] text-white/65">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-white/10 bg-black/10">
          <div className="container-page py-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> {h.trustVerified}</span>
            <span className="inline-flex items-center gap-2"><Building2 size={14} /> {h.trustRegistered}</span>
            <span className="inline-flex items-center gap-2"><Users size={14} /> {h.trustCommunity}</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="chip">{h.services}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary-deep max-w-xl">{h.services}</h2>
            <p className="mt-2 text-muted-foreground max-w-md">{h.servicesSub}</p>
          </div>
          <Link to="/about" className="btn-ghost">{t.nav.about} <ArrowRight size={14} /></Link>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {h.serviceCards.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <Link to={SERVICE_LINKS[i]} key={i} className="group bg-card p-7 hover:bg-primary-soft/60 transition-colors">
                <div className="leaf-mark"><Icon size={16} /></div>
                <h3 className="mt-5 font-display text-xl text-primary-deep">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-primary-deep opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROFILES */}
      <section className="bg-surface border-y border-border">
        <div className="container-page py-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="chip">{t.nav.matrimony}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary-deep">{h.featured}</h2>
              <p className="mt-2 text-muted-foreground max-w-md">{h.featuredSub}</p>
            </div>
            <Link to="/matrimony" className="btn-ghost">{h.viewAllProfiles} <ArrowRight size={14} /></Link>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROFILES.slice(0, 3).map((p) => (
              <article key={p.id} className="card-flat overflow-hidden">
                <div className="relative h-56 bg-gradient-to-br from-primary-soft to-[#d8ebe0] flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary-deep text-white font-display text-4xl flex items-center justify-center">
                    {p.initial}
                  </div>
                  <span className="absolute top-3 left-3 chip !bg-white">{p.id}</span>
                  <span className="absolute top-3 right-3 chip !bg-white">{t.matrimony.verified_badge}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg text-primary-deep">{p.name}</h3>
                    <span className="text-xs text-muted-foreground">{p.age} yrs · {p.height}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-muted-foreground">
                    <span>{t.matrimony.rasi}</span><span className="text-foreground">{p.rasi}</span>
                    <span>Education</span><span className="text-foreground">{p.education}</span>
                    <span>Location</span><span className="text-foreground">{p.location}</span>
                    <span>{t.matrimony.religion}</span><span className="text-foreground">{p.religion} Nadar</span>
                  </div>
                  <button
                    className="mt-5 btn-ghost w-full justify-center"
                    onClick={() => toast.success(t.matrimony.interestToast)}
                  >
                    {t.matrimony.expressInterest}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS STRIP */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="chip">{t.nav.events}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary-deep">{t.eventsLabel}</h2>
          </div>
          <Link to="/events" className="btn-ghost">{h.viewAllEvents} <ArrowRight size={14} /></Link>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EVENTS.slice(0, 4).map((e) => (
            <div key={e.title} className="card-flat p-5 hover:border-primary-deep/40 transition-colors">
              <div className="text-xs font-medium text-primary-deep uppercase tracking-[0.12em]">{e.date}</div>
              <h3 className="mt-2 font-display text-lg text-foreground leading-snug">{e.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{e.venue}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />
    </SiteLayout>
  );
}

function ContactSection() {
  const { t } = useI18n();
  const h = t.home;
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  return (
    <section className="bg-primary-soft/60 border-t border-border">
      <div className="container-page py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="chip">{t.nav.about}</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary-deep">{h.contact}</h2>
          <p className="mt-2 text-muted-foreground max-w-md">{h.contactSub}</p>
          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-3"><MapPin className="text-primary-deep mt-0.5" size={18} /> 349, Dr. Radhakrishna Road, Tatabad, Near Vadakovai Power House, Coimbatore – 641012</li>
            <li className="flex gap-3"><Phone className="text-primary-deep mt-0.5" size={18} /> 0422-2491297 · 0422-2491298</li>
            <li className="flex gap-3"><Mail className="text-primary-deep mt-0.5" size={18} /> office@kovainadarsangam.org</li>
          </ul>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); toast.success(h.contactToast); setForm({ name: "", phone: "", message: "" }); }}
          className="card-flat p-6 sm:p-8 bg-white"
        >
          <h3 className="font-display text-xl text-primary-deep">{h.contact}</h3>
          <div className="mt-5 space-y-4">
            <FormField label={h.contactForm.name}>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="kns-input" />
            </FormField>
            <FormField label={h.contactForm.phone}>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="kns-input" />
            </FormField>
            <FormField label={h.contactForm.message}>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="kns-input" />
            </FormField>
            <button className="btn-primary w-full justify-center">{h.contactForm.send}</button>
          </div>
        </form>
      </div>
      <style>{`.kns-input{width:100%;border:1px solid var(--border);background:white;border-radius:.6rem;padding:.7rem .85rem;font-size:.9rem;outline:none;transition:border-color .15s, box-shadow .15s}.kns-input:focus{border-color:var(--primary-deep);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary-deep) 15%,transparent)}`}</style>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.1em]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
