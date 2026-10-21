'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useConversations } from '../../hooks/useConversations';
import { useAppDispatch } from '../../store/hooks';
import { resetChatSession } from '../../store/slices/chatSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Plus, MessageSquare, Trash2, Search, Loader2, Pencil } from 'lucide-react';
import { clsx } from 'clsx';
import { formatTimeAgo } from '../../utils/formatters';

export const ConversationSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    conversations,
    isLoading,
    deleteConversation,
    isDeleting,
    renameConversation,
    isRenaming,
  } = useConversations(1, 30, searchQuery);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    dispatch(resetChatSession());
    router.push('/chat');
  };

  const handleConfirmDelete = async () => {
    if (!targetDeleteId) return;
    const idToDelete = targetDeleteId;
    try {
      await deleteConversation(idToDelete);
      dispatch(
        addToast({
          type: 'success',
          title: 'Conversation Deleted',
          message: 'Conversation thread was deleted successfully.',
        })
      );
      if (pathname.includes(idToDelete)) {
        dispatch(resetChatSession());
        router.replace('/chat');
      }
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err?.response?.data?.message || err?.message || 'Failed to delete conversation.',
        })
      );
    } finally {
      setTargetDeleteId(null);
    }
  };

  const handleConfirmRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!renameTarget || !newTitle.trim()) return;
    try {
      await renameConversation({ id: renameTarget.id, title: newTitle.trim() });
      dispatch(
        addToast({
          type: 'success',
          title: 'Conversation Renamed',
          message: 'Conversation title was updated successfully.',
        })
      );
      setRenameTarget(null);
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Rename Failed',
          message: err?.response?.data?.message || err?.message || 'Failed to rename conversation.',
        })
      );
    }
  };

  return (
    <div className="w-72 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex flex-col h-[calc(100vh-8rem)] rounded-xl shadow-sm overflow-hidden">
      {/* New Chat Button */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2.5 text-xs font-semibold shadow-sm transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        {/* Search Input */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-slate-400">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const convId = conv._id || conv.id;
            const isActive = Boolean(
              convId && (pathname === `/chat/${convId}` || pathname.endsWith(convId))
            );

            return (
              <div
                key={convId || conv.title}
                onClick={() => {
                  if (convId) router.push(`/chat/${convId}`);
                }}
                className={clsx(
                  'group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer select-none',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MessageSquare
                    className={clsx(
                      'w-3.5 h-3.5 shrink-0',
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                    )}
                  />
                  <div className="truncate">
                    <p className="truncate text-xs">{conv.title || 'Untitled Session'}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {formatTimeAgo(conv.createdAt)}
                    </p>
                  </div>
                </div>

                {convId && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameTarget({ id: convId, title: conv.title || '' });
                        setNewTitle(conv.title || '');
                      }}
                      className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded transition-all shrink-0"
                      title="Rename conversation"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetDeleteId(convId);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-all shrink-0"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Rename Conversation"
        description="Enter a new title for this conversation thread."
        maxWidth="sm"
      >
        <form onSubmit={handleConfirmRename}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mt-2 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Conversation title"
            maxLength={150}
            autoFocus
          />
          <div className="flex items-center justify-end gap-2.5 pt-4">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setRenameTarget(null)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isRenaming}
              disabled={!newTitle.trim()}
            >
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={Boolean(targetDeleteId)}
        onClose={() => setTargetDeleteId(null)}
        title="Delete Conversation Thread"
        description="Are you sure you want to delete this conversation? All associated messages and context will be permanently removed."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTargetDeleteId(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete} isLoading={isDeleting}>
            Delete Thread
          </Button>
        </div>
      </Modal>
    </div>
  );
};
