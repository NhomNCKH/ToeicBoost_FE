// app/admin/exams/components/sections/SectionItem.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  PenTool, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Plus,
  Copy,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { ExamSection, ExamItem } from "../../types";
import { ItemList } from "./ItemList";

interface SectionItemProps {
  section: ExamSection;
  index: number;
  onUpdate: (section: ExamSection) => void;
  onDelete: (sectionId: string) => void;
  onReorderItems: (sectionId: string, startIndex: number, endIndex: number) => void;
  onAddItem: (sectionId: string) => void;
  onEditItem: (sectionId: string, item: ExamItem) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
}

export function SectionItem({
  section,
  index,
  onUpdate,
  onDelete,
  onReorderItems,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: SectionItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const getTypeIcon = () => {
    if (section.type === "reading") {
      return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
    return <PenTool className="w-5 h-5 text-purple-500" />;
  };

  const getTypeColor = () => {
    if (section.type === "reading") {
      return "border-blue-200 bg-blue-50/30 hover:bg-blue-50/50";
    }
    return "border-purple-200 bg-purple-50/30 hover:bg-purple-50/50";
  };

  const getStatusBadge = () => {
    const completedCount = section.items.filter(item => item.status === "completed").length;
    const percentage = (completedCount / section.itemCount) * 100;
    
    if (percentage === 100) {
      return { text: "Hoàn thành", icon: CheckCircle, color: "text-green-600 bg-green-100" };
    }
    if (percentage > 0) {
      return { text: `${Math.round(percentage)}%`, icon: AlertCircle, color: "text-yellow-600 bg-yellow-100" };
    }
    return { text: "Chưa bắt đầu", icon: XCircle, color: "text-gray-500 bg-gray-100" };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdate({ ...section, name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      setEditName(section.name);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border rounded-xl ${getTypeColor()} transition-all shadow-sm hover:shadow-md`}
    >
      {/* Section Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Drag handle and icon */}
          <div className="flex items-center gap-3 flex-1">
            <div className="cursor-move text-gray-400 hover:text-gray-600 transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
              {getTypeIcon()}
            </div>
            
            {/* Section info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="px-2 py-1 text-base font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setEditName(section.name);
                      setIsEditing(false);
                    }}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800">{section.name}</h4>
                    <span className="text-xs text-gray-400">• {section.part}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {section.itemCount} câu hỏi
                    </span>
                    <span className="text-xs text-gray-400">
                      {section.items.reduce((sum, item) => sum + (item.points || 0), 0)} điểm
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddItem(section.id)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Thêm câu hỏi"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Sửa phần thi"
            >
              <Edit className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => onDelete(section.id)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Xóa phần thi"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title={expanded ? "Thu gọn" : "Mở rộng"}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Section - Items List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-gray-200 bg-white/80 rounded-b-xl">
              <ItemList
                sectionId={section.id}
                items={section.items}
                onReorderItems={(startIndex, endIndex) => 
                  onReorderItems(section.id, startIndex, endIndex)
                }
                onEditItem={(item) => onEditItem(section.id, item)}
                onDeleteItem={(itemId) => onDeleteItem(section.id, itemId)}
                onAddItem={() => onAddItem(section.id)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}