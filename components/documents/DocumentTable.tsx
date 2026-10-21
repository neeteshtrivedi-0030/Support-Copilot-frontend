'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '../../types/document.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatBytes, formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { FileText, RotateCw, Trash2, Download, ExternalLink, Shield } from 'lucide-react';

interface DocumentTableProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  isLoading,
  onRetry,
  onDelete,
  onDownload,
}) => {
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        Loading knowledge base documents...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="py-16 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No documents found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Upload enterprise handbooks, policies, or manuals to begin powering the AI Copilot.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200/80 dark:border-slate-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Document</th>
            <th className="py-3.5 px-4 font-semibold">Type</th>
            <th className="py-3.5 px-4 font-semibold">Department</th>
            <th className="py-3.5 px-4 font-semibold">Status</th>
            <th className="py-3.5 px-4 font-semibold">Size</th>
            <th className="py-3.5 px-4 font-semibold">Uploaded</th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {documents.map((doc) => {
            const docId = doc._id || (doc as any).id;
            return (
              <tr
                key={docId}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3.5 px-4">
                  <Link
                    href={`/documents/${docId}`}
                    className="font-medium text-slate-900 dark:text-slate-100 hover:text-brand-600 flex items-center gap-2 group"
                  >
                    <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="truncate max-w-xs">{doc.name || doc.originalName}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                  </Link>
                  {doc.chunksCount !== undefined && doc.chunksCount > 0 && (
                    <span className="text-[10px] text-slate-400 ml-6">
                      {doc.chunksCount} chunks indexed
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="uppercase text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {doc.type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Shield className="w-2.5 h-2.5 text-slate-400" />
                    {doc.department}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Badge status={doc.status} />
                </td>
                <td className="py-3.5 px-4 text-slate-500">{formatBytes(doc.fileSize || 0)}</td>
                <td className="py-3.5 px-4 text-slate-500">{formatDate(doc.createdAt)}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {doc.status === 'failed' && isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetry(docId)}
                        title="Retry Ingestion"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(docId)}
                      title="Download Source Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(docId)}
                        title="Delete Document"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
