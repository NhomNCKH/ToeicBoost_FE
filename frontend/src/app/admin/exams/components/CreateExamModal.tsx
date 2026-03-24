// app/admin/exams/components/CreateExamModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, Loader2 } from "lucide-react";
import { useExamActions } from "../hooks/useExamActions";

interface CreateExamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateExamModal({ onClose, onSuccess }: CreateExamModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "full" as "full" | "mini",
    duration: 120,
    difficulty: "medium" as "easy" | "medium" | "hard",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createExam, loading } = useExamActions();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên đề thi không được để trống";
    }
    if (formData.duration < 30 || formData.duration > 180) {
      newErrors.duration = "Thời gian phải từ 30 đến 180 phút";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      await createExam(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to create exam:", error);
    }
  };

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Tạo đề thi mới</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Nhập thông tin cơ bản để bắt đầu</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đề thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: TOEIC Full Test 4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn về đề thi..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại đề
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "full" | "mini" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="full">Full Test (83 câu)</option>
                <option value="mini">Mini Test (30 câu)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (phút)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  errors.duration ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.duration && (
                <p className="text-xs text-red-500 mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ khó
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as "easy" | "medium" | "hard" })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 Sau khi tạo, bạn có thể thêm cấu trúc đề thi và quy tắc lấy câu hỏi
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Tạo đề thi</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}