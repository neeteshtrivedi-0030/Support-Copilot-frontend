'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../services/admin.service';
import { AnalyticsStatCards } from '../../../components/admin/AnalyticsStatCards';
import { Card } from '../../../components/ui/Card';
import { BarChart3, HelpCircle, FileText, ThumbsUp, Target, Clock, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminService.getAnalytics(),
    refetchInterval: 15000, // refresh every 15s
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            AI Knowledge & Support Analytics
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Monitor enterprise copilot activity, RAG retrieval quality, and user satisfaction metrics.
        </p>
      </div>

      {/* Top Stat Cards */}
      <AnalyticsStatCards metrics={metrics || null} />

      {/* RAG Evaluation & Quality Box (PDF Task 14) */}
      <Card className="space-y-4 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-brand-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              RAG Evaluation & Generation Quality (Task 14)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full">
            Real-Time Scoring
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Retrieval Success
            </p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics?.ragEvaluation?.retrievalSuccessRate !== undefined
                ? `${(metrics.ragEvaluation.retrievalSuccessRate * 100).toFixed(1)}%`
                : '-'}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Positive Feedback
            </p>
            <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
              {metrics?.ragEvaluation?.positiveFeedbackRate !== undefined
                ? `${(metrics.ragEvaluation.positiveFeedbackRate * 100).toFixed(1)}%`
                : '-'}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Avg Similarity Score
            </p>
            <p className="text-xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
              {metrics?.ragEvaluation?.averageRetrievalScore !== undefined
                ? `${(metrics.ragEvaluation.averageRetrievalScore * 100).toFixed(1)}%`
                : '-'}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              No-Answer Rate
            </p>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
              {metrics?.ragEvaluation?.noAnswerRate !== undefined
                ? `${(metrics.ragEvaluation.noAnswerRate * 100).toFixed(1)}%`
                : '-'}
            </p>
          </div>
        </div>
      </Card>

      {/* Grid: Most Asked Questions & Most Used Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Asked Questions */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Most Frequently Asked Questions
            </h3>
          </div>

          {metrics?.mostAskedQuestions && metrics.mostAskedQuestions.length > 0 ? (
            <div className="space-y-2">
              {metrics.mostAskedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-sm">
                    {idx + 1}. {q.question || (q as any).query || 'Untitled Query'}
                  </span>
                  <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                    {q.count} queries
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No frequent questions recorded yet
            </div>
          )}
        </Card>

        {/* Most Used Documents */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Most Used Knowledge Documents
            </h3>
          </div>

          {metrics?.mostUsedDocuments && metrics.mostUsedDocuments.length > 0 ? (
            <div className="space-y-2">
              {metrics.mostUsedDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-sm">
                    {idx + 1}. {doc.documentName}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {doc.queryCount ?? (doc as any).count ?? 0} citations
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No document citations logged yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
