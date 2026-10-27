'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { RenameConversationPayload } from '../types';

export const CONVERSATIONS_QUERY_KEY = ['conversations'];

export function useConversations(page = 1, limit = 20, search?: string) {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: [...CONVERSATIONS_QUERY_KEY, page, limit, search || ''],
    queryFn: () => chatService.getConversations(page, limit, search),
    staleTime: 5 * 1000,
    refetchOnMount: 'always',
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => chatService.deleteConversation(id),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData({ queryKey: CONVERSATIONS_QUERY_KEY }, (oldData: any) => {
        if (!oldData || !oldData.items) return oldData;
        return {
          ...oldData,
          items: oldData.items.filter((c: any) => (c._id || c.id) !== deletedId),
          total: Math.max(0, (oldData.total || 1) - 1),
        };
      });
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  const renameConversationMutation = useMutation({
    mutationFn: ({ id, title }: RenameConversationPayload) =>
      chatService.renameConversation(id, title),
    onSuccess: (updated) => {
      queryClient.setQueriesData({ queryKey: CONVERSATIONS_QUERY_KEY }, (oldData: any) => {
        if (!oldData || !oldData.items) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((c: any) =>
            (c._id || c.id) === (updated._id || updated.id) ? { ...c, title: updated.title } : c
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  return {
    ...conversationsQuery,
    conversations: conversationsQuery.data?.items || [],
    total: conversationsQuery.data?.total || 0,
    deleteConversation: deleteConversationMutation.mutateAsync,
    isDeleting: deleteConversationMutation.isPending,
    renameConversation: renameConversationMutation.mutateAsync,
    isRenaming: renameConversationMutation.isPending,
  };
}

export function useConversationDetails(conversationId?: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => (conversationId ? chatService.getConversationById(conversationId) : null),
    enabled: Boolean(conversationId),
  });
}
