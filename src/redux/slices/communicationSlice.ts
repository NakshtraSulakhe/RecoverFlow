import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Call, WhatsAppMessage, CommunicationEvent, DialerMode, CallStatus } from '../../features/communication/types'

interface CommunicationState {
  dialerMode: DialerMode
  currentCall: Call | null
  callHistory: Call[]
  whatsappMessages: WhatsAppMessage[]
  communicationTimeline: CommunicationEvent[]
  isDialing: boolean
  isLoading: boolean
  error: string | null
}

const initialState: CommunicationState = {
  dialerMode: 'manual',
  currentCall: null,
  callHistory: [],
  whatsappMessages: [],
  communicationTimeline: [],
  isDialing: false,
  isLoading: false,
  error: null,
}

// Mock async thunks
export const makeCall = createAsyncThunk(
  'communication/makeCall',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockCall: Call = {
        id: Date.now().toString(),
        customerId: '1',
        customerName: 'John Doe',
        phoneNumber,
        status: 'connected',
        startTime: new Date(),
      }
      return mockCall
    } catch (error) {
      return rejectWithValue('Failed to make call')
    }
  }
)

export const sendWhatsAppMessage = createAsyncThunk(
  'communication/sendWhatsAppMessage',
  async (messageData: { phoneNumber: string; content: string; type: string }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockMessage: WhatsAppMessage = {
        id: Date.now().toString(),
        customerId: '1',
        customerName: 'John Doe',
        phoneNumber: messageData.phoneNumber,
        direction: 'outbound',
        type: messageData.type as any,
        content: messageData.content,
        status: 'sent',
        timestamp: new Date(),
      }
      return mockMessage
    } catch (error) {
      return rejectWithValue('Failed to send WhatsApp message')
    }
  }
)

export const fetchCommunicationTimeline = createAsyncThunk(
  'communication/fetchTimeline',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const mockTimeline: CommunicationEvent[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          channel: 'phone',
          type: 'call',
          title: 'Outbound Call',
          description: 'Spoke with customer about payment',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          customerId: '1',
          customerName: 'John Doe',
          channel: 'whatsapp',
          type: 'message',
          title: 'Payment Reminder Sent',
          description: 'Sent payment reminder via WhatsApp',
          timestamp: new Date(Date.now() - 7200000),
        },
      ]
      return mockTimeline
    } catch (error) {
      return rejectWithValue('Failed to fetch communication timeline')
    }
  }
)

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setDialerMode: (state, action: PayloadAction<DialerMode>) => {
      state.dialerMode = action.payload
    },
    endCall: (state) => {
      if (state.currentCall) {
        state.currentCall.status = 'disconnected'
        state.currentCall.endTime = new Date()
        state.callHistory.unshift(state.currentCall)
      }
      state.currentCall = null
      state.isDialing = false
    },
    updateCallStatus: (state, action: PayloadAction<CallStatus>) => {
      if (state.currentCall) {
        state.currentCall.status = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeCall.pending, (state) => {
        state.isDialing = true
        state.isLoading = true
        state.error = null
      })
      .addCase(makeCall.fulfilled, (state, action) => {
        state.isDialing = false
        state.isLoading = false
        state.currentCall = action.payload
      })
      .addCase(makeCall.rejected, (state, action) => {
        state.isDialing = false
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(sendWhatsAppMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendWhatsAppMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.whatsappMessages.unshift(action.payload)
        state.communicationTimeline.unshift({
          id: action.payload.id,
          customerId: action.payload.customerId,
          customerName: action.payload.customerName,
          channel: 'whatsapp',
          type: action.payload.type,
          title: 'WhatsApp Message Sent',
          description: action.payload.content,
          timestamp: action.payload.timestamp,
        })
      })
      .addCase(sendWhatsAppMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchCommunicationTimeline.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCommunicationTimeline.fulfilled, (state, action) => {
        state.isLoading = false
        state.communicationTimeline = action.payload
      })
      .addCase(fetchCommunicationTimeline.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setDialerMode, endCall, updateCallStatus, clearError } = communicationSlice.actions
export default communicationSlice.reducer
