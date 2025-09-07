import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"), // admin, manager, staff
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdBy: varchar("created_by"), // ID of admin who created this user
});

export const attendanceRecords = pgTable("attendance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  checkInTime: timestamp("check_in_time").notNull(),
  checkOutTime: timestamp("check_out_time"),
  checkInLatitude: numeric("check_in_latitude", { precision: 10, scale: 8 }),
  checkInLongitude: numeric("check_in_longitude", { precision: 11, scale: 8 }),
  checkOutLatitude: numeric("check_out_latitude", { precision: 10, scale: 8 }),
  checkOutLongitude: numeric("check_out_longitude", { precision: 11, scale: 8 }),
  workDate: text("work_date").notNull(), // YYYY-MM-DD format
  notes: text("notes"),
});

export const homepageContent = pgTable("homepage_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(), // hero, programs, facilities, etc.
  contentKey: text("content_key").notNull(), // title, description, image_url, etc.
  contentValue: text("content_value").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedBy: varchar("updated_by").notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  childName: text("child_name"),
  childAge: text("child_age"),
  visitTime: text("visit_time"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được trống"),
  password: z.string().min(1, "Mật khẩu không được trống"),
});

// Attendance schemas
export const insertAttendanceSchema = createInsertSchema(attendanceRecords).omit({
  id: true,
});

export const checkInSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  notes: z.string().optional(),
});

export const checkOutSchema = z.object({
  recordId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  notes: z.string().optional(),
});

// Homepage content schemas
export const insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  parentName: true,
  phone: true,
  childName: true,
  childAge: true,
  visitTime: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type CheckInData = z.infer<typeof checkInSchema>;
export type CheckOutData = z.infer<typeof checkOutSchema>;

export type InsertHomepageContent = z.infer<typeof insertHomepageContentSchema>;
export type HomepageContent = typeof homepageContent.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
