// app/admin/exams/api/examApi.ts
import { api } from "@/services/api";

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

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path?: string;
}

export const examApi = {
  // Get all exam templates
  getAll: async (params?: { status?: string; type?: string; search?: string }) => {
    // Build query string from params
    const queryString = params 
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== 'all')
          )
        ).toString()
      : '';
    
    const response = await fetch(`${api.baseURL}/admin/exam-templates${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Get exam template by id
  getById: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Create exam template
  create: async (data: Partial<ExamTemplate>) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update exam template (PATCH)
  update: async (id: string, data: Partial<ExamTemplate>) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete exam template (only draft)
  delete: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Update sections (PUT)
  updateSections: async (id: string, sections: any[]) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/sections`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify({ sections }),
    });
    return response.json();
  },

  // Update rules (PUT)
  updateRules: async (id: string, rules: any[]) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify({ rules }),
    });
    return response.json();
  },

  // Manual add items
  addItemsManual: async (id: string, items: any[]) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/items/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify({ items }),
    });
    return response.json();
  },

  // Auto fill items
  autoFillItems: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/items/auto-fill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Reorder items
  reorderItems: async (id: string, items: { itemId: string; order: number }[]) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/items/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
      body: JSON.stringify({ items }),
    });
    return response.json();
  },

  // Remove item
  removeItem: async (id: string, itemId: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Validate exam
  validate: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Preview exam
  preview: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/preview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Publish exam
  publish: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Archive exam
  archive: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },

  // Duplicate exam
  duplicate: async (id: string) => {
    const response = await fetch(`${api.baseURL}/admin/exam-templates/${id}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') && { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        }),
      },
    });
    return response.json();
  },
};