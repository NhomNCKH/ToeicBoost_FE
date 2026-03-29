// app/admin/exams/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import { ActionIcon } from "@/components/ui/action-icons";
import { AdminConfirmDialog, AdminPagination } from "@/components/admin";
import { ExamStats } from "./components/ExamStats";
import { ExamFilters } from "./components/ExamFilters";
import { ExamCard } from "./components/ExamCard";
import { ExamListItem } from "./components/ExamListItem";
import { ExamDetailModal } from "./components/ExamDetailModal";
import { CreateExamModal, type CreateExamSuccessSnapshot } from "./components/CreateExamModal";
import { useExamTemplates } from "./hooks/useExamTemplates";
import { useExamActions } from "./hooks/useExamActions";
import { useToast } from "@/hooks/useToast";
import { formatExamPublishError } from "./utils/helpers";
import type { ExamTemplate } from "./types";

type ViewMode = "grid" | "list";
type ExamStatus = "all" | "published" | "draft" | "archived";
type ExamMode = "all" | "practice" | "mock_test" | "official_exam";

// ─── Workflow Banner ──────────────────────────────────────────────────────────
function WorkflowBanner() {
  const steps = [
    { n: 1, label: "Thông tin", desc: "Code, tên, mode" },
    { n: 2, label: "Cấu trúc", desc: "Sections" },
    { n: 3, label: "Quy tắc", desc: "Rules" },
    { n: 4, label: "Câu hỏi", desc: "Fill questions" },
    { n: 5, label: "Xuất bản", desc: "Publish" },
  ];
  return (
    <div className="workflow-banner-exams bg-white border border-gray-100 rounded-2xl p-4 shadow-sm overflow-hidden relative group">
      <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <div className="flex-shrink-0 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-8">
          <span className="workflow-banner-kicker text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Workflow</span>
          <h3 className="text-lg font-black text-gray-900 leading-tight">Quy trình<br className="hidden md:block" /> thiết lập</h3>
        </div>

        <div className="flex-1 w-full overflow-hidden">
          <div className="flex items-center justify-between py-1">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none group/step">
                <div className="flex items-center gap-3 transition-all duration-300 transform group-hover/step:translate-x-1">
                  <div className="relative">
                    <div className="workflow-step-dot w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover/step:bg-blue-600 group-hover/step:text-white group-hover/step:border-blue-600 group-hover/step:shadow-lg group-hover/step:shadow-blue-200 transition-all duration-300">
                      {s.n}
                    </div>
                    {/* Active dot indicator if needed, but keeping it simple for now */}
                  </div>
                  <div className="flex flex-col">
                    <span className="workflow-step-label text-[11px] font-bold text-gray-800 group-hover/step:text-blue-700 transition-colors duration-300">{s.label}</span>
                    <span className="workflow-step-desc text-[9px] text-gray-400 font-medium group-hover/step:text-gray-500 transition-colors duration-300">{s.desc}</span>
                  </div>
                </div>
                
                {i < steps.length - 1 && (
                  <div className="workflow-step-connector flex-1 mx-4 h-[1px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 relative overflow-hidden">
                    <div className="workflow-step-connector-glow absolute inset-0 bg-blue-400 transform -translate-x-full group-hover/step:translate-x-full transition-transform duration-1000 ease-in-out opacity-30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminExamsPage() {
  const { templates, loading, error, stats, pagination, refresh } = useExamTemplates();
  const { publishExam, duplicateExam, archiveExam, deleteExam } = useExamActions();
  const { notify } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus>("all");
  const [selectedMode, setSelectedMode] = useState<ExamMode>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [searchDebounced, setSearchDebounced] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ExamTemplate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const buildQueryParams = useCallback(
    (targetPage = page) => ({
      page: targetPage,
      limit: 12,
      keyword: searchDebounced || undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      mode: selectedMode !== "all" ? selectedMode : undefined,
    }),
    [page, searchDebounced, selectedStatus, selectedMode],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchDebounced(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus, selectedMode]);

  useEffect(() => {
    refresh(buildQueryParams(page));
  }, [page, searchDebounced, selectedStatus, selectedMode, refresh, buildQueryParams]);

  const handlePublish = async (id: string) => {
    try {
      await publishExam(id);
      notify({
        title: "Đã xuất bản",
        message: "Đề thi đã sẵn sàng cho học viên.",
        variant: "success",
      });
      refresh(buildQueryParams(page));
    } catch (err: unknown) {
      notify({
        title: "Không thể xuất bản",
        message: formatExamPublishError(err),
        variant: "error",
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    await duplicateExam(id);
    refresh(buildQueryParams(page));
  };

  const handleArchive = async (id: string) => {
    await archiveExam(id);
    refresh(buildQueryParams(page));
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    setDeleting(true);
    try {
      await deleteExam(templateToDelete.id);
      notify({
        title: "Đã xóa đề thi",
        message: `"${templateToDelete.name}" đã được gỡ khỏi hệ thống.`,
        variant: "success",
      });
      setTemplateToDelete(null);
      setSelectedTemplate((prev: ExamTemplate | null) =>
        prev?.id === templateToDelete.id ? null : prev,
      );
      refresh(buildQueryParams(page));
    } catch (err: unknown) {
      notify({
        title: "Không thể xóa",
        message: formatExamPublishError(err),
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  // After creating, auto-open detail modal on Sections tab so user can continue the workflow
  const handleCreateSuccess = (id: string, snapshot: CreateExamSuccessSnapshot) => {
    setShowCreateModal(false);
    setPage(1);
    refresh(buildQueryParams(1));
    setSelectedTemplate({
      id,
      code: snapshot.code,
      name: snapshot.name,
      status: "draft",
      mode: snapshot.mode,
      totalDurationSec: snapshot.totalDurationSec,
      totalQuestions: snapshot.totalQuestions,
      instructions: snapshot.instructions,
      shuffleQuestionOrder: snapshot.shuffleQuestionOrder,
      shuffleOptionOrder: snapshot.shuffleOptionOrder,
      _initialTab: "sections",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Không thể tải dữ liệu</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={() => refresh(buildQueryParams(page))} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Thử lại
        </button>
      </div>
    );
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };

  return (
    <div className="space-y-5">
      {/* Workflow Banner */}
      <WorkflowBanner />

      {/* Stats */}
      <ExamStats stats={stats} />

      {/* Filters */}
      <ExamFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actionSlot={
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
          >
            <ActionIcon action="add" className="w-4 h-4" />
            <span className="font-bold text-sm">Tạo đề thi mới</span>
          </button>
        }
      />

      {/* Templates */}
      {templates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Không tìm thấy đề thi</h3>
          <p className="text-gray-500 text-sm">Hãy thử thay đổi bộ lọc hoặc tạo đề thi mới</p>
          <button onClick={() => setShowCreateModal(true)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto">
            <ActionIcon action="add" className="w-4 h-4" />Tạo đề thi đầu tiên
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-3"}
        >
          {templates.map((template) =>
            viewMode === "grid" ? (
              <ExamCard
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
                onDuplicate={handleDuplicate}
                onPublish={template.status === "draft" ? handlePublish : undefined}
                onArchive={template.status === "published" ? handleArchive : undefined}
                onDelete={setTemplateToDelete}
              />
            ) : (
              <ExamListItem
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
                onDuplicate={handleDuplicate}
                onPublish={template.status === "draft" ? handlePublish : undefined}
                onArchive={template.status === "published" ? handleArchive : undefined}
                onDelete={setTemplateToDelete}
              />
            )
          )}
        </motion.div>
      )}

      {pagination.totalPages > 1 && (
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          loading={loading}
          onPageChange={setPage}
          itemLabel="đề thi"
        />
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedTemplate && (
          <ExamDetailModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onRefresh={refresh}
            initialTab={selectedTemplate._initialTab ?? "overview"}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateExamModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
          />
        )}
      </AnimatePresence>

      <AdminConfirmDialog
        open={!!templateToDelete}
        title="Xóa đề thi này?"
        description={
          templateToDelete
            ? `Đề "${templateToDelete.name}" (${templateToDelete.status === "published" ? "đã xuất bản" : templateToDelete.status === "archived" ? "đã lưu trữ" : "bản nháp"}) sẽ bị xóa vĩnh viễn. Mọi bài làm thi của học viên gắn với đề này cũng sẽ bị xóa. Thao tác không thể hoàn tác.`
            : undefined
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        danger
        loading={deleting}
        onClose={() => {
          if (!deleting) setTemplateToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
