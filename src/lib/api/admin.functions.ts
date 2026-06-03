import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, desc, count } from "drizzle-orm";
import { getDb } from "@/lib/db";

export const getAdminStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { db, schema } = await getDb();
  const [pendingMatrimony] = await db.select({ c: count() }).from(schema.matrimonyProfiles).where(eq(schema.matrimonyProfiles.status, "pending"));
  const [totalMembers] = await db.select({ c: count() }).from(schema.members);
  const [totalUsers] = await db.select({ c: count() }).from(schema.users);
  const [upcomingEvents] = await db.select({ c: count() }).from(schema.events);
  const [pendingScholarships] = await db.select({ c: count() }).from(schema.scholarships).where(eq(schema.scholarships.status, "pending"));
  return {
    pendingMatrimony: pendingMatrimony?.c ?? 0,
    totalMembers: totalMembers?.c ?? 0,
    upcomingEvents: upcomingEvents?.c ?? 0,
    pendingScholarships: pendingScholarships?.c ?? 0,
    totalUsers: totalUsers?.c ?? 0,
    recentActivity: [
      { text: "Aravind R. submitted matrimony profile", time: "14 min ago" },
      { text: "Selvaraj K. paid membership renewal", time: "1 hour ago" },
      { text: "Scholarship application #SCH-228 verified", time: "3 hours ago" },
      { text: "Event 'Health Camp' updated by Secretary", time: "yesterday" },
      { text: "New member registration: Kavitha M.", time: "2 days ago" },
    ],
  };
});

export const getAdminMatrimonyFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ status: z.string().optional() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const status = data.status ?? "pending";
    return db.select().from(schema.matrimonyProfiles).where(eq(schema.matrimonyProfiles.status, status)).orderBy(desc(schema.matrimonyProfiles.createdAt));
  });

export const getAdminMembersFn = createServerFn({ method: "GET" }).handler(async () => {
  const { db, schema } = await getDb();
  return db.select().from(schema.members).orderBy(desc(schema.members.joinedAt));
});

export const getAdminScholarshipsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { db, schema } = await getDb();
  return db.select().from(schema.scholarships).orderBy(desc(schema.scholarships.createdAt));
});

export const updateScholarshipStatusFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number(), status: z.enum(["pending", "under_review", "approved", "rejected"]), notes: z.string().optional() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    await db.update(schema.scholarships).set({ status: data.status, adminNotes: data.notes }).where(eq(schema.scholarships.id, data.id));
    return { ok: true };
  });

export const createEventFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ title: z.string().min(2), description: z.string().optional(), date: z.string(), venue: z.string().optional() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const [event] = await db.insert(schema.events).values({ title: data.title, description: data.description, date: new Date(data.date), venue: data.venue }).returning();
    return { ok: true, id: event.id };
  });

export const getAdminEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { db, schema } = await getDb();
  return db.select().from(schema.events).orderBy(desc(schema.events.date));
});

export const deleteEventFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    await db.delete(schema.events).where(eq(schema.events.id, data.id));
    return { ok: true };
  });

export const addMemberFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(2), area: z.string().optional(), profession: z.string().optional(), phone: z.string().optional(), email: z.string().email().optional() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const [{ c }] = await db.select({ c: count() }).from(schema.members);
    const membershipNumber = `KNS-M${1000 + (c ?? 0)}`;
    await db.insert(schema.members).values({ ...data, membershipNumber });
    return { ok: true };
  });
