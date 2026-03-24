// app/admin/exams/components/ExamCard.tsx
import { motion } from "framer-motion";
import { 
  Eye, 
  Copy, 
  Send, 
  MoreVertical, 
  CheckCircle, 
  Edit, 
  Archive,
  FileText,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { ExamTemplate } from "../types";

interface ExamCardProps {
  template: ExamTemplate;
  onSelect: (template: ExamTemplate) => void;
  onDuplicate: (id: string) => void;
  onPublish?: (id: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ExamCard({
  template,
  onSelect,
  onDuplicate,
  onPublish,
  getDifficultyColor,
  getDifficultyLabel,
}: ExamCardProps) {
  const statusConfig = {
    published: { 
      icon: CheckCircle, 
      label: "Đã xuất bản", 
      color: "text-green-600", 
      bgColor: "bg-green-50" 
    },
    draft: { 
      icon: Edit, 
      label: "Bản nháp", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50" 
    },
    archived: { 
      icon: Archive, 
      label: "Đã lưu trữ", 
      color: "text-gray-500", 
      bgColor: "bg-gray-50" 
    },
  }[template.status];
  
  const StatusIcon = statusConfig.icon;

  const getStatusBarColor = () => {
    switch (template.status) {
      case "published": return "bg-green-500";
      case "draft": return "bg-yellow-500";
      case "archived": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Status bar */}
      <div className={`h-1 ${getStatusBarColor()}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(template.difficulty)}`}>
              {getDifficultyLabel(template.difficulty)}
            </span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{template.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{template.totalQuestions}</div>
            <div className="text-xs text-gray-500">Câu hỏi</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{template.duration}'</div>
            <div className="text-xs text-gray-500">Phút</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">{template.usageCount?.toLocaleString() || 0}</div>
            <div className="text-xs text-gray-500">Lượt thi</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onSelect(template)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Chi tiết</span>
          </button>
          <button
            onClick={() => onDuplicate(template.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Nhân bản</span>
          </button>
          {template.status === "draft" && onPublish && (
            <button
              onClick={() => onPublish(template.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Xuất bản</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}