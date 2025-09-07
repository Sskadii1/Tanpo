import React from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import logoPath from "@assets/Artboard 2_1755662279875.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => 
      apiRequest("/api/auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      localStorage.removeItem("user");
      toast({
        title: "Thành công",
        description: "Đăng xuất thành công",
      });
      setLocation("/admin/login");
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Có lỗi khi đăng xuất",
        variant: "destructive",
      });
    },
  });

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
      roles: ["admin", "manager", "staff"],
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Báo cáo chấm công",
      href: "/admin/attendance",
      icon: BarChart3,
      roles: ["admin", "manager"],
    },
    {
      title: "Quản lý trang chủ",
      href: "/admin/homepage",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || "")
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "manager":
        return "bg-blue-500";
      case "staff":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "staff":
        return "Nhân viên";
      default:
        return role;
    }
  };

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-testid="button-menu-toggle"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b">
            <img 
              src={logoPath} 
              alt="Tanpopo Academy" 
              className="w-10 h-10 object-cover rounded-full"
            />
            <div>
              <h1 className="font-bold text-tanpopo-green">Tanpopo</h1>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tanpopo-green/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-tanpopo-green">
                  {user.fullName?.charAt(0) || user.username?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" data-testid="text-user-name">
                  {user.fullName || user.username}
                </p>
                <Badge 
                  className={`${getRoleBadgeColor(user.role)} text-white text-xs`}
                  data-testid="badge-user-role"
                >
                  {getRoleText(user.role)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setLocation(item.href);
                        setSidebarOpen(false);
                      }}
                      data-testid={`button-nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}