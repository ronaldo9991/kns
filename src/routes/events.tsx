import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { EVENTS } from "@/lib/mockData";
import { Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — Kovai Nadar Sangam" }] }),
  component: EventsPage,
});

const past = [
  { title: "Pongal Celebration 2025", date: "Jan 14, 2025" },
  { title: "Annual Day & Awards", date: "Dec 20, 2024" },
  { title: "Free Eye Camp", date: "Oct 06, 2024" },
  { title: "Women's Wing Tailoring Workshop", date: "Sep 12, 2024" },
];

function EventsPage() {
  const { t } = useI18n();
  const ev = t.events;

  return (
    <SiteLayout>
      <PageHeader
        title={ev.title}
        subtitle={ev.subtitle}
        breadcrumb={[{ label: t.nav.events }]}
      />
      <div className="container-page py-10">
        <h2 className="font-display text-2xl text-primary-deep">{ev.upcoming}</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {EVENTS.map((e) => (
            <article key={e.title} className="card-flat p-6 flex flex-col">
              <div className="flex items-center gap-3 text-xs text-primary-deep font-medium uppercase tracking-[0.12em]">
                <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {e.date}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {e.venue}</span>
              </div>
              <h3 className="mt-3 font-display text-xl text-foreground">{e.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{e.desc}</p>
              <button
                onClick={() => toast.success(ev.registeredToast)}
                className="mt-5 btn-ghost self-start"
              >
                {ev.register}
              </button>
            </article>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl text-primary-deep">{ev.past}</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {past.map((e) => (
            <div key={e.title} className="card-flat overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-soft to-[#d8ebe0] flex items-center justify-center font-display text-3xl text-primary-deep">
                {e.title.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{e.date}</div>
                <div className="mt-1 font-display text-sm">{e.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
