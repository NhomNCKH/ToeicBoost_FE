// app/admin/exams/components/tabs/PreviewTab.tsx
import { useState } from "react";
import { AlertCircle, Loader2, Play, CheckCircle, XCircle, Eye } from "lucide-react";
import { ExamTemplate } from "../../types";

interface PreviewTabProps {
  template: ExamTemplate;
  onValidate: () => Promise<void>;
  validating: boolean;
}

export function PreviewTab({ template, onValidate, validating }: PreviewTabProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);

  const sampleQuestions = [
    {
      id: 1,
      part: "Reading - Part 5",
      content: "The company's new policy was _____ by all employees.",
      options: ["A. accepted", "B. accepting", "C. to accept", "D. acceptance"],
      correctAnswer: "A",
    },
    {
      id: 2,
      part: "Reading - Part 5",
      content: "______ the weather was bad, we decided to continue the trip.",
      options: ["A. Although", "B. Because", "C. Despite", "D. However"],
      correctAnswer: "A",
    },
    {
      id: 3,
      part: "Reading - Part 6",
      content: "The new software is designed to help users _____ their productivity.",
      options: ["A. increase", "B. increasing", "C. to increase", "D. increased"],
      correctAnswer: "A",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">Xem trước đề thi</p>
          <p className="text-sm text-yellow-700">Đây là bản xem trước, chưa phải đề thi chính thức</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800">Mẫu câu hỏi</h3>
          <button
            onClick={() => setShowFullPreview(!showFullPreview)}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
          >
            <Eye className="w-4 h-4" />
            <span>{showFullPreview ? "Thu gọn" : "Xem đầy đủ"}</span>
          </button>
        </div>

        <div className="space-y-4">
          {sampleQuestions.slice(0, showFullPreview ? sampleQuestions.length : 2).map((q) => (
            <div key={q.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {q.part}
                </span>
                <span className="text-xs text-gray-400">Câu {q.id}</span>
              </div>
              <p className="text-sm text-gray-800 mb-3">{q.content}</p>
              <div className="space-y-2 pl-4">
                {q.options?.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-gray-300 rounded-full" />
                    <span className="text-sm text-gray-600">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!showFullPreview && sampleQuestions.length > 2 && (
          <div className="text-center mt-3">
            <button
              onClick={() => setShowFullPreview(true)}
              className="text-sm text-emerald-600 hover:underline"
            >
              + {sampleQuestions.length - 2} câu hỏi khác
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-800 mb-3">Thông tin đề thi</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">Tổng số câu hỏi:</span>
            <span className="font-medium text-gray-800">{template.totalQuestions}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">Thời gian làm bài:</span>
            <span className="font-medium text-gray-800">{template.duration} phút</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">Số phần Reading:</span>
            <span className="font-medium text-gray-800">3 phần</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">Số phần Writing:</span>
            <span className="font-medium text-gray-800">3 phần</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onValidate}
          disabled={validating}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {validating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>Kiểm tra tính hợp lệ</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <Play className="w-4 h-4" />
          <span>Xem đầy đủ</span>
        </button>
      </div>
    </div>
  );
}