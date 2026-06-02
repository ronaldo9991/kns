import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { GraduationCap, FileText, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/scholarships")({
  head: () => ({ meta: [{ title: "Scholarships — Kovai Nadar Sangam" }] }),
  component: ScholarshipsPage,
});

const steps = ["Submitted", "Documents verified", "Committee review", "Approved & Disbursed"];

function ScholarshipsPage() {
  const [form, setForm] = useState({ name: "", school: "", marks: "", income: "" });
  const [status, setStatus] = useState(1);

  return (
    <SiteLayout>
      <PageHeader title="Scholarships" subtitle="Educational support for school, college and higher studies for deserving Nadar students from Coimbatore." breadcrumb={[{ label: "Scholarships" }]}/>

      <div className="container-page py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="card-flat p-6 bg-primary-soft/50 border-primary-deep/15">
            <div className="leaf-mark"><GraduationCap size={16}/></div>
            <h3 className="mt-3 font-display text-xl text-primary-deep">Eligibility</h3>
            <ul className="mt-3 text-sm space-y-2 text-foreground/85">
              <li className="flex gap-2"><Check size={16} className="text-primary-deep mt-0.5"/> Student or parent must be a registered sangam member.</li>
              <li className="flex gap-2"><Check size={16} className="text-primary-deep mt-0.5"/> Hindu or Christian Nadar community, residing in Coimbatore district.</li>
              <li className="flex gap-2"><Check size={16} className="text-primary-deep mt-0.5"/> Minimum 75% marks for merit aid · annual family income below ₹3,00,000 for need-based aid.</li>
              <li className="flex gap-2"><Check size={16} className="text-primary-deep mt-0.5"/> Valid bonafide certificate from school / college.</li>
            </ul>
          </div>

          <div className="card-flat p-6 mt-6">
            <h3 className="font-display text-lg text-primary-deep">Application status</h3>
            <p className="text-xs text-muted-foreground mt-1">Track your application here once submitted.</p>
            <ol className="mt-5 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i <= status ? "bg-primary-deep text-white" : "bg-primary-soft text-primary-deep/60"}`}>
                    {i < status ? <Check size={12}/> : i + 1}
                  </div>
                  <span className={`text-sm ${i <= status ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                </li>
              ))}
            </ol>
            <button onClick={() => setStatus((s) => Math.min(3, s + 1))} className="mt-5 btn-ghost text-xs">Advance status (demo)</button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast.success("Application submitted. We'll verify documents within 7 days."); }} className="card-flat p-6 sm:p-8">
          <h3 className="font-display text-xl text-primary-deep flex items-center gap-2"><FileText size={18}/> Apply now</h3>
          <div className="mt-5 grid gap-4">
            <Field label="Student name *"><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="kns-input"/></Field>
            <Field label="School / College *"><input required value={form.school} onChange={(e) => setForm({...form, school: e.target.value})} className="kns-input"/></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Latest marks (%)"><input value={form.marks} onChange={(e) => setForm({...form, marks: e.target.value})} className="kns-input"/></Field>
              <Field label="Annual family income (₹)"><input value={form.income} onChange={(e) => setForm({...form, income: e.target.value})} className="kns-input"/></Field>
            </div>
            <Field label="Upload documents (mark sheet, income certificate, bonafide)">
              <input type="file" multiple className="kns-input cursor-pointer"/>
            </Field>
            <button className="btn-primary justify-center">Submit application</button>
          </div>
        </form>
      </div>
      <style>{`.kns-input{width:100%;border:1px solid var(--border);background:white;border-radius:.55rem;padding:.65rem .8rem;font-size:.9rem;outline:none}.kns-input:focus{border-color:var(--primary-deep);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary-deep) 15%,transparent)}`}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.08em]">{label}</span><div className="mt-1.5">{children}</div></label>;
}
