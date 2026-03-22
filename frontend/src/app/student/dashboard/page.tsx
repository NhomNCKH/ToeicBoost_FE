// app/student/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PenTool,
  Mic,
  FileText,
  Award,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  ChevronRight,
  Sparkles,
  Shield,
  Star,
  Zap,
  Brain,
  Activity,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    readingProgress: 65,
    writingProgress: 45,
    speakingProgress: 30,
    totalHours: 24,
    totalLessons: 48,
    streak: 7,
    toeicScore: 650,
    rank: 1250,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: "reading",
      title: "Part 7: Reading Comprehension",
      score: 85,
      date: "Hôm nay",
      time: "10:30 AM",
    },
    {
      id: 2,
      type: "writing",
      title: "Part 2: Respond to a Request",
      score: 78,
      date: "Hôm qua",
      time: "2:15 PM",
    },
    {
      id: 3,
      type: "mock-test",
      title: "TOEIC Full Test 1",
      score: 650,
      date: "2 ngày trước",
      time: "9:00 AM",
    },
  ]);

  const [recommendations] = useState([
    {
      title: "Từ vựng Part 5 - Ngữ pháp cơ bản",
      progress: 30,
      difficulty: "Dễ",
    },
    {
      title: "Đọc hiểu đoạn văn - Part 7",
      progress: 50,
      difficulty: "Trung bình",
    },
    {
      title: "Viết email phản hồi - Part 2",
      progress: 20,
      difficulty: "Trung bình",
    },
  ]);

  const [upcomingTests] = useState([
    {
      name: "Mini Test - Reading",
      date: "Thứ 4, 25/12/2024",
      time: "14:00",
    },
    {
      name: "Mock Test Full",
      date: "Chủ nhật, 29/12/2024",
      time: "09:00",
    },
  ]);

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
    <div className="p-6 lg:p-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Chào mừng trở lại</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {user?.name || "Học viên"}!
              </h1>
              <p className="text-emerald-100">
                Hôm nay bạn có {stats.totalLessons - stats.totalLessons * 0.65} bài học chưa hoàn thành.
                Hãy tiếp tục duy trì đà học tập nhé! 🔥
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.streak}</div>
              <div className="text-xs">Ngày liên tiếp</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Đã học
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalLessons}</div>
          <div className="text-sm text-gray-500">bài học</div>
          <div className="mt-2 text-xs text-emerald-600">{stats.totalHours} giờ học</div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Mục tiêu
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.toeicScore}</div>
          <div className="text-sm text-gray-500">điểm TOEIC</div>
          <div className="mt-2 text-xs text-emerald-600">Mục tiêu: 900+</div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Xếp hạng
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">#{stats.rank}</div>
          <div className="text-sm text-gray-500">trong 5,000+ học viên</div>
          <div className="mt-2 text-xs text-emerald-600">Top 25%</div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Độ chăm chỉ
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
          <div className="text-sm text-gray-500">ngày liên tiếp</div>
          <div className="mt-2 text-xs text-emerald-600">🔥 Đang nóng</div>
        </motion.div>
      </motion.div>

      {/* Skills Progress */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-500" />
            Tiến độ kỹ năng
          </h2>
          <Link href="/student/reading" className="text-emerald-600 text-sm hover:underline flex items-center gap-1">
            Xem chi tiết <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Đọc hiểu</span>
              <span className="text-sm text-emerald-600">{stats.readingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${stats.readingProgress}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Kỹ năng viết</span>
              <span className="text-sm text-emerald-600">{stats.writingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${stats.writingProgress}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Luyện nói AI</span>
              <span className="text-sm text-emerald-600">{stats.speakingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${stats.speakingProgress}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Hoạt động gần đây
            </h2>
            <Link href="/student/mock-test" className="text-emerald-600 text-sm hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    {activity.type === "reading" && <BookOpen className="w-5 h-5 text-emerald-500" />}
                    {activity.type === "writing" && <PenTool className="w-5 h-5 text-emerald-500" />}
                    {activity.type === "mock-test" && <FileText className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{activity.date}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">{activity.score}</div>
                  <div className="text-xs text-gray-500">
                    {activity.type === "mock-test" ? "điểm" : "%"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recommendations */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-800">Gợi ý học tập</h2>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 border border-emerald-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-2">{rec.title}</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="text-emerald-600">{rec.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${rec.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Độ khó: {rec.difficulty}</span>
                    <button className="text-emerald-600 text-xs font-medium hover:underline">
                      Học ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Tests */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-800">Lịch thi thử</h2>
            </div>
            <div className="space-y-3">
              {upcomingTests.map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{test.name}</p>
                    <p className="text-xs text-gray-500">{test.date} • {test.time}</p>
                  </div>
                  <button className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">
                    Đăng ký
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Badge */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              <div>
                <p className="font-bold text-gray-800">Thành tích nổi bật</p>
                <p className="text-xs text-gray-600">Đã hoàn thành 7 ngày liên tiếp</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-amber-300 rounded-full">
                  <div className="w-full h-full bg-amber-500 rounded-full" />
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-2">+50 điểm thưởng</p>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Link href="/student/reading" className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all group border border-emerald-100">
          <BookOpen className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-gray-800">Luyện đọc</p>
          <p className="text-xs text-gray-500">48 bài học</p>
        </Link>
        <Link href="/student/writing" className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all group border border-emerald-100">
          <PenTool className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-gray-800">Luyện viết</p>
          <p className="text-xs text-gray-500">32 bài học</p>
        </Link>
        <Link href="/student/speaking" className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all group border border-emerald-100">
          <Mic className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-gray-800">Luyện nói AI</p>
          <p className="text-xs text-gray-500">24 bài học</p>
        </Link>
        <Link href="/student/mock-test" className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all group border border-emerald-100">
          <FileText className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-gray-800">Thi thử</p>
          <p className="text-xs text-gray-500">12 đề thi</p>
        </Link>
      </motion.div>
    </div>
  );
}