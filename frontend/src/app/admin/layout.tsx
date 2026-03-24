// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Award,
  Settings,
  LogOut,
  Leaf,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  Database,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !["admin", "superadmin", "org_admin"].includes(user.role)) {
        router.push("/student/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/admin/dashboard",
      description: "Thống kê hệ thống",
      permission: "dashboard.view",
    },
    {
      icon: Users,
      label: "Quản lý người dùng",
      href: "/admin/users",
      description: "Quản lý học viên",
      permission: "users.read",
    },
    {
      icon: BookOpen,
      label: "Quản lý câu hỏi",
      href: "/admin/questions",
      description: "Thêm/sửa câu hỏi",
      permission: "questions.manage",
    },
    {
      icon: FileText,
      label: "Quản lý đề thi",
      href: "/admin/exams",
      description: "Tạo đề thi",
      permission: "exam_templates.manage",
    },
    {
      icon: Award,
      label: "Cấp chứng chỉ",
      href: "/admin/certificates",
      description: "Cấp và xác thực",
      permission: "credentials.manage",
    },
    {
      icon: BarChart3,
      label: "Phân tích",
      href: "/admin/analytics",
      description: "Báo cáo chi tiết",
      permission: "audit.view",
    },
    {
      icon: Settings,
      label: "Cấu hình hệ thống",
      href: "/admin/settings",
      description: "Cài đặt hệ thống",
      permission: "settings.manage",
    },
  ].filter(item => {
    // 1. Superadmin luôn thấy tất cả
    if (user?.role === "superadmin") return true;
    
    // 2. Nếu không có yêu cầu permission cụ thể thì hiện
    if (!item.permission) return true;
    
    // 3. Kiểm tra permission từ mảng permissions phẳng (nếu có)
    if (user?.permissions?.includes(item.permission)) return true;
    
    // 4. Kiểm tra permission từ mảng roles (nếu BE trả về lồng nhau)
    const hasRolePermission = (user as any)?.roles?.some((role: any) => 
      role.permissions?.some((p: any) => p.code === item.permission)
    );
    
    return hasRolePermission;
  });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !["admin", "superadmin", "org_admin"].includes(user?.role || "")) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-emerald-600" />
      </button>

      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-emerald-800 to-teal-800 shadow-2xl z-40 ${
          mobileMenuOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-emerald-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-white font-bold text-xl">EduChain</div>
                  <div className="text-emerald-300 text-xs">Admin Panel</div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-emerald-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user?.name}</p>
                  <p className="text-emerald-300 text-xs truncate">Quản trị viên</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-emerald-100 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <p className="text-xs text-emerald-300/70 truncate">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-emerald-700/50 space-y-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
              {!sidebarCollapsed && <span className="text-sm">Thu gọn</span>}
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-sm">Đăng xuất</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <div className="min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {menuItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">
                    {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'org_admin' ? 'Org Admin' : 'Admin'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}