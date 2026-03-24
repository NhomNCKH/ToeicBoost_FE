// app/admin/exams/components/tabs/SectionsTab.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionItem } from "../sections/SectionItem";
import { 
  Loader2, 
  Plus, 
  Shuffle, 
  BookOpen, 
  PenTool, 
  GripVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Check
} from "lucide-react";
import { ExamTemplate, ExamSection, ExamItem } from "../../types";

interface SectionsTabProps {
  template: ExamTemplate;
  onAutoFill: () => Promise<void>;
  onAddSection: () => void;
  onUpdateSection: (section: ExamSection) => void;
  onReorderItems: (items: any[]) => void;
  autoFillLoading: boolean;
}

// Mock sections data for UI development
const mockSections: ExamSection[] = [
  {
    id: "s1",
    name: "Reading - Part 5",
    type: "reading",
    part: "Part 5",
    itemCount: 40,
    order: 1,
    items: Array.from({ length: 40 }, (_, i) => ({
      id: `q${i + 1}`,
      questionId: `q${i + 1}`,
      content: `Câu hỏi ${i + 1}: The company's new policy was _____ by all employees.`,
      type: "multiple_choice",
      order: i + 1,
      points: 1,
    })),
  },
  {
    id: "s2",
    name: "Reading - Part 6",
    type: "reading",
    part: "Part 6",
    itemCount: 16,
    order: 2,
    items: Array.from({ length: 16 }, (_, i) => ({
      id: `q${i + 41}`,
      questionId: `q${i + 41}`,
      content: `Câu hỏi ${i + 41}: ______ the weather was bad, we decided to continue the trip.`,
      type: "multiple_choice",
      order: i + 1,
      points: 1,
    })),
  },
  {
    id: "s3",
    name: "Reading - Part 7",
    type: "reading",
    part: "Part 7",
    itemCount: 27,
    order: 3,
    items: Array.from({ length: 27 }, (_, i) => ({
      id: `q${i + 57}`,
      questionId: `q${i + 57}`,
      content: `Câu hỏi ${i + 57}: [Reading Passage] According to the article, what is the main benefit...`,
      type: "reading_comprehension",
      order: i + 1,
      points: 1,
    })),
  },
  {
    id: "s4",
    name: "Writing - Part 1",
    type: "writing",
    part: "Part 1",
    itemCount: 5,
    order: 4,
    items: Array.from({ length: 5 }, (_, i) => ({
      id: `w${i + 1}`,
      questionId: `w${i + 1}`,
      content: `Describe the picture showing a business meeting with executives discussing documents.`,
      type: "description",
      order: i + 1,
      points: 3,
    })),
  },
  {
    id: "s5",
    name: "Writing - Part 2",
    type: "writing",
    part: "Part 2",
    itemCount: 2,
    order: 5,
    items: Array.from({ length: 2 }, (_, i) => ({
      id: `w${i + 6}`,
      questionId: `w${i + 6}`,
      content: `Write an email responding to a customer complaint about a delayed shipment.`,
      type: "email",
      order: i + 1,
      points: 5,
    })),
  },
  {
    id: "s6",
    name: "Writing - Part 3",
    type: "writing",
    part: "Part 3",
    itemCount: 1,
    order: 6,
    items: [
      {
        id: "w8",
        questionId: "w8",
        content: "Write an essay discussing whether technology has improved or harmed education.",
        type: "essay",
        order: 1,
        points: 10,
      },
    ],
  },
];

export function SectionsTab({
  template,
  onAutoFill,
  onAddSection,
  onUpdateSection,
  onReorderItems,
  autoFillLoading,
}: SectionsTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("s1");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [sections, setSections] = useState<ExamSection[]>(mockSections);

  const getTypeIcon = (type: string) => {
    if (type === "reading") {
      return <BookOpen className="w-4 h-4 text-blue-500" />;
    }
    return <PenTool className="w-4 h-4 text-purple-500" />;
  };

  const getTypeColor = (type: string) => {
    if (type === "reading") {
      return "border-blue-200 bg-blue-50";
    }
    return "border-purple-200 bg-purple-50";
  };

  const handleEditSection = (section: ExamSection) => {
    setEditingSection(section.id);
    setEditName(section.name);
  };

  const handleSaveEdit = (sectionId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, name: editName } : s
    ));
    setEditingSection(null);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleReorderItems = (sectionId: string, startIndex: number, endIndex: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newItems = [...section.items];
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);
    
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, items: newItems.map((item, idx) => ({ ...item, order: idx + 1 })) } : s
    ));
  };

  const getDifficultyBadge = (points: number) => {
    if (points <= 2) return "bg-green-100 text-green-700";
    if (points <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Cấu trúc đề thi</h3>
        <div className="flex gap-2">
          <button
            onClick={onAutoFill}
            disabled={autoFillLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {autoFillLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Shuffle className="w-4 h-4" />
            )}
            <span>Tự động điền</span>
          </button>
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phần thi</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
        <div className="space-y-3">
        {sections.map((section, idx) => (
            <SectionItem
            key={section.id}
            section={section}
            index={idx}
            onUpdate={(updatedSection) => {
                setSections(sections.map(s => 
                s.id === updatedSection.id ? updatedSection : s
                ));
            }}
            onDelete={(sectionId) => {
                setSections(sections.filter(s => s.id !== sectionId));
            }}
            onReorderItems={(sectionId, startIndex, endIndex) => {
                const section = sections.find(s => s.id === sectionId);
                if (!section) return;
                
                const newItems = [...section.items];
                const [removed] = newItems.splice(startIndex, 1);
                newItems.splice(endIndex, 0, removed);
                
                setSections(sections.map(s => 
                s.id === sectionId ? { ...s, items: newItems.map((item, i) => ({ ...item, order: i + 1 })) } : s
                ));
            }}
            onAddItem={(sectionId) => {
                // Handle add item
                console.log("Add item to section:", sectionId);
            }}
            onEditItem={(sectionId, item) => {
                // Handle edit item
                console.log("Edit item:", sectionId, item);
            }}
            onDeleteItem={(sectionId, itemId) => {
                // Handle delete item
                const section = sections.find(s => s.id === sectionId);
                if (!section) return;
                
                setSections(sections.map(s => 
                s.id === sectionId 
                    ? { ...s, items: s.items.filter(i => i.id !== itemId), itemCount: s.items.length - 1 }
                    : s
                ));
            }}
            />
        ))}
        </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-gray-600 font-medium mb-1">Chưa có phần thi nào</h4>
          <p className="text-sm text-gray-400 mb-3">Hãy thêm phần thi hoặc tự động điền</p>
          <button
            onClick={onAutoFill}
            className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mx-auto"
          >
            <Shuffle className="w-4 h-4" />
            Tự động điền theo cấu trúc mặc định
          </button>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 rounded-lg p-3 mt-4">
        <p className="text-xs text-blue-700">
          💡 <strong>Mẹo:</strong> Bạn có thể kéo thả để sắp xếp lại thứ tự các phần thi và câu hỏi. 
          Mỗi phần thi có thể chứa nhiều câu hỏi với số điểm khác nhau.
        </p>
      </div>
    </div>
  );
}