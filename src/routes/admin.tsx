import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Users, Heart, Calendar, GraduationCap,
  CheckCircle2, XCircle, Clock, TrendingUp, Plus, Trash2,
  Eye, LogOut, ChevronRight, Activity, Bell, Search,
  Edit2, Shield, ArrowUpRight, Menu, X
} from "lucide-react";
import {
  getAdminStatsFn, getAdminMatrimonyFn, getAdminMembersFn,
  getAdminScholarshipsFn, updateScholarshipStatusFn,
  createEventFn, deleteEventFn, addMemberFn, getAdminEventsFn
} from "@/lib/api/admin.functions";
import { updateProfileStatusFn } from "@/lib/api/matrimony.functions";
import { loginFn } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Kovai Nadar Sangam" }] }),
  component: AdminRoute,
});

type Tab = "dashboard" | "matrimony" | "members" | "events" | "scholarships";

function AdminRoute() {
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || !isAdmin) return <AdminLogin onLogin={login} />;
  return <AdminPanel user={user} onLogout={() => { logout(); navigate({ to: "/" }); }} />;
}

function AdminLogin({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const { lang, setLang } = useI18n();
  const [email, setEmail] = useState("admin@kns.org");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginFn({ data: { email, password } });
      if (res.user.role !== "admin") throw new Error("Admin access required");
      onLogin(res.token, res.user);
      toast.success("Welcome back, Admin!");
    } catch (err: any) {
      toast.error(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-deep via-[#1a4d35] to-[#0f3020] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <Logo light />
            <div className="text-white text-left">
              <div className="font-display text-xl font-semibold">Kovai Nadar Sangam</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Admin Portal</div>
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-deep to-primary p-6">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white">Admin Sign In</h1>
            <p className="text-white/60 text-sm mt-1">Office bearers & secretaries only</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30 focus:border-primary-deep" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary-deep text-white rounded-xl py-3 font-semibold hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : "Sign in to Admin Panel"}
              </button>
            </form>
            <div className="mt-4 rounded-xl bg-primary-soft/60 p-3 text-xs text-muted-foreground">
              Demo: <span className="font-mono">admin@kns.org</span> / <span className="font-mono">admin123</span>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-4">
          <button onClick={() => setLang(lang === "en" ? "ta" : "en")} className="hover:text-white/70 mr-3">
            {lang === "en" ? "தமிழ்" : "English"}
          </button>
          <Link to="/" className="hover:text-white/70">← Public site</Link>
        </p>
      </div>
    </div>
  );
}

function AdminPanel({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { key: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "matrimony", label: "Matrimony", icon: Heart },
    { key: "members", label: "Members", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "scholarships", label: "Scholarships", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-40 flex flex-col w-64 bg-primary-deep text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo light />
            <div>
              <div className="font-display text-sm font-semibold">KNS Admin</div>
              <div className="text-xs text-white/50">Est. 1952</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === key
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/65 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={16} />
              {label}
              {badge != null && badge > 0 && (
                <span className="ml-auto bg-orange-400 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-white/50 truncate">{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 lg:px-8 h-14 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Menu size={18} />
            </button>
            <h1 className="font-display text-lg text-primary-deep capitalize">
              {navItems.find(n => n.key === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary-deep flex items-center gap-1">
              View site <ArrowUpRight size={12} />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {tab === "dashboard" && <Dashboard />}
          {tab === "matrimony" && <MatrimonyTab />}
          {tab === "members" && <MembersTab />}
          {tab === "events" && <EventsTab />}
          {tab === "scholarships" && <ScholarshipsTab />}
        </main>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    getAdminStatsFn().then(setStats).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Pending Approvals", value: stats.pendingMatrimony + stats.pendingScholarships, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Total Members", value: stats.totalMembers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Scholarships", value: stats.pendingScholarships, icon: GraduationCap, color: "text-green-600", bg: "bg-green-50" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats
          ? cards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-border">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="font-display text-3xl text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-border animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-xl mb-3" />
                <div className="h-8 w-12 bg-muted rounded mb-1" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Activity size={16} className="text-primary-deep" />
            <h2 className="font-semibold text-sm">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {(stats?.recentActivity ?? [
              { text: "Aravind R. submitted matrimony profile", time: "14 min ago" },
              { text: "Selvaraj K. paid membership renewal", time: "1 hour ago" },
              { text: "Scholarship #SCH-228 approved", time: "3 hours ago" },
              { text: "Event 'Health Camp' updated", time: "yesterday" },
              { text: "New member: Kavitha M.", time: "2 days ago" },
            ]).map((item: any, i: number) => (
              <li key={i} className="px-6 py-3 flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">{item.text}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-deep" />
            <h2 className="font-semibold text-sm">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Review Matrimony", desc: "3 pending", to: "matrimony", icon: Heart, color: "bg-pink-50 text-pink-600" },
              { label: "Add Member", desc: "Directory", to: "members", icon: Users, color: "bg-blue-50 text-blue-600" },
              { label: "New Event", desc: "Create post", to: "events", icon: Calendar, color: "bg-purple-50 text-purple-600" },
              { label: "Scholarships", desc: "2 pending", to: "scholarships", icon: GraduationCap, color: "bg-green-50 text-green-600" },
            ].map(({ label, desc, to, icon: Icon, color }) => (
              <button key={label} className="p-4 rounded-xl border border-border hover:border-primary-deep/30 hover:bg-primary-soft/30 transition-all text-left group">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
                  <Icon size={14} />
                </div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Matrimony Tab ── */
function MatrimonyTab() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  function loadProfiles() {
    setLoading(true);
    getAdminMatrimonyFn({ data: { status: statusFilter } })
      .then(setProfiles)
      .catch(() => toast.error("Failed to load profiles"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadProfiles(); }, [statusFilter]);

  async function handleStatus(id: number, status: "approved" | "rejected") {
    try {
      await updateProfileStatusFn({ data: { id, status } });
      toast.success(`Profile ${status}`);
      loadProfiles();
    } catch {
      toast.error("Action failed");
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${statusFilter === s ? "bg-primary-deep text-white" : "bg-white border border-border hover:border-primary-deep/30"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Matrimony Profiles — <span className="capitalize text-primary-deep">{statusFilter}</span></h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : profiles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No {statusFilter} profiles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">Religion</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  {statusFilter === "pending" && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map((p: any) => (
                  <tr key={p.id ?? p.profileId} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{p.profileId ?? p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.age} · {p.gender}</td>
                    <td className="px-4 py-3">{p.religion ?? "—"}</td>
                    <td className="px-4 py-3">{p.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[p.status] ?? "bg-muted text-muted-foreground"}`}>
                        {p.status}
                      </span>
                    </td>
                    {statusFilter === "pending" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleStatus(p.id, "approved")} className="flex items-center gap-1 text-green-700 text-xs font-medium hover:underline">
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button onClick={() => handleStatus(p.id, "rejected")} className="flex items-center gap-1 text-red-600 text-xs font-medium hover:underline">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Members Tab ── */
function MembersTab() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", area: "", profession: "", phone: "", email: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getAdminMembersFn().then(setMembers).catch(() => {});
  }, []);

  const filtered = members.filter((m) =>
    `${m.name} ${m.area} ${m.profession}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      await addMemberFn({ data: { name: form.name, area: form.area || undefined, profession: form.profession || undefined, phone: form.phone || undefined, email: form.email || undefined } });
      toast.success("Member added successfully");
      setShowAdd(false);
      setForm({ name: "", area: "", profession: "", phone: "", email: "" });
      getAdminMembersFn().then(setMembers).catch(() => {});
    } catch {
      toast.error("Failed to add member");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members…" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 bg-white" />
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-primary-deep text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary transition-colors">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name*", required: true },
              { key: "area", label: "Area" },
              { key: "profession", label: "Profession" },
              { key: "phone", label: "Phone" },
              { key: "email", label: "Email" },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={required}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={adding} className="bg-primary-deep text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary transition-colors disabled:opacity-50">
                {adding ? "Adding…" : "Add Member"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl text-sm border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Members ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Profession</th>
                <th className="px-4 py-3">Membership #</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m: any, i) => (
                <tr key={m.id ?? i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.area ?? "—"}</td>
                  <td className="px-4 py-3">{m.profession ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.membershipNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {m.status ?? "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Events Tab ── */
function EventsTab() {
  const [showCreate, setShowCreate] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", venue: "" });
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function loadEvents() {
    setLoading(true);
    getAdminEventsFn().then(setEvents).catch(() => toast.error("Failed to load events")).finally(() => setLoading(false));
  }

  useEffect(() => { loadEvents(); }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createEventFn({ data: { title: eventForm.title, description: eventForm.description || undefined, date: eventForm.date, venue: eventForm.venue || undefined } });
      toast.success("Event created successfully");
      setShowCreate(false);
      setEventForm({ title: "", description: "", date: "", venue: "" });
      loadEvents();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteEvent(id: number) {
    try {
      await deleteEventFn({ data: { id } });
      toast.success("Event deleted");
      loadEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-primary-deep text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary transition-colors">
          <Plus size={14} /> New Event
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Event Title*</label>
              <input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} required className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Date & Time*</label>
              <input type="datetime-local" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} required className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Venue</label>
              <input value={eventForm.venue} onChange={e => setEventForm(f => ({ ...f, venue: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Description</label>
              <textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={creating} className="bg-primary-deep text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary disabled:opacity-50">
                {creating ? "Creating…" : "Create Event"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl text-sm border border-border hover:bg-muted">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">Loading…</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">No events yet. Create one above.</div>
      ) : (
        <div className="grid gap-4">
          {events.map((ev: any) => (
            <div key={ev.id} className="bg-white rounded-2xl border border-border p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">{ev.status ?? "upcoming"}</span>
                </div>
                <h3 className="font-semibold text-foreground">{ev.title}</h3>
                {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  {ev.date && <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(ev.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>}
                  {ev.venue && <span>{ev.venue}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Scholarships Tab ── */
function ScholarshipsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getAdminScholarshipsFn().then(setApps).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleStatus(id: number, status: "pending" | "under_review" | "approved" | "rejected") {
    try {
      await updateScholarshipStatusFn({ data: { id, status } });
      toast.success(`Status updated to ${status}`);
      load();
    } catch {
      toast.error("Update failed");
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    under_review: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-sm">Scholarship Applications</h2>
      </div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Income / yr</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apps.map((a: any) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">SCH-{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.studentName}</td>
                  <td className="px-4 py-3">{a.school ?? "—"}</td>
                  <td className="px-4 py-3">{a.marks ? `${parseFloat(a.marks)}%` : "—"}</td>
                  <td className="px-4 py-3">{a.annualIncome ? `₹${parseInt(a.annualIncome).toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[a.status] ?? "bg-muted text-muted-foreground"}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatus(a.id, e.target.value as any)}
                      className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
