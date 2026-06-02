import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// SQLite mirror of schema.pg.ts (used for local development).
// Same table + column names so the application query code is identical.

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("member").notNull(),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const matrimonyProfiles = sqliteTable("matrimony_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  profileId: text("profile_id").notNull().unique(),
  gender: text("gender").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  height: text("height"),
  religion: text("religion"),
  rasi: text("rasi"),
  star: text("star"),
  gotram: text("gotram"),
  education: text("education"),
  profession: text("profession"),
  income: text("income"),
  location: text("location"),
  about: text("about"),
  expectations: text("expectations"),
  photoUrl: text("photo_url"),
  status: text("status").default("pending").notNull(),
  aiMatchData: text("ai_match_data", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  area: text("area"),
  profession: text("profession"),
  phone: text("phone"),
  email: text("email"),
  membershipNumber: text("membership_number"),
  status: text("status").default("active").notNull(),
  joinedAt: integer("joined_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  venue: text("venue"),
  imageUrl: text("image_url"),
  status: text("status").default("upcoming").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const eventRegistrations = sqliteTable("event_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const scholarships = sqliteTable("scholarships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  studentName: text("student_name").notNull(),
  school: text("school"),
  marks: text("marks"),
  annualIncome: text("annual_income"),
  category: text("category"),
  contactPhone: text("contact_phone"),
  status: text("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  documents: text("documents", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});
