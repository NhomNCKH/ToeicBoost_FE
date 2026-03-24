// app/admin/exams/components/ExamStats.tsx
import { motion } from "framer-motion";
import { FileText, CheckCircle, Edit, Archive, Users, TrendingUp } from "lucide-react";

interface ExamStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalAttempts: number;
  };
}

export function ExamStats({ stats }: ExamStatsProps) {
  const statCards = [
    {
      icon: FileText,
      label: "Tổng đề thi",
      value: stats?.total || 0,
      color: "blue",
    },
    {
      icon: CheckCircle,
      label: "Đã xuất bản",
      value: stats?.published || 0,
      color: "green",
    },
    {
      icon: Edit,
      label: "Bản nháp",
      value: stats?.draft || 0,
      color: "yellow",
    },
    {
      icon: Users,
      label: "Lượt thi",
      value: (stats?.totalAttempts || 0).toLocaleString(),
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "yellow": return "bg-yellow-100 text-yellow-600";
      case "purple": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}