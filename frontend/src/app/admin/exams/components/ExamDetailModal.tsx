// app/admin/exams/components/ExamDetailModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  XCircle, 
  Layout, 
  Layers, 
  Settings, 
  Eye, 
  Edit, 
  Archive, 
  CheckCircle, 
  Send, 
  Loader2,
  FileText,      // Thêm import này
  Clock,         // Thêm import này
  Users,         // Thêm import này
  Calendar       // Thêm import này
} from "lucide-react";
import { OverviewTab } from "./tabs/OverviewTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { RulesTab } from "./tabs/RulesTab";
import { PreviewTab } from "./tabs/PreviewTab";
import { ExamTemplate } from "../types";
import { useExamActions } from "../hooks/useExamActions";

interface ExamDetailModalProps {
  template: ExamTemplate;
  onClose: () => void;
  onRefresh: () => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

export function ExamDetailModal({
  template,
  onClose,
  onRefresh,
  getDifficultyColor,
  getDifficultyLabel,
}: ExamDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "rules" | "preview">("overview");
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const { publishExam, archiveExam, updateExam } = useExamActions();

  const statusConfig = {
    published: { icon: CheckCircle, label: "Đã xuất bản", color: "text-green-600", bgColor: "bg-green-50" },
    draft: { icon: Edit, label: "Bản nháp", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    archived: { icon: Archive, label: "Đã lưu trữ", color: "text-gray-500", bgColor: "bg-gray-50" },
  }[template.status];
  const StatusIcon = statusConfig.icon;

  const handleAutoFill = async () => {
    setAutoFillLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAutoFillLoading(false);
  };

  const handleValidate = async () => {
    setValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidating(false);
  };

  const handlePublish = async () => {
    await publishExam(template.id);
    onRefresh();
    onClose();
  };

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: Layout },
    { id: "sections", label: "Cấu trúc đề", icon: Layers },
    { id: "rules", label: "Quy tắc", icon: Settings },
    { id: "preview", label: "Xem trước", icon: Eye },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${statusConfig.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                  {getDifficultyLabel(template.difficulty)}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {template.type === "full" ? "Full Test" : "Mini Test"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{template.name}</h2>
              <p className="text-gray-500 mt-1">{template.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Stats - Đã thêm các icon cần thiết */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{template.totalQuestions} câu hỏi</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{template.duration} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{template.usageCount?.toLocaleString() || 0} lượt thi</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Cập nhật: {template.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewTab template={template} />}
          {activeTab === "sections" && (
            <SectionsTab
              template={template}
              onAutoFill={handleAutoFill}
              onAddSection={() => {}}
              onUpdateSection={() => {}}
              onReorderItems={() => {}}
              autoFillLoading={autoFillLoading}
            />
          )}
          {activeTab === "rules" && <RulesTab template={template} />}
          {activeTab === "preview" && (
            <PreviewTab
              template={template}
              onValidate={handleValidate}
              validating={validating}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Chỉnh sửa
          </button>
          {template.status === "draft" && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Xuất bản
            </button>
          )}
          {template.status === "published" && (
            <button
              onClick={() => archiveExam(template.id)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Lưu trữ
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}