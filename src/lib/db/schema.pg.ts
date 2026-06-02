import { pgTable, serial, text, integer, timestamp, decimal, jsonb, varchar, boolean, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matrimonyProfiles = pgTable("matrimony_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  profileId: varchar("profile_id", { length: 20 }).notNull().unique(),
  gender: varchar("gender", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  height: varchar("height", { length: 20 }),
  religion: varchar("religion", { length: 50 }),
  rasi: varchar("rasi", { length: 50 }),
  star: varchar("star", { length: 50 }),
  gotram: varchar("gotram", { length: 100 }),
  education: text("education"),
  profession: varchar("profession", { length: 255 }),
  income: varchar("income", { length: 100 }),
  location: varchar("location", { length: 255 }),
  about: text("about"),
  expectations: text("expectations"),
  photoUrl: varchar("photo_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  aiMatchData: jsonb("ai_match_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  area: varchar("area", { length: 255 }),
  profession: varchar("profession", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  membershipNumber: varchar("membership_number", { length: 100 }),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  venue: varchar("venue", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("upcoming").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }),
  marks: decimal("marks", { precision: 5, scale: 2 }),
  annualIncome: decimal("annual_income", { precision: 12, scale: 2 }),
  category: varchar("category", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  adminNotes: text("admin_notes"),
  documents: jsonb("documents"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
