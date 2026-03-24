// app/admin/exams/types/index.ts
export interface ExamTemplate {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  type: "full" | "mini";
  sections: ExamSection[];
  rules: ExamRule[];
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

export interface ExamSection {
  id: string;
  name: string;
  type: "reading" | "writing";
  part: string;
  itemCount: number;
  items: ExamItem[];
  order: number;
}

export interface ExamItem {
  id: string;
  questionId: string;
  content: string;
  type: string;
  order: number;
  points: number;
}

export interface ExamRule {
  id: string;
  type: "difficulty" | "topic" | "skill";
  value: string;
  count: number;
}

export interface ExamStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalAttempts: number;
}

export type ExamStatus = "all" | "published" | "draft" | "archived";
export type ExamType = "all" | "full" | "mini";
export type ViewMode = "grid" | "list";