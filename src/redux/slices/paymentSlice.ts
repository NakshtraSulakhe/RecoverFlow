import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Payment {
  id: string
  caseId: string
  customerId: string
  amount: number
  paymentDate: string
  method: 'cash' | 'card' | 'bank_transfer' | 'check'
  status: 'pending' | 'completed' | 'failed'
  reference: string
}

interface PaymentState {
  payments: Payment[]
  loading: boolean
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPayments, setLoading } = paymentSlice.actions
export default paymentSlice.reducer
