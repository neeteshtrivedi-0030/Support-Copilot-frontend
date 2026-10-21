'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatContainer } from '../../components/chat/ChatContainer';

function ChatContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || undefined;

  return <ChatContainer initialPrompt={initialPrompt} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatContainer />}>
      <ChatContent />
    </Suspense>
  );
}
