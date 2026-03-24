// app/admin/exams/components/ExamFilters.tsx
import { Search, Grid, List, Filter } from "lucide-react";
import { ExamStatus, ExamType, ViewMode } from "../types";

interface ExamFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: ExamStatus;
  onStatusChange: (value: ExamStatus) => void;
  selectedType: ExamType;
  onTypeChange: (value: ExamType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ExamFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
}: ExamFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as ExamStatus)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as ExamType)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">Tất cả loại</option>
            <option value="full">Full Test</option>
            <option value="mini">Mini Test</option>
          </select>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 transition-colors ${
                viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}