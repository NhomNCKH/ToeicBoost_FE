import type {
  LearnerAttemptResultData,
  LearnerAttemptSessionData,
} from "@/types/learner-exam";

export interface MockExamQuestion {
  id: string;
  questionNumber?: number;
  content: string;
  options?: { key: string; text: string }[];
  audioUrl?: string;
  imageUrl?: string;
  part?: string;
  stem?: string | null;
}

export interface MockExamQuestionGroup {
  id: string;
  title?: string;
  part?: string;
  questions: MockExamQuestion[];
  passage?: string;
}

export interface MockExamSection {
  id: string;
  name: string;
  questionGroups: MockExamQuestionGroup[];
}

export interface MockExamAttemptView {
  id: string;
  examTemplateId: string;
  status: string;
  startedAt: string;
  totalDurationSec?: number;
  sections?: MockExamSection[];
  savedAnswers?: Record<string, string>;
}

export interface MockExamResultView {
  attemptId: string;
  totalScore?: number;
  listeningScore?: number;
  readingScore?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  accuracy?: number;
  timeTakenSec?: number;
}

export function mapAttemptSessionToMockExam(raw: LearnerAttemptSessionData): {
  attemptData: MockExamAttemptView;
  questions: MockExamQuestion[];
  savedAnswers: Record<string, string>;
} {
  const sections = (raw.template.sections ?? []).map((section) => ({
    id: section.id,
    name: section.part || "Section",
    questionGroups: (section.items ?? []).map((item) => {
      const group = item.questionGroup;
      return {
        id: group?.id ?? item.id,
        title: group?.title,
        part: group?.part || section.part,
        passage: group?.stem ?? undefined,
        questions: (group?.questions ?? []).map((q) => ({
          id: q.id,
          questionNumber: q.questionNo,
          content: q.prompt ?? "",
          part: group?.part || section.part,
          stem: group?.stem ?? null,
          options: (q.options ?? []).map((opt) => ({
            key: opt.optionKey ?? "",
            text: opt.content ?? "",
          })),
          audioUrl:
            (group?.assets ?? []).find((asset) => asset.kind === "audio")?.publicUrl ??
            undefined,
          imageUrl:
            (group?.assets ?? []).find((asset) => asset.kind === "image")?.publicUrl ??
            undefined,
        })),
      };
    }),
  }));

  const questions: MockExamQuestion[] = [];
  sections.forEach((section) => {
    section.questionGroups.forEach((group) => {
      group.questions.forEach((q) => questions.push(q));
    });
  });

  const savedAnswers = Object.fromEntries(
    (raw.savedAnswers ?? [])
      .filter((item) => !!item.selectedOptionKey)
      .map((item) => [item.questionId, item.selectedOptionKey as string]),
  );

  return {
    attemptData: {
      id: raw.attempt.id,
      examTemplateId: raw.attempt.examTemplateId,
      status: raw.attempt.status,
      startedAt: raw.attempt.startedAt,
      totalDurationSec: raw.template.template?.totalDurationSec,
      sections,
      savedAnswers,
    },
    questions,
    savedAnswers,
  };
}

export function mapAttemptResultToMockExam(
  raw: LearnerAttemptResultData,
): MockExamResultView {
  const totalQuestions = raw.attempt.totalQuestions ?? 0;
  const correctAnswers = raw.attempt.correctCount ?? 0;
  const accuracy =
    totalQuestions > 0
      ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
      : 0;

  return {
    attemptId: raw.attempt.id,
    totalScore: raw.attempt.totalScore,
    listeningScore: raw.attempt.listeningScaledScore,
    readingScore: raw.attempt.readingScaledScore,
    totalQuestions,
    correctAnswers,
    accuracy,
    timeTakenSec: raw.attempt.durationSec ?? undefined,
  };
}
