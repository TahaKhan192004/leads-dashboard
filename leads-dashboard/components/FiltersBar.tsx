"use client";

import { EmailFilter, SortField, SortOrder } from "@/types";
import { ArrowUpDown, Filter, Tag } from "lucide-react";

interface FiltersBarProps {
  keywords: string[];
  selectedKeyword: string;
  onKeywordChange: (k: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  emailFilter: EmailFilter;
  onEmailFilterChange: (f: EmailFilter) => void;
  total: number;
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "created_at", label: "Date Added" },
  { field: "updated_at", label: "Last Updated" },
  { field: "business_name", label: "Business Name" },
  { field: "rating", label: "Rating" },
];

const EMAIL_FILTER_OPTIONS: { value: EmailFilter; label: string }[] = [
  { value: "all", label: "All Leads" },
  { value: "with_email", label: "Has Email" },
  { value: "without_email", label: "No Email" },
];

export default function FiltersBar({
  keywords,
  selectedKeyword,
  onKeywordChange,
  sortField,
  sortOrder,
  onSortChange,
  emailFilter,
  onEmailFilterChange,
  total,
}: FiltersBarProps) {
  function handleSortFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onSortChange(e.target.value as SortField, sortOrder);
  }

  function toggleSortOrder() {
    onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc");
  }

  const selectClass =
    "bg-surface-2 border border-border hover:border-border-bright text-text-primary text-xs font-mono px-3 py-2 rounded-lg outline-none focus:border-amber-500/50 transition-colors cursor-pointer appearance-none pr-8";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Total count */}
      <div className="flex items-center gap-1.5 text-text-dim text-xs font-mono mr-1">
        <span className="text-amber-400 font-semibold">{total.toLocaleString()}</span>
        <span>leads</span>
      </div>

      <div className="h-4 w-px bg-border hidden sm:block" />

      {/* Keyword filter */}
      {keywords.length > 0 && (
        <div className="relative flex items-center">
          <Tag className="absolute left-2.5 w-3 h-3 text-text-dim pointer-events-none" />
          <select
            value={selectedKeyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className={`${selectClass} pl-7`}
          >
            <option value="">All Keywords</option>
            {keywords.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Email filter */}
      <div className="relative flex items-center">
        <Filter className="absolute left-2.5 w-3 h-3 text-text-dim pointer-events-none" />
        <select
          value={emailFilter}
          onChange={(e) => onEmailFilterChange(e.target.value as EmailFilter)}
          className={`${selectClass} pl-7`}
        >
          {EMAIL_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort field */}
      <div className="relative flex items-center">
        <ArrowUpDown className="absolute left-2.5 w-3 h-3 text-text-dim pointer-events-none" />
        <select
          value={sortField}
          onChange={handleSortFieldChange}
          className={`${selectClass} pl-7`}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.field} value={opt.field}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort order toggle */}
      <button
        onClick={toggleSortOrder}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 border border-border hover:border-border-bright text-text-muted hover:text-text-primary text-xs font-mono transition-all duration-150"
        title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
      >
        {sortOrder === "desc" ? (
          <>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3 3.5a.5.5 0 011 0v8.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L3 12.293V3.5zm4 .5h6a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h5a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h4a.5.5 0 010 1H7a.5.5 0 010-1z" />
            </svg>
            Newest
          </>
        ) : (
          <>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3 12.5a.5.5 0 01-1 0V3.707L.854 4.854a.5.5 0 11-.708-.708l2-1.999.007-.007a.5.5 0 01.7.006l2 2a.5.5 0 11-.707.708L3 3.707V12.5zm4-9h6a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h5a.5.5 0 010 1H7a.5.5 0 010-1zm0 3h4a.5.5 0 010 1H7a.5.5 0 010-1z" />
            </svg>
            Oldest
          </>
        )}
      </button>
    </div>
  );
}
