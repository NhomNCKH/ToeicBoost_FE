"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Eye,
} from "lucide-react";

const PART_LABEL: Record<string, string> = {
  P1: "Part 1 — Mô tả hình ảnh",
  P2: "Part 2 — Hỏi & đáp",
  P3: "Part 3 — Hội thoại ngắn",
  P4: "Part 4 — Bài nói ngắn",
  P5: "Part 5 — Hoàn thành câu",
  P6: "Part 6 — Đoạn văn",
  P7: "Part 7 — Đọc hiểu",
};

export interface TemplatePreviewValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    sections: number;
    items: number;
    expectedQuestionCount: number;
    actualQuestionCount: number;
  };
}

interface PreviewOption {
  optionKey: string;
  content: string;
  sortOrder?: number;
}

interface PreviewQuestion {
  id: string;
  questionNo: number;
  prompt: string;
  options?: PreviewOption[];
}

interface PreviewAsset {
  kind: string;
  publicUrl?: string | null;
}

interface PreviewQuestionGroup {
  id: string;
  title: string;
  code: string;
  part: string;
  stem: string | null;
  assets?: PreviewAsset[];
  questions?: PreviewQuestion[];
}

export interface PreviewTemplatePayload {
  id: string;
  name: string;
  code: string;
  mode: string;
  totalQuestions?: number;
  totalDurationSec?: number;
  instructions?: string | null;
  sections?: {
    id: string;
    part: string;
    sectionOrder: number;
    expectedGroupCount?: number;
    expectedQuestionCount?: number;
  }[];
  items?: {
    id: string;
    sectionId: string;
    displayOrder: number;
    questionGroup?: PreviewQuestionGroup;
  }[];
}

export interface ExamPreviewModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  errorMessage: string | null;
  payload: {
    template: PreviewTemplatePayload;
    validation: TemplatePreviewValidation;
  } | null;
}

function sortSections<T extends { sectionOrder?: number }>(sections: T[] | undefined): T[] {
  return [...(sections ?? [])].sort(
    (a, b) => (a.sectionOrder ?? 0) - (b.sectionOrder ?? 0),
  );
}

function itemsForSection(
  template: PreviewTemplatePayload,
  sectionId: string,
) {
  return [...(template.items ?? [])]
    .filter((i) => i.sectionId === sectionId)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function assetUrl(assets: PreviewAsset[] | undefined, kind: string): string | undefined {
  const u = assets?.find((a) => a.kind === kind)?.publicUrl;
  return u || undefined;
}

function sortQuestions(qs: PreviewQuestion[] | undefined): PreviewQuestion[] {
  return [...(qs ?? [])].sort((a, b) => (a.questionNo ?? 0) - (b.questionNo ?? 0));
}

function sortOptions(opts: PreviewOption[] | undefined): PreviewOption[] {
  return [...(opts ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/** Vùng cuộn: màu trong globals (.exam-preview-body) — sáng khi admin light, tối khi admin dark. */
const previewBodyClass = "exam-preview-body antialiased";

export function ExamPreviewModal({
  open,
  onClose,
  loading,
  errorMessage,
  payload,
}: ExamPreviewModalProps) {
  const flatQuestionCount = useMemo(() => {
    if (!payload?.template) return 0;
    let n = 0;
    for (const it of payload.template.items ?? []) {
      n += it.questionGroup?.questions?.length ?? 0;
    }
    return n;
  }, [payload]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]/88 p-3 backdrop-blur-md sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="exam-preview-surface flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)]"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3.5 sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
                    <Eye className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="ep-text-primary truncate text-base font-bold tracking-tight sm:text-lg">
                      Xem trước đề thi
                    </h2>
                    {payload?.template?.name && (
                      <p className="truncate text-sm font-medium text-slate-600">
                        {payload.template.name}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Chế độ xem — không chấm điểm, không lưu lựa chọn
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Validation — gọn, không dải xanh full width */}
            {payload?.validation && (
              <div className="flex-shrink-0 border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6">
                <div
                  className={`flex flex-col gap-2 rounded-xl border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                    payload.validation.isValid
                      ? "border-emerald-200/80 bg-emerald-50/90"
                      : "border-amber-200/90 bg-amber-50/90"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {payload.validation.isValid ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        payload.validation.isValid ? "text-emerald-900" : "text-amber-950"
                      }`}
                    >
                      {payload.validation.isValid
                        ? "Cấu trúc hợp lệ"
                        : "Có lỗi hoặc cảnh báo"}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-snug text-slate-600 sm:text-right">
                    <span className="whitespace-nowrap">
                      {payload.validation.summary.sections} phần
                    </span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="whitespace-nowrap">
                      {payload.validation.summary.items} nhóm
                    </span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="whitespace-nowrap">
                      {payload.validation.summary.actualQuestionCount}/
                      {payload.validation.summary.expectedQuestionCount} câu
                    </span>
                  </p>
                </div>
                {(payload.validation.errors.length > 0 ||
                  payload.validation.warnings.length > 0) && (
                  <ul className="mt-2 max-h-20 list-inside list-disc space-y-0.5 overflow-y-auto text-[11px] leading-relaxed text-slate-700">
                    {payload.validation.errors.map((e, i) => (
                      <li key={`e-${i}`} className="marker:text-red-500">
                        {e}
                      </li>
                    ))}
                    {payload.validation.warnings.map((w, i) => (
                      <li key={`w-${i}`} className="marker:text-amber-600">
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Body */}
            <div
              className={`min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 ${previewBodyClass} [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]`}
            >
              {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                  <p className="text-sm font-semibold text-slate-700">
                    Đang tải bản xem trước…
                  </p>
                </div>
              )}

              {!loading && errorMessage && (
                <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
                  <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
                  <p className="text-sm font-semibold text-red-800">{errorMessage}</p>
                </div>
              )}

              {!loading && !errorMessage && payload?.template && (
                <div className="mx-auto max-w-2xl space-y-6 pb-6">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-800">
                      <BookOpen className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="font-mono text-xs font-bold tracking-tight text-slate-600">
                        {payload.template.code}
                      </span>
                      <span className="hidden text-slate-300 sm:inline">|</span>
                      <span>
                        {flatQuestionCount} câu
                        {typeof payload.template.totalQuestions === "number" && (
                          <span className="text-slate-500">
                            {" "}
                            / {payload.template.totalQuestions} (cấu hình)
                          </span>
                        )}
                      </span>
                      {typeof payload.template.totalDurationSec === "number" && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span>{Math.floor(payload.template.totalDurationSec / 60)} phút</span>
                        </>
                      )}
                    </div>
                    {payload.template.instructions && (
                      <div className="ep-bg-instructions mt-3 rounded-xl border border-slate-100 p-3.5 text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                        {payload.template.instructions}
                      </div>
                    )}
                  </div>

                  {sortSections(payload.template.sections).map((section) => {
                    const sectionItems = itemsForSection(payload.template, section.id);
                    if (sectionItems.length === 0) return null;

                    return (
                      <section
                        key={section.id}
                        className="scroll-mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50"
                      >
                        <div className="border-b border-slate-100 bg-white px-4 py-3.5 sm:px-5">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                              {section.sectionOrder}
                            </span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Phần thi
                              </p>
                              <h3 className="ep-text-primary text-[15px] font-bold leading-snug">
                                {PART_LABEL[section.part] ?? section.part}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="ep-bg-section space-y-8 p-4 sm:p-5">
                          {sectionItems.map((item) => {
                            const g = item.questionGroup;
                            if (!g) {
                              return (
                                <div
                                  key={item.id}
                                  className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900"
                                >
                                  Thiếu dữ liệu nhóm câu (item {item.id.slice(0, 8)}…).
                                </div>
                              );
                            }

                            const imageUrl = assetUrl(g.assets, "image");
                            const audioUrl = assetUrl(g.assets, "audio");
                            const questions = sortQuestions(g.questions);

                            return (
                              <div
                                key={item.id}
                                className="border-b border-slate-200/80 pb-8 last:border-0 last:pb-0"
                              >
                                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                                  <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                    {g.code}
                                  </span>
                                  <span className="ep-text-primary text-[13px] font-semibold">
                                    {g.title}
                                  </span>
                                </div>

                                {imageUrl && (
                                  <img
                                    src={imageUrl}
                                    alt=""
                                    className="mb-4 max-h-72 w-full rounded-xl border border-slate-200 bg-white object-contain p-1"
                                  />
                                )}
                                {audioUrl && (
                                  <audio
                                    controls
                                    className="exam-preview-audio mb-4 h-10 w-full max-w-full rounded-lg border border-slate-200 bg-white"
                                  >
                                    <source src={audioUrl} />
                                  </audio>
                                )}

                                {g.stem && (
                                  <div className="ep-text-primary mb-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-[13px] leading-relaxed shadow-sm">
                                    {g.stem}
                                  </div>
                                )}

                                <div className="space-y-5">
                                  {questions.map((q) => (
                                    <div
                                      key={q.id}
                                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100/80 sm:p-5"
                                    >
                                      <p className="ep-text-primary mb-4 text-[15px] font-medium leading-relaxed">
                                        <span className="mr-2 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-slate-900 px-2 text-xs font-bold text-white">
                                          {q.questionNo}
                                        </span>
                                        {q.prompt}
                                      </p>
                                      {sortOptions(q.options).length > 0 ? (
                                        <div className="grid gap-2">
                                          {sortOptions(q.options).map((opt) => (
                                            <div
                                              key={opt.optionKey}
                                              role="presentation"
                                              className="group flex gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50/80"
                                            >
                                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-800 ring-1 ring-slate-200/80 group-hover:bg-white">
                                                {opt.optionKey}
                                              </span>
                                              <span className="ep-text-primary min-w-0 flex-1 pt-0.5 text-[15px] font-normal leading-snug">
                                                {opt.content}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs font-medium italic text-slate-500">
                                          Không có đáp án (kiểm tra dữ liệu ngân hàng).
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
