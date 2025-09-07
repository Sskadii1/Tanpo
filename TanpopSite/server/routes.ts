import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { 
  insertRegistrationSchema, 
  insertContactMessageSchema,
  insertUserSchema,
  loginSchema,
  checkInSchema,
  checkOutSchema,
  insertHomepageContentSchema
} from "@shared/schema";
import { z } from "zod";

// Extend Express session type
declare module 'express-session' {
  export interface SessionData {
    userId?: string;
  }
}

// Simple session management (in production, use proper session handling)
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  next();
};

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// Middleware to check manager or admin role
const requireManager = (req: any, res: any, next: any) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
    return res.status(403).json({ success: false, message: "Manager or Admin access required" });
  }
  next();
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
           Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// School location (example coordinates - replace with actual coordinates)
const SCHOOL_LOCATION = {
  latitude: 10.7769, // Ho Chi Minh City example
  longitude: 106.7009
};
const ALLOWED_DISTANCE = 200; // 200 meters

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: 'tanpopo-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware - check for logged in user
  app.use(async (req: any, res, next) => {
    if (req.session?.userId) {
      try {
        const user = await storage.getUser(req.session.userId);
        req.user = user;
      } catch (error) {
        console.error('Error loading user from session:', error);
      }
    }
    next();
  });

  // ================================
  // AUTHENTICATION ROUTES
  // ================================
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.verifyPassword(username, password);
      
      if (user) {
        req.session.userId = user.id;
        res.json({ 
          success: true, 
          message: "Đăng nhập thành công",
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            email: user.email
          }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Tên đăng nhập hoặc mật khẩu không đúng" 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.errors 
        });
      } else {
        console.error("Login error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Lỗi hệ thống" 
        });
      }
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        res.status(500).json({ success: false, message: "Lỗi đăng xuất" });
      } else {
        res.json({ success: true, message: "Đăng xuất thành công" });
      }
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, (req: any, res) => {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        fullName: req.user.fullName,
        email: req.user.email
      }
    });
  });

  // ================================
  // USER MANAGEMENT ROUTES (ADMIN ONLY)
  // ================================
  
  // Create new user (Admin only)
  app.post("/api/admin/users", requireAdmin, async (req: any, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      const newUser = await storage.createUser(userData);
      res.json({ 
        success: true, 
        message: "Tạo tài khoản thành công",
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          fullName: newUser.fullName,
          email: newUser.email
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.errors 
        });
      } else {
        console.error("Create user error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Lỗi tạo tài khoản" 
        });
      }
    }
  });

  // Get all users (Admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt
      }));
      res.json({ success: true, data: usersWithoutPasswords });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy danh sách người dùng" 
      });
    }
  });

  // Delete user (Admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ success: true, message: "Xóa tài khoản thành công" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi xóa tài khoản" 
      });
    }
  });

  // ================================
  // ATTENDANCE ROUTES
  // ================================

  // Check in
  app.post("/api/attendance/checkin", requireAuth, async (req: any, res) => {
    try {
      const { latitude, longitude, notes } = checkInSchema.parse(req.body);
      
      // Check if user is within allowed distance
      const distance = calculateDistance(
        SCHOOL_LOCATION.latitude, 
        SCHOOL_LOCATION.longitude,
        latitude, 
        longitude
      );

      if (distance > ALLOWED_DISTANCE) {
        return res.status(400).json({
          success: false,
          message: `Bạn phải ở trong phạm vi ${ALLOWED_DISTANCE}m từ trường để chấm công. Khoảng cách hiện tại: ${Math.round(distance)}m`
        });
      }

      // Check if already checked in today
      const existingRecord = await storage.getTodayAttendance(req.user.id);
      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã chấm công vào hôm nay rồi"
        });
      }

      const record = await storage.checkIn(req.user.id, { latitude, longitude, notes });
      res.json({
        success: true,
        message: "Chấm công vào thành công",
        record: {
          id: record.id,
          checkInTime: record.checkInTime,
          workDate: record.workDate
        }
      });
    } catch (error) {
      console.error("Check in error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi chấm công" 
      });
    }
  });

  // Check out
  app.post("/api/attendance/checkout", requireAuth, async (req: any, res) => {
    try {
      const { latitude, longitude, notes } = req.body;
      
      // Check distance
      const distance = calculateDistance(
        SCHOOL_LOCATION.latitude, 
        SCHOOL_LOCATION.longitude,
        latitude, 
        longitude
      );

      if (distance > ALLOWED_DISTANCE) {
        return res.status(400).json({
          success: false,
          message: `Bạn phải ở trong phạm vi ${ALLOWED_DISTANCE}m từ trường để chấm công ra. Khoảng cách hiện tại: ${Math.round(distance)}m`
        });
      }

      // Get today's attendance record
      const existingRecord = await storage.getTodayAttendance(req.user.id);
      if (!existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Bạn chưa chấm công vào hôm nay"
        });
      }

      if (existingRecord.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã chấm công ra hôm nay rồi"
        });
      }

      const record = await storage.checkOut(req.user.id, existingRecord.id, { 
        recordId: existingRecord.id,
        latitude, 
        longitude, 
        notes 
      });
      
      res.json({
        success: true,
        message: "Chấm công ra thành công",
        record: {
          id: record.id,
          checkInTime: record.checkInTime,
          checkOutTime: record.checkOutTime,
          workDate: record.workDate
        }
      });
    } catch (error) {
      console.error("Check out error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi chấm công ra" 
      });
    }
  });

  // Get today's attendance status
  app.get("/api/attendance/today", requireAuth, async (req: any, res) => {
    try {
      const record = await storage.getTodayAttendance(req.user.id);
      res.json({ 
        success: true, 
        data: record || null 
      });
    } catch (error) {
      console.error("Get today attendance error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy thông tin chấm công hôm nay" 
      });
    }
  });

  // Get user's attendance records
  app.get("/api/attendance/records", requireAuth, async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      const records = await storage.getUserAttendanceRecords(
        req.user.id, 
        startDate as string, 
        endDate as string
      );
      res.json({ success: true, data: records });
    } catch (error) {
      console.error("Get attendance records error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy lịch sử chấm công" 
      });
    }
  });

  // Get attendance stats (Manager/Admin can see all, staff see only their own)
  app.get("/api/attendance/stats", requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.query;
      let targetUserId = req.user.id;

      // Admin can see all users' stats
      if (req.user.role === 'admin') {
        targetUserId = userId ? userId as string : undefined;
      }
      // Manager can see staff stats but not admin stats
      else if (req.user.role === 'manager') {
        if (userId) {
          const targetUser = await storage.getUser(userId as string);
          if (!targetUser || targetUser.role === 'admin') {
            return res.status(403).json({
              success: false,
              message: "Bạn không có quyền xem thông tin này"
            });
          }
          targetUserId = userId as string;
        }
      }
      // Staff can only see their own stats
      else {
        targetUserId = req.user.id;
      }

      const stats = await storage.getAttendanceStats(targetUserId);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Get attendance stats error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy thống kê chấm công" 
      });
    }
  });

  // Get all attendance records for management (Manager/Admin only)
  app.get("/api/admin/attendance", requireManager, async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      const records = await storage.getAllAttendanceRecords(
        startDate as string, 
        endDate as string
      );
      
      // Filter based on user role
      let filteredRecords = records;
      if (req.user.role === 'manager') {
        const staffUsers = await storage.getUsersByRole('staff');
        const staffIds = staffUsers.map(u => u.id);
        filteredRecords = records.filter(record => 
          record.userId === req.user.id || staffIds.includes(record.userId)
        );
      }
      
      res.json({ success: true, data: filteredRecords });
    } catch (error) {
      console.error("Get all attendance error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy dữ liệu chấm công" 
      });
    }
  });

  // ================================
  // HOMEPAGE CONTENT MANAGEMENT (ADMIN ONLY)
  // ================================
  
  // Get homepage content
  app.get("/api/homepage", async (req, res) => {
    try {
      const { section } = req.query;
      const content = await storage.getHomepageContent(section as string);
      res.json({ success: true, data: content });
    } catch (error) {
      console.error("Get homepage content error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi lấy nội dung trang chủ" 
      });
    }
  });

  // Update homepage content (Admin only)
  app.post("/api/admin/homepage", requireAdmin, async (req: any, res) => {
    try {
      const contentData = insertHomepageContentSchema.parse({
        ...req.body,
        updatedBy: req.user.id
      });
      const content = await storage.updateHomepageContent(contentData);
      res.json({ 
        success: true, 
        message: "Cập nhật nội dung thành công",
        data: content
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.errors 
        });
      } else {
        console.error("Update homepage content error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Lỗi cập nhật nội dung" 
        });
      }
    }
  });

  // ================================
  // ORIGINAL ROUTES (PUBLIC)
  // ================================
  // Registration endpoint for quick tour registration
  app.post("/api/registration", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.json({ 
        success: true, 
        message: "Registration submitted successfully",
        id: registration.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ 
        success: true, 
        message: "Contact message sent successfully",
        id: message.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      } else {
        console.error("Contact error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Admin endpoints to view submissions (for development/testing)
  app.get("/api/admin/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json({ success: true, data: registrations });
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContactMessages();
      res.json({ success: true, data: contacts });
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
