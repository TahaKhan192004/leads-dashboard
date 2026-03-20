"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Zap, Globe, Brain, Loader2, CheckCircle, XCircle, X } from "lucide-react";
import { startScrapeJob, pollJobStatus } from "@/lib/api";
import { JobStatusResponse } from "@/types";

interface SearchBarProps {
  onJobComplete: () => void;
}

type JobState = {
  jobId: string;
  status: JobStatusResponse["status"];
  message: string;
  totalLeads?: number;
};

export default function SearchBar({ onJobComplete }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [maxLeads, setMaxLeads] = useState(20);
  const [websiteScraping, setWebsiteScraping] = useState(true);
  const [aiContext, setAiContext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<JobState | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => () => stopPolling(), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setJob(null);
    stopPolling();

    try {
      const response = await startScrapeJob({
        search_query: query.trim(),
        max_leads: maxLeads,
        run_website_scraper: websiteScraping,
        run_summary: aiContext,
      });

      setJob({ jobId: response.job_id, status: "pending", message: "Job queued…" });

      pollRef.current = setInterval(async () => {
        try {
          const status = await pollJobStatus(response.job_id);
          setJob({
            jobId: response.job_id,
            status: status.status,
            message:
              status.status === "running"
                ? "Scraping in progress…"
                : status.status === "done"
                ? `Done! Found ${status.result?.total_leads ?? 0} leads`
                : status.status === "failed"
                ? status.error || "Job failed"
                : "Job queued…",
            totalLeads: status.result?.total_leads,
          });

          if (status.status === "done" || status.status === "failed") {
            stopPolling();
            setLoading(false);
            if (status.status === "done") {
              setTimeout(() => {
                onJobComplete();
              }, 800);
            }
          }
        } catch {
          stopPolling();
          setLoading(false);
          setJob((prev) => prev ? { ...prev, status: "failed", message: "Polling error" } : null);
        }
      }, 2000);
    } catch (err: unknown) {
      setLoading(false);
      setJob({
        jobId: "",
        status: "failed",
        message: err instanceof Error ? err.message : "Failed to start job",
      });
    }
  }

  function dismissJob() {
    stopPolling();
    setJob(null);
    setLoading(false);
  }

  const statusColors: Record<string, string> = {
    pending: "text-text-muted",
    running: "text-amber-400",
    done: "text-emerald-400",
    failed: "text-red-400",
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. plumbers in London, restaurants in Dubai…"
              className="w-full bg-surface-2 border border-border hover:border-border-bright focus:border-amber-500/60 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-dim text-sm font-mono outline-none transition-colors duration-150"
            />
          </div>

          {/* Max leads */}
          <div className="relative">
            <select
              value={maxLeads}
              onChange={(e) => setMaxLeads(Number(e.target.value))}
              className="h-full bg-surface-2 border border-border hover:border-border-bright text-text-primary text-xs font-mono px-3 py-3 rounded-xl outline-none focus:border-amber-500/60 transition-colors cursor-pointer appearance-none pr-7"
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n} leads</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-mono font-bold rounded-xl transition-all duration-150 animate-pulse-amber whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? "Running…" : "Scrape"}
          </button>
        </div>

        {/* Toggles row */}
        <div className="flex items-center gap-4 pl-1">
          <ToggleOption
            icon={<Globe className="w-3.5 h-3.5" />}
            label="Website Scraping"
            enabled={websiteScraping}
            onChange={setWebsiteScraping}
          />
          <ToggleOption
            icon={<Brain className="w-3.5 h-3.5" />}
            label="AI Context"
            enabled={aiContext}
            onChange={setAiContext}
          />
        </div>
      </form>

      {/* Job status banner */}
      {job && (
        <div
          className={`mt-3 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${
            job.status === "done"
              ? "bg-emerald-500/5 border-emerald-500/20"
              : job.status === "failed"
              ? "bg-red-500/5 border-red-500/20"
              : "bg-amber-500/5 border-amber-500/20"
          } animate-fade-in`}
        >
          <div className="flex items-center gap-2.5">
            {job.status === "running" || job.status === "pending" ? (
              <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            ) : job.status === "done" ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className={`text-xs font-mono ${statusColors[job.status]}`}>
              {job.message}
            </span>
            {job.jobId && (
              <span className="text-text-dim text-xs font-mono hidden sm:inline">
                · {job.jobId.slice(0, 8)}…
              </span>
            )}
          </div>
          <button
            onClick={dismissJob}
            className="text-text-dim hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function ToggleOption({
  icon,
  label,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all duration-150 ${
        enabled
          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
          : "bg-surface-2 border-border text-text-dim hover:text-text-muted"
      }`}
    >
      {icon}
      {label}
      <span
        className={`ml-0.5 w-5 h-2.5 rounded-full inline-block transition-colors duration-150 relative ${
          enabled ? "bg-amber-500" : "bg-surface-3"
        }`}
      >
        <span
          className={`absolute top-0.5 w-1.5 h-1.5 rounded-full bg-white transition-all duration-150 ${
            enabled ? "left-[12px]" : "left-[2px]"
          }`}
        />
      </span>
    </button>
  );
}
