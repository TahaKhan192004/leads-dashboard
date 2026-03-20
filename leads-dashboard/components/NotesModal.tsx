"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, FileText } from "lucide-react";

interface NotesModalProps {
  leadId: string;
  businessName: string | null;
  initialNotes: string | null;
  onSave: (notes: string) => void;
  onClose: () => void;
}

export default function NotesModal({
  leadId,
  businessName,
  initialNotes,
  onSave,
  onClose,
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      onSave(notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail — could add toast here
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-surface border border-border-bright rounded-xl shadow-2xl shadow-black/80 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-text-primary text-sm font-display font-semibold">
                {businessName || "Lead"}
              </p>
              <p className="text-text-dim text-xs font-mono">Notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this lead — status, follow-up reminders, contact history..."
            rows={8}
            className="w-full bg-surface-2 border border-border hover:border-border-bright focus:border-amber-500/50 rounded-lg px-4 py-3 text-text-primary text-sm font-mono placeholder:text-text-dim resize-none outline-none transition-colors duration-150 leading-relaxed"
          />
          <p className="mt-1.5 text-text-dim text-xs font-mono">
            Press{" "}
            <kbd className="px-1 py-0.5 bg-surface-3 border border-border rounded text-text-muted text-xs">
              ⌘S
            </kbd>{" "}
            to save
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary text-sm font-mono transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-sm font-mono font-semibold transition-all duration-150"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : saved ? "Saved!" : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
