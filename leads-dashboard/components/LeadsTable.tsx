"use client";

import { useState } from "react";
import { Lead } from "@/types";
import EmailDropdown from "./EmailDropdown";
import SocialsIcons from "./SocialsIcons";
import NotesModal from "./NotesModal";
import AiContextModal from "./AiContextModal";
import {
  MapPin,
  Phone,
  Star,
  Globe,
  ExternalLink,
  FileText,
  Map,
  Calendar,
  Sparkles,
} from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  onLeadUpdate: (id: string, updated: Partial<Lead>) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function RatingBadge({ rating }: { rating: string | null }) {
  if (!rating) return <span className="text-text-dim text-xs font-mono">—</span>;
  const num = parseFloat(rating);
  const color =
    num >= 4.5
      ? "text-emerald-400"
      : num >= 4
        ? "text-amber-400"
        : num >= 3
          ? "text-yellow-600"
          : "text-text-muted";
  return (
    <span className={`flex items-center gap-0.5 text-xs font-mono ${color}`}>
      <Star className="w-3 h-3 fill-current" />
      {rating}
    </span>
  );
}

export default function LeadsTable({ leads, onLeadUpdate }: LeadsTableProps) {
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [aiLead, setAiLead] = useState<Lead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4">
          <Map className="w-6 h-6 text-text-dim" />
        </div>
        <p className="text-text-muted font-mono text-sm">No leads found</p>
        <p className="text-text-dim font-mono text-xs mt-1">
          Try scraping a new keyword or adjusting filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              {[
                "Business",
                "Contact",
                "Location",
                "Rating",
                "Emails",
                "Socials",
                "Keyword",
                "Added",
                "Notes",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-text-dim text-xs font-mono uppercase tracking-widest font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                index={i}
                onOpenNotes={() => setNotesLead(lead)}
                onOpenAi={() => setAiLead(lead)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {notesLead && (
        <NotesModal
          leadId={notesLead.id}
          businessName={notesLead.business_name}
          initialNotes={notesLead.notes}
          onSave={(notes) => {
            onLeadUpdate(notesLead.id, { notes });
            setNotesLead(null);
          }}
          onClose={() => setNotesLead(null)}
        />
      )}

      {aiLead?.business_summary && (
        <AiContextModal
          businessName={aiLead.business_name}
          summary={aiLead.business_summary}
          onClose={() => setAiLead(null)}
        />
      )}
    </>
  );
}

function LeadRow({
  lead,
  index,
  onOpenNotes,
  onOpenAi,
}: {
  lead: Lead;
  index: number;
  onOpenNotes: () => void;
  onOpenAi: () => void;
}) {
  const hasNotes = lead.notes && lead.notes.trim().length > 0;

  return (
    <>
      <tr
        className={`border-b border-border/60 hover:bg-surface-2/50 transition-colors duration-100 ${index % 2 === 0 ? "" : "bg-surface/40"
          }`}
      >
        {/* Business */}
        <td className="px-4 py-3 max-w-[200px]">
          <div className="space-y-0.5">
            <p className="text-text-primary font-mono text-xs font-medium truncate leading-snug">
              {lead.business_name || (
                <span className="text-text-dim">Unnamed</span>
              )}
            </p>
            {lead.website && (
              <a
                href={
                  lead.website.startsWith("http")
                    ? lead.website
                    : `https://${lead.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400/70 hover:text-amber-400 text-xs font-mono transition-colors truncate"
              >
                <Globe className="w-2.5 h-2.5 flex-shrink-0" />
                <span className="truncate">{lead.website.replace(/^https?:\/\//i, "").split("/")[0]}</span>
              </a>
            )}
          </div>
        </td>

        {/* Contact */}
        <td className="px-4 py-3">
          {lead.phone ? (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs font-mono transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 flex-shrink-0" />
              {lead.phone}
            </a>
          ) : (
            <span className="text-text-dim text-xs font-mono">—</span>
          )}
        </td>

        {/* Location */}
        <td className="px-4 py-3 max-w-[180px]">
          {lead.address ? (
            <div className="flex items-start gap-1">
              <MapPin className="w-3 h-3 text-text-dim flex-shrink-0 mt-0.5" />
              <span className="text-text-muted text-xs font-mono leading-snug line-clamp-2">
                {lead.address}
              </span>
            </div>
          ) : (
            <span className="text-text-dim text-xs font-mono">—</span>
          )}
        </td>

        {/* Rating */}
        <td className="px-4 py-3">
          <RatingBadge rating={lead.rating} />
        </td>

        {/* Emails */}
        <td className="px-4 py-3">
          <EmailDropdown emails={lead.emails} firecrawlEmails={lead.firecrawl_emails} />
        </td>

        {/* Socials */}
        <td className="px-4 py-3">
          <SocialsIcons socials={lead.socials} />
        </td>

        {/* Keyword */}
        <td className="px-4 py-3">
          {lead.keyword ? (
            <span className="px-2 py-0.5 bg-surface-3 border border-border rounded-md text-text-muted text-xs font-mono whitespace-nowrap">
              {lead.keyword}
            </span>
          ) : (
            <span className="text-text-dim text-xs font-mono">—</span>
          )}
        </td>

        {/* Added */}
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="flex items-center gap-1 text-text-dim text-xs font-mono">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.created_at)}
          </span>
        </td>

        {/* Notes */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenNotes}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-mono transition-all duration-150 ${hasNotes
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                  : "bg-surface-3 border-border text-text-dim hover:text-text-muted hover:border-border-bright"
                }`}
            >
              <FileText className="w-3 h-3" />
              {hasNotes ? "Edit" : "Add"}
            </button>
            {lead.business_summary && (
              <button
                onClick={onOpenAi}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/15 text-xs font-mono transition-all duration-150"
                title="View AI context"
              >
                <Sparkles className="w-3 h-3" />
                AI
              </button>
            )}
            {lead.maps_url && (
              <a
                href={lead.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md border border-border hover:border-border-bright text-text-dim hover:text-text-muted transition-all"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
