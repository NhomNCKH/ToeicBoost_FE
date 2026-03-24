// app/admin/exams/hooks/useExamTemplates.ts
import { useState, useEffect, useCallback } from "react";
import { examApi } from "../api/examApi";

export interface ExamTemplate {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  type: "full" | "mini";
  sections: any[];
  rules: any[];
  totalQuestions: number;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  usageCount: number;
  avgScore: number;
  tags: string[];
}

export function useExamTemplates() {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalAttempts: 0,
  });

  const fetchTemplates = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await examApi.getAll(params);

      console.log("=== DEBUG EXAM API ===");
      console.log("API Response:", response);
      console.log("Response statusCode:", response?.statusCode);
      console.log("Response data:", response?.data);
      console.log("Is data array?", Array.isArray(response?.data));
      console.log("Type of data:", typeof response?.data);
      console.log("=========================");
      
      console.log("API Response:", response); // Debug log
      
      // Kiểm tra response có data và data là array
      let templatesData: ExamTemplate[] = [];
      
      if (response.statusCode === 200) {
        // Nếu response.data là array
        if (Array.isArray(response.data)) {
          templatesData = response.data;
        } 
        // Nếu response.data có property data (nested)
        else if (response.data && Array.isArray(response.data.data)) {
          templatesData = response.data.data;
        }
        // Nếu response.data có property items
        else if (response.data && Array.isArray(response.data.items)) {
          templatesData = response.data.items;
        }
        // Nếu response.data là object nhưng không phải array
        else if (response.data && typeof response.data === 'object') {
          console.warn("Response data is not an array:", response.data);
          templatesData = [];
        }
      } else {
        setError(response.message || "Không thể tải danh sách đề thi");
      }
      
      // Đảm bảo templatesData luôn là array
      const safeTemplates = Array.isArray(templatesData) ? templatesData : [];
      setTemplates(safeTemplates);
      
      // Calculate stats
      setStats({
        total: safeTemplates.length,
        published: safeTemplates.filter((t: ExamTemplate) => t.status === "published").length,
        draft: safeTemplates.filter((t: ExamTemplate) => t.status === "draft").length,
        archived: safeTemplates.filter((t: ExamTemplate) => t.status === "archived").length,
        totalAttempts: safeTemplates.reduce((acc: number, t: ExamTemplate) => acc + (t.usageCount || 0), 0),
      });
    } catch (err) {
      console.error("Fetch templates error:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setTemplates([]); // Đặt là array rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, stats, refresh: fetchTemplates };
}