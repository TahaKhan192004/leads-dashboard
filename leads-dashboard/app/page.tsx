"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lead, LeadsResponse, SortField, SortOrder, EmailFilter } from "@/types";
import SearchBar from "@/components/SearchBar";
import LeadsTable from "@/components/LeadsTable";
import FiltersBar from "@/components/FiltersBar";
import Pagination from "@/components/Pagination";
import { Search, RefreshCw, Map, TrendingUp, Mail, Zap, LogOut } from "lucide-react";

const LIMIT = 20;

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [emailFilter, setEmailFilter] = useState<EmailFilter>("all");

  // Stats
  const [stats, setStats] = useState({ total: 0, withEmail: 0, keywords: 0 });
  const statsLoadedRef = useRef(false);

  const totalPages = Math.ceil(total / LIMIT);

  const fetchLeads = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true);
      else setRefreshing(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        sortField,
        sortOrder,
        emailFilter,
      });
      if (selectedKeyword) params.set("keyword", selectedKeyword);
      if (search) params.set("search", search);

      try {
        const res = await fetch(`/api/leads?${params}`);
        const data: LeadsResponse = await res.json();
        setLeads(data.data || []);
        setTotal(data.total || 0);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, sortField, sortOrder, emailFilter, selectedKeyword, search]
  );

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/keywords");
      const data = await res.json();
      setKeywords(data.keywords || []);
    } catch {
      // silently fail
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (statsLoadedRef.current) return;
    try {
      const [allRes, emailRes] = await Promise.all([
        fetch("/api/leads?limit=1"),
        fetch("/api/leads?limit=1&emailFilter=with_email"),
      ]);
      const [allData, emailData] = await Promise.all([allRes.json(), emailRes.json()]);
      setStats({
        total: allData.total || 0,
        withEmail: emailData.total || 0,
        keywords: keywords.length,
      });
      statsLoadedRef.current = true;
    } catch {
      // silently fail
    }
  }, [keywords.length]);

  // Initial load
  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function handleSortChange(field: SortField, order: SortOrder) {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  }

  function handleKeywordChange(k: string) {
    setSelectedKeyword(k);
    setPage(1);
  }

  function handleEmailFilterChange(f: EmailFilter) {
    setEmailFilter(f);
    setPage(1);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleJobComplete() {
    statsLoadedRef.current = false;
    setPage(1);
    fetchKeywords();
    fetchLeads({ silent: true });
    fetchStats();
  }

  function handleLeadUpdate(id: string, updated: Partial<Lead>) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
  }

  const totalWithEmail = leads.filter(
    (l) => (l.emails?.length || 0) + (l.firecrawl_emails?.length || 0) > 0
  ).length;

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Map className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-display font-bold text-text-primary tracking-tight">
              LeadRadar
            </span>
            <span className="hidden sm:inline text-text-dim font-mono text-xs border-l border-border pl-3">
              Google Maps Intelligence
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => fetchLeads({ silent: true })}
              disabled={refreshing}
              className="p-1.5 rounded-lg border border-border hover:border-border-bright text-text-dim hover:text-text-muted transition-all disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="h-5 w-px bg-border" />
            <span className="text-text-dim font-mono text-xs">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="h-5 w-px bg-border" />
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded-lg border border-border hover:border-red-500/40 text-text-dim hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Total Leads"
            value={stats.total.toLocaleString()}
            color="amber"
          />
          <StatCard
            icon={<Mail className="w-4 h-4" />}
            label="With Email"
            value={stats.withEmail.toLocaleString()}
            color="emerald"
          />
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label="Keywords"
            value={keywords.length.toLocaleString()}
            color="sky"
          />
          <StatCard
            icon={<Map className="w-4 h-4" />}
            label="This Page"
            value={leads.length.toString()}
            color="purple"
          />
        </div>

        {/* Search + Scrape section */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="font-display font-semibold text-text-primary text-sm">
              Scrape New Leads
            </h2>
          </div>
          <SearchBar onJobComplete={handleJobComplete} />
        </div>

        {/* Leads section */}
        <div className="space-y-4">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display font-semibold text-text-primary flex items-center gap-2">
              <span>Lead Database</span>
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-border border-t-amber-400 animate-spin inline-block" />
              )}
            </h2>

            {/* Table search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value === "") {
                    setSearch("");
                    setPage(1);
                  }
                }}
                placeholder="Search name, address, phone…"
                className="w-full bg-surface-2 border border-border hover:border-border-bright focus:border-amber-500/50 rounded-lg pl-9 pr-4 py-2 text-text-primary placeholder:text-text-dim text-xs font-mono outline-none transition-colors"
              />
            </form>
          </div>

          {/* Filters */}
          <FiltersBar
            keywords={keywords}
            selectedKeyword={selectedKeyword}
            onKeywordChange={handleKeywordChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            emailFilter={emailFilter}
            onEmailFilterChange={handleEmailFilterChange}
            total={total}
          />

          {/* Table */}
          <div className="animate-fade-in">
            <LeadsTable leads={leads} onLeadUpdate={handleLeadUpdate} />
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            limit={LIMIT}
            total={total}
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "amber" | "emerald" | "sky" | "purple";
}) {
  const colors = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg border ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-text-dim font-mono text-xs">{label}</p>
        <p className="text-text-primary font-display font-bold text-lg leading-none mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
