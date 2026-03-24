// app/admin/exams/components/tabs/OverviewTab.tsx
import { ExamTemplate } from "../../types";
import { 
  FileText, 
  Clock, 
  Users, 
  Calendar, 
  Tag, 
  Award, 
  TrendingUp,
  CheckCircle,
  Edit,
  Archive
} from "lucide-react";

interface OverviewTabProps {
  template: ExamTemplate;
}

// Helper function để format số an toàn
const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString();
};

// Helper function để format ngày
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Chưa có";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateString;
  }
};

export function OverviewTab({ template }: OverviewTabProps) {
  const statusConfig = {
    published: { 
      icon: CheckCircle, 
      label: "Đã xuất bản", 
      color: "text-green-600", 
      bgColor: "bg-green-100" 
    },
    draft: { 
      icon: Edit, 
      label: "Bản nháp", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100" 
    },
    archived: { 
      icon: Archive, 
      label: "Đã lưu trữ", 
      color: "text-gray-500", 
      bgColor: "bg-gray-100" 
    },
  }[template.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            Thông tin cơ bản
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ID đề thi:</span>
              <span className="font-mono text-gray-800">{template.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Loại đề:</span>
              <span className="text-gray-800">
                {template.type === "full" ? "Full Test (83 câu)" : "Mini Test (30 câu)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Độ khó:</span>
              <span className="text-gray-800">
                {template.difficulty === "easy" ? "Dễ" : 
                 template.difficulty === "medium" ? "Trung bình" : "Khó"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            Thời gian
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ngày tạo:</span>
              <span className="text-gray-800">{formatDate(template.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Cập nhật lần cuối:</span>
              <span className="text-gray-800">{formatDate(template.updatedAt)}</span>
            </div>
            {template.publishedAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngày xuất bản:</span>
                <span className="text-gray-800">{formatDate(template.publishedAt)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Thời gian làm bài:</span>
              <span className="text-gray-800">{template.duration} phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Thống kê
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tổng số câu hỏi:</span>
              <span className="font-semibold text-gray-800">{template.totalQuestions || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Điểm trung bình:</span>
              <span className="font-semibold text-emerald-600">{template.avgScore || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Lượt thi:</span>
              <span className="font-semibold text-gray-800">{formatNumber(template.usageCount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tỉ lệ hoàn thành:</span>
              <span className="font-semibold text-gray-800">
                {template.usageCount ? `${Math.round((template.usageCount / 5000) * 100)}%` : "0%"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            Đánh giá
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Độ khó trung bình:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= (template.difficulty === "easy" ? 2 : template.difficulty === "medium" ? 3 : 4)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Độ phổ biến:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.min(5, Math.floor((template.usageCount || 0) / 500))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Hiệu quả học tập</span>
                <span>{template.avgScore ? `${Math.round((template.avgScore / 990) * 100)}%` : "0%"}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${template.avgScore ? (template.avgScore / 990) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-500" />
          Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {template.tags && template.tags.length > 0 ? (
            template.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 italic">Chưa có tags</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {template.description || "Chưa có mô tả"}
        </p>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Cấu trúc đề thi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Reading:</span>
            <span className="text-blue-800 font-medium">
              {template.type === "full" ? "75 câu" : "30 câu"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Writing:</span>
            <span className="text-blue-800 font-medium">
              {template.type === "full" ? "8 câu" : "0 câu"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Part 5:</span>
            <span className="text-blue-800 font-medium">40 câu</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Part 6:</span>
            <span className="text-blue-800 font-medium">16 câu</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Part 7:</span>
            <span className="text-blue-800 font-medium">27 câu</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Writing Parts:</span>
            <span className="text-blue-800 font-medium">3 phần</span>
          </div>
        </div>
      </div>
    </div>
  );
}