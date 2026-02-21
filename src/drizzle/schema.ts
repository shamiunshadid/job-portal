import { relations } from "drizzle-orm";
import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  year,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: mysqlEnum("role", ["admin", "applicant", "employer"]).default(
    "applicant"
  ),
  phoneNumber: varchar("phone_numbar", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAgent: text("user_agent").notNull(),
  ip: varchar("ip", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


// creating new schema for employers
export const employers = mysqlTable("employers", {
  id: int("id").primaryKey().references(()=> users.id, {onDelete: "cascade"}),

  name: varchar("name", {length: 255}),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  bannerImageUrl: text("banner_image_url"),
  organizationType: varchar("organization_type", {length: 255}),
  teamSize: varchar("team_size", {length: 50}),
  yearOfEstablishment: year("year_of_establishment"),
  websiteUrl: varchar("website_url", {length: 255}),
  location: varchar("location", {length: 255}),

  createdAt: timestamp("created_at", {mode: "string"}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", {mode: "string"}),
});



// creating schema for applicants
export const applicants = mysqlTable("applicants", {
  id: int("id").primaryKey().references(()=> users.id, {onDelete: "cascade"}),
  biography: text("biography"),
  dateOfBirth: datetime("date_of_birth"),
  nationality: varchar("nationality", {length: 100}),

  maritalStatus: mysqlEnum("marital_status", ["single", "married", "divorced"]),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  education: mysqlEnum("education", ["none", "high school", "undergradute", "masters", "phd"]),

  experience: text("experience"),
  websiteUrl: varchar("website_url", {length: 255}),
  location: varchar("location", {length: 255}),

  createdAt: timestamp("created_at", {mode: "string"}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", {mode: "string"}),
});


// relationship schemas

export const userRelations = relations(users, ({one, many}) =>  ({
  employers: one(employers, {
    fields: [users.id],
    references: [employers.id]
  }),

  applicants: one(applicants, {
    fields: [users.id],
    references: [applicants.id]
  }),

  sessions: many(sessions),
}));


// relationship with sessions
export const sessionsRelations = relations(sessions, ({one})=>({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));