'use client';

import { useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../store/hooks';
import {
  setIsStreaming,
  appendStreamingAnswer,
  setStreamingSources,
  setCurrentConversationId,
} from '../store/slices/chatSlice';
import { chatService } from '../services/chat.service';
import { ChatMessage, SourceCitation, StreamEvent } from '../types/chat.types';
import { CONVERSATIONS_QUERY_KEY } from './useConversations';

export function useChatStream() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSources, setActiveSources] = useState<SourceCitation[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      question: string,
      conversationId?: string,
      department?: string,
      onComplete?: (convId: string) => void
    ) => {
      if (!question.trim()) return;

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: question,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Initialize assistant placeholder
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '',
        sources: [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      dispatch(setIsStreaming(true));
      setActiveSources([]);

      abortControllerRef.current = new AbortController();
      let accumulatedText = '';
      let receivedSources: SourceCitation[] = [];
      let finalConversationId = conversationId;

      try {
        await chatService.streamMessage(
          {
            message: question,
            conversationId,
            department,
          },
          (event: StreamEvent) => {
            if (event.type === 'content' && event.answer) {
              accumulatedText += event.answer;
              dispatch(appendStreamingAnswer(event.answer));
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === 'assistant') {
                  last.content = accumulatedText;
                }
                return updated;
              });
            } else if (event.type === 'sources' && event.sources) {
              receivedSources = event.sources;
              setActiveSources(event.sources);
              dispatch(setStreamingSources(event.sources));
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === 'assistant') {
                  last.sources = receivedSources;
                }
                return updated;
              });
            } else if (event.type === 'done') {
              if (event.conversationId) {
                finalConversationId = event.conversationId;
                dispatch(setCurrentConversationId(event.conversationId));

                // Optimistically update conversation sidebar cache immediately
                queryClient.setQueriesData(
                  { queryKey: CONVERSATIONS_QUERY_KEY },
                  (oldData: any) => {
                    const newItem = {
                      _id: event.conversationId,
                      id: event.conversationId,
                      title: question.length > 45 ? `${question.slice(0, 42)}...` : question,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    if (!oldData || !oldData.items) {
                      return {
                        items: [newItem],
                        total: 1,
                      };
                    }
                    const exists = oldData.items.some(
                      (c: any) => (c._id || c.id) === event.conversationId
                    );
                    if (exists) return oldData;
                    return {
                      ...oldData,
                      items: [newItem, ...oldData.items],
                      total: (oldData.total || 0) + 1,
                    };
                  }
                );

                // Invalidate so server-generated title and timestamps sync in background
                queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
              }
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === 'assistant') {
                  last._id = event.messageId;
                  last.tokens =
                    typeof event.tokens === 'number'
                      ? event.tokens
                      : typeof event.tokens === 'object' && event.tokens !== null
                        ? ((event.tokens as { totalTokens?: number }).totalTokens ??
                          ((event.tokens as { promptTokens?: number }).promptTokens ?? 0) +
                            ((event.tokens as { completionTokens?: number }).completionTokens ?? 0))
                        : undefined;
                }
                return updated;
              });
            } else if (event.type === 'error') {
              throw new Error(event.message || 'Stream error occurred');
            }
          },
          abortControllerRef.current.signal
        );

        if (finalConversationId && onComplete) {
          queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
          onComplete(finalConversationId);
        }
      } catch (err) {
        const error = err as Error;
        if (error.name !== 'AbortError') {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              last.content =
                accumulatedText ||
                `Error: Unable to generate response. ${error.message || 'Please try again later.'}`;
            }
            return updated;
          });
        }
      } finally {
        dispatch(setIsStreaming(false));
      }
    },
    [dispatch, queryClient]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch(setIsStreaming(false));
  }, [dispatch]);

  return {
    messages,
    setMessages,
    activeSources,
    sendMessage,
    stopStreaming,
  };
}
