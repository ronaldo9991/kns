import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { MEMBERS } from "@/lib/mockData";
import { Search, UserPlus, Phone, MapPin, Briefcase } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/members")({
  head: () => ({ meta: [{ title: "Member Directory — Kovai Nadar Sangam" }] }),
  component: MembersPage,
});

function MembersPage() {
  const { t } = useI18n();
  const m = t.members;
  const [q, setQ] = useState("");
  const list = useMemo(
    () => MEMBERS.filter((mem) => `${mem.name} ${mem.area} ${mem.profession}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <SiteLayout>
      <PageHeader title={m.title} subtitle={m.subtitle} breadcrumb={[{ label: t.nav.members }]} />
      <div className="container-page py-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={m.search}
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-full text-sm bg-white"
            />
          </div>
          <button
            onClick={() => toast.info(m.membershipToast)}
            className="btn-primary"
          >
            <UserPlus size={14} /> {m.addSelf}
          </button>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((mem) => (
            <article key={mem.name} className="card-flat p-5 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-deep text-white font-display flex items-center justify-center flex-shrink-0">
                {mem.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base text-primary-deep">{mem.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><MapPin size={12} /> {mem.area}</p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><Briefcase size={12} /> {mem.profession}</p>
                <button
                  onClick={() => toast.success(m.contactToast)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-deep font-medium"
                >
                  <Phone size={12} /> {m.requestContact}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
