import { 
  type User, 
  type InsertUser, 
  type Registration, 
  type InsertRegistration, 
  type ContactMessage, 
  type InsertContactMessage,
  type AttendanceRecord,
  type InsertAttendance,
  type CheckInData,
  type CheckOutData,
  type HomepageContent,
  type InsertHomepageContent
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Authentication
  verifyPassword(username: string, password: string): Promise<User | null>;

  // Attendance management
  checkIn(userId: string, data: CheckInData): Promise<AttendanceRecord>;
  checkOut(userId: string, recordId: string, data: CheckOutData): Promise<AttendanceRecord>;
  getTodayAttendance(userId: string): Promise<AttendanceRecord | undefined>;
  getUserAttendanceRecords(userId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]>;
  getAllAttendanceRecords(startDate?: string, endDate?: string): Promise<AttendanceRecord[]>;
  getAttendanceStats(userId?: string): Promise<{
    totalDays: number;
    presentDays: number;
    averageHours: number;
  }>;

  // Homepage content management
  getHomepageContent(section?: string): Promise<HomepageContent[]>;
  updateHomepageContent(content: InsertHomepageContent): Promise<HomepageContent>;
  deleteHomepageContent(id: string): Promise<void>;

  // Original methods
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getRegistrations(): Promise<Registration[]>;
  getContactMessages(): Promise<ContactMessage[]>;
}

import { db } from "./db";
import { users, registrations, contactMessages, attendanceRecords, homepageContent } from "@shared/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.update(users)
      .set({ isActive: false })
      .where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isActive, true));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users)
      .where(and(eq(users.role, role), eq(users.isActive, true)));
  }

  // Authentication
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password && user.isActive) {
      return user;
    }
    return null;
  }

  // Attendance management
  async checkIn(userId: string, data: CheckInData): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];
    const [record] = await db.insert(attendanceRecords).values({
      userId,
      checkInTime: new Date(),
      checkInLatitude: data.latitude.toString(),
      checkInLongitude: data.longitude.toString(),
      workDate: today,
      notes: data.notes,
    }).returning();
    return record;
  }

  async checkOut(userId: string, recordId: string, data: CheckOutData): Promise<AttendanceRecord> {
    const [record] = await db.update(attendanceRecords)
      .set({
        checkOutTime: new Date(),
        checkOutLatitude: data.latitude.toString(),
        checkOutLongitude: data.longitude.toString(),
        notes: data.notes,
      })
      .where(and(
        eq(attendanceRecords.id, recordId),
        eq(attendanceRecords.userId, userId)
      ))
      .returning();
    return record;
  }

  async getTodayAttendance(userId: string): Promise<AttendanceRecord | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const [record] = await db.select().from(attendanceRecords)
      .where(and(
        eq(attendanceRecords.userId, userId),
        eq(attendanceRecords.workDate, today)
      ));
    return record;
  }

  async getUserAttendanceRecords(userId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
    let query = db.select().from(attendanceRecords)
      .where(eq(attendanceRecords.userId, userId));

    if (startDate && endDate) {
      query = query.where(and(
        eq(attendanceRecords.userId, userId),
        gte(attendanceRecords.workDate, startDate),
        lte(attendanceRecords.workDate, endDate)
      ));
    }

    return await query.orderBy(desc(attendanceRecords.workDate));
  }

  async getAllAttendanceRecords(startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
    let query = db.select().from(attendanceRecords);

    if (startDate && endDate) {
      query = query.where(and(
        gte(attendanceRecords.workDate, startDate),
        lte(attendanceRecords.workDate, endDate)
      ));
    }

    return await query.orderBy(desc(attendanceRecords.workDate));
  }

  async getAttendanceStats(userId?: string): Promise<{
    totalDays: number;
    presentDays: number;
    averageHours: number;
  }> {
    let query = db.select().from(attendanceRecords);
    
    if (userId) {
      query = query.where(eq(attendanceRecords.userId, userId));
    }

    const records = await query;
    const totalDays = new Set(records.map(r => r.workDate)).size;
    const presentDays = records.filter(r => r.checkInTime && r.checkOutTime).length;
    
    const totalHours = records.reduce((sum, record) => {
      if (record.checkInTime && record.checkOutTime) {
        const hours = (record.checkOutTime.getTime() - record.checkInTime.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }
      return sum;
    }, 0);

    return {
      totalDays,
      presentDays,
      averageHours: presentDays > 0 ? totalHours / presentDays : 0,
    };
  }

  // Homepage content management
  async getHomepageContent(section?: string): Promise<HomepageContent[]> {
    let query = db.select().from(homepageContent);
    
    if (section) {
      query = query.where(eq(homepageContent.section, section));
    }

    return await query.orderBy(homepageContent.section, homepageContent.contentKey);
  }

  async updateHomepageContent(content: InsertHomepageContent): Promise<HomepageContent> {
    const existing = await db.select().from(homepageContent)
      .where(and(
        eq(homepageContent.section, content.section),
        eq(homepageContent.contentKey, content.contentKey)
      ));

    if (existing.length > 0) {
      const [updated] = await db.update(homepageContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(homepageContent.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(homepageContent)
        .values({ ...content, updatedAt: new Date() })
        .returning();
      return created;
    }
  }

  async deleteHomepageContent(id: string): Promise<void> {
    await db.delete(homepageContent).where(eq(homepageContent.id, id));
  }

  // Original methods
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db.insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations)
      .orderBy(desc(registrations.createdAt));
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();
