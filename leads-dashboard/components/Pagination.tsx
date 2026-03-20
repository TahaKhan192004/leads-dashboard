"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  total: number;
}

export default function Pagination({ page, totalPages, onPageChange, limit, total }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page window
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
      <p className="text-text-dim text-xs font-mono">
        Showing{" "}
        <span className="text-text-primary">{from}–{to}</span>{" "}
        of{" "}
        <span className="text-text-primary">{total.toLocaleString()}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1 w-full sm:w-auto">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-border hover:border-border-bright disabled:opacity-30 disabled:cursor-not-allowed text-text-muted hover:text-text-primary transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-text-dim text-xs font-mono">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[28px] h-7 rounded-lg text-xs font-mono transition-all duration-150 ${
                p === page
                  ? "bg-amber-500 text-black font-semibold border border-amber-400"
                  : "border border-border hover:border-border-bright text-text-muted hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-border hover:border-border-bright disabled:opacity-30 disabled:cursor-not-allowed text-text-muted hover:text-text-primary transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
