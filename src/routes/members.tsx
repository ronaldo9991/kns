import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { MEMBERS } from "@/lib/mockData";
import { Search, UserPlus, Phone, MapPin, Briefcase } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/members")({
  head: () => ({ meta: [{ title: "Member Directory — Kovai Nadar Sangam" }] }),
  component: MembersPage,
});

function MembersPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => MEMBERS.filter((m) => `${m.name} ${m.area} ${m.profession}`.toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <SiteLayout>
      <PageHeader title="Member Directory" subtitle="Connect with fellow community members across Coimbatore." breadcrumb={[{ label: "Members" }]} />
      <div className="container-page py-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, area or profession…" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-full text-sm bg-white" />
          </div>
          <button onClick={() => toast.info("Membership form opens at the office. We'll add the online form soon.")} className="btn-primary"><UserPlus size={14}/> Add yourself</button>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((m) => (
            <article key={m.name} className="card-flat p-5 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-deep text-white font-display flex items-center justify-center">
                {m.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base text-primary-deep">{m.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><MapPin size={12}/> {m.area}</p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><Briefcase size={12}/> {m.profession}</p>
                <button onClick={() => toast.success("Sangam office will share contact details after verification.")} className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-deep font-medium">
                  <Phone size={12}/> Request contact
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
