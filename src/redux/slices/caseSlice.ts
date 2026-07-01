import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Case {
  id: string
  customerId: string
  caseNumber: string
  amount: number
  status: 'open' | 'in_progress' | 'closed' | 'settled'
  assignedTo: string
  createdAt: string
  updatedAt: string
}

interface CaseState {
  cases: Case[]
  loading: boolean
}

const initialState: CaseState = {
  cases: [],
  loading: false,
}

const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    setCases: (state, action: PayloadAction<Case[]>) => {
      state.cases = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setCases, setLoading } = caseSlice.actions
export default caseSlice.reducer
