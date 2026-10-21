'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ChatContainer } from '../../../components/chat/ChatContainer';

export default function ConversationChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return <ChatContainer conversationId={conversationId} />;
}
