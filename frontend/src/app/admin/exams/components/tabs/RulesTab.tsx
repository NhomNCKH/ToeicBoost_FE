// app/admin/exams/components/tabs/RulesTab.tsx
import { useState } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { ExamTemplate, ExamRule } from "../../types";

interface RulesTabProps {
  template: ExamTemplate;
}

export function RulesTab({ template }: RulesTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rules, setRules] = useState<ExamRule[]>([
    { id: "1", type: "difficulty", value: "easy", count: 20 },
    { id: "2", type: "difficulty", value: "medium", count: 50 },
    { id: "3", type: "difficulty", value: "hard", count: 30 },
    { id: "4", type: "topic", value: "Business", count: 30 },
    { id: "5", type: "topic", value: "Travel", count: 20 },
    { id: "6", type: "topic", value: "Technology", count: 25 },
    { id: "7", type: "topic", value: "Daily Life", count: 25 },
    { id: "8", type: "skill", value: "Grammar", count: 30 },
    { id: "9", type: "skill", value: "Vocabulary", count: 30 },
    { id: "10", type: "skill", value: "Comprehension", count: 40 },
  ]);

  const groupedRules = {
    difficulty: rules.filter(r => r.type === "difficulty"),
    topic: rules.filter(r => r.type === "topic"),
    skill: rules.filter(r => r.type === "skill"),
  };

  const typeLabels = {
    difficulty: "Độ khó",
    topic: "Chủ đề",
    skill: "Kỹ năng",
  };

  const typeColors = {
    difficulty: "bg-blue-50 border-blue-200",
    topic: "bg-green-50 border-green-200",
    skill: "bg-purple-50 border-purple-200",
  };

  const handleSave = () => {
    setIsEditing(false);
    // API call to save rules
  };

  const handleAddRule = () => {
    const newRule: ExamRule = {
      id: Date.now().toString(),
      type: "topic",
      value: "New Topic",
      count: 10,
    };
    setRules([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleUpdateRule = (id: string, field: keyof ExamRule, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Quy tắc lấy câu hỏi</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleAddRule}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm rule</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              <Save className="w-4 h-4" />
              <span>Lưu</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
              <span>Hủy</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedRules).map(([type, typeRules]) => (
          <div
            key={type}
            className={`rounded-xl p-4 border ${typeColors[type as keyof typeof typeColors]}`}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {typeLabels[type as keyof typeof typeLabels]}
            </h4>
            <div className="space-y-3">
              {typeRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => handleUpdateRule(rule.id, "value", e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={rule.count}
                          onChange={(e) => handleUpdateRule(rule.id, "count", parseInt(e.target.value))}
                          className="w-20 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      <button
                        onClick={() => handleRemoveRule(rule.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-800">{rule.value}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${rule.count}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-emerald-600 w-12">
                          {rule.count}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚡ Lưu ý: Tổng tỉ lệ phần trăm của mỗi nhóm phải bằng 100%
        </p>
        <div className="mt-2 flex gap-4 text-xs text-yellow-700">
          <span>Độ khó: 100%</span>
          <span>Chủ đề: 100%</span>
          <span>Kỹ năng: 100%</span>
        </div>
      </div>
    </div>
  );
}