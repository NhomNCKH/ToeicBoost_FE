// app/admin/exams/components/sections/ItemList.tsx
import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  GripVertical,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Image,
  Type,
  HelpCircle
} from "lucide-react";
import { ExamItem } from "../../types";

interface ItemListProps {
  sectionId: string;
  items: ExamItem[];
  onReorderItems: (startIndex: number, endIndex: number) => void;
  onEditItem: (item: ExamItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: () => void;
}

export function ItemList({
  sectionId,
  items,
  onReorderItems,
  onEditItem,
  onDeleteItem,
  onAddItem,
}: ItemListProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState(items);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <HelpCircle className="w-4 h-4 text-blue-500" />;
      case "description":
        return <Image className="w-4 h-4 text-green-500" />;
      case "email":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "essay":
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case "reading_comprehension":
        return <FileText className="w-4 h-4 text-cyan-500" />;
      default:
        return <Type className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice": return "Trắc nghiệm";
      case "description": return "Mô tả hình ảnh";
      case "email": return "Email";
      case "essay": return "Bài luận";
      case "reading_comprehension": return "Đọc hiểu";
      default: return type;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "in_progress":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      default:
        return <XCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getDifficultyColor = (points: number) => {
    if (points <= 2) return "bg-green-100 text-green-700";
    if (points <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Handle reorder
  const handleReorder = (newItems: ExamItem[]) => {
    setLocalItems(newItems);
    newItems.forEach((item, index) => {
      onReorderItems(items.findIndex(i => i.id === item.id), index);
    });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-semibold text-gray-700">
            Danh sách câu hỏi
          </h5>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {items.length} câu
          </span>
        </div>
        <button
          onClick={onAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm câu hỏi</span>
        </button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-2">Chưa có câu hỏi nào</p>
          <button
            onClick={onAddItem}
            className="text-sm text-emerald-600 hover:underline"
          >
            + Thêm câu hỏi đầu tiên
          </button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={localItems}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {localItems.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              onDragEnd={() => {}}
              className="cursor-move"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.01 }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Drag handle */}
                    <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 mt-1">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Item number and icon */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                        {getTypeIcon(item.type)}
                      </div>
                    </div>

                    {/* Item content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm text-gray-800 line-clamp-2 flex-1">
                          {item.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(item.points || 1)}`}>
                          {item.points || 1} điểm
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          {getTypeLabel(item.type)}
                        </span>
                        {item.status && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status === "completed" ? "Hoàn thành" : 
                             item.status === "in_progress" ? "Đang làm" : "Chưa làm"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className={`p-1.5 rounded-lg transition-all ${
                          hoveredItem === item.id 
                            ? "opacity-100 bg-gray-100" 
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => onEditItem(item)}
                        className={`p-1.5 rounded-lg transition-all ${
                          hoveredItem === item.id 
                            ? "opacity-100 bg-gray-100" 
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          hoveredItem === item.id 
                            ? "opacity-100 bg-red-50" 
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Footer note */}
      {items.length > 0 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <GripVertical className="w-3 h-3" />
            Kéo thả để sắp xếp lại thứ tự câu hỏi
          </p>
        </div>
      )}
    </div>
  );
}