import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { Upload, ImageIcon, Sparkles, Check, LogIn, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { RASI, STARS } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { getMyMatrimonyProfileFn, upsertMatrimonyProfileFn } from "@/lib/api/matrimony.functions";

export const Route = createFileRoute("/matrimony/register")({
  head: () => ({ meta: [{ title: "Matrimony Profile — Kovai Nadar Sangam" }] }),
  component: RegisterPage,
});

const emptyForm = {
  gender: "Female" as "Male" | "Female",
  name: "", dob: "", religion: "Hindu Nadar", birthTime: "", birthPlace: "",
  blood: "", height: "", weight: "", star: "", rasi: "", gotram: "",
  job: "", workplace: "", income: "", education: "", about: "",
  fatherName: "", fatherJob: "", motherName: "", motherJob: "",
  address: "", phone: "", mobile: "", email: "", siblings: "", expectations: "",
};

function calcAge(dob: string): number {
  if (!dob) return 0;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function RegisterPage() {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const mr = t.matrimonyRegister;

  const [photo, setPhoto] = useState<string | null>(null);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrFilled, setOcrFilled] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

  // Load existing profile if user is logged in
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setLoadingProfile(false); return; }

    getMyMatrimonyProfileFn({ data: { userId: user.id } })
      .then((profile) => {
        if (profile) {
          setExistingProfileId(profile.profileId);
          setForm((f) => ({
            ...f,
            gender: (profile.gender as "Male" | "Female") ?? f.gender,
            name: profile.name ?? f.name,
            religion: profile.religion ?? f.religion,
            height: profile.height ?? f.height,
            rasi: profile.rasi ?? f.rasi,
            star: profile.star ?? f.star,
            gotram: profile.gotram ?? f.gotram,
            education: profile.education ?? f.education,
            job: profile.profession ?? f.job,
            income: profile.income ?? f.income,
            location: profile.location ?? f.location,
            about: profile.about ?? f.about,
            expectations: profile.expectations ?? f.expectations,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [isLoaded, user]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const handleOcrUpload = (file: File) => {
    setOcrPreview(URL.createObjectURL(file));
    setOcrLoading(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        name: f.name || "Karthik R.",
        dob: f.dob || "1996-04-12",
        birthTime: f.birthTime || "06:45",
        birthPlace: f.birthPlace || "Coimbatore",
        blood: f.blood || "B+",
        height: f.height || "5'10\"",
        weight: f.weight || "72 kg",
        star: f.star || "Rohini",
        rasi: f.rasi || "Rishabam",
        education: f.education || "B.E. ECE",
        job: f.job || "Senior Engineer",
        workplace: f.workplace || "Bosch, Coimbatore",
        income: f.income || "85000",
        gotram: f.gotram || "Sambavar",
      }));
      setOcrLoading(false);
      setOcrFilled(true);
      toast.success(mr.ocrFillToast);
    }, 1600);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate({ to: "/login" }); return; }
    const age = calcAge(form.dob);
    if (age < 18 || age > 70) {
      toast.error(lang === "ta" ? "வயது 18–70 இடையே இருக்க வேண்டும்." : "Age must be between 18 and 70.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await upsertMatrimonyProfileFn({
        data: {
          userId: user.id,
          gender: form.gender,
          name: form.name,
          age,
          height: form.height || undefined,
          religion: form.religion || undefined,
          rasi: form.rasi || undefined,
          star: form.star || undefined,
          gotram: form.gotram || undefined,
          education: form.education || undefined,
          profession: form.job || undefined,
          income: form.income || undefined,
          location: form.address || undefined,
          about: form.about || undefined,
          expectations: form.expectations || undefined,
          fatherName: form.fatherName || undefined,
          fatherJob: form.fatherJob || undefined,
          motherName: form.motherName || undefined,
          motherJob: form.motherJob || undefined,
          siblings: form.siblings || undefined,
          phone: form.mobile || undefined,
          address: form.address || undefined,
        },
      });
      toast.success(
        result.isNew
          ? (lang === "ta" ? `சுயவிவரம் (${result.profileId}) சமர்ப்பிக்கப்பட்டது. விரைவில் அனுமதிக்கப்படும்.` : `Profile ${result.profileId} submitted! Pending office approval.`)
          : (lang === "ta" ? "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." : "Profile updated successfully."),
        { duration: 5000 }
      );
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message ?? (lang === "ta" ? "சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." : "Submission failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  // Not logged in — show prompt
  if (isLoaded && !user) {
    return (
      <SiteLayout>
        <div className="container-page py-20 max-w-md mx-auto text-center">
          <div className="card-flat p-10">
            <div className="w-16 h-16 rounded-2xl bg-primary-soft mx-auto flex items-center justify-center mb-4">
              <LogIn size={24} className="text-primary-deep" />
            </div>
            <h2 className="font-display text-2xl text-primary-deep">
              {lang === "ta" ? "முதலில் உள்நுழையவும்" : "Sign in to register your profile"}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {lang === "ta"
                ? "திருமண சுயவிவரம் உருவாக்க அல்லது புதுப்பிக்க கணக்கு தேவை."
                : "You need an account to create or manage your matrimony profile."}
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Link to="/login" className="btn-primary justify-center gap-2">
                <LogIn size={16} /> {lang === "ta" ? "உள்நுழைக" : "Sign in"}
              </Link>
              <Link to="/register" className="btn-ghost justify-center gap-2">
                {lang === "ta" ? "புதிய கணக்கு உருவாக்கவும்" : "Create a free account"} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (loadingProfile) {
    return (
      <SiteLayout>
        <div className="container-page py-20 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-deep border-t-transparent rounded-full" />
        </div>
      </SiteLayout>
    );
  }

  const isEdit = !!existingProfileId;

  return (
    <SiteLayout>
      <PageHeader
        title={isEdit
          ? (lang === "ta" ? "சுயவிவரத்தை திருத்து" : "Edit My Profile")
          : (lang === "ta" ? "திருமண சுயவிவரம் உருவாக்கவும்" : "Create Matrimony Profile")}
        subtitle={lang === "ta" ? mr.subtitle : mr.subtitle}
        breadcrumb={[{ label: lang === "ta" ? "திருமணம்" : "Matrimony", to: "/matrimony" }, { label: isEdit ? (lang === "ta" ? "திருத்து" : "Edit") : (lang === "ta" ? "பதிவு" : "Register") }]}
      />

      {isEdit && (
        <div className="container-page pt-4">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
            <Sparkles size={14} />
            <span>
              {lang === "ta"
                ? `சுயவிவரம் ${existingProfileId} — புதுப்பித்த பிறகு மீண்டும் ஆய்வுக்கு அனுப்பப்படும்.`
                : `Editing profile ${existingProfileId} — changes will be re-submitted for review.`}
            </span>
          </div>
        </div>
      )}

      <div className="container-page py-8 grid lg:grid-cols-[1fr_300px] gap-8">
        <form onSubmit={handleSubmit} className="card-flat p-6 sm:p-8 space-y-8">

          {/* Gender */}
          <Section title={lang === "ta" ? "பாலினம் *" : "Gender *"}>
            <div className="flex gap-3">
              {(["Male", "Female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: g }))}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.gender === g
                      ? "bg-primary-deep text-white border-primary-deep"
                      : "border-border hover:border-primary-deep/40"
                  }`}
                >
                  {g === "Male" ? (lang === "ta" ? "ஆண்" : "Male") : (lang === "ta" ? "பெண்" : "Female")}
                </button>
              ))}
            </div>
          </Section>

          <Section title={lang === "ta" ? mr.sections.personal : "Personal Details"}>
            <Grid>
              <Field label={lang === "ta" ? mr.fields.name : "Full name *"}>
                <input required className="kns-input" value={form.name} onChange={set("name")} placeholder={lang === "ta" ? "முழு பெயர்" : "Full name"} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.dob : "Date of birth *"}>
                <input type="date" required className="kns-input" value={form.dob} onChange={set("dob")} max={new Date(Date.now() - 18 * 365.25 * 864e5).toISOString().slice(0,10)} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.caste : "Religion & caste"}>
                <select className="kns-input" value={form.religion} onChange={set("religion")}>
                  <option value="Hindu Nadar">{lang === "ta" ? "இந்து நாடார்" : "Hindu Nadar"}</option>
                  <option value="Christian Nadar">{lang === "ta" ? "கிறிஸ்தவ நாடார்" : "Christian Nadar"}</option>
                </select>
              </Field>
              <Field label={lang === "ta" ? mr.fields.blood : "Blood group"}>
                <input className="kns-input" value={form.blood} onChange={set("blood")} placeholder="e.g. B+" />
              </Field>
              <Field label={lang === "ta" ? mr.fields.birthTime : "Birth time"}>
                <input className="kns-input" value={form.birthTime} onChange={set("birthTime")} placeholder="HH:MM" />
              </Field>
              <Field label={lang === "ta" ? mr.fields.birthPlace : "Birth place"}>
                <input className="kns-input" value={form.birthPlace} onChange={set("birthPlace")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.height : "Height"}>
                <input className="kns-input" value={form.height} onChange={set("height")} placeholder="e.g. 5'6&quot;" />
              </Field>
              <Field label={lang === "ta" ? mr.fields.weight : "Weight"}>
                <input className="kns-input" value={form.weight} onChange={set("weight")} placeholder="e.g. 55 kg" />
              </Field>
              <Field label={lang === "ta" ? mr.fields.star : "Star (Nakshatra)"}>
                <select className="kns-input" value={form.star} onChange={set("star")}>
                  <option value="">{lang === "ta" ? "தேர்ந்தெடுக்கவும்…" : "Select…"}</option>
                  {STARS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={lang === "ta" ? mr.fields.rasi : "Rasi"}>
                <select className="kns-input" value={form.rasi} onChange={set("rasi")}>
                  <option value="">{lang === "ta" ? "தேர்ந்தெடுக்கவும்…" : "Select…"}</option>
                  {RASI.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={lang === "ta" ? mr.fields.gotram : "Gotram"}>
                <input className="kns-input" value={form.gotram} onChange={set("gotram")} />
              </Field>
            </Grid>
          </Section>

          <Section title={lang === "ta" ? mr.sections.profession : "Education & Profession"}>
            <Grid>
              <Field label={lang === "ta" ? mr.fields.education : "Education"}>
                <input className="kns-input" value={form.education} onChange={set("education")} placeholder="e.g. B.E. CSE, MBA" />
              </Field>
              <Field label={lang === "ta" ? mr.fields.job : "Job title"}>
                <input className="kns-input" value={form.job} onChange={set("job")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.workplace : "Workplace"}>
                <input className="kns-input" value={form.workplace} onChange={set("workplace")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.income : "Monthly income (₹)"}>
                <input className="kns-input" value={form.income} onChange={set("income")} placeholder="e.g. 50000" />
              </Field>
              <Field label={lang === "ta" ? "என்னைப் பற்றி" : "About me"} wide>
                <textarea className="kns-input min-h-[80px]" value={form.about} onChange={set("about")} placeholder={lang === "ta" ? "சுருக்கமாக உங்களைப் பற்றி கூறுங்கள்…" : "Brief description about yourself…"} />
              </Field>
            </Grid>
          </Section>

          <Section title={lang === "ta" ? mr.sections.family : "Family Details"}>
            <Grid>
              <Field label={lang === "ta" ? mr.fields.fatherName : "Father's name"}>
                <input className="kns-input" value={form.fatherName} onChange={set("fatherName")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.fatherJob : "Father's occupation"}>
                <input className="kns-input" value={form.fatherJob} onChange={set("fatherJob")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.motherName : "Mother's name"}>
                <input className="kns-input" value={form.motherName} onChange={set("motherName")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.motherJob : "Mother's occupation"}>
                <input className="kns-input" value={form.motherJob} onChange={set("motherJob")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.siblings : "Siblings"} wide>
                <textarea className="kns-input min-h-[80px]" value={form.siblings} onChange={set("siblings")} placeholder={lang === "ta" ? "உடன்பிறந்தோர் விவரங்கள்…" : "Brothers / sisters with age and status…"} />
              </Field>
            </Grid>
          </Section>

          <Section title={lang === "ta" ? mr.sections.contact : "Contact Information"}>
            <Grid>
              <Field label={lang === "ta" ? mr.fields.address : "Address"} wide>
                <textarea className="kns-input min-h-[80px]" value={form.address} onChange={set("address")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.phone : "Phone"}>
                <input className="kns-input" value={form.phone} onChange={set("phone")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.mobile : "Mobile *"}>
                <input required className="kns-input" value={form.mobile} onChange={set("mobile")} />
              </Field>
              <Field label={lang === "ta" ? mr.fields.email : "Email"}>
                <input type="email" className="kns-input" value={form.email} onChange={set("email")} defaultValue={user?.email} />
              </Field>
            </Grid>
          </Section>

          <Section title={lang === "ta" ? mr.sections.expectations : "Partner Expectations"}>
            <textarea
              className="kns-input min-h-[100px]"
              value={form.expectations}
              onChange={set("expectations")}
              placeholder={lang === "ta" ? "கல்வி, தொழில், குடும்பம், இடம் விருப்பங்கள்…" : "Education, profession, family background, location preference…"}
            />
          </Section>

          <Section title={lang === "ta" ? mr.fields.photo : "Profile Photo (3:4 format)"}>
            <PhotoUpload value={photo} onChange={setPhoto} lang={lang} />
          </Section>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Save size={16} />
              )}
              {isEdit
                ? (lang === "ta" ? "மாற்றங்களை சேமிக்கவும்" : "Save Changes")
                : (lang === "ta" ? "ஆய்வுக்கு சமர்ப்பிக்கவும்" : "Submit for Approval")}
            </button>
            <Link to="/dashboard" className="btn-ghost">
              {lang === "ta" ? "ரத்து செய்" : "Cancel"}
            </Link>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 self-start space-y-4">
          {/* OCR upload */}
          <div className="card-flat p-5 bg-primary-soft/60 border-primary-deep/15">
            <div className="flex items-center gap-2 text-primary-deep mb-1">
              <Sparkles size={15} />
              <h3 className="font-display text-base">{lang === "ta" ? mr.ocrTitle : "Auto-fill from paper form"}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {lang === "ta" ? mr.ocrSub : "Upload a photo of your printed biodata and we'll fill the fields for you."}
            </p>
            <label className="block">
              <div className="border-2 border-dashed border-primary-deep/30 rounded-xl p-5 text-center cursor-pointer hover:border-primary-deep/60 bg-white transition-colors">
                {ocrPreview ? (
                  <img src={ocrPreview} alt="paper form" className="max-h-36 mx-auto rounded-md" />
                ) : (
                  <>
                    <Upload className="mx-auto text-primary-deep" size={20} />
                    <div className="mt-2 text-xs text-muted-foreground">{lang === "ta" ? "JPG / PNG பதிவேற்றவும்" : "Click to upload (JPG / PNG)"}</div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleOcrUpload(e.target.files[0])} />
            </label>
            {ocrLoading && <p className="mt-2 text-xs text-primary-deep">{lang === "ta" ? mr.ocrLoading : "Reading form…"}</p>}
            {ocrFilled && <p className="mt-2 text-xs text-primary-deep flex items-center gap-1"><Check size={12} /> {lang === "ta" ? mr.ocrDone : "Fields filled. Please review."}</p>}
          </div>

          {/* Tips */}
          <div className="card-flat p-5">
            <h4 className="font-semibold text-sm mb-3">{lang === "ta" ? "உதவிக்குறிப்புகள்" : "Tips"}</h4>
            <ul className="space-y-2">
              {(lang === "ta" ? [
                "அனைத்து தேவையான புலங்களையும் (*) நிரப்பவும்",
                "ராசி மற்றும் நட்சத்திரம் சரியாக தேர்ந்தெடுக்கவும்",
                "3:4 விகிதத்தில் புகைப்படம் பதிவேற்றவும்",
                "சமர்ப்பித்த பிறகு 1–3 நாட்களில் அனுமதி கிடைக்கும்",
              ] : [
                "Fill all required (*) fields",
                "Select correct Rasi and Star",
                "Upload a clear 3:4 photo",
                "Approval takes 1–3 working days",
              ]).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <style>{`.kns-input{width:100%;border:1px solid var(--border);background:white;border-radius:.55rem;padding:.65rem .8rem;font-size:.9rem;outline:none;transition:border-color .15s,box-shadow .15s}.kns-input:focus{border-color:var(--primary-deep);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary-deep) 15%,transparent)}`}</style>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg text-primary-deep border-b border-border pb-2 mb-4">{title}</h2>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.08em]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function PhotoUpload({ value, onChange, lang }: { value: string | null; onChange: (v: string | null) => void; lang: string }) {
  return (
    <label className="block max-w-xs">
      <div className="aspect-[3/4] border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-white overflow-hidden cursor-pointer hover:border-primary-deep/40 transition-colors">
        {value ? (
          <img src={value} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-muted-foreground text-xs p-4">
            <ImageIcon className="mx-auto mb-2" size={24} />
            {lang === "ta" ? "புகைப்படம் பதிவேற்றவும் (3:4)" : "Upload photo (3:4)"}
          </div>
        )}
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onChange(URL.createObjectURL(f));
      }} />
    </label>
  );
}
