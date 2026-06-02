import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary-deep">Home</Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} />
          {it.to ? <Link to={it.to} className="hover:text-primary-deep">{it.label}</Link> : <span className="text-foreground">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb: { label: string; to?: string }[] }) {
  return (
    <div className="bg-surface border-b border-border">
      <div className="container-page py-10">
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-4 font-display text-3xl sm:text-4xl text-primary-deep">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}
