import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SourceCitation } from '../../types/chat.types';

interface ChatState {
  currentConversationId: string | null;
  isStreaming: boolean;
  streamingAnswer: string;
  streamingSources: SourceCitation[];
  selectedDepartment: string;
  inputDraft: string;
}

const initialState: ChatState = {
  currentConversationId: null,
  isStreaming: false,
  streamingAnswer: '',
  streamingSources: [],
  selectedDepartment: '',
  inputDraft: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
      if (!action.payload) {
        state.streamingAnswer = '';
        state.streamingSources = [];
      }
    },
    appendStreamingAnswer: (state, action: PayloadAction<string>) => {
      state.streamingAnswer += action.payload;
    },
    setStreamingSources: (state, action: PayloadAction<SourceCitation[]>) => {
      state.streamingSources = action.payload;
    },
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload;
    },
    setInputDraft: (state, action: PayloadAction<string>) => {
      state.inputDraft = action.payload;
    },
    resetChatSession: (state) => {
      state.currentConversationId = null;
      state.isStreaming = false;
      state.streamingAnswer = '';
      state.streamingSources = [];
      state.inputDraft = '';
    },
  },
});

export const {
  setCurrentConversationId,
  setIsStreaming,
  appendStreamingAnswer,
  setStreamingSources,
  setSelectedDepartment,
  setInputDraft,
  resetChatSession,
} = chatSlice.actions;

export default chatSlice.reducer;
