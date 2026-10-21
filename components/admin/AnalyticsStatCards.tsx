'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsMetrics } from '../../types/analytics.types';
import { Users, FileText, HelpCircle, CheckCircle, Clock, ThumbsUp } from 'lucide-react';

interface AnalyticsStatCardsProps {
  metrics: AnalyticsMetrics | null;
}

export const AnalyticsStatCards: React.FC<AnalyticsStatCardsProps> = ({ metrics }) => {
  const raw = metrics as any;
  const totalUsers = metrics?.totalUsers ?? raw?.users?.total;
  const activeUsers = metrics?.activeUsers ?? raw?.users?.active ?? 0;
  const totalDocs = metrics?.totalDocuments ?? raw?.documents?.total;
  const docsProcessed = metrics?.documentsProcessed ?? raw?.documents?.byStatus?.processed ?? 0;
  const docsFailed = metrics?.processingFailures ?? raw?.documents?.byStatus?.failed ?? 0;
  const questionsToday = metrics?.questionsToday ?? raw?.queries?.questionsToday;
  const successfulQueries = metrics?.successfulRagQueries ?? raw?.queries?.successfulQueries;
  const successRate =
    metrics?.ragEvaluation?.retrievalSuccessRate !== undefined
      ? (metrics.ragEvaluation.retrievalSuccessRate * 100).toFixed(1)
      : raw?.queries?.retrievalSuccessRate !== undefined
        ? Number(raw.queries.retrievalSuccessRate).toFixed(1)
        : '0.0';

  const responseTimeSec = metrics?.averageResponseTimeSec ?? raw?.queries?.averageResponseTimeSec;
  const positiveFeedbackRate =
    metrics?.ragEvaluation?.positiveFeedbackRate !== undefined
      ? (metrics.ragEvaluation.positiveFeedbackRate * 100).toFixed(1)
      : raw?.feedback?.positiveFeedbackRate !== undefined
        ? Number(raw.feedback.positiveFeedbackRate).toFixed(1)
        : undefined;

  const cards = [
    {
      title: 'Total Users',
      value: totalUsers !== undefined ? totalUsers : '-',
      subValue: `${activeUsers} active`,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
    },
    {
      title: 'Knowledge Documents',
      value: totalDocs !== undefined ? totalDocs : '-',
      subValue: `${docsProcessed} indexed, ${docsFailed} failed`,
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Questions Today',
      value: questionsToday !== undefined ? questionsToday : '-',
      subValue: 'Live enterprise queries',
      icon: HelpCircle,
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/60',
    },
    {
      title: 'Successful RAG Queries',
      value: successfulQueries !== undefined ? successfulQueries : '-',
      subValue: `${successRate}% success rate`,
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Average Response Time',
      value: responseTimeSec !== undefined ? `${Number(responseTimeSec).toFixed(2)}s` : '-',
      subValue: 'End-to-end RAG latency',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
    },
    {
      title: 'Positive Feedback Rate',
      value: positiveFeedbackRate !== undefined ? `${positiveFeedbackRate}%` : '-',
      subValue: '👍 Helpful rating',
      icon: ThumbsUp,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} hoverable className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {card.subValue}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
