import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { PromiseToPay, PTPCalendarEvent } from '../../features/ptp-tracker/types'

interface PTPState {
  ptps: PromiseToPay[]
  calendarEvents: PTPCalendarEvent[]
  selectedPtp: PromiseToPay | null
  isLoading: boolean
  error: string | null
}

const initialState: PTPState = {
  ptps: [],
  calendarEvents: [],
  selectedPtp: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const getPTPs = createAsyncThunk(
  'ptp/getPTPs',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const today = new Date()
      const mockPTPs: PromiseToPay[] = [
        {
          id: '1',
          customerId: '1',
          caseId: '1',
          ptpDate: new Date(today.setDate(today.getDate() + 5)),
          amount: 50000,
          confidenceScore: 82,
          status: 'pending',
          notes: 'Customer promised to pay after salary',
          createdBy: 'Agent Smith',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      return mockPTPs
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get PTPs')
    }
  }
)

export const createPTP = createAsyncThunk(
  'ptp/createPTP',
  async (ptpData: Omit<PromiseToPay, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newPTP: PromiseToPay = {
        ...ptpData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return newPTP
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create PTP')
    }
  }
)

const ptpTrackerSlice = createSlice({
  name: 'ptpTracker',
  initialState,
  reducers: {
    setSelectedPtp: (state, action: PayloadAction<PromiseToPay | null>) => {
      state.selectedPtp = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPTPs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPTPs.fulfilled, (state, action) => {
        state.isLoading = false
        state.ptps = action.payload
        // Convert to calendar events
        state.calendarEvents = action.payload.map(ptp => ({
          id: ptp.id,
          title: `PTP - ${ptp.customerId}`,
          start: ptp.ptpDate,
          end: ptp.ptpDate,
          allDay: true,
          resource: ptp,
        }))
      })
      .addCase(getPTPs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createPTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.ptps.push(action.payload)
        state.calendarEvents.push({
          id: action.payload.id,
          title: `PTP - ${action.payload.customerId}`,
          start: action.payload.ptpDate,
          end: action.payload.ptpDate,
          allDay: true,
          resource: action.payload,
        })
      })
      .addCase(createPTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedPtp, clearError } = ptpTrackerSlice.actions
export default ptpTrackerSlice.reducer
