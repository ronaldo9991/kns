import { hashPassword } from "@/lib/auth.server";
import { PROFILES, MEMBERS, EVENTS } from "@/lib/mockData";
import type { DbConn } from "./index";

/**
 * Seeds the database with demo content the first time it is empty.
 * Idempotent: runs only when the users table has no rows, so it is safe to
 * call on every boot (local SQLite and fresh Railway Postgres alike).
 */
export async function seedIfEmpty({ db, schema }: Pick<DbConn, "db" | "schema">) {
  const existing = await db.select().from(schema.users).limit(1);
  if (existing.length > 0) return;

  const [adminHash, demoHash] = await Promise.all([
    hashPassword("admin123"),
    hashPassword("demo123"),
  ]);

  await db.insert(schema.users).values([
    { email: "admin@kns.org", passwordHash: adminHash, name: "KNS Admin", role: "admin" },
    { email: "demo@kns.org", passwordHash: demoHash, name: "Demo User", role: "member" },
  ]);

  await db.insert(schema.members).values(
    MEMBERS.map((m, i) => ({
      name: m.name,
      area: m.area,
      profession: m.profession,
      membershipNumber: `KNS-M${1000 + i}`,
      status: "active",
    }))
  );

  await db.insert(schema.matrimonyProfiles).values(
    PROFILES.map((p, i) => ({
      profileId: p.id,
      gender: p.gender,
      name: p.name,
      age: p.age,
      height: p.height,
      religion: p.religion,
      rasi: p.rasi,
      education: p.education,
      profession: p.profession,
      location: p.location,
      // Most profiles published; last two left pending so the admin
      // approvals queue has something to demonstrate.
      status: i < PROFILES.length - 2 ? "approved" : "pending",
    }))
  );

  await db.insert(schema.events).values(
    EVENTS.map((e) => {
      const d = new Date(e.date);
      return {
        title: e.title,
        description: e.desc,
        date: isNaN(d.getTime()) ? new Date() : d,
        venue: e.venue,
        status: "upcoming",
      };
    })
  );

  await db.insert(schema.scholarships).values([
    { studentName: "Meera P.", school: "PSG Tech", marks: "86.00", annualIncome: "120000", status: "approved" },
    { studentName: "Arjun N.", school: "Govt HSS", marks: "92.00", annualIncome: "80000", status: "under_review" },
    { studentName: "Daniel J.", school: "CIT", marks: "78.00", annualIncome: "95000", status: "pending" },
  ]);
}
