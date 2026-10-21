'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ConversationSidebar } from './ConversationSidebar';
import { SourceCitations } from './SourceCitations';
import { StreamingCursor } from './StreamingCursor';
import { MarkdownMessage } from './MarkdownMessage';
import { useChatStream } from '../../hooks/useChatStream';
import { useConversationDetails, CONVERSATIONS_QUERY_KEY } from '../../hooks/useConversations';
import { useJoiValidation } from '../../hooks/useJoiValidation';
import { chatMessageSchema } from '../../utils/validation/chat.schema';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import { chatService } from '../../services/chat.service';
import { DEPARTMENTS } from '../../utils/constants';
import {
  Send,
  Square,
  Bot,
  User as UserIcon,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import { formatTimeAgo } from '../../utils/formatters';

interface ChatContainerProps {
  conversationId?: string;
  initialPrompt?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId, initialPrompt }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isStreaming = useAppSelector((state) => state.chat.isStreaming);
  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, 'helpful' | 'unhelpful'>>({});

  const { messages, setMessages, sendMessage, stopStreaming } = useChatStream();
  const { data: convData, isLoading: isConvLoading } = useConversationDetails(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialPromptRef = useRef(false);

  const { errors, validate } = useJoiValidation(chatMessageSchema);

  // Sync historical messages if viewing an existing conversation
  useEffect(() => {
    if (convData?.messages) {
      setMessages(convData.messages);
    } else if (!conversationId) {
      setMessages([]);
    }
  }, [convData, conversationId, setMessages]);

  // Handle auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Handle initial prompt from query parameter (e.g. from Dashboard search bar)
  useEffect(() => {
    if (
      initialPrompt &&
      !conversationId &&
      messages.length === 0 &&
      !hasSentInitialPromptRef.current
    ) {
      hasSentInitialPromptRef.current = true;
      handleSend(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputMessage).trim();
    if (!textToSend || isStreaming) return;

    const isValid = validate({ message: textToSend });
    if (!isValid) return;

    setInputMessage('');

    await sendMessage(
      textToSend,
      conversationId,
      selectedDepartment || undefined,
      async (newConvId) => {
        await queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
        if (!conversationId && newConvId) {
          router.replace(`/chat/${newConvId}`);
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = async (messageIdx: number, type: 'helpful' | 'unhelpful') => {
    setFeedbackGiven((prev) => ({ ...prev, [messageIdx]: type }));
    const msg = messages[messageIdx];
    const msgId = msg?._id || msg?.id;
    const currentConvId =
      conversationId || convData?.conversation?.id || convData?.conversation?._id;

    if (msgId && currentConvId) {
      try {
        await chatService.submitFeedback({
          messageId: msgId,
          conversationId: currentConvId,
          rating: type === 'helpful' ? 'helpful' : 'not_helpful',
        });
      } catch (err) {
        console.warn('Feedback API call warning:', err);
      }
    }

    dispatch(
      addToast({
        type: 'success',
        title: 'Feedback Recorded',
        message: `Thank you for marking this response as ${type === 'helpful' ? 'helpful 👍' : 'not helpful 👎'}.`,
      })
    );
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Conversation Thread Sidebar */}
      <ConversationSidebar />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 rounded-lg">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {convData?.conversation?.title || 'Enterprise AI Copilot'}
              </h2>
              <p className="text-[11px] text-slate-400">RAG Retrieval with verified sources</p>
            </div>
          </div>

          {/* Department Filter Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-2xl shadow-lg shadow-brand-500/20 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                How can I assist you with enterprise knowledge today?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Ask about company policies, leave guidelines, IT support manuals, or technical
                documents. All responses are cited directly from uploaded documentation.
              </p>

              {/* Suggested Questions */}
              <div className="grid grid-cols-1 gap-2 w-full mt-6 text-left">
                {[
                  'What is our company work-from-home policy?',
                  'What is the laptop replacement policy?',
                  'How do I submit an expense reimbursement?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-200 text-slate-700 dark:text-slate-300 transition-all text-left"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user' || (msg as any).sender === 'user';
              const isLast = idx === messages.length - 1;
              const feedback = feedbackGiven[idx];

              return (
                <div
                  key={idx}
                  className={clsx(
                    'flex gap-3 items-start',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={clsx(
                      'rounded-2xl p-4 text-xs leading-relaxed shadow-sm transition-all',
                      isUser
                        ? 'max-w-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md ml-12'
                        : 'w-full max-w-3xl lg:max-w-4xl bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 mr-4 md:mr-8 shadow-sm'
                    )}
                  >
                    {/* Message Body */}
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-sans text-sm">{msg.content}</div>
                    ) : (
                      <div className="font-sans text-sm">
                        <MarkdownMessage content={msg.content} />
                        {isStreaming && isLast && <StreamingCursor />}
                      </div>
                    )}

                    {/* Source Citations */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <SourceCitations sources={msg.sources} />
                    )}

                    {/* Footer: RAG Evaluation / Feedback */}
                    {!isUser && (!isStreaming || !isLast) && msg.content && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          {msg.responseTimeMs && (
                            <span>{(msg.responseTimeMs / 1000).toFixed(2)}s latency</span>
                          )}
                          {(() => {
                            if (!msg.tokens) return null;
                            const count =
                              typeof msg.tokens === 'number'
                                ? msg.tokens
                                : typeof msg.tokens === 'object'
                                  ? (msg.tokens.totalTokens ??
                                    (msg.tokens.promptTokens ?? 0) +
                                      (msg.tokens.completionTokens ?? 0))
                                  : null;
                            return count ? <span>• {count} tokens</span> : null;
                          })()}
                        </div>

                        {/* RAG Feedback Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleFeedback(idx, 'helpful')}
                            className={clsx(
                              'p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors',
                              feedback === 'helpful' ? 'text-emerald-600 font-bold' : ''
                            )}
                            title="Helpful response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, 'unhelpful')}
                            className={clsx(
                              'p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors',
                              feedback === 'unhelpful' ? 'text-rose-600 font-bold' : ''
                            )}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about enterprise policies, handbooks, or manuals..."
              disabled={isStreaming}
              className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 pr-24 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              )}
            </div>
          </form>

          {errors.message && <p className="mt-1 text-xs text-rose-600">{errors.message}</p>}
        </div>
      </div>
    </div>
  );
};
