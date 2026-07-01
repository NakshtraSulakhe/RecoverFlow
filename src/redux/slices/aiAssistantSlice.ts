import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ChatMessage, AIAssistantResponse, ConversationContext } from '../../features/ai-assistant/types'

interface AIState {
  messages: ChatMessage[]
  isTyping: boolean
  context: ConversationContext
  lastResponse: AIAssistantResponse | null
  isLoading: boolean
  error: string | null
}

const initialState: AIState = {
  messages: [],
  isTyping: false,
  context: {},
  lastResponse: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async (content: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse: AIAssistantResponse = {
        ptpDate: '2026-07-15',
        confidenceScore: 82,
        reminderDate: '2026-07-14',
        suggestedResponse: "Thank you for letting us know. We've noted your promise to pay on July 15th.",
        suggestedAction: 'sms',
        recoveryProbability: 75,
        followUpNotes: 'Customer promised to pay after salary on July 15th. Send reminder on July 14th evening.',
      }
      return mockResponse
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get AI response')
    }
  }
)

const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    setContext: (state, action: PayloadAction<ConversationContext>) => {
      state.context = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.isTyping = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isTyping = false
        state.lastResponse = action.payload
        
        // Add assistant response message
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Here's my analysis:\n\n- Promise to Pay: ${action.payload.ptpDate}\n- Confidence Score: ${action.payload.confidenceScore}%\n- Reminder: ${action.payload.reminderDate}`,
          timestamp: new Date(),
        }
        state.messages.push(assistantMessage)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.isTyping = false
        state.error = action.payload as string
      })
  },
})

export const { addMessage, setContext, clearMessages, setTyping, clearError } = aiAssistantSlice.actions
export default aiAssistantSlice.reducer
