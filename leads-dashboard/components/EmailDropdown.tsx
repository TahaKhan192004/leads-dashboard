"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mail, ExternalLink } from "lucide-react";

interface EmailDropdownProps {
  emails: string[];
  firecrawlEmails?: string[];
}

function cleanEmail(email: string): string {
  return email.replace(/^mailto:/i, "").trim();
}

function dedupeEmails(emails: string[], firecrawl: string[]): string[] {
  const all = [...emails, ...firecrawl].map(cleanEmail).filter(Boolean);
  return [...new Set(all)];
}

export default function EmailDropdown({ emails, firecrawlEmails = [] }: EmailDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const allEmails = dedupeEmails(emails, firecrawlEmails);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (allEmails.length === 0) {
    return <span className="text-text-dim text-xs font-mono">No emails</span>;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-3 border border-border hover:border-border-bright text-text-primary text-xs font-mono transition-all duration-150 group"
      >
        <Mail className="w-3.5 h-3.5 text-amber-400" />
        <span>{allEmails.length} email{allEmails.length > 1 ? "s" : ""}</span>
        <ChevronDown
          className={`w-3 h-3 text-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[260px] bg-surface border border-border-bright rounded-lg shadow-2xl shadow-black/60 animate-slide-up overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-text-dim text-xs uppercase tracking-widest font-mono">Emails</p>
          </div>
          <ul className="py-1 max-h-48 overflow-y-auto">
            {allEmails.map((email) => (
              <li key={email} className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-surface-2 group/item">
                <span className="text-text-primary text-xs font-mono truncate flex-1">{email}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Send via Gmail"
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-mono border border-amber-500/20 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Gmail
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
