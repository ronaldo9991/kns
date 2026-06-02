import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import { OFFICE_BEARERS } from "@/lib/mockData";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Kovai Nadar Sangam" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader title="About the Sangam" subtitle="A registered community trust serving the Hindu and Christian Nadar families of Coimbatore since 1952." breadcrumb={[{ label: "About" }]}/>
      <div className="container-page py-10 grid lg:grid-cols-[1fr_320px] gap-10">
        <article className="prose-like">
          <h2 className="font-display text-2xl text-primary-deep">Our history</h2>
          <p className="mt-3 text-foreground/85 leading-relaxed">
            Kovai Nadar Sangam was founded in 1952 by a small group of merchants and educators who saw the need for a unified body that could support Nadar families newly settled in Coimbatore. Over seven decades the sangam has grown from a single rented room in Tatabad into a registered trust with its own community hall, matrimony service, scholarship fund and welfare programs.
          </p>
          <p className="mt-3 text-foreground/85 leading-relaxed">
            We welcome both Hindu and Christian Nadar families. Our work spans matrimony, educational scholarships, health camps, business networking and emergency welfare. Every initiative is funded by member contributions and run by volunteer office bearers elected every three years.
          </p>

          <h2 className="font-display text-2xl text-primary-deep mt-10">Office bearers (2024 — 2027)</h2>
          <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {OFFICE_BEARERS.map((p) => (
              <div key={p.name} className="card-flat p-5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-deep text-white font-display text-2xl mx-auto flex items-center justify-center">{p.initial}</div>
                <div className="mt-3 font-display text-base text-primary-deep">{p.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-[0.08em] mt-0.5">{p.role}</div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl text-primary-deep mt-12">Gallery</h2>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary-soft to-[#d8ebe0] hairline" />
            ))}
          </div>
        </article>

        <aside className="self-start space-y-5 lg:sticky lg:top-20">
          <div className="card-flat p-5">
            <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Founded</div>
            <div className="font-display text-3xl text-primary-deep mt-1">1952</div>
          </div>
          <div className="card-flat p-5">
            <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Trust Reg. No.</div>
            <div className="font-display text-xl text-primary-deep mt-1">42 / 1952</div>
          </div>
          <div className="card-flat p-5">
            <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Office hours</div>
            <div className="mt-1 text-sm">Mon–Sat · 10am to 6pm</div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
