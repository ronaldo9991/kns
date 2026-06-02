import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { PROFILES, RASI, type Profile } from "@/lib/mockData";
import { useMemo, useState } from "react";
import { Upload, X, Filter, Search, ShieldCheck, Heart, Sparkles, Star, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { computeCompatibility } from "@/lib/matrimony-match";
import { getAiCompatibilityFn } from "@/lib/api/matrimony.functions";

export const Route = createFileRoute("/matrimony")({
  head: () => ({ meta: [{ title: "Matrimony — Kovai Nadar Sangam" }, { name: "description", content: "Verified matrimony profiles from the Hindu & Christian Nadar community in Coimbatore." }] }),
  component: MatrimonyPage,
});

function MatrimonyPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [gender, setGender] = useState("any");
  const [religion, setReligion] = useState("any");
  const [rasi, setRasi] = useState("any");
  const [age, setAge] = useState<[number, number]>([22, 45]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // User's own profile for AI matching (demo based on login)
  const myProfile = user
    ? { name: user.name, age: 28, gender: user.role === "admin" ? "Male" : "Female", religion: "Hindu", rasi: "Simmam" }
    : null;

  const filtered = useMemo(() => {
    let profiles = [...PROFILES];
    if (gender !== "any") profiles = profiles.filter((p) => p.gender === gender);
    if (religion !== "any") profiles = profiles.filter((p) => p.religion === religion);
    if (rasi !== "any") profiles = profiles.filter((p) => p.rasi === rasi);
    profiles = profiles.filter((p) => p.age >= age[0] && p.age <= age[1]);
    if (q) {
      const ql = q.toLowerCase();
      profiles = profiles.filter((p) => `${p.name} ${p.location} ${p.education} ${p.profession}`.toLowerCase().includes(ql));
    }

    // Sort by AI compatibility if user is logged in
    if (myProfile) {
      profiles.sort((a, b) => {
        const sa = computeCompatibility({ ...a, rasi: a.rasi, religion: a.religion, age: a.age, gender: a.gender }, myProfile);
        const sb = computeCompatibility({ ...b, rasi: b.rasi, religion: b.religion, age: b.age, gender: b.gender }, myProfile);
        return sb - sa;
      });
    }
    return profiles;
  }, [gender, religion, rasi, age, q, myProfile]);

  return (
    <SiteLayout>
      <PageHeader
        title={t.matrimony.title}
        subtitle={t.matrimony.subtitle}
        breadcrumb={[{ label: t.matrimony.title }]}
      />

      <div className="container-page py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white overflow-y-auto lg:static lg:z-auto" : "hidden"} lg:block`}>
          {showFilters && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border lg:hidden">
              <h3 className="font-semibold">{t.matrimony.filter}</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-muted"><X size={20} /></button>
            </div>
          )}
          <div className="p-4 lg:p-0 lg:sticky lg:top-20 space-y-4">
            <div className="card-flat p-5">
              <h3 className="font-display text-base text-primary-deep mb-4">{t.matrimony.filter}</h3>

              <FilterGroup label={t.matrimony.gender}>
                {[["any", "Any"], ["Male", "Male"], ["Female", "Female"]].map(([v, l]) => (
                  <Pill key={v} active={gender === v} onClick={() => setGender(v)}>{l}</Pill>
                ))}
              </FilterGroup>

              <FilterGroup label={t.matrimony.religion}>
                {[["any", "Any"], ["Hindu", "Hindu Nadar"], ["Christian", "Christian Nadar"]].map(([v, l]) => (
                  <Pill key={v} active={religion === v} onClick={() => setReligion(v)}>{l}</Pill>
                ))}
              </FilterGroup>

              <FilterGroup label={`${t.matrimony.age} · ${age[0]}–${age[1]} yrs`}>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div>
                    <label className="text-xs text-muted-foreground">Min</label>
                    <input type="number" value={age[0]} min={18} max={age[1] - 1} onChange={(e) => setAge([+e.target.value, age[1]])} className="w-full border border-border rounded-lg px-2 py-1.5 text-sm mt-0.5" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Max</label>
                    <input type="number" value={age[1]} min={age[0] + 1} max={70} onChange={(e) => setAge([age[0], +e.target.value])} className="w-full border border-border rounded-lg px-2 py-1.5 text-sm mt-0.5" />
                  </div>
                </div>
              </FilterGroup>

              <FilterGroup label={t.matrimony.rasi}>
                <select value={rasi} onChange={(e) => setRasi(e.target.value)} className="w-full border border-border rounded-lg px-2 py-2 text-sm bg-white">
                  <option value="any">Any Rasi</option>
                  {RASI.map((r) => <option key={r}>{r}</option>)}
                </select>
              </FilterGroup>

              {user && (
                <div className="mt-4 rounded-xl bg-gradient-to-br from-primary-deep/5 to-primary-soft p-4 border border-primary-deep/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-primary-deep" />
                    <span className="text-xs font-semibold text-primary-deep">AI Match Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Profiles sorted by compatibility with your profile using traditional & modern criteria.</p>
                </div>
              )}

              {!user && (
                <div className="mt-4 rounded-xl bg-primary-soft/50 p-4 border border-primary-deep/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-primary-deep" />
                    <span className="text-xs font-semibold text-primary-deep">AI Matching</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Sign in to see your compatibility score with each profile.</p>
                  <Link to="/login" className="text-xs text-primary-deep font-medium hover:underline">Sign in →</Link>
                </div>
              )}
            </div>

            <div className="card-flat p-5 bg-primary-soft/40 border-primary-deep/10">
              <div className="leaf-mark mb-3"><Upload size={13} /></div>
              <h4 className="font-display text-sm text-primary-deep">Have a paper biodata?</h4>
              <p className="mt-1 text-xs text-muted-foreground">Upload it and we'll auto-fill your digital profile.</p>
              <Link to="/matrimony/register" className="mt-3 btn-ghost w-full justify-center !text-xs !py-2">Upload & auto-fill</Link>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.matrimony.search}
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
              />
            </div>
            <button onClick={() => setShowFilters(true)} className="lg:hidden btn-ghost gap-1.5 !py-2.5">
              <Filter size={14} /> {t.matrimony.filter}
            </button>
            <Link to="/matrimony/register" className="btn-primary gap-1.5 !py-2.5 !text-sm">
              <Heart size={14} /> Register Profile
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="text-primary-deep" />
            <span>{filtered.length} {t.matrimony.verified}</span>
            {user && <span className="flex items-center gap-1 ml-2 text-primary-deep font-medium"><Sparkles size={11} /> Sorted by AI compatibility</span>}
          </div>

          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProfileCard
                  key={p.id}
                  p={p}
                  myProfile={myProfile}
                  onOpen={() => setOpen(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {open && <ProfileModal p={open} myProfile={myProfile} onClose={() => setOpen(null)} />}
    </SiteLayout>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
        active ? "bg-primary-deep text-white border-primary-deep shadow-sm" : "border-border hover:border-primary-deep/40 hover:bg-primary-soft/30"
      }`}
    >
      {children}
    </button>
  );
}

function CompatBadge({ score }: { score: number }) {
  const color = score >= 75 ? "bg-green-500" : score >= 55 ? "bg-amber-500" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`absolute inset-y-0 left-0 ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-primary-deep">{score}%</span>
    </div>
  );
}

function ProfileCard({ p, myProfile, onOpen }: { p: Profile; myProfile: any | null; onOpen: () => void }) {
  const score = myProfile ? computeCompatibility({ ...p, rasi: p.rasi, religion: p.religion, age: p.age, gender: p.gender }, myProfile) : null;

  return (
    <article className="card-flat overflow-hidden group hover:shadow-md transition-shadow">
      <button onClick={onOpen} className="w-full text-left">
        <div className="relative h-44 bg-gradient-to-br from-primary-soft via-[#d8ebe0] to-[#c5e0d0] flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-deep text-white font-display text-3xl flex items-center justify-center shadow-lg">
            {p.initial}
          </div>
          <span className="absolute top-3 left-3 chip text-[10px]">{p.id}</span>
          {score !== null && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1.5 shadow-sm">
              <Sparkles size={10} className="text-primary-deep" />
              <span className="text-xs font-bold text-primary-deep">{score}%</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h3 className="font-display text-lg text-primary-deep leading-tight">{p.name}</h3>
            <span className="text-xs text-muted-foreground flex-shrink-0">{p.age} yrs · {p.height}</span>
          </div>

          {score !== null && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={11} className="text-primary-deep" />
                <span className="text-xs text-muted-foreground">AI Compatibility</span>
              </div>
              <CompatBadge score={score} />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star size={11} className="text-primary-deep/60 flex-shrink-0" />
              <span>{p.rasi} Rasi · {p.religion}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap size={11} className="text-primary-deep/60 flex-shrink-0" />
              <span className="truncate">{p.education}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase size={11} className="text-primary-deep/60 flex-shrink-0" />
              <span className="truncate">{p.profession}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={11} className="text-primary-deep/60 flex-shrink-0" />
              <span>{p.location}</span>
            </div>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        <button
          onClick={() => toast.success("Interest sent. The Sangam office will contact both families within 2-3 working days.", { duration: 5000 })}
          className="btn-ghost w-full justify-center !py-2 !text-sm"
        >
          <Heart size={13} /> {" "}Express Interest
        </button>
      </div>
    </article>
  );
}

function ProfileModal({ p, myProfile, onClose }: { p: Profile; myProfile: any | null; onClose: () => void }) {
  const [aiData, setAiData] = useState<{ score: number; summary: string; details: string[] } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const baseScore = myProfile ? computeCompatibility({ ...p, rasi: p.rasi, religion: p.religion, age: p.age, gender: p.gender }, myProfile) : null;

  async function loadAiMatch() {
    if (!myProfile) return;
    setLoadingAi(true);
    try {
      const res = await getAiCompatibilityFn({
        data: {
          profileA: { name: myProfile.name, age: myProfile.age, gender: myProfile.gender, religion: myProfile.religion, rasi: myProfile.rasi },
          profileB: { name: p.name, age: p.age, gender: p.gender, religion: p.religion, rasi: p.rasi, education: p.education, profession: p.profession, location: p.location },
        },
      });
      setAiData(res);
    } catch {
      toast.error("AI analysis unavailable");
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-deep to-primary text-white p-6 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X size={15} />
          </button>
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center font-display text-3xl text-white">
              {p.initial}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60 mb-1">{p.id} · Verified</div>
              <h2 className="font-display text-2xl">{p.name}</h2>
              <p className="text-white/70 text-sm">{p.age} years · {p.height} · {p.gender}</p>
            </div>
          </div>
          {baseScore !== null && (
            <div className="mt-4 flex items-center gap-2">
              <Sparkles size={13} />
              <span className="text-sm">AI Compatibility: <span className="font-bold">{aiData?.score ?? baseScore}%</span></span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              ["Religion", `${p.religion} Nadar`],
              ["Rasi", p.rasi],
              ["Education", p.education],
              ["Profession", p.profession],
              ["Location", p.location],
              ["Height", p.height],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-surface px-4 py-3">
                <div className="text-xs text-muted-foreground mb-0.5">{k}</div>
                <div className="text-sm font-medium text-foreground">{v}</div>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          {myProfile && (
            <div className="rounded-xl border border-primary-deep/15 bg-primary-soft/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary-deep" />
                  <span className="text-sm font-semibold text-primary-deep">AI Compatibility Analysis</span>
                </div>
                {!aiData && (
                  <button
                    onClick={loadAiMatch}
                    disabled={loadingAi}
                    className="text-xs text-primary-deep font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
                  >
                    {loadingAi ? <span className="animate-spin w-3 h-3 border border-primary-deep border-t-transparent rounded-full" /> : null}
                    {loadingAi ? "Analyzing…" : "Get detailed analysis"}
                  </button>
                )}
              </div>

              {aiData ? (
                <div>
                  <p className="text-sm text-foreground mb-3">{aiData.summary}</p>
                  <ul className="space-y-1.5">
                    {aiData.details.map((d, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-deep mt-1.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
                      <div className="h-full bg-primary-deep rounded-full" style={{ width: `${baseScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-primary-deep">{baseScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Based on traditional compatibility criteria. Click "Get detailed analysis" for AI insights.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3 flex-shrink-0">
          <button
            onClick={() => { toast.success("Interest sent. The Sangam office will contact both families within 2-3 working days.", { duration: 5000 }); onClose(); }}
            className="btn-primary flex-1 justify-center !py-3"
          >
            <Heart size={15} /> Express Interest
          </button>
          <button onClick={onClose} className="btn-ghost !py-3 px-6">Close</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 card-flat p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-primary-soft mx-auto flex items-center justify-center">
        <Search className="text-primary-deep" size={20} />
      </div>
      <h3 className="mt-4 font-display text-xl text-primary-deep">No profiles match</h3>
      <p className="mt-1 text-sm text-muted-foreground">Try widening your age range or clearing the rasi filter.</p>
    </div>
  );
}
