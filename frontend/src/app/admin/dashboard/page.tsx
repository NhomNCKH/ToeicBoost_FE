'use client';

import { motion } from 'framer-motion';
import { Users, Award, Activity, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Tổng học viên', value: '1,234', change: '+12%', color: 'bg-blue-500' },
    { icon: Award, label: 'Chứng chỉ đã cấp', value: '856', change: '+23%', color: 'bg-emerald-500' },
    { icon: Activity, label: 'Bài luyện tập', value: '12.5K', change: '+8%', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Tỉ lệ hoàn thành', value: '78%', change: '+5%', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-600">Quản lý và theo dõi hoạt động của hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}