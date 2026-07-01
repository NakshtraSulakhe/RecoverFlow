import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Recovery {
  id: string
  caseId: string
  amount: number
  method: 'phone' | 'email' | 'visit' | 'legal'
  status: 'pending' | 'completed' | 'failed'
  notes: string
  date: string
}

interface RecoveryState {
  recoveries: Recovery[]
  loading: boolean
}

const initialState: RecoveryState = {
  recoveries: [],
  loading: false,
}

const recoverySlice = createSlice({
  name: 'recovery',
  initialState,
  reducers: {
    setRecoveries: (state, action: PayloadAction<Recovery[]>) => {
      state.recoveries = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setRecoveries, setLoading } = recoverySlice.actions
export default recoverySlice.reducer
