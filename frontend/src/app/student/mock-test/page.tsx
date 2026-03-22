// app/student/mock-test/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Award,
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function MockTestPage() {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const mockTests = [
    {
      id: 1,
      name: "TOEIC Full Test 1",
      description: "Đề thi thử TOEIC chuẩn cấu trúc mới nhất",
      reading: 75,
      writing: 8,
      duration: 120,
      level: "Trung cấp",
      students: 1234,
      score: 650,
      difficulty: 3,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    },
    {
      id: 2,
      name: "TOEIC Full Test 2",
      description: "Đề thi thử với độ khó cao, phù hợp cho mục tiêu 800+",
      reading: 75,
      writing: 8,
      duration: 120,
      level: "Cao cấp",
      students: 892,
      score: 780,
      difficulty: 4,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    },
    {
      id: 3,
      name: "Mini Test - Reading",
      description: "Kiểm tra nhanh kỹ năng đọc",
      reading: 30,
      writing: 0,
      duration: 45,
      level: "Cơ bản",
      students: 2156,
      score: 85,
      difficulty: 2,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    },
    {
      id: 4,
      name: "Mini Test - Writing",
      description: "Kiểm tra nhanh kỹ năng viết",
      reading: 0,
      writing: 4,
      duration: 40,
      level: "Trung bình",
      students: 1543,
      score: 78,
      difficulty: 3,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
    },
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Thi thử TOEIC</h1>
        </div>
        <p className="text-gray-600">
          Làm quen với cấu trúc đề thi thật và đánh giá năng lực hiện tại
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">12</div>
          <div className="text-sm text-gray-600">Đề thi có sẵn</div>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">4</div>
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">650</div>
          <div className="text-sm text-gray-600">Điểm cao nhất</div>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">582</div>
          <div className="text-sm text-gray-600">Điểm trung bình</div>
        </motion.div>
      </motion.div>

      {/* Recommended Test */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-8 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">Đề thi được đề xuất</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">TOEIC Full Test 1</h2>
            <p className="text-emerald-100 mb-4">
              Dựa trên kết quả học tập, đề thi này phù hợp với trình độ hiện tại của bạn
            </p>
            <Link
              href="/student/mock-test/1"
              className="inline-flex items-center gap-2 px-6 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Bắt đầu thi
              <Play className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">120</div>
            <div className="text-sm text-emerald-100">phút</div>
          </div>
        </div>
      </motion.div>

      {/* Test List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid lg:grid-cols-2 gap-6 mb-8"
      >
        {mockTests.map((test) => (
          <motion.div
            key={test.id}
            variants={item}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-emerald-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedTest(test.id === selectedTest ? null : test.id)}
          >
            <div className="flex">
              <img
                src={test.image}
                alt={test.name}
                className="w-32 h-32 object-cover"
              />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{test.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{test.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < test.difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{test.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{test.students} học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{test.level}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-emerald-600 font-semibold">{test.score}</span>
                    <span className="text-gray-500"> điểm TB</span>
                  </div>
                  <button className="px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    Thi thử
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Content */}
            {selectedTest === test.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-100 p-4 bg-emerald-50"
              >
                <h4 className="font-medium text-gray-800 mb-2">Chi tiết đề thi</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reading:</span>
                    <span className="text-sm font-medium text-emerald-600">{test.reading} câu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Writing:</span>
                    <span className="text-sm font-medium text-emerald-600">{test.writing} câu</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Nên hoàn thành trong {test.duration} phút để mô phỏng thi thật</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Test Schedule */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-gray-800">Lịch thi thử theo lộ trình</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Tuần 1: Đánh giá năng lực</p>
              <p className="text-xs text-gray-500">Mini Test - Reading & Writing</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-emerald-600">Đã hoàn thành</p>
              <p className="text-xs text-gray-500">15/12/2024</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Tuần 4: Giữa khóa</p>
              <p className="text-xs text-gray-500">TOEIC Full Test 1</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-600">Sắp diễn ra</p>
              <p className="text-xs text-gray-500">29/12/2024</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}