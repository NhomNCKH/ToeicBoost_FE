// app/admin/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Users,
  Award,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Database,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      icon: Users,
      label: "Tổng học viên",
      value: "1,234",
      change: "+12%",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      label: "Chứng chỉ đã cấp",
      value: "856",
      change: "+23%",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: BookOpen,
      label: "Câu hỏi",
      value: "2,345",
      change: "+8%",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FileText,
      label: "Đề thi",
      value: "24",
      change: "+2",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@email.com", joined: "2024-03-15", status: "active" },
    { id: 2, name: "Trần Thị B", email: "tranthib@email.com", joined: "2024-03-14", status: "active" },
    { id: 3, name: "Lê Văn C", email: "levanc@email.com", joined: "2024-03-13", status: "inactive" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@email.com", joined: "2024-03-12", status: "active" },
  ];

  const recentCertificates = [
    { id: "CERT-001", student: "Nguyễn Văn A", score: 950, date: "2024-03-15", status: "verified" },
    { id: "CERT-002", student: "Trần Thị B", score: 850, date: "2024-03-14", status: "pending" },
    { id: "CERT-003", student: "Lê Văn C", score: 990, date: "2024-03-13", status: "verified" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Xin chào, {user?.name || "Admin"}!
            </h1>
            <p className="text-emerald-100">
              Chào mừng bạn quay trở lại. Dưới đây là tổng quan hệ thống hôm nay.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">24/03/2024</div>
            <div className="text-xs text-emerald-100">Hôm nay</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-emerald-600 font-medium bg-white px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Học viên mới
            </h2>
            <button className="text-emerald-600 text-sm hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{user.joined}</span>
                  <div className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Certificates */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Chứng chỉ gần đây
            </h2>
            <button className="text-emerald-600 text-sm hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {recentCertificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{cert.student}</p>
                  <p className="text-sm text-gray-500">{cert.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-600">{cert.score}</span>
                  {cert.status === "verified" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Blockchain Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Block height</span>
              <span className="font-mono font-bold text-emerald-600">#1,234,567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending transactions</span>
              <span className="font-mono font-bold text-blue-600">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network hash rate</span>
              <span className="font-mono font-bold text-purple-600">125.4 MH/s</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Hoạt động hôm nay</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Bài tập đã làm</span>
              <span className="font-bold text-gray-800">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Người dùng hoạt động</span>
              <span className="font-bold text-gray-800">567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đề thi đã hoàn thành</span>
              <span className="font-bold text-gray-800">89</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Lịch trình</h3>
          </div>
          <div className="space-y-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Đợt cấp chứng chỉ</p>
              <p className="text-xs text-yellow-600">25/03/2024 - 15:00</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Bảo trì hệ thống</p>
              <p className="text-xs text-blue-600">30/03/2024 - 02:00</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}