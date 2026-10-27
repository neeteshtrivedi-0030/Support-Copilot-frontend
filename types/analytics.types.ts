export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  documentsProcessed: number;
  documentsProcessing: number;
  processingFailures: number;
  questionsToday: number;
  successfulRagQueries: number;
  averageResponseTimeSec: number;
  mostAskedQuestions: Array<{
    question: string;
    count: number;
  }>;
  mostUsedDocuments: Array<{
    documentId: string;
    documentName: string;
    queryCount: number;
  }>;
  ragEvaluation: {
    retrievalSuccessRate: number;
    positiveFeedbackRate: number;
    averageResponseTimeMs: number;
    noAnswerRate: number;
    averageRetrievalScore: number;
  };
}

export interface AnalyticsStatCardsProps {
  metrics: AnalyticsMetrics | null;
}
