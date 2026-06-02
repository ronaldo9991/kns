import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";

export const applyForScholarshipFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.number().optional(),
      studentName: z.string().min(2),
      school: z.string().min(2),
      marks: z.number().min(0).max(100),
      annualIncome: z.number().optional(),
      category: z.string().optional(),
      contactPhone: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const [app] = await db
      .insert(schema.scholarships)
      .values({
        userId: data.userId,
        studentName: data.studentName,
        school: data.school,
        marks: String(data.marks),
        annualIncome: data.annualIncome != null ? String(data.annualIncome) : undefined,
        category: data.category,
        contactPhone: data.contactPhone,
      })
      .returning({ id: schema.scholarships.id });
    return { ok: true, applicationId: `SCH-${app.id}` };
  });

export const getMyScholarshipsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.number() }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    return db.select().from(schema.scholarships).where(eq(schema.scholarships.userId, data.userId)).orderBy(desc(schema.scholarships.createdAt));
  });
