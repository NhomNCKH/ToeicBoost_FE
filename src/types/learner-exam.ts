export type TemplateMode = "practice" | "mock_test" | "official_exam";

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LearnerExamTemplateSummary {
  id: string;
  code: string;
  name: string;
  mode: TemplateMode | string;
  status: string;
  totalDurationSec: number;
  totalQuestions: number;
  instructions?: string | null;
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearnerAttemptSessionOption {
  optionKey: string;
  content: string;
  sortOrder: number;
}

export interface LearnerAttemptSessionQuestion {
  id: string;
  questionNo: number;
  prompt: string;
  timeLimitSec?: number | null;
  metadata?: Record<string, unknown>;
  options: LearnerAttemptSessionOption[];
}

export interface LearnerAttemptSessionAsset {
  id: string;
  kind: string;
  publicUrl?: string | null;
  mimeType?: string | null;
  durationSec?: number | null;
  sortOrder?: number;
  contentText?: string | null;
  metadata?: Record<string, unknown>;
}

export interface LearnerAttemptSessionGroup {
  id: string;
  code: string;
  title: string;
  part: string;
  level: string;
  stem?: string | null;
  assets: LearnerAttemptSessionAsset[];
  questions: LearnerAttemptSessionQuestion[];
}

export interface LearnerAttemptSessionSectionItem {
  id: string;
  questionGroupId: string;
  displayOrder: number;
  sourceMode: string;
  locked: boolean;
  questionGroup: LearnerAttemptSessionGroup;
}

export interface LearnerAttemptSessionSection {
  id: string;
  part: string;
  sectionOrder: number;
  expectedGroupCount: number;
  expectedQuestionCount: number;
  durationSec?: number | null;
  instructions?: string | null;
  items: LearnerAttemptSessionSectionItem[];
}

export interface LearnerAttemptSessionData {
  resumed: boolean;
  attempt: {
    id: string;
    examTemplateId: string;
    attemptNo: number;
    status: string;
    startedAt: string;
    totalQuestions: number;
    answeredCount: number;
    durationSec?: number | null;
    mode?: string;
  };
  template: {
    template: {
      id: string;
      code: string;
      name: string;
      mode: string;
      totalDurationSec: number;
      totalQuestions: number;
      instructions?: string | null;
      shuffleQuestionOrder?: boolean;
      shuffleOptionOrder?: boolean;
    };
    sections: LearnerAttemptSessionSection[];
  };
  savedAnswers: Array<{
    questionId: string;
    selectedOptionKey?: string | null;
    answeredAt?: string;
    timeSpentSec?: number | null;
  }>;
}

export interface LearnerAttemptResultData {
  attempt: {
    id: string;
    examTemplateId: string;
    attemptNo: number;
    status: string;
    startedAt: string;
    submittedAt?: string | null;
    gradedAt?: string | null;
    durationSec?: number | null;
    totalQuestions: number;
    answeredCount: number;
    correctCount: number;
    listeningScaledScore: number;
    readingScaledScore: number;
    totalScore: number;
    passed?: boolean;
  };
  partScores?: Array<{
    part: string;
    sectionOrder: number;
    questionCount: number;
    correctCount: number;
    rawScore: number;
    scaledScore: number;
    durationSec?: number | null;
  }>;
  credentialRequest?: {
    id: string;
    status: string;
    credentialTemplateId: string;
    requestedAt: string;
  } | null;
  review?: unknown;
}
