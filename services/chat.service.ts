import { apiClient } from './api';
import { API_BASE_URL, API_PREFIX } from '../utils/constants';
import { storage } from '../utils/storage';
import {
  ApiResponse,
  ChatRequestPayload,
  ChatResponseData,
  Conversation,
  ChatMessage,
  StreamEvent,
} from '../types';

export const chatService = {
  // Non-streaming chat query
  sendMessage: async (payload: ChatRequestPayload): Promise<ChatResponseData> => {
    const response = await apiClient.post<ApiResponse<ChatResponseData>>('/chat', {
      ...payload,
      stream: false,
    });
    return response.data.data;
  },

  // Streaming chat query via Fetch API & SSE
  streamMessage: async (
    payload: ChatRequestPayload,
    onChunk: (event: StreamEvent) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-access-token': token } : {}),
      },
      body: JSON.stringify({ ...payload, stream: true }),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = 'Failed to connect to AI chat service';
      try {
        const parsed = JSON.parse(errText);
        errorMsg = parsed.message || errorMsg;
      } catch {
        // use fallback
      }
      throw new Error(errorMsg);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const jsonStr = trimmed.slice(6);
            const event: StreamEvent = JSON.parse(jsonStr);
            onChunk(event);
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    }
  },

  // Semantic search endpoint
  searchKnowledge: async (query: string, department?: string) => {
    const response = await apiClient.post<ApiResponse<unknown>>('/search', {
      query,
      department,
    });
    return response.data.data;
  },

  // List all conversations
  getConversations: async (
    page = 1,
    limit = 20,
    search?: string
  ): Promise<{ items: Conversation[]; total: number }> => {
    const response = await apiClient.get<ApiResponse<any>>('/conversations', {
      params: {
        page,
        limit,
        search: search ? search.trim() : undefined,
      },
    });
    const data = response.data?.data;
    const rawList = data?.conversations || data?.items || [];
    const items: Conversation[] = rawList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
      id: item.id || item._id,
    }));
    return {
      items,
      total: data?.total ?? items.length,
    };
  },

  // Get conversation with messages
  getConversationById: async (
    id: string
  ): Promise<{ conversation: Conversation; messages: ChatMessage[] }> => {
    const response = await apiClient.get<
      ApiResponse<{ conversation: any; messages: ChatMessage[] }>
    >(`/conversations/${id}`);
    const data = response.data?.data;
    if (data?.conversation) {
      data.conversation._id = data.conversation._id || data.conversation.id;
      data.conversation.id = data.conversation.id || data.conversation._id;
    }
    if (data?.messages) {
      data.messages = data.messages.map((m: any) => ({
        ...m,
        role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
        sender: m.sender || m.role,
        _id: m._id || m.id,
        id: m.id || m._id,
      }));
    }
    return data;
  },

  // Rename conversation
  renameConversation: async (id: string, title: string): Promise<Conversation> => {
    if (!id || id === 'undefined') {
      throw new Error('Valid conversation ID is required');
    }
    const response = await apiClient.patch<ApiResponse<Conversation>>(`/conversations/${id}`, {
      title,
    });
    return response.data.data;
  },

  // Delete conversation
  deleteConversation: async (id: string): Promise<void> => {
    if (!id || id === 'undefined') {
      throw new Error('Valid conversation ID is required');
    }
    await apiClient.delete(`/conversations/${id}`);
  },

  // Submit feedback for RAG response
  submitFeedback: async (payload: {
    messageId: string;
    conversationId: string;
    rating: 'helpful' | 'not_helpful';
    comment?: string;
  }): Promise<void> => {
    await apiClient.post('/chat/feedback', payload);
  },
};
