import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BarChart3, Settings, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get attendance today
  const { data: todayAttendance } = useQuery({
    queryKey: ["/api/attendance/today"],
    enabled: !!user,
  });

  // Get attendance stats
  const { data: attendanceStats } = useQuery({
    queryKey: ["/api/attendance/stats"],
    enabled: !!user,
  });

  // Get users count (admin only)
  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  // Check in mutation with geolocation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Trình duyệt không hỗ trợ định vị"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const result = await apiRequest("/api/attendance/checkin", {
                method: "POST",
                body: JSON.stringify({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  notes: "",
                }),
                headers: { "Content-Type": "application/json" },
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(new Error("Không thể lấy vị trí. Vui lòng bật định vị."));
          }
        );
      });
    },
    onSuccess: (response: any) => {
      toast({
        title: "Thành công",
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi chấm công",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check out mutation
  const checkOutMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Trình duyệt không hỗ trợ định vị"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const result = await apiRequest("/api/attendance/checkout", {
                method: "POST",
                body: JSON.stringify({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  notes: "",
                }),
                headers: { "Content-Type": "application/json" },
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(new Error("Không thể lấy vị trí. Vui lòng bật định vị."));
          }
        );
      });
    },
    onSuccess: (response: any) => {
      toast({
        title: "Thành công",
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi chấm công",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const canCheckIn = !todayAttendance?.data;
  const canCheckOut = todayAttendance?.data && !todayAttendance?.data.checkOutTime;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-tanpopo-green" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Chào mừng {user?.fullName} ({user?.role})
          </p>
        </div>

        {/* Attendance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Chấm công hôm nay
            </CardTitle>
            <CardDescription>
              Thời gian làm việc - {formatDate(new Date().toISOString())}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAttendance?.data ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Vào:</span>
                  <Badge variant="outline" data-testid="badge-checkin-time">
                    {formatTime(todayAttendance.data.checkInTime)}
                  </Badge>
                </div>
                {todayAttendance.data.checkOutTime ? (
                  <div className="flex items-center justify-between">
                    <span>Ra:</span>
                    <Badge variant="outline" data-testid="badge-checkout-time">
                      {formatTime(todayAttendance.data.checkOutTime)}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>Ra:</span>
                    <Badge variant="secondary">Chưa chấm công ra</Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa chấm công hôm nay</p>
            )}

            <div className="flex gap-2">
              {canCheckIn && (
                <Button
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                  className="bg-tanpopo-green hover:bg-tanpopo-green/90"
                  data-testid="button-checkin"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {checkInMutation.isPending ? "Đang chấm công..." : "Chấm công vào"}
                </Button>
              )}
              
              {canCheckOut && (
                <Button
                  onClick={() => checkOutMutation.mutate()}
                  disabled={checkOutMutation.isPending}
                  variant="outline"
                  data-testid="button-checkout"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {checkOutMutation.isPending ? "Đang chấm công..." : "Chấm công ra"}
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>📍 Bạn cần ở trong phạm vi 200m từ trường để chấm công</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {user?.role === "admin" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-users">
                  {usersData?.data?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Đang hoạt động</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ngày làm việc</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-work-days">
                {attendanceStats?.data?.presentDays || 0}
              </div>
              <p className="text-xs text-muted-foreground">Tổng số ngày</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giờ trung bình</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-average-hours">
                {attendanceStats?.data?.averageHours?.toFixed(1) || "0.0"}
              </div>
              <p className="text-xs text-muted-foreground">Giờ/ngày</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {user?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quản lý nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                <Button variant="outline" size="sm" data-testid="button-manage-users">
                  Quản lý người dùng
                </Button>
                <Button variant="outline" size="sm" data-testid="button-attendance-reports">
                  Báo cáo chấm công
                </Button>
                <Button variant="outline" size="sm" data-testid="button-homepage-content">
                  Quản lý trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}