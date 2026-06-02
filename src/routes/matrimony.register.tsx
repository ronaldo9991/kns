import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { useState } from "react";
import { Upload, ImageIcon, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { RASI, STARS } from "@/lib/mockData";

export const Route = createFileRoute("/matrimony/register")({
  head: () => ({ meta: [{ title: "Register Matrimony Profile — Kovai Nadar Sangam" }] }),
  component: RegisterPage,
});

const today = new Date().toISOString().slice(0, 10);
const regNo = "KNS-" + Math.floor(1000 + Math.random() * 9000);

function RegisterPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrFilled, setOcrFilled] = useState(false);
  const [form, setForm] = useState({
    name: "", dob: "", caste: "Hindu Nadar", birthTime: "", birthPlace: "",
    blood: "", height: "", weight: "", star: "", rasi: "", job: "", workplace: "",
    income: "", education: "", fatherName: "", fatherJob: "",
    motherName: "", motherJob: "", address: "", phone: "", mobile: "", email: "",
    siblings: "", expectations: "", gotram: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleOcrUpload = (file: File) => {
    setOcrPreview(URL.createObjectURL(file));
    setOcrLoading(true);
    // Simulate OCR
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
      toast.success("Form auto-filled from the photo. Please review every field.");
    }, 1600);
  };

  return (
    <SiteLayout>
      <PageHeader
        title="Matrimony Registration"
        subtitle="This digital form mirrors the paper biodata used by the sangam office. Once submitted, the office will verify and approve your profile."
        breadcrumb={[{ label: "Matrimony", to: "/matrimony" }, { label: "Register" }]}
      />

      <div className="container-page py-10 grid lg:grid-cols-[1fr_320px] gap-8">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Profile submitted. Pending office approval."); }}
          className="card-flat p-6 sm:p-8 space-y-8"
        >
          {/* Meta */}
          <Section title="Office use">
            <Grid>
              <Field label="Registration No.">
                <input className="kns-input bg-primary-soft/50 font-mono" value={regNo} readOnly />
              </Field>
              <Field label="Date">
                <input type="date" className="kns-input" defaultValue={today} />
              </Field>
            </Grid>
          </Section>

          <Section title="Personal details">
            <Grid>
              <Field label="Full name *"><input required className="kns-input" value={form.name} onChange={set("name")} /></Field>
              <Field label="Date of birth *"><input type="date" required className="kns-input" value={form.dob} onChange={set("dob")} /></Field>
              <Field label="Caste *">
                <select className="kns-input" value={form.caste} onChange={set("caste")}>
                  <option>Hindu Nadar</option>
                  <option>Christian Nadar</option>
                </select>
              </Field>
              <Field label="Blood group"><input className="kns-input" value={form.blood} onChange={set("blood")} placeholder="e.g. B+"/></Field>
              <Field label="Birth time"><input className="kns-input" value={form.birthTime} onChange={set("birthTime")} placeholder="HH:MM"/></Field>
              <Field label="Birth place"><input className="kns-input" value={form.birthPlace} onChange={set("birthPlace")} /></Field>
              <Field label="Height"><input className="kns-input" value={form.height} onChange={set("height")} placeholder="e.g. 5'8&quot;"/></Field>
              <Field label="Weight"><input className="kns-input" value={form.weight} onChange={set("weight")} placeholder="e.g. 65 kg"/></Field>
              <Field label="Star (Natchathiram)">
                <select className="kns-input" value={form.star} onChange={set("star")}>
                  <option value="">Select…</option>
                  {STARS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Rasi">
                <select className="kns-input" value={form.rasi} onChange={set("rasi")}>
                  <option value="">Select…</option>
                  {RASI.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Gotram"><input className="kns-input" value={form.gotram} onChange={set("gotram")} /></Field>
            </Grid>
          </Section>

          <Section title="Profession">
            <Grid>
              <Field label="Education"><input className="kns-input" value={form.education} onChange={set("education")} /></Field>
              <Field label="Job / Role"><input className="kns-input" value={form.job} onChange={set("job")} /></Field>
              <Field label="Workplace"><input className="kns-input" value={form.workplace} onChange={set("workplace")} /></Field>
              <Field label="Monthly income (₹)"><input className="kns-input" value={form.income} onChange={set("income")} /></Field>
            </Grid>
          </Section>

          <Section title="Family">
            <Grid>
              <Field label="Father's name"><input className="kns-input" value={form.fatherName} onChange={set("fatherName")} /></Field>
              <Field label="Father's profession"><input className="kns-input" value={form.fatherJob} onChange={set("fatherJob")} /></Field>
              <Field label="Mother's name"><input className="kns-input" value={form.motherName} onChange={set("motherName")} /></Field>
              <Field label="Mother's profession"><input className="kns-input" value={form.motherJob} onChange={set("motherJob")} /></Field>
              <Field label="Siblings" wide><textarea className="kns-input min-h-[80px]" value={form.siblings} onChange={set("siblings")} placeholder="Brothers / sisters with age and status"/></Field>
            </Grid>
          </Section>

          <Section title="Contact">
            <Grid>
              <Field label="Contact address" wide><textarea className="kns-input min-h-[80px]" value={form.address} onChange={set("address")} /></Field>
              <Field label="Phone"><input className="kns-input" value={form.phone} onChange={set("phone")} /></Field>
              <Field label="Mobile *"><input required className="kns-input" value={form.mobile} onChange={set("mobile")} /></Field>
              <Field label="Email"><input type="email" className="kns-input" value={form.email} onChange={set("email")} /></Field>
            </Grid>
          </Section>

          <Section title="Partner expectations">
            <textarea className="kns-input min-h-[100px]" value={form.expectations} onChange={set("expectations")} placeholder="Education, profession, family background, location preference, etc."/>
          </Section>

          <Section title="Photograph (post-card size, 6×4)">
            <PhotoUpload value={photo} onChange={setPhoto} />
          </Section>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="btn-primary">Submit for approval</button>
            <Link to="/matrimony" className="btn-ghost">Cancel</Link>
          </div>
        </form>

        {/* OCR side panel */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="card-flat p-5 bg-primary-soft/60 border-primary-deep/15">
            <div className="flex items-center gap-2 text-primary-deep">
              <Sparkles size={16}/>
              <h3 className="font-display text-lg">Auto-fill from paper form</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload a clear photo of the printed biodata. We'll read the fields and pre-fill the form for your review.
            </p>

            <label className="mt-4 block">
              <div className="border-2 border-dashed border-primary-deep/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary-deep/60 bg-white">
                {ocrPreview ? (
                  <img src={ocrPreview} alt="paper form" className="max-h-40 mx-auto rounded-md" />
                ) : (
                  <>
                    <Upload className="mx-auto text-primary-deep" size={22}/>
                    <div className="mt-2 text-xs text-muted-foreground">Click to upload (JPG / PNG)</div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleOcrUpload(e.target.files[0])} />
            </label>

            {ocrLoading && <p className="mt-3 text-xs text-primary-deep">Reading form… extracting fields.</p>}
            {ocrFilled && <p className="mt-3 text-xs inline-flex items-center gap-1.5 text-primary-deep"><Check size={14}/> Fields filled. Please review before submitting.</p>}
          </div>
        </aside>
      </div>

      <style>{`.kns-input{width:100%;border:1px solid var(--border);background:white;border-radius:.55rem;padding:.65rem .8rem;font-size:.9rem;outline:none;transition:border-color .15s, box-shadow .15s}.kns-input:focus{border-color:var(--primary-deep);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary-deep) 15%,transparent)}`}</style>
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
function PhotoUpload({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  return (
    <label className="block max-w-xs">
      <div className="aspect-[3/4] border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-white overflow-hidden">
        {value ? <img src={value} alt="profile" className="w-full h-full object-cover"/> : (
          <div className="text-center text-muted-foreground text-xs">
            <ImageIcon className="mx-auto mb-2" size={22}/> Upload photo (3:4)
          </div>
        )}
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; if (f) onChange(URL.createObjectURL(f));
      }}/>
    </label>
  );
}
