// app/student/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  ClipboardCheck,
  FileText,
  Award,
  User,
  LogOut,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Home,
  Settings,
  HelpCircle,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/User/Footer";
import ThemeToggle from "@/components/User/ThemeToggle";
import { getStoredUserProfile } from "@/lib/auth-session";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = getStoredUserProfile();
      setAvatarUrl(storedUser?.avatarUrl || "");
    }
  }, [isAuthenticated]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showExamModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showExamModal]);

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/student/dashboard",
    },
    {
      icon: BookOpen,
      label: "Luyện đọc",
      href: "/student/reading",
    },
    {
      icon: PenTool,
      label: "Luyện viết",
      href: "/student/writing",
    },
    {
      icon: FileText,
      label: "Kiểm tra nhanh",
      href: "/student/mock-test",
    },
    {
      icon: ClipboardCheck,
      label: "Thi thử",
      href: "/student/practicetest",
    },
    {
      icon: Award,
      label: "Đăng ký thi chứng chỉ",
      href: "#",
      onClick: () => setShowExamModal(true),
    },
  ];

  const handleRegisterExam = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowExamModal(false);
    setShowSuccessToast(true);
    
    // Auto hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  if (isLoading) {
    return (
      <div className="student-theme min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="student-theme min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-white shadow-sm transition-colors dark:border-[#334067] dark:bg-[#18223b]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
            {/* Logo */}
            <div className="flex flex-none items-center">
              <Link href="/student/dashboard" className="flex items-center">
                <div className="relative h-10 w-[150px] sm:w-[164px] lg:w-[176px]">
                  <Image
                    src="/logo/logo_website.svg"
                    alt="TOEIC Master"
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 164px, 176px"
                    className="object-contain object-left dark:hidden"
                    priority
                  />
                  <Image
                    src="/logo/logo_website_dark.svg"
                    alt="TOEIC Master"
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 164px, 176px"
                    className="hidden object-contain object-left dark:block"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden min-w-0 flex-1 md:block">
              <nav className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-1 lg:gap-1.5">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.label}
                        onClick={item.onClick || (() => router.push(item.href))}
                        className={`group flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition-all duration-200 lg:px-3 lg:text-sm ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-[#263154] dark:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-current/80 transition-colors group-hover:text-current" />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-none items-center gap-1.5 lg:gap-2">
              <ThemeToggle />

              {/* Search Button */}
              <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-[#334067] dark:bg-[#202a45] dark:text-slate-400 dark:hover:border-[#42517e] dark:hover:text-white xl:flex">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-[#334067] dark:bg-[#202a45] dark:text-slate-400 dark:hover:border-[#42517e] dark:hover:text-white xl:flex">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-colors hover:border-blue-200 hover:bg-slate-50 dark:border-[#334067] dark:bg-[#202a45] dark:hover:border-[#42517e] dark:hover:bg-[#263154]"
                >
                  <img
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3b82f6&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3b82f6&color=fff`;
                    }}
                  />
                  <ChevronDown className="hidden h-4 w-4 text-gray-400 dark:text-slate-400 xl:block" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-lg dark:border-[#334067] dark:bg-[#202a45]">
                      <div className="border-b border-gray-100 px-4 py-3 dark:border-[#334067]">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.name}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <Link
                        href="/student/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-[#263154]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        href="/student/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-[#263154]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-[#263154]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Trợ giúp
                      </Link>
                      <div className="mt-2 border-t border-gray-100 pt-2 dark:border-[#334067]">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-400 shadow-sm hover:text-gray-600 dark:border-[#334067] dark:bg-[#202a45] dark:text-slate-400 dark:hover:text-white md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-40 bg-white shadow-lg dark:bg-[#18223b] md:hidden">
            <nav className="p-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        router.push(item.href);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-[#263154] dark:text-[#FBFB24]"
                        : "text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-[#202a45]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Exam Registration Modal - Fixed Positioning */}
      <AnimatePresence>
        {showExamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExamModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3, damping: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#202a45]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Đăng ký thi chứng chỉ
                  </h3>
                  <button
                    onClick={() => setShowExamModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Xác nhận đăng ký thi
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Bạn có chắc chắn muốn đăng ký tham gia kỳ thi chứng chỉ?
                  </p>
                </div>

                {/* User Information */}
                <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-[#263154] dark:to-[#202a45]">
                  <h5 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-slate-100">
                    <User className="w-4 h-4 text-blue-600" />
                    Thông tin thí sinh
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Họ và tên:</span>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 mb-1">
                        Lưu ý quan trọng:
                      </p>
                      <p className="text-xs text-amber-700">
                        Sau khi đăng ký, bạn sẽ nhận được thông tin chi tiết về lịch thi qua email. 
                        Vui lòng kiểm tra email thường xuyên để không bỏ lỡ thông báo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-[#334067] dark:bg-[#263154]">
                <button
                  onClick={() => setShowExamModal(false)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-[#42517e] dark:text-slate-200 dark:hover:bg-[#2b365c]"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleRegisterExam}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </div>
                  ) : (
                    "Xác nhận đăng ký"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="min-w-[320px] rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-xl dark:bg-[#202a45]">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">
                    Đăng ký thành công!
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Lịch thi sẽ được thông báo qua email và trong trang hồ sơ của bạn
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                    <Mail className="w-3 h-3" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessToast(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Quick Actions */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow">
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
      <Footer />
    </div>
  );
}
