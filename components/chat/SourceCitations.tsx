'use client';

import React, { useState } from 'react';
import { SourceCitation } from '../../types/chat.types';
import { FileText, ChevronDown, ChevronUp, ExternalLink, Bookmark } from 'lucide-react';

interface SourceCitationsProps {
  sources: SourceCitation[];
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Bookmark className="w-3.5 h-3.5 text-brand-500" />
        <span>Source Citations ({sources.length})</span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2.5 space-y-2">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200 truncate">
                  <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="truncate">{source.documentName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {source.page && (
                    <span className="bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Page {source.page}
                    </span>
                  )}
                  {typeof source.similarityScore === 'number' && (
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {(source.similarityScore * 100).toFixed(0)}% Match
                    </span>
                  )}
                </div>
              </div>

              {source.section && (
                <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Section: {source.section}
                </p>
              )}

              {(source.snippet || source.text) && (
                <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 bg-white/80 dark:bg-slate-950/60 p-2 rounded border border-slate-100 dark:border-slate-800 italic">
                  &ldquo;{source.snippet || source.text}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
