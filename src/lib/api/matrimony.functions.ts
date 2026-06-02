import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { computeCompatibility } from "@/lib/matrimony-match";

// Re-export so existing imports from this module keep working.
export { computeCompatibility } from "@/lib/matrimony-match";

export const getMatrimonyProfilesFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      gender: z.string().optional(),
      religion: z.string().optional(),
      rasi: z.string().optional(),
      minAge: z.number().optional(),
      maxAge: z.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const filters = [eq(schema.matrimonyProfiles.status, data.status ?? "approved")];
    if (data.gender && data.gender !== "any") filters.push(eq(schema.matrimonyProfiles.gender, data.gender));
    if (data.religion && data.religion !== "any") filters.push(eq(schema.matrimonyProfiles.religion, data.religion));
    if (data.rasi && data.rasi !== "any") filters.push(eq(schema.matrimonyProfiles.rasi, data.rasi));
    if (data.minAge) filters.push(gte(schema.matrimonyProfiles.age, data.minAge));
    if (data.maxAge) filters.push(lte(schema.matrimonyProfiles.age, data.maxAge));
    let rows = await db.select().from(schema.matrimonyProfiles).where(and(...filters)).orderBy(desc(schema.matrimonyProfiles.createdAt));
    if (data.search) {
      const q = data.search.toLowerCase();
      rows = rows.filter((p: any) => `${p.name} ${p.location ?? ""} ${p.education ?? ""} ${p.profession ?? ""}`.toLowerCase().includes(q));
    }
    return rows;
  });

export const createMatrimonyProfileFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.number().optional(),
      gender: z.enum(["Male", "Female"]),
      name: z.string().min(2),
      age: z.number().min(18).max(60),
      height: z.string().optional(),
      religion: z.string().optional(),
      rasi: z.string().optional(),
      star: z.string().optional(),
      gotram: z.string().optional(),
      education: z.string().optional(),
      profession: z.string().optional(),
      income: z.string().optional(),
      location: z.string().optional(),
      about: z.string().optional(),
      expectations: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    const all = await db.select().from(schema.matrimonyProfiles);
    const profileId = `KNS-${1100 + all.length}`;
    const [profile] = await db
      .insert(schema.matrimonyProfiles)
      .values({ ...data, profileId, status: "pending" })
      .returning();
    return profile;
  });

export const updateProfileStatusFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number(), status: z.enum(["approved", "rejected", "pending"]) }))
  .handler(async ({ data }) => {
    const { db, schema } = await getDb();
    await db.update(schema.matrimonyProfiles).set({ status: data.status }).where(eq(schema.matrimonyProfiles.id, data.id));
    return { ok: true };
  });

const profileShape = z.object({
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  religion: z.string().optional(),
  rasi: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  location: z.string().optional(),
});

export const getAiCompatibilityFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ profileA: profileShape, profileB: profileShape }))
  .handler(async ({ data }) => {
    const { profileA, profileB } = data;
    const baseScore = computeCompatibility(profileA, profileB);

    const ruleBased = () => ({
      score: baseScore,
      summary: `${baseScore}% compatibility based on traditional matching criteria including religion, rasi, and age factors.`,
      details: [
        profileA.religion === profileB.religion ? "✓ Same religion" : "○ Different religion",
        profileA.rasi && profileB.rasi ? `Rasi: ${profileA.rasi} × ${profileB.rasi}` : "Rasi comparison not available",
        `Age difference: ${Math.abs(profileA.age - profileB.age)} years`,
      ],
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return ruleBased();

    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey });
      const prompt = `You are an expert Tamil community matrimony advisor with deep knowledge of traditional compatibility (rasi, jathagam) and modern factors (education, profession, location). Analyze these two profiles.

Profile A: ${profileA.name}, ${profileA.age} years, ${profileA.gender}
- Religion: ${profileA.religion ?? "Unknown"}, Rasi: ${profileA.rasi ?? "Unknown"}
- Education: ${profileA.education ?? "Unknown"}, Profession: ${profileA.profession ?? "Unknown"}, Location: ${profileA.location ?? "Unknown"}

Profile B: ${profileB.name}, ${profileB.age} years, ${profileB.gender}
- Religion: ${profileB.religion ?? "Unknown"}, Rasi: ${profileB.rasi ?? "Unknown"}
- Education: ${profileB.education ?? "Unknown"}, Profession: ${profileB.profession ?? "Unknown"}, Location: ${profileB.location ?? "Unknown"}

Respond ONLY with JSON: {"score": <0-100 integer>, "summary": "<2 sentences>", "details": ["<point1>", "<point2>", "<point3>"]}`;

      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.4,
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content ?? "";
      const parsed = JSON.parse(text);
      return {
        score: typeof parsed.score === "number" ? parsed.score : baseScore,
        summary: parsed.summary ?? ruleBased().summary,
        details: Array.isArray(parsed.details) ? parsed.details : ruleBased().details,
      };
    } catch {
      return ruleBased();
    }
  });
