import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { getMyMatrimonyProfileFn } from "@/lib/api/matrimony.functions";
import {
  Heart, CheckCircle2, Clock, XCircle, Plus, Edit2,
  User, GraduationCap, Briefcase, MapPin, Star, Shield,
  ArrowRight, AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — Kovai Nadar Sangam" }] }),
  component: DashboardPage,
});

type Profile = Awaited<ReturnType<typeof getMyMatrimonyProfileFn>>;

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    labelTa: "ஆய்வில் உள்ளது",
    desc: "Your profile has been submitted and is awaiting review by the sangam office. This usually takes 1–3 working days.",
    descTa: "உங்கள் சுயவிவரம் சமர்ப்பிக்கப்பட்டது. 1–3 வேலை நாட்களில் சங்கம் அலுவலகம் ஆய்வு செய்யும்.",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  approved: {
    label: "Approved & Live",
    labelTa: "அனுமதிக்கப்பட்டது",
    desc: "Your profile is visible to verified members. The sangam office will contact you when there is a mutual interest.",
    descTa: "உங்கள் சுயவிவரம் சரிபார்க்கப்பட்ட உறுப்பினர்களுக்கு தெரியும். பரஸ்பர ஆர்வம் இருந்தால் சங்கம் தொடர்பு கொள்ளும்.",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Needs Revision",
    labelTa: "திருத்தம் தேவை",
    desc: "The office has requested changes to your profile. Please update and resubmit.",
    descTa: "அலுவலகம் திருத்தங்கள் கோரியுள்ளது. புதுப்பித்து மீண்டும் சமர்ப்பிக்கவும்.",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
};

function DashboardPage() {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { navigate({ to: "/login" }); return; }
    getMyMatrimonyProfileFn({ data: { userId: user.id } })
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <SiteLayout>
        <div className="container-page py-20 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-deep border-t-transparent rounded-full" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) return null;

  const statusKey = profile?.status as keyof typeof STATUS_CONFIG | undefined;
  const statusCfg = statusKey ? STATUS_CONFIG[statusKey] : null;

  return (
    <SiteLayout>
      {/* Header */}
      <div className="bg-primary-deep text-white">
        <div className="container-page py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center font-display text-2xl">
              {user.name[0]}
            </div>
            <div>
              <p className="text-white/60 text-sm">
                {lang === "ta" ? "வணக்கம்" : "Welcome back"},
              </p>
              <h1 className="font-display text-2xl">{user.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8 space-y-6">

        {/* ── NO PROFILE YET ── */}
        {profile === null && (
          <div className="card-flat overflow-hidden">
            <div className="bg-gradient-to-br from-primary-deep to-primary p-8 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                <Heart size={22} />
              </div>
              <h2 className="font-display text-2xl mb-2">
                {lang === "ta" ? "திருமண சுயவிவரம் உருவாக்கவும்" : "Create Your Matrimony Profile"}
              </h2>
              <p className="text-white/75 text-sm max-w-lg">
                {lang === "ta"
                  ? "உங்கள் முழு விவரங்களை நிரப்பவும். சங்கம் அலுவலகம் சரிபார்த்து 1–3 நாட்களில் வெளியிடும்."
                  : "Fill in your complete biodata. The sangam office will verify and publish your profile within 1–3 working days."}
              </p>
            </div>

            {/* Completion steps */}
            <div className="p-6">
              <h3 className="font-semibold text-sm text-foreground mb-4">
                {lang === "ta" ? "நீங்கள் என்ன நிரப்ப வேண்டும்:" : "What you'll fill in:"}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: User, label: lang === "ta" ? "தனிப்பட்ட விவரங்கள்" : "Personal Details", sub: lang === "ta" ? "பெயர், பிறந்த தேதி, ராசி, நட்சத்திரம்" : "Name, DOB, Rasi, Star" },
                  { icon: Briefcase, label: lang === "ta" ? "கல்வி & தொழில்" : "Education & Profession", sub: lang === "ta" ? "கல்வி, பணி, வருமானம்" : "Qualification, Job, Income" },
                  { icon: User, label: lang === "ta" ? "குடும்ப விவரங்கள்" : "Family Details", sub: lang === "ta" ? "பெற்றோர், உடன்பிறந்தோர்" : "Parents, Siblings" },
                  { icon: MapPin, label: lang === "ta" ? "தொடர்பு தகவல்" : "Contact Info", sub: lang === "ta" ? "முகவரி, தொலைபேசி" : "Address, Phone" },
                  { icon: Star, label: lang === "ta" ? "துணைவர் எதிர்பார்ப்பு" : "Partner Expectations", sub: lang === "ta" ? "விருப்பங்கள்" : "Your preferences" },
                  { icon: Heart, label: lang === "ta" ? "புகைப்படம்" : "Profile Photo", sub: lang === "ta" ? "3:4 விகிதம்" : "3:4 format preferred" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary-deep" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/matrimony/register" className="btn-primary gap-2">
                <Plus size={16} />
                {lang === "ta" ? "இப்போது சுயவிவரம் உருவாக்கவும்" : "Create My Profile Now"}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* ── HAS PROFILE ── */}
        {profile && statusCfg && (
          <>
            {/* Status card */}
            <div className={`card-flat p-5 border-2 ${statusCfg.border} ${statusCfg.bg}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white`}>
                  <statusCfg.icon size={20} className={statusCfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${statusCfg.color}`}>
                      {lang === "ta" ? statusCfg.labelTa : statusCfg.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.badge}`}>
                      {profile.profileId}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lang === "ta" ? statusCfg.descTa : statusCfg.desc}
                  </p>
                </div>
                <Link
                  to="/matrimony/register"
                  className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:underline"
                >
                  <Edit2 size={14} />
                  {lang === "ta" ? "திருத்து" : "Edit"}
                </Link>
              </div>
            </div>

            {/* Profile preview */}
            <div className="card-flat overflow-hidden">
              <div className="bg-gradient-to-br from-primary-deep to-primary px-6 py-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center font-display text-2xl text-white">
                  {profile.name?.[0] ?? "?"}
                </div>
                <div>
                  <div className="font-display text-xl text-white">{profile.name}</div>
                  <div className="text-white/70 text-sm mt-0.5">
                    {profile.age} {lang === "ta" ? "வயது" : "years"} · {profile.gender}
                    {profile.height ? ` · ${profile.height}` : ""}
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: lang === "ta" ? "மதம்" : "Religion", value: profile.religion, icon: Shield },
                  { label: lang === "ta" ? "ராசி" : "Rasi", value: profile.rasi, icon: Star },
                  { label: lang === "ta" ? "நட்சத்திரம்" : "Star", value: profile.star, icon: Star },
                  { label: lang === "ta" ? "கல்வி" : "Education", value: profile.education, icon: GraduationCap },
                  { label: lang === "ta" ? "தொழில்" : "Profession", value: profile.profession, icon: Briefcase },
                  { label: lang === "ta" ? "இடம்" : "Location", value: profile.location, icon: MapPin },
                ].map(({ label, value, icon: Icon }) =>
                  value ? (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                      <Icon size={14} className="text-primary-deep flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="text-sm font-medium">{value}</div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              {profile.about && (
                <div className="px-6 pb-4">
                  <div className="text-xs text-muted-foreground mb-1">{lang === "ta" ? "என்னைப் பற்றி" : "About"}</div>
                  <p className="text-sm text-foreground leading-relaxed">{profile.about}</p>
                </div>
              )}

              {profile.expectations && (
                <div className="px-6 pb-6">
                  <div className="text-xs text-muted-foreground mb-1">{lang === "ta" ? "துணைவர் எதிர்பார்ப்பு" : "Partner Expectations"}</div>
                  <p className="text-sm text-foreground leading-relaxed">{profile.expectations}</p>
                </div>
              )}

              <div className="px-6 pb-6 border-t border-border pt-4 flex flex-wrap gap-3">
                <Link to="/matrimony/register" className="btn-primary gap-2 !py-2.5 !text-sm">
                  <Edit2 size={14} />
                  {lang === "ta" ? "சுயவிவரத்தை திருத்து" : "Edit My Profile"}
                </Link>
                {profile.status === "approved" && (
                  <Link to="/matrimony" className="btn-ghost gap-2 !py-2.5 !text-sm">
                    <Heart size={14} />
                    {lang === "ta" ? "பொருத்தங்களை காண்க" : "View Matches"}
                  </Link>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Heart,
              label: lang === "ta" ? "திருமண தேடல்" : "Browse Profiles",
              sub: lang === "ta" ? "பொருத்தமான சுயவிவரங்களை தேடுங்கள்" : "Find compatible matches",
              to: "/matrimony",
              color: "bg-pink-50 text-pink-600",
            },
            {
              icon: Shield,
              label: lang === "ta" ? "சங்கம் தொடர்பு" : "Contact Sangam",
              sub: lang === "ta" ? "உதவிக்கு அலுவலகத்தை தொடர்பு கொள்ளுங்கள்" : "Reach the office for help",
              to: "/",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: GraduationCap,
              label: lang === "ta" ? "எங்கள் பள்ளி" : "Our School",
              sub: lang === "ta" ? "சங்கமம் மெட்ரிகுலேஷன் பள்ளி" : "Sangamam Matriculation School",
              to: "/school",
              color: "bg-green-50 text-green-600",
            },
          ].map(({ icon: Icon, label, sub, to, color }) => (
            <Link key={label} to={to} className="card-flat p-5 hover:border-primary-deep/30 hover:shadow-sm transition-all group">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={16} />
              </div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
              <ArrowRight size={13} className="mt-3 text-primary-deep opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Account info */}
        <div className="card-flat p-5">
          <h3 className="font-semibold text-sm mb-3">{lang === "ta" ? "கணக்கு விவரங்கள்" : "Account Details"}</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">{lang === "ta" ? "பெயர்" : "Name"}: </span>{user.name}</div>
            <div><span className="text-muted-foreground">{lang === "ta" ? "மின்னஞ்சல்" : "Email"}: </span>{user.email}</div>
            <div><span className="text-muted-foreground">{lang === "ta" ? "பங்கு" : "Role"}: </span><span className="capitalize">{user.role}</span></div>
          </div>
        </div>

      </div>
    </SiteLayout>
  );
}
