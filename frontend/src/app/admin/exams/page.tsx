// app/admin/exams/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Loader2 } from "lucide-react";
import { ExamStats } from "./components/ExamStats";
import { ExamFilters } from "./components/ExamFilters";
import { ExamCard } from "./components/ExamCard";
import { ExamListItem } from "./components/ExamListItem";
import { ExamDetailModal } from "./components/ExamDetailModal";
import { CreateExamModal } from "./components/CreateExamModal";
import { useExamTemplates } from "./hooks/useExamTemplates";
import { useExamActions } from "./hooks/useExamActions";

type ViewMode = "grid" | "list";
type ExamStatus = "all" | "published" | "draft" | "archived";
type ExamType = "all" | "full" | "mini";

export default function AdminExamsPage() {
  const { templates, loading, error, stats, refresh } = useExamTemplates();
  const { publishExam, duplicateExam } = useExamActions();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus>("all");
  const [selectedType, setSelectedType] = useState<ExamType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return difficulty;
    }
  };

  // Filter templates - THÊM KIỂM TRA templates là array
  const filteredTemplates = Array.isArray(templates) 
    ? templates.filter((template) => {
        const matchesSearch = template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || template.status === selectedStatus;
        const matchesType = selectedType === "all" || template.type === selectedType;
        return matchesSearch && matchesStatus && matchesType;
      })
    : [];

  const handlePublish = async (id: string) => {
    await publishExam(id);
    refresh();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateExam(id);
    refresh();
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Không thể tải dữ liệu</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đề thi</h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các mẫu đề thi TOEIC với cấu trúc linh hoạt
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo đề thi mới</span>
        </button>
      </div>

      {/* Stats */}
      <ExamStats stats={stats} />

      {/* Filters */}
      <ExamFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Templates Grid/List */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy đề thi</h3>
          <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc tạo đề thi mới</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
        >
          {filteredTemplates.map((template) => (
            viewMode === "grid" ? (
              <ExamCard
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
                onDuplicate={handleDuplicate}
                onPublish={template.status === "draft" ? handlePublish : undefined}
                getDifficultyColor={getDifficultyColor}
                getDifficultyLabel={getDifficultyLabel}
              />
            ) : (
              <ExamListItem
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
                onDuplicate={handleDuplicate}
                onPublish={template.status === "draft" ? handlePublish : undefined}
                getDifficultyColor={getDifficultyColor}
                getDifficultyLabel={getDifficultyLabel}
              />
            )
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedTemplate && (
          <ExamDetailModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onRefresh={refresh}
            getDifficultyColor={getDifficultyColor}
            getDifficultyLabel={getDifficultyLabel}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateExamModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              refresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}