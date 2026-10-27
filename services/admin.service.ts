import { apiClient } from './api';
import {
  ApiResponse,
  AnalyticsMetrics,
  User,
  RegisterPayload,
  AdminUserListResult,
} from '../types';

export const adminService = {
  getUsers: async (page = 1, limit = 20, search?: string): Promise<AdminUserListResult> => {
    const response = await apiClient.get<
      ApiResponse<{
        users?: User[];
        items?: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>
    >('/admin/users', {
      params: { page, limit, search },
    });
    const data = response.data.data;
    const userList = data?.users || data?.items || [];
    return {
      items: userList,
      users: userList,
      total: data?.total ?? userList.length,
      page: data?.page ?? page,
      limit: data?.limit ?? limit,
      totalPages: data?.totalPages ?? 1,
    };
  },

  createUser: async (payload: RegisterPayload): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/admin/users', payload);
    const resData = response.data;
    if (!resData.success || !resData.data) {
      throw new Error(resData.message || 'Failed to create user');
    }
    return resData.data;
  },

  getAnalytics: async (): Promise<AnalyticsMetrics> => {
    const response = await apiClient.get<ApiResponse<any>>('/admin/analytics');
    const raw = response.data.data;
    if (!raw) return {} as AnalyticsMetrics;

    const totalUsers = raw.totalUsers ?? raw.users?.total ?? 0;
    const activeUsers = raw.activeUsers ?? raw.users?.active ?? 0;
    const totalDocuments = raw.totalDocuments ?? raw.documents?.total ?? 0;
    const documentsProcessed = raw.documentsProcessed ?? raw.documents?.byStatus?.processed ?? 0;
    const documentsProcessing = raw.documentsProcessing ?? raw.documents?.byStatus?.processing ?? 0;
    const processingFailures = raw.processingFailures ?? raw.documents?.byStatus?.failed ?? 0;
    const questionsToday = raw.questionsToday ?? raw.queries?.questionsToday ?? 0;
    const successfulRagQueries = raw.successfulRagQueries ?? raw.queries?.successfulQueries ?? 0;
    const averageResponseTimeSec =
      raw.averageResponseTimeSec ?? raw.queries?.averageResponseTimeSec ?? 0;

    const mostAskedQuestions = (raw.mostAskedQuestions || []).map((q: any) => ({
      question: q.question || q.query || 'Untitled Query',
      query: q.query || q.question || 'Untitled Query',
      count: q.count ?? 0,
    }));

    const mostUsedDocuments = (raw.mostUsedDocuments || []).map((d: any) => ({
      documentId: d.documentId || '',
      documentName: d.documentName || 'Unknown Document',
      count: d.count ?? d.queryCount ?? 0,
      queryCount: d.queryCount ?? d.count ?? 0,
    }));

    const ragEvalRaw = raw.ragEvaluation || {};
    const queries = raw.queries || {};
    const feedback = raw.feedback || {};

    const retrievalSuccessRate =
      ragEvalRaw.retrievalSuccessRate !== undefined
        ? ragEvalRaw.retrievalSuccessRate
        : queries.retrievalSuccessRate !== undefined
          ? queries.retrievalSuccessRate / 100
          : queries.totalQuestions > 0
            ? queries.successfulQueries / queries.totalQuestions
            : 1;

    const positiveFeedbackRate =
      ragEvalRaw.positiveFeedbackRate !== undefined
        ? ragEvalRaw.positiveFeedbackRate
        : feedback.positiveFeedbackRate !== undefined
          ? feedback.positiveFeedbackRate / 100
          : feedback.total > 0
            ? feedback.positive / feedback.total
            : 0;

    const averageSimilarityScore =
      ragEvalRaw.averageRetrievalScore ?? queries.averageSimilarityScore ?? 0.88;

    const noAnswerRate =
      ragEvalRaw.noAnswerRate !== undefined
        ? ragEvalRaw.noAnswerRate
        : queries.noAnswerRate !== undefined
          ? queries.noAnswerRate / 100
          : 0;

    return {
      totalUsers,
      activeUsers,
      totalDocuments,
      documentsProcessed,
      documentsProcessing,
      processingFailures,
      questionsToday,
      successfulRagQueries,
      averageResponseTimeSec,
      mostAskedQuestions,
      mostUsedDocuments,
      ragEvaluation: {
        retrievalSuccessRate,
        positiveFeedbackRate,
        averageResponseTimeMs:
          ragEvalRaw.averageResponseTimeMs ?? queries.averageResponseTimeMs ?? 0,
        noAnswerRate,
        averageRetrievalScore: averageSimilarityScore,
      },
    };
  },

  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/documents/${id}`);
  },
};
