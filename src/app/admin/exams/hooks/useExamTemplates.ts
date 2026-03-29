import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { ExamPagination, ExamStats, ExamTemplate } from "../types";

export type { ExamTemplate };

export function useExamTemplates() {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ExamStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalAttempts: 0,
    modes: {
      practice: 0,
      mock_test: 0,
      official_exam: 0,
    },
  });
  const [pagination, setPagination] = useState<ExamPagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const fetchTemplates = useCallback(async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    mode?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const [response, statsRes] = await Promise.all([
        apiClient.admin.examTemplate.list(params),
        apiClient.admin.examTemplate.stats(),
      ]);

      let templatesData: ExamTemplate[] = [];
      let paginationData: ExamPagination = {
        page: params?.page ?? 1,
        limit: params?.limit ?? 12,
        total: 0,
        totalPages: 1,
      };
      if (Array.isArray(response.data)) {
        templatesData = response.data as ExamTemplate[];
      } else if (response.data && Array.isArray((response.data as any).data)) {
        templatesData = (response.data as any).data as ExamTemplate[];
        const pg = (response.data as any).pagination;
        if (pg) {
          paginationData = {
            page: Number(pg.page ?? paginationData.page),
            limit: Number(pg.limit ?? paginationData.limit),
            total: Number(pg.total ?? templatesData.length),
            totalPages: Number(pg.totalPages ?? 1),
          };
        }
      } else if (response.data && Array.isArray((response.data as any).items)) {
        templatesData = (response.data as any).items as ExamTemplate[];
      }

      setTemplates(templatesData);
      setPagination(paginationData);
      const statsPayload = statsRes.data as any;
      setStats({
        total: Number(statsPayload?.total ?? templatesData.length),
        published: Number(statsPayload?.published ?? templatesData.filter((t) => t.status === "published").length),
        draft: Number(statsPayload?.draft ?? templatesData.filter((t) => t.status === "draft").length),
        archived: Number(statsPayload?.archived ?? templatesData.filter((t) => t.status === "archived").length),
        totalAttempts: Number(statsPayload?.totalAttempts ?? 0),
        modes: {
          practice: Number(statsPayload?.modes?.practice ?? 0),
          mock_test: Number(statsPayload?.modes?.mock_test ?? 0),
          official_exam: Number(statsPayload?.modes?.official_exam ?? 0),
        },
      });
    } catch (err) {
      console.error("Fetch templates error:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { templates, loading, error, stats, pagination, refresh: fetchTemplates };
}
