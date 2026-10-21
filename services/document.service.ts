import { apiClient } from './api';
import { ApiResponse, DocumentItem, DocumentListQuery, PaginatedResult } from '../types';

export const documentService = {
  uploadDocument: async (
    file: File,
    department: string,
    customName?: string
  ): Promise<DocumentItem> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);
    if (customName) {
      formData.append('name', customName);
    }

    const response = await apiClient.post<ApiResponse<any>>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const doc = response.data?.data?.document || response.data?.data;
    if (doc) {
      doc._id = doc._id || doc.id;
      doc.id = doc.id || doc._id;
    }
    return doc;
  },

  getDocuments: async (query?: DocumentListQuery): Promise<PaginatedResult<DocumentItem>> => {
    const response = await apiClient.get<ApiResponse<any>>('/documents', {
      params: query,
    });
    const data = response.data?.data;
    const rawList = data?.documents || data?.items || [];
    const items: DocumentItem[] = rawList.map((doc: any) => ({
      ...doc,
      _id: doc._id || doc.id,
      id: doc.id || doc._id,
    }));
    return {
      items,
      total: data?.total ?? items.length,
      page: data?.page ?? 1,
      limit: data?.limit ?? 10,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getDocumentById: async (id: string): Promise<DocumentItem> => {
    const response = await apiClient.get<ApiResponse<any>>(`/documents/${id}`);
    const doc = response.data?.data?.document || response.data?.data;
    if (doc) {
      doc._id = doc._id || doc.id;
      doc.id = doc.id || doc._id;
    }
    return doc;
  },

  downloadDocument: async (id: string): Promise<{ downloadUrl: string } | Blob> => {
    const response = await apiClient.get<ApiResponse<{ downloadUrl?: string }>>(
      `/documents/${id}/download`
    );
    if (response.data?.data?.downloadUrl) {
      return { downloadUrl: response.data.data.downloadUrl };
    }
    // Fallback: binary download
    const blobResponse = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return blobResponse.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    if (!id || id === 'undefined') {
      throw new Error('Valid document ID is required');
    }
    await apiClient.delete(`/documents/${id}`);
  },

  retryProcessing: async (id: string): Promise<DocumentItem> => {
    const response = await apiClient.post<ApiResponse<any>>(`/documents/${id}/retry`);
    const doc = response.data?.data?.document || response.data?.data;
    if (doc) {
      doc._id = doc._id || doc.id;
      doc.id = doc.id || doc._id;
    }
    return doc;
  },
};
