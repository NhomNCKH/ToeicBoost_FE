"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  loading = false,
  danger = false,
  onClose,
  onConfirm,
}: AdminConfirmDialogProps) {
  const isLongTitle = title.trim().length > 28;
  const isLongDescription = (description?.trim().length ?? 0) > 95;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/50 backdrop-blur-[1.5px]" onClick={onClose} aria-label="close confirm dialog" />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="surface relative w-full max-w-[500px] rounded-2xl p-4 md:p-5"
          >
            <h3
              className={`font-bold tracking-[-0.015em] leading-[1.12] text-slate-900 ${
                isLongTitle ? "text-[1.25rem] md:text-[1.35rem]" : "text-[1.35rem] md:text-[1.5rem]"
              }`}
            >
              {title}
            </h3>
            {description ? (
              <p
                className={`mt-3 border-t border-slate-200 pt-3 font-medium text-slate-700 ${
                  isLongDescription ? "text-[0.92rem] leading-[1.4]" : "text-[0.96rem] leading-[1.36]"
                }`}
              >
                {description}
              </p>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#3b4f7a] bg-[#1f2c4a] px-4 text-[0.95rem] font-semibold text-white transition-colors hover:border-[#f7bc2f] hover:bg-[#25355a] disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#f7bc2f] bg-[#f7bc2f] px-4 text-[0.95rem] font-semibold text-[#1b223a] transition-colors hover:border-[#ffd56b] hover:bg-[#efb11f] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

