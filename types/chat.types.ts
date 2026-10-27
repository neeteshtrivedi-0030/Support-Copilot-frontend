export interface SourceCitation {
  documentId?: string;
  documentName: string;
  department?: string;
  page?: number | string;
  section?: string;
  similarityScore?: number;
  snippet?: string;
  text?: string;
}

export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ChatMessage {
  _id?: string;
  id?: string;
  role: 'user' | 'assistant';
  sender?: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  feedback?: 'helpful' | 'unhelpful' | null;
  responseTimeMs?: number;
  tokens?: number | TokenUsage;
  createdAt?: string;
}

export interface Conversation {
  _id: string;
  id?: string;
  title: string;
  userId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messagesCount?: number;
  messageCount?: number;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatRequestPayload {
  message: string;
  conversationId?: string;
  department?: string;
  stream?: boolean;
}

export interface ChatResponseData {
  conversationId: string;
  messageId: string;
  answer: string;
  sources: SourceCitation[];
  tokens?: number | TokenUsage;
  responseTimeMs?: number;
}

export interface StreamEvent {
  type: 'content' | 'sources' | 'done' | 'error';
  answer?: string;
  sources?: SourceCitation[];
  conversationId?: string;
  messageId?: string;
  tokens?: number | TokenUsage;
  responseTimeMs?: number;
  message?: string;
}

export interface ChatState {
  currentConversationId: string | null;
  isStreaming: boolean;
  streamingAnswer: string;
  streamingSources: SourceCitation[];
  selectedDepartment: string;
  inputDraft: string;
}

export interface ChatContainerProps {
  conversationId?: string;
  initialPrompt?: string;
}

export interface SourceCitationsProps {
  sources: SourceCitation[];
}

export interface MarkdownMessageProps {
  content: string;
}

export interface ChatFeedbackPayload {
  messageId: string;
  conversationId: string;
  rating: 'helpful' | 'not_helpful';
  comment?: string;
}

export interface RenameConversationPayload {
  id: string;
  title: string;
}

export interface ConversationListResult {
  items: Conversation[];
  total: number;
}

export interface ConversationDetailResult {
  conversation: Conversation;
  messages: ChatMessage[];
}
