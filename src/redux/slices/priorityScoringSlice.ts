import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RecoveryScore, PriorityCase } from '../../features/priority-scoring/types'

interface PriorityState {
  currentScore: RecoveryScore | null
  priorityCases: PriorityCase[]
  isLoading: boolean
  error: string | null
}

const initialState: PriorityState = {
  currentScore: null,
  priorityCases: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const getRecoveryScore = createAsyncThunk(
  'priority/getRecoveryScore',
  async (caseId: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockScore: RecoveryScore = {
        overall: 94,
        riskLevel: 'medium',
        starRating: 5,
        factors: [
          { name: 'Payment History', value: 'Good', weight: 30, impact: 'positive' },
          { name: 'Loan Age', value: '60 days', weight: 20, impact: 'neutral' },
          { name: 'Previous Promises', value: '2 kept, 0 broken', weight: 25, impact: 'positive' },
          { name: 'Call Behavior', value: 'Responsive', weight: 15, impact: 'positive' },
          { name: 'Occupation', value: 'Salaried', weight: 10, impact: 'positive' },
        ],
      }
      return mockScore
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get recovery score')
    }
  }
)

export const getPriorityCases = createAsyncThunk(
  'priority/getPriorityCases',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const mockCases: PriorityCase[] = [
        {
          id: '1',
          customerName: 'John Doe',
          caseNumber: 'CASE-001',
          recoveryScore: {
            overall: 94,
            riskLevel: 'medium',
            starRating: 5,
            factors: [],
          },
          amountDue: 50000,
          dpd: 30,
          assignedTo: 'Agent Smith',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          caseNumber: 'CASE-002',
          recoveryScore: {
            overall: 65,
            riskLevel: 'high',
            starRating: 3,
            factors: [],
          },
          amountDue: 75000,
          dpd: 60,
          assignedTo: 'Agent Johnson',
        },
      ]
      return mockCases
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get priority cases')
    }
  }
)

const priorityScoringSlice = createSlice({
  name: 'priorityScoring',
  initialState,
  reducers: {
    setCurrentScore: (state, action: PayloadAction<RecoveryScore>) => {
      state.currentScore = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecoveryScore.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRecoveryScore.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentScore = action.payload
      })
      .addCase(getRecoveryScore.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getPriorityCases.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPriorityCases.fulfilled, (state, action) => {
        state.isLoading = false
        state.priorityCases = action.payload
      })
      .addCase(getPriorityCases.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentScore, clearError } = priorityScoringSlice.actions
export default priorityScoringSlice.reducer
