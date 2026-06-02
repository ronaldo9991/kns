import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";

export const getEventsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ status: z.string().optional() }))
  .handler(async () => {
    const { db, schema } = await getDb();
    return db.select().from(schema.events).orderBy(desc(schema.events.date));
  });

export const registerForEventFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ userId: z.number(), eventId: z.number() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    try {
      await db.insert(schema.eventRegistrations).values({ userId: data.userId, eventId: data.eventId });
      return { ok: true };
    } catch {
      return { ok: false, error: "Already registered" };
    }
  });
