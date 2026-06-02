import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { GraduationCap, FileText, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/scholarships")({
  head: () => ({ meta: [{ title: "Scholarships — Kovai Nadar Sangam" }] }),
  component: ScholarshipsPage,
});

function ScholarshipsPage() {
  const { t } = useI18n();
  const s = t.scholarships;
  const [form, setForm] = useState({ name: "", school: "", marks: "", income: "" });
  const [status, setStatus] = useState(1);

  return (
    <SiteLayout>
      <PageHeader title={s.title} subtitle={s.subtitle} breadcrumb={[{ label: t.nav.scholarships }]} />

      <div className="container-page py-10 grid lg:grid-cols-2 gap-10">
        <div>
          {/* Eligibility */}
          <div className="card-flat p-6 bg-primary-soft/50 border-primary-deep/15">
            <div className="leaf-mark"><GraduationCap size={16} /></div>
            <h3 className="mt-3 font-display text-xl text-primary-deep">{s.eligibility}</h3>
            <ul className="mt-3 text-sm space-y-2 text-foreground/85">
              {s.eligibilityCriteria.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <Check size={16} className="text-primary-deep mt-0.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Status tracker */}
          <div className="card-flat p-6 mt-6">
            <h3 className="font-display text-lg text-primary-deep">{s.applicationStatus}</h3>
            <p className="text-xs text-muted-foreground mt-1">{s.applicationStatusSub}</p>
            <ol className="mt-5 space-y-3">
              {s.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${i <= status ? "bg-primary-deep text-white" : "bg-primary-soft text-primary-deep/60"}`}>
                    {i < status ? <Check size={12} /> : i + 1}
                  </div>
                  <span className={`text-sm ${i <= status ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                </li>
              ))}
            </ol>
            <button onClick={() => setStatus((prev) => Math.min(3, prev + 1))} className="mt-5 btn-ghost text-xs">
              {s.advanceDemo}
            </button>
          </div>
        </div>

        {/* Application form */}
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success(s.submitToast); }}
          className="card-flat p-6 sm:p-8"
        >
          <h3 className="font-display text-xl text-primary-deep flex items-center gap-2">
            <FileText size={18} /> {s.applyNow}
          </h3>
          <div className="mt-5 grid gap-4">
            <Field label={s.fields.studentName}>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="kns-input" />
            </Field>
            <Field label={s.fields.school}>
              <input required value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="kns-input" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={s.fields.marks}>
                <input value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} className="kns-input" />
              </Field>
              <Field label={s.fields.income}>
                <input value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} className="kns-input" />
              </Field>
            </div>
            <Field label={s.fields.documents}>
              <input type="file" multiple className="kns-input cursor-pointer" />
            </Field>
            <button className="btn-primary justify-center">{s.submit}</button>
          </div>
        </form>
      </div>

      <style>{`.kns-input{width:100%;border:1px solid var(--border);background:white;border-radius:.55rem;padding:.65rem .8rem;font-size:.9rem;outline:none}.kns-input:focus{border-color:var(--primary-deep);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary-deep) 15%,transparent)}`}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.08em]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
