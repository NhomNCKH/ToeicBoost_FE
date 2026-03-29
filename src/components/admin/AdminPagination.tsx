"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  /** Danh từ số ít: "nhóm", "đề thi", … */
  itemLabel: string;
  className?: string;
};

/** Danh sách số trang + dấu … khi tổng nhiều trang */
function buildPageList(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>([
    1,
    totalPages,
    current,
    current - 1,
    current + 1,
  ]);
  Array.from(set).forEach((p) => {
    if (p < 1 || p > totalPages) set.delete(p);
  });
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]);
  }
  return out;
}

export function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  loading = false,
  onPageChange,
  itemLabel,
  className = "",
}: AdminPaginationProps) {
  if (totalPages < 1) return null;

  const safeLimit = Math.max(1, limit);
  const start = total === 0 ? 0 : (page - 1) * safeLimit + 1;
  const end = total === 0 ? 0 : Math.min(page * safeLimit, total);
  const pages = buildPageList(page, totalPages);
  const busy = !!loading;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 ${className}`}
    >
      <p className="text-center text-[13px] text-gray-600 sm:text-left">
        <span className="font-medium text-gray-800">
          Hiển thị{" "}
          <span className="tabular-nums">
            {start}–{end}
          </span>
        </span>
        <span className="text-gray-400"> · </span>
        <span className="text-gray-500">
          <span className="tabular-nums font-semibold text-gray-700">{total}</span> {itemLabel}
        </span>
        <span className="text-gray-400"> · </span>
        <span className="text-gray-500">
          Trang{" "}
          <span className="tabular-nums font-semibold text-gray-800">
            {page}/{totalPages}
          </span>
        </span>
      </p>

      <nav
        className="flex flex-wrap items-center justify-center gap-1 sm:justify-end"
        aria-label="Phân trang"
      >
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={page <= 1 || busy}
            onClick={() => onPageChange(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            title="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            disabled={page <= 1 || busy}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <ul className="flex items-center gap-1 px-1">
          {pages.map((item, idx) =>
            item === "ellipsis" ? (
              <li
                key={`e-${idx}`}
                className="flex h-9 min-w-[2rem] items-center justify-center text-gray-400"
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onPageChange(item)}
                  className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-lg px-2.5 py-2 text-sm font-semibold tabular-nums transition-colors ${
                    item === page
                      ? "border border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                      : "border border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                  } disabled:opacity-50`}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={page >= totalPages || busy}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            title="Trang sau"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            disabled={page >= totalPages || busy}
            onClick={() => onPageChange(totalPages)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            title="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </nav>
    </div>
  );
}
