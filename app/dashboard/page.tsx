'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useDocuments } from '../../hooks/useDocuments';
import { documentService } from '../../services/document.service';
import { useConversations } from '../../hooks/useConversations';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DocumentTable } from '../../components/documents/DocumentTable';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import {
  MessageSquare,
  FileText,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Search,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');

  const {
    documents,
    isLoading: isDocsLoading,
    retryProcessing,
    deleteDocument,
  } = useDocuments({
    limit: 5,
  });
  const { conversations, isLoading: isConvsLoading } = useConversations(1, 4);

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    router.push(`/chat?prompt=${encodeURIComponent(quickPrompt.trim())}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI-Powered Knowledge & Support Copilot</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {user?.name || 'Team Member'}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Ask natural language questions across company policies, HR manuals, IT handbooks, and
            technical docs with verified source citations.
          </p>

          {/* Quick Question Search Bar */}
          <form onSubmit={handleQuickAsk} className="mt-6 flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Ask e.g. What is our work-from-home policy?"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 backdrop-blur-md"
              />
            </div>
            <Button type="submit" size="lg" className="bg-brand-500 hover:bg-brand-400">
              Ask AI
            </Button>
          </form>
        </div>

        {/* Ambient decorative gradient */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card hoverable className="flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                AI Copilot Chat
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Start a multi-turn conversation with streaming answers and chunk citations.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Launch Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Knowledge Base
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore indexed enterprise handbooks, manuals, and security guidelines.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Browse Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card hoverable className="flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Ingest Document
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload new PDF, DOCX, or TXT documents into the RAG vector store.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Upload Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Knowledge Documents
            </h2>
            <p className="text-xs text-slate-500">
              Recently ingested organizational policies and manuals
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => setIsUploadOpen(true)}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                Upload Document
              </Button>
            )}
            <Link href="/documents">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <DocumentTable
          documents={documents}
          isLoading={isDocsLoading}
          onRetry={retryProcessing}
          onDelete={deleteDocument}
          onDownload={async (id) => {
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
          }}
        />
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
