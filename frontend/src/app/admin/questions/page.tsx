// app/admin/questions/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  FileText,
  Layers,
} from "lucide-react";

interface Question {
  id: number;
  type: "reading" | "writing";
  part: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  skill: string;
  usageCount: number;
  successRate: number;
}

export default function AdminQuestionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPart, setSelectedPart] = useState("all");

  const [questions] = useState<Question[]>([
    {
      id: 1,
      type: "reading",
      part: "Part 5",
      content: "The company's new policy was _____ by all employees.",
      options: ["accepted", "accepting", "to accept", "acceptance"],
      correctAnswer: "accepted",
      difficulty: "easy",
      skill: "Grammar",
      usageCount: 234,
      successRate: 78,
    },
    {
      id: 2,
      type: "reading",
      part: "Part 6",
      content: "______ the weather was bad, we decided to continue the trip.",
      options: ["Although", "Because", "Despite", "However"],
      correctAnswer: "Although",
      difficulty: "medium",
      skill: "Conjunction",
      usageCount: 189,
      successRate: 65,
    },
    {
      id: 3,
      type: "writing",
      part: "Part 1",
      content: "Describe the picture showing a business meeting.",
      correctAnswer: "The executives are discussing the annual report in the conference room.",
      difficulty: "medium",
      skill: "Description",
      usageCount: 156,
      successRate: 72,
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý câu hỏi</h1>
          <p className="text-gray-600">Thêm, sửa, xóa câu hỏi cho các phần thi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          <span>Thêm câu hỏi</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">2,345</p>
              <p className="text-sm text-gray-500">Tổng câu hỏi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">1,234</p>
              <p className="text-sm text-gray-500">Reading</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">1,111</p>
              <p className="text-sm text-gray-500">Writing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-500">Bộ đề</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">Tất cả loại</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
          </select>
          <select
            value={selectedPart}
            onChange={(e) => setSelectedPart(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">Tất cả Part</option>
            <option value="part5">Part 5</option>
            <option value="part6">Part 6</option>
            <option value="part7">Part 7</option>
            <option value="writing1">Writing Part 1</option>
            <option value="writing2">Writing Part 2</option>
            <option value="writing3">Writing Part 3</option>
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {questions.map((question, idx) => (
          <motion.div
            key={question.id}
            variants={item}
            className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${question.type === "reading" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                  {question.type === "reading" ? "Reading" : "Writing"} - {question.part}
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty === "easy" ? "Dễ" : question.difficulty === "medium" ? "Trung bình" : "Khó"}
                </div>
                <div className="text-xs text-gray-500">{question.skill}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-blue-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <p className="text-gray-800 mb-4">{question.content}</p>

            {question.options && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {question.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-2 rounded-lg text-sm ${
                      option === question.correctAnswer
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-gray-50 border border-gray-200 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}. {option}
                  </div>
                ))}
              </div>
            )}

            {question.type === "writing" && (
              <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-emerald-700 mb-1">Đáp án mẫu:</p>
                <p className="text-sm text-emerald-800">{question.correctAnswer}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Sử dụng: {question.usageCount} lần</span>
                <span>Tỉ lệ đúng: {question.successRate}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    style={{ width: `${question.successRate}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}