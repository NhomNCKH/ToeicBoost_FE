"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Flag,
  BookOpen,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import {
  mapAttemptResultToMockExam,
  mapAttemptSessionToMockExam,
  type MockExamAttemptView,
  type MockExamQuestion,
  type MockExamResultView,
} from "@/lib/learner-exam-adapter";

type PageState = "loading" | "exam" | "submitting" | "result" | "error";

export default function MockTestExamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [attempt, setAttempt] = useState<MockExamAttemptView | null>(null);
  const [result, setResult] = useState<MockExamResultView | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Flatten all questions for navigation
  const [allQuestions, setAllQuestions] = useState<MockExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<Record<string, string>>({});
  const submittingRef = useRef(false);
  const answersRef = useRef<Record<string, string>>({});
  const submitRef = useRef<(autoSubmit?: boolean) => void>(() => {});

  const clearTimerInterval = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const clearAutoSaveInterval = () => {
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
  };

  // Start attempt
  useEffect(() => {
    const start = async () => {
      try {
        const res = await apiClient.learner.examAttempt.start({ examTemplateId: id });
        const mapped = mapAttemptSessionToMockExam(res.data);
        setAttempt(mapped.attemptData);
        setAllQuestions(mapped.questions);
        setAnswers(mapped.savedAnswers);
        answersRef.current = mapped.savedAnswers;
        lastSavedRef.current = mapped.savedAnswers;

        // Timer = totalDurationSec - elapsedSinceStartedAt
        if (mapped.attemptData.totalDurationSec && mapped.attemptData.startedAt) {
          const startedAt = new Date(mapped.attemptData.startedAt).getTime();
          const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
          const remaining = Math.max(0, mapped.attemptData.totalDurationSec - elapsed);
          setTimeLeft(remaining);
        } else {
          setTimeLeft(null);
        }

        setPageState("exam");
      } catch (err: any) {
        setErrorMsg(err.message || "Lỗi khi bắt đầu bài thi");
        setPageState("error");
      }
    };
    start();
  }, [id]);

  // Keep ref in sync to avoid stale data in interval callbacks
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Countdown timer
  useEffect(() => {
    if (pageState !== "exam" || timeLeft === null) return;
    if (timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearTimerInterval();
          clearAutoSaveInterval();
          submitRef.current(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimerInterval();
  }, [pageState, timeLeft]);

  const saveAnswers = useCallback(
    async (currentAnswers: Record<string, string>) => {
      if (!attempt) return;
      try {
        const payload = Object.entries(currentAnswers).map(([questionId, selectedOptionKey]) => ({
          questionId,
          selectedOptionKey,
          answeredAt: new Date().toISOString(),
        }));
        if (payload.length === 0) return;
        await apiClient.learner.examAttempt.saveAnswers(attempt.id, { answers: payload });
        lastSavedRef.current = { ...currentAnswers };
      } catch {
        // silent fail for auto-save
      }
    },
    [attempt]
  );

  // Auto-save every 30s
  useEffect(() => {
    if (pageState !== "exam" || !attempt?.id) return;
    autoSaveRef.current = setInterval(() => {
      const currentAnswers = answersRef.current;
      const changed = Object.entries(currentAnswers).filter(
        ([qId, ans]) => lastSavedRef.current[qId] !== ans
      );
      if (changed.length > 0) {
        void saveAnswers(currentAnswers);
      }
    }, 30000);
    return () => clearAutoSaveInterval();
  }, [pageState, attempt?.id, saveAnswers]);

  const handleAnswer = (questionId: string, optionKey: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionKey };
      answersRef.current = next;
      return next;
    });
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!attempt) return;
    if (submittingRef.current) return;
    if (!autoSubmit && !confirm("Bạn có chắc muốn nộp bài?")) return;
    submittingRef.current = true;

    clearTimerInterval();
    clearAutoSaveInterval();
    setPageState("submitting");

    try {
      // Save latest answers first
      await saveAnswers(answersRef.current);
      // Submit
      await apiClient.learner.examAttempt.submit(attempt.id, { metadata: { source: autoSubmit ? "auto-timeout" : "submit-button" } });
      // Get result
      const resultRes = await apiClient.learner.examAttempt.getResult(attempt.id);
      setResult(mapAttemptResultToMockExam(resultRes.data));
      setPageState("result");
    } catch (err: any) {
      setErrorMsg(err.message || "Nộp bài thất bại");
      setPageState("error");
    } finally {
      submittingRef.current = false;
    }
  }, [attempt, saveAnswers]);

  useEffect(() => {
    submitRef.current = (autoSubmit = false) => {
      void handleSubmit(autoSubmit);
    };
  }, [handleSubmit]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = allQuestions.length;
  const currentQuestion = allQuestions[currentIdx];

  // ---- LOADING ----
  if (pageState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-gray-600">Đang tải đề thi...</p>
      </div>
    );
  }

  // ---- ERROR ----
  if (pageState === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">Có lỗi xảy ra</h2>
        <p className="text-gray-600 text-center">{errorMsg}</p>
        <button
          onClick={() => router.push("/student/mock-test")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // ---- SUBMITTING ----
  if (pageState === "submitting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-gray-600">Đang nộp bài và chấm điểm...</p>
      </div>
    );
  }

  // ---- RESULT ----
  if (pageState === "result" && result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nộp bài thành công!</h2>
          <p className="text-gray-500 mb-6">Kết quả bài thi của bạn</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {result.totalScore !== undefined && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-emerald-600">{result.totalScore}</div>
                <div className="text-sm text-gray-600">Tổng điểm</div>
              </div>
            )}
            {result.listeningScore !== undefined && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{result.listeningScore}</div>
                <div className="text-sm text-gray-600">Listening</div>
              </div>
            )}
            {result.readingScore !== undefined && (
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">{result.readingScore}</div>
                <div className="text-sm text-gray-600">Reading</div>
              </div>
            )}
            {result.accuracy !== undefined && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-600">{result.accuracy}%</div>
                <div className="text-sm text-gray-600">Độ chính xác</div>
              </div>
            )}
            {result.correctAnswers !== undefined && result.totalQuestions !== undefined && (
              <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                <div className="text-2xl font-bold text-gray-700">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Câu đúng</div>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/student/mock-test")}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Về trang thi thử
          </button>
        </motion.div>
      </div>
    );
  }

  // ---- EXAM ----
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-gray-800 text-sm">
            Câu {currentIdx + 1}/{totalCount}
          </span>
          <span className="text-xs text-gray-500">
            ({answeredCount} đã trả lời)
          </span>
        </div>

        {timeLeft !== null && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
            timeLeft < 300 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}

        <button
          onClick={() => handleSubmit(false)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Nộp bài
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question panel */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Part badge */}
              {currentQuestion.part && (
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg mb-3 font-medium">
                  {currentQuestion.part}
                </span>
              )}

              {/* Image */}
              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question image"
                  className="w-full max-h-64 object-contain rounded-lg mb-4 border border-gray-200"
                />
              )}

              {/* Audio */}
              {currentQuestion.audioUrl && (
                <audio controls className="w-full mb-4">
                  <source src={currentQuestion.audioUrl} />
                </audio>
              )}

              {/* Question content */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                {currentQuestion.stem && (
                  <p className="mb-3 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    {currentQuestion.stem}
                  </p>
                )}
                <p className="text-gray-800 font-medium leading-relaxed">
                  {currentQuestion.content}
                </p>
              </div>

              {/* Options */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleAnswer(currentQuestion.id, opt.key)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <span className={`font-bold mr-3 ${selected ? "text-emerald-600" : "text-gray-500"}`}>
                          {opt.key}.
                        </span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Flag button */}
              <button
                onClick={() => {
                  setFlagged((prev) => {
                    const next = new Set(prev);
                    if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
                    else next.add(currentQuestion.id);
                    return next;
                  });
                }}
                className={`mt-4 flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {flagged.has(currentQuestion.id) ? "Đã đánh dấu" : "Đánh dấu"}
              </button>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>
                <button
                  onClick={() => setCurrentIdx((i) => Math.min(totalCount - 1, i + 1))}
                  disabled={currentIdx === totalCount - 1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Câu tiếp
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Question map sidebar */}
        <div className="hidden lg:block w-56 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Bảng câu hỏi</p>
          <div className="grid grid-cols-5 gap-1.5">
            {allQuestions.map((q, idx) => {
              const answered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                    isCurrent
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                      : isFlagged
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : answered
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 rounded" />
              Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 rounded border border-amber-300" />
              Đánh dấu
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded" />
              Chưa trả lời
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
