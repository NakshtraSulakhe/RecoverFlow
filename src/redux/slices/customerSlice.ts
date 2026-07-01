import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalDebt: number
  status: 'active' | 'inactive' | 'settled'
  createdAt: string
}

interface CustomerState {
  customers: Customer[]
  loading: boolean
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setCustomers, setLoading } = customerSlice.actions
export default customerSlice.reducer
