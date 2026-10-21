'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocumentDetails, useDocuments } from '../../../hooks/useDocuments';
import { documentService } from '../../../services/document.service';
import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatBytes, formatDate } from '../../../utils/formatters';
import {
  FileText,
  ArrowLeft,
  Download,
  RotateCw,
  Trash2,
  Shield,
  Hash,
  Clock,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAdmin } = useAuth();

  const { data: doc, isLoading } = useDocumentDetails(id);
  const { retryProcessing, deleteDocument } = useDocuments();

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">Loading document details...</div>
    );
  }

  if (!doc) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-sm text-slate-500">Document not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/documents')}>
          Back to Documents
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm('Permanently delete this document and its vector embeddings?')) {
      await deleteDocument(id);
      router.push('/documents');
    }
  };

  const handleDownload = async () => {
    try {
      const res = await documentService.downloadDocument(id);
      if ('downloadUrl' in res && res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      } else if (res instanceof Blob) {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${id}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.push('/documents')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Knowledge Documents</span>
      </button>

      {/* Header card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-brand-50 dark:bg-brand-950/60 text-brand-600 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {doc.name || doc.originalName}
              </h1>
              <Badge status={doc.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Original: {doc.originalName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {doc.status === 'failed' && isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => retryProcessing(id)}
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            >
              Retry Ingestion
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>

          {isAdmin && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Metadata & Governance
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Department Scope:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                {doc.department}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Document Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                {doc.type}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">File Size:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatBytes(doc.fileSize)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> SHA-256 Hash:
              </span>
              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-xs">
                {doc.fileHash}
              </span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            RAG Pipeline Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Chunks Extracted:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {doc.chunksCount ?? 0} Chunks
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Ingestion Date:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(doc.createdAt)}
              </span>
            </div>

            {doc.error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                <p className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Processing Error:
                </p>
                <p className="text-[11px] mt-1">{doc.error}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
