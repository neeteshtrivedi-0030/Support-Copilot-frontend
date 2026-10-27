'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';
import { DocumentListQuery, DocumentUploadPayload } from '../types';

export const DOCUMENTS_QUERY_KEY = ['documents'];

export function useDocuments(query?: DocumentListQuery) {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, query],
    queryFn: () => documentService.getDocuments(query),
    // If any document is still processing, poll every 4 seconds
    refetchInterval: (queryResult) => {
      const items = queryResult.state.data?.items;
      const isAnyProcessing = items?.some(
        (doc) => doc.status === 'processing' || doc.status === 'uploaded'
      );
      return isAnyProcessing ? 4000 : false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, department, name }: DocumentUploadPayload) =>
      documentService.uploadDocument(file, department, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => documentService.retryProcessing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });

  return {
    ...documentsQuery,
    documents: documentsQuery.data?.items || [],
    total: documentsQuery.data?.total || 0,
    totalPages: documentsQuery.data?.totalPages || 1,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    retryProcessing: retryMutation.mutateAsync,
    isRetrying: retryMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useDocumentDetails(id?: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => (id ? documentService.getDocumentById(id) : null),
    enabled: Boolean(id),
  });
}
